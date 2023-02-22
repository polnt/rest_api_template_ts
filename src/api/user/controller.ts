// import autoBind from "auto-bind";
// const autoBind = import("auto-bind");
import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { UserService } from "./service";
import TYPES from "../../IoC/types";
import { AuthPayload } from "./model";

interface extRequest extends Request {
  user: any;
}

@injectable()
export class UserController {
  constructor(@inject(TYPES.UserService) private userService: UserService) {
    // autoBind(this);
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.userService.getOne(+id);
    res.status(result.status).json(result);
  }

  public async getAll(_: Request, res: Response): Promise<void> {
    const result = await this.userService.getAll();
    res.status(result.status).json(result);
  }

  public async create(req: Request, res: Response): Promise<void> {
    const result = await this.userService.create(req.body);
    res.status(result.status).json(result);
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.userService.update(+id, req.body);
    res.status(result.status).json(result);
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.userService.delete(+id);
    res.status(result.status).json(result);
  }

  public async authorize(
    request: Request<any, AuthPayload>,
    response: Response
  ): Promise<void> {
    const auth: any = await this.userService.authenticate(request.body);
    response.status(auth.status).json(auth);
  }

  public async resetPassword(req: extRequest, res: Response): Promise<void> {
    const { userID } = req.user;
    const { password } = req.body;
    const result = await this.userService.resetPassword(userID, password);
    res.status(result.status).json(result);
  }

  public async getCurrentUser(req: extRequest, res: Response) {
    const { userID } = req.user;
    const result = await this.userService.getOne(userID);
    res.status(result.status).json(result);
  }
}
