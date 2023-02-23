import { readdirAsync, readFileAsync } from "utils/fs";

describe("server utils", () => {
  test("read directory", async () => {
    await expect(
      readdirAsync(`${process.cwd()}/src/custom_typings/express`)
    ).resolves.toEqual<string[]>(["index.d.ts"]);
    await expect(readdirAsync("/dummy")).rejects.toThrow();
  });

  test("read file", async () => {
    await expect(
      readFileAsync(`${process.cwd()}/.gitignore`)
    ).resolves.not.toThrow();
    await expect(readFileAsync("/dummy")).rejects.toThrow();
  });
});
