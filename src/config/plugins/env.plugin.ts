import * as env from "env-var";

export const envs = {
  PORT: env.get("PORT").required().asPortNumber(),
  MAILER_EMAIL: env.get("MAILER_EMAIL").required().asEmailString(),
  MAILER_SECRET_LEY: env.get("MAILER_SECRET_LEY").required().asString(),
  PROD: env.get("PROD").required().asBool(),
};
