import bcrypt from "bcrypt";

export const hash = (password: string) => {
  const hashPwd = bcrypt.hash(password, 10);
  return hashPwd;
};

export const compare = (payloadPwd: string, dbPwd: string) => {
  const match = bcrypt.compare(payloadPwd, dbPwd);
  return match;
};
