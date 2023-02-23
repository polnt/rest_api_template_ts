import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";

import { appConfig } from "config/appConfig";
import { hash, compare } from "utils/encryption";
import { checkEmailDuplicate } from "utils/validation";
import { AuthPayload } from "./model";
import { MySQLClient } from "backends/mysql/client";
import TYPES from "IoC/types";

@injectable()
export class UserService {
  constructor(@inject(TYPES.MySQLClient) private mysqlClient: MySQLClient) {}

  // CRUD
  public async getOne(
    userID: Number
  ): Promise<{ status: number; message: string; data?: any }> {
    const connection = await this.mysqlClient.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM user WHERE id = ?",
      userID
    );

    connection.release();
    const users = this.mysqlClient.processRows(rows);
    if (users && users.length) {
      const { password, ...data } = users[0];
      return {
        status: 200,
        message: "User found",
        data: data,
      };
    }
    return { status: 404, message: "User not found" };
  }

  public async getAll(): Promise<{
    status: number;
    data: any[];
    message: string;
  }> {
    const connection = await this.mysqlClient.getConnection();
    const [rows] = await connection.query("SELECT * from user");
    connection.release();
    const users = this.mysqlClient.processRows(rows);
    if (users.length) {
      return {
        status: 200,
        data: users,
        message: "Users list successfully fetched",
      };
    }
    return { status: 200, data: [], message: "No data" };
  }

  public async create(
    payload: any
  ): Promise<{ status: number; message: string; data?: any }> {
    const { email } = payload;
    const emailResult = await checkEmailDuplicate(email, this.mysqlClient);

    if (emailResult.status === 404) {
      const connection = await this.mysqlClient.getConnection();
      console.log(payload);
      const createResult: any = await connection.query(
        "INSERT INTO user SET ?",
        payload
      );
      const result = await this.getOne(createResult[0].insertId);
      connection.release();
      return {
        status: 201,
        message: "User successfully created",
        data: result.data,
      };
    }
    return emailResult;
  }

  public async update(
    userID: number,
    payload: any
  ): Promise<{ status: number; message: string }> {
    const getResult = await this.getOne(userID);
    if (getResult.status === 200) {
      if (payload.password) {
        const hashPwd = await hash(payload.password);
        payload.password = hashPwd;
      }
      const connection = await this.mysqlClient.getConnection();
      await connection.query("UPDATE user SET ? WHERE id = ?", [
        payload,
        userID,
      ]);
      connection.release();
      return { status: 201, message: "User successfully updated" };
    }
    return getResult;
  }

  public async delete(
    userID: number
  ): Promise<{ status: number; message: string }> {
    const getResult = await this.getOne(userID);
    if (getResult.status === 200) {
      const connection = await this.mysqlClient.getConnection();
      await connection.query("DELETE FROM user WHERE id = ?", userID);
      connection.release();
      return { status: 200, message: "Account unregistered" };
    }
    return getResult;
  }

  // LOGIC
  public async authenticate(
    payload: AuthPayload
  ): Promise<{ status: number; message?: string; token?: string }> {
    const connection = await this.mysqlClient.getConnection();
    const { email, password } = payload;
    const [rows] = await connection.query(
      "SELECT id, email, password, role FROM user WHERE email = ?",
      email
    );

    connection.release();
    const users: any[] = this.mysqlClient.processRows(rows);

    if (users && users.length) {
      const user = users[0];
      const match = await compare(password, user.password);
      if (match) {
        const tokenPayload = {
          userID: user.id,
          email: user.email,
        };
        const token = jwt.sign(tokenPayload, appConfig.app.secret, {
          expiresIn: appConfig.app.expiresIn,
        });
        console.log(token);
        return { status: 200, token: token };
      }
    }
    return { status: 401, message: "Wrong credentials" };
  }

  public async resetPassword(
    userID: number,
    password: string
  ): Promise<{ status: number; message: string }> {
    const connection = await this.mysqlClient.getConnection();
    const hashPwd = await hash(password);
    const data = { password: hashPwd };
    await connection.query("UPDATE user SET ? WHERE id= ?", [data, userID]);
    connection.release();
    return { status: 201, message: "Password successfully reset" };
  }
}
