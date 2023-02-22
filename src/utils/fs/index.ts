import fs from "fs";
import { readFile } from "fs/promises";

export const readdirAsync = (filePath: fs.PathLike) =>
  new Promise<string[]>((resolve, reject) => {
    fs.readdir(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const readFileAsync = (filePath: fs.PathLike) =>
  new Promise<Buffer>((resolve, reject) => {
    fs.readFile(filePath, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });

export const encodeBase64 = async (filePath: string): Promise<string> => {
  const data = await readFile(filePath);
  return Buffer.from(data).toString("base64");
};

export const getFsFileName = (file: any): string => {
  return `${file.user_id}-${file.user_role}-${file.originalname}`;
};
