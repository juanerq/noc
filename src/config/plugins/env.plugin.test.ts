import { envs } from "./env.plugin";

describe("env plugin", () => {
  test("should be defined", () => {
    expect(envs).toBeDefined();
  });

  test("should return env options", () => {
    expect(envs).toEqual({
      PORT: 3000,
      MAILER_SERVICE: "gmail",
      MAILER_EMAIL: "jrjuanreyes64@gmail.com",
      MAILER_SECRET_LEY: "ysxz ahrl pehb vwzo",
      PROD: false,
      MONGO_URL: "mongodb://admin:4321@localhost:27017",
      MONGO_DB_NAME: "noc",
      MONGO_USER: "admin",
      MONGO_PASS: "4321",
    });
  });

  test("should return error if not found env", async () => {
    jest.resetModules();
    process.env.PORT = "ABC";

    try {
      await import("./env.plugin");
    } catch (error) {
      expect(`${error}`).toContain(
        'EnvVarError: env-var: "PORT" should be a valid integer'
      );
    }
  });
});
