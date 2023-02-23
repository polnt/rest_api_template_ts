import bcrypt from "bcrypt";

export const hash = async (password: string) => {
  const hashPwd = await bcrypt.hash(password, 10);
  return hashPwd;
};

export const compare = async (payloadPwd: string, dbPwd: string) => {
  const match = await bcrypt.compare(payloadPwd, dbPwd);
  return match;
};
