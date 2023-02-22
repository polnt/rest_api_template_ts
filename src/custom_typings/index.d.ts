declare namespace Express {
  interface Request {
    // file?: Multer.File;
    user: { userID: number; email: string };
  }
}
