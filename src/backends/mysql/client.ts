import { injectable } from "inversify";
import { access, mkdir } from "fs/promises";
import mysql, {
  OkPacket,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { appConfig } from "config/appConfig";
import { readdirAsync, readFileAsync } from "utils/fs";

@injectable()
export class MySQLClient {
  private readonly hydratationTablesPath: string = "src/backends/mysql/tables";
  // private readonly uploadPath: string = "./uploads";
  private pool: mysql.Pool = undefined;

  constructor() {}

  private async checkConnection(): Promise<void> {
    const connection = await this.getConnection();
    await connection.ping();
    connection.release();
  }

  private async checkDatabase(): Promise<void> {
    const connection = await this.getConnection();
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS ${appConfig.mysql.database};`
    );
    await connection.query(`use ${appConfig.mysql.database};`);
    const tables: string[] = await readdirAsync(this.hydratationTablesPath);
    const thenables = tables.map(async (table) => {
      const tmp = await readFileAsync(`${this.hydratationTablesPath}/${table}`);
      await connection.query(tmp.toString("utf-8")).catch((err) => {
        throw err;
      });
    });

    await Promise.all(thenables);

    // try {
    //   await access(this.uploadPath);
    // } catch (_) {
    //   await mkdir(this.uploadPath);
    //   // await mkdir(`${this.uploadPath}/audio`);
    //   // await mkdir(`${this.uploadPath}/video`);
    //   await mkdir(`${this.uploadPath}/documents`);
    //   await mkdir(`${this.uploadPath}/images`);
    // }
    connection.release();
    await this.disconnect();
    // this.pool = mysql.createPool({
    //   connectionLimit: 10,
    //   ...appConfig.mysql,
    // });
  }

  public async connect(): Promise<void> {
    if (this.pool !== undefined) {
      await this.checkConnection();
      return;
    }

    const { host, user, password } = appConfig.mysql;

    this.pool = mysql.createPool({
      connectionLimit: 10,
      host,
      user,
      password,
    });

    await this.checkConnection();
    await this.checkDatabase();
  }

  public async disconnect(): Promise<void> {
    if (this.pool !== undefined) {
      await this.pool.end();
      this.pool = undefined;
    }
  }

  public async getConnection(): Promise<mysql.PoolConnection> {
    if (this.pool === undefined) {
      throw new Error(
        "MySQLClient not connected, call 'connect(): Promise<void>' before"
      );
    }
    return this.pool.getConnection();
  }

  public processRows(
    rows:
      | RowDataPacket[]
      | RowDataPacket[][]
      | OkPacket
      | OkPacket[]
      | ResultSetHeader
  ): any[] {
    return (
      [rows]
        .map((row) =>
          JSON.parse(JSON.stringify(row)).length ? { ...row } : undefined
        )
        .filter((elem) => elem !== undefined)
        // handle BinaryRow
        .map((elem) => Object.values(elem))[0]
    );
  }
}
