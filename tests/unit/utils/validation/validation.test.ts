import { checkEmailDuplicate } from "utils/validation";
// import { MySQLClient } from "backends/mysql";

describe("CheckEmailDuplicate", () => {
  const expected = {
    400: {
      status: 400,
      message: "Invalid email",
    },
    500: { status: 500, message: "Client connection error" },
  };

  test("invalid email should return 400", async () => {
    expect(await checkEmailDuplicate(undefined, {})).toEqual(expected[400]);
    expect(await checkEmailDuplicate(null, {})).toEqual(expected[400]);
  });

  test("invalid email and invalid client should return 400", async () => {
    expect(await checkEmailDuplicate(undefined, undefined)).toEqual(
      expected[400]
    );
    expect(await checkEmailDuplicate(undefined, null)).toEqual(expected[400]);
    expect(await checkEmailDuplicate(undefined, {})).toEqual(expected[400]);
    expect(await checkEmailDuplicate(undefined, "test")).toEqual(expected[400]);

    expect(await checkEmailDuplicate(null, undefined)).toEqual(expected[400]);
    expect(await checkEmailDuplicate(null, null)).toEqual(expected[400]);
    expect(await checkEmailDuplicate(null, {})).toEqual(expected[400]);
    expect(await checkEmailDuplicate(null, "test")).toEqual(expected[400]);
  });

  test("valid email & invalid client should return 500", async () => {
    expect(await checkEmailDuplicate("lol@lol.fr", {})).toEqual(expected[500]);
    expect(await checkEmailDuplicate("lol@lol.fr", null)).toEqual(
      expected[500]
    );
    expect(await checkEmailDuplicate("lol@lol.fr", undefined)).toEqual(
      expected[500]
    );
    expect(await checkEmailDuplicate("lol@lol.fr", "test")).toEqual(
      expected[500]
    );
    expect(await checkEmailDuplicate("lol@lol.fr", false)).toEqual(
      expected[500]
    );
  });
});
