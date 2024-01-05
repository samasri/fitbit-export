import axios from "axios";
import express, { Request, Response } from "express";

import { env } from "./env";
import assert from "assert";
import { updateEnv } from "./utils";

const app = express();
const port = 2323;

app.use(express.json());

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

interface FitbitAuthResponse {
  code: string;
}

app.get("/", async (req: Request, res: Response) => {
  const { code } = req.query as unknown as FitbitAuthResponse;

  if (code) {
    const tokens = await authorize(code);
    const { access_token, refresh_token } = tokens;
    assert(access_token, "Access token was not found");
    assert(refresh_token, "Refresh token was not found");

    updateEnv({ access_token, refresh_token });
    res.status(200).send("Token updated successfully");
  } else {
    res.status(400).send('Missing "code" parameter in the request.');
  }
});

app.listen(port, () => {
  console.log(
    `Server is running on port ${port}
Now visit https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23RHR9&redirect_uri=http://localhost:2323&scope=heartrate`
  );
});
