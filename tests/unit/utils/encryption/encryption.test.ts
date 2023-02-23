import { hash, compare } from "utils/encryption";

describe("server utils", () => {
  test("hash", async () => {
    const hashPwd = await hash("test");
    expect(hashPwd).not.toEqual("test");
    expect(hashPwd).not.toEqual(await hash("test"));
    expect(hashPwd).toEqual(hashPwd);
  });

  test("compare", async () => {
    expect(await compare("test", await hash("test"))).toEqual(true);
    expect(await compare("test", "lol")).toEqual(false);
    expect(await compare("test", await hash("lol"))).toEqual(false);
  });
});
