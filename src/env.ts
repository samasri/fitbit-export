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

export const clientEnv = () => {
  const variables = {
    clientId: process.env.FITBIT_CLIENT_ID,
    clientSecret: process.env.FITBIT_CLIENT_SECRET,
  };
  assert(
    variables.clientSecret,
    "FITBIT_CLIENT_SECRET must be set in the environment"
  );
  assert(
    variables.clientId,
    "FITBIT_CLIENT_SECRET must be set in the environment"
  );
  return variables;
};

export const env = () => {
  const variables = {
    token: process.env.ACCESS_TOKEN,
    refresh: process.env.REFRESH_TOKEN,
    userId: process.env.USER_ID,
    ...clientEnv(),
  } as Environment;
  assert(variables.token, "ACCESS_TOKEN must be set in the environment");
  assert(variables.refresh, "REFRESH_TOKEN must be set in the environment");
  assert(variables.userId, "USER_ID must be set in the environment");
  return variables;
};
