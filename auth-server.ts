import axios from "axios";
import assert from "assert";
import express, { Request, Response } from "express";
import * as readline from "readline";

import { errorWrapper } from "./error-wrapper";
import { env } from "./env";
import { updateEnv } from "./utils";

const askQuestion = (query: string): Promise<string> => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise<string>((resolve) =>
    rl.question(query, (answer: string) => {
      resolve(answer);
      rl.close();
    })
  );
};

const baseUrl = "https://api.fitbit.com";

const authorize = async (code: string) => {
  const { clientId, clientSecret } = env;
  const token = btoa(`${clientId}:${clientSecret}`);
  const { data } = await axios.post(
    `${baseUrl}/oauth2/token`,
    {
      code,
      grant_type: "authorization_code",
      client_id: clientId,
      redirect_uri: "http://localhost:2323",
    },
    {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return data;
};

const save = async (code: string) => {
  const tokens = await authorize(code);
  const { access_token, refresh_token } = tokens;
  assert(access_token, "Access token was not found");
  assert(refresh_token, "Refresh token was not found");

  updateEnv({ access_token, refresh_token });
  console.log("Token updated successfully");
};

interface FitbitAuthResponse {
  code: string;
}

export const serveAuthServer = () => {
  const app = express();
  const port = 2323;

  app.use(express.json());

  app.get("/", async (req: Request, res: Response) => {
    const { code } = req.query as unknown as FitbitAuthResponse;

    if (code) {
      await save(code);
      res.status(200).send("Token updated successfully");
    } else {
      res.status(400).send('Missing "code" parameter in the request.');
    }
  });

  app.listen(port, () => {
    console.log(
      `Server is running on port ${port}. Now visit the following page to authenticate:

https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${env.clientId}&redirect_uri=http://localhost:${port}&scope=heartrate

If the page does not redirect you to this server after authentication (if you're hosting this somewhere other than your own machine), you can enter the code manually here to continue:`
    );
    askQuestion("Code:").then((code) => errorWrapper(save, code));
  });
};
