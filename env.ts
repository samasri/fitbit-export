import assert from "assert";
import { config as dotenv } from "dotenv";
dotenv();

interface Environment {
  token: string;
  refresh: string;
  userId: string;
  clientSecret: string;
  clientId: string;
}

export const env = {
  token: process.env.ACCESS_TOKEN,
  refresh: process.env.REFRESH_TOKEN,
  userId: process.env.USER_ID,
  clientId: process.env.FITBIT_CLIENT_ID,
  clientSecret: process.env.FITBIT_CLIENT_SECRET,
} as Environment;
assert(env.token, "ACCESS_TOKEN must be set in the environment");
assert(env.refresh, "REFRESH_TOKEN must be set in the environment");
assert(env.userId, "USER_ID must be set in the environment");
assert(env.clientSecret, "FITBIT_CLIENT_SECRET must be set in the environment");
assert(env.clientId, "FITBIT_CLIENT_SECRET must be set in the environment");
