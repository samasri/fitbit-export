import { Command } from "commander";
import axios, { AxiosError } from "axios";
import { env } from "./env";
import { updateEnv } from "./utils";
import assert from "assert";
import dateValidator from "date-and-time";
import { existsSync, writeFileSync } from "fs";
import pMap from "p-map";

const baseUrl = "https://api.fitbit.com";
const hrEndpoint = (userId: string, date: string) =>
  `/1/user/${userId}/activities/heart/date/${date}/1d/1sec.json`;
const dataStoragePath = "./data";

const introspect = async () => {
  const { token } = env;
  const { data } = await axios.post(
    `${baseUrl}/1.1/oauth2/introspect`,
    { token },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  console.log(data);
};

const refresh = async () => {
  const { token, refresh: refreshToken } = env;
  const { data } = await axios.post(
    `${baseUrl}/oauth2/token`,
    {
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  const { access_token, refresh_token } = data;
  assert(access_token, "Access token was not found");
  assert(refresh_token, "Refresh token was not found");
  updateEnv(data);
};

interface HeartRateResponse {
  data: {
    "activities-heart": {
      dateTime: Date;
      value: any[];
    }[];
    "activities-heart-intraday": {
      dataset: {
        time: string;
        value: number;
      }[];
    };
  };
}

const getHeartRate = async (date: string, userId: string, token: string) => {
  const { data } = (await axios.get(`${baseUrl}/${hrEndpoint(userId, date)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })) as HeartRateResponse;
  return data["activities-heart-intraday"];
};

const save = async (date: string) => {
  if (!dateValidator.isValid(date, "YYYY-MM-DD"))
    throw new Error("Invalid date argument");
  const filePath = `${dataStoragePath}/${date}`;
  if (existsSync(filePath)) throw new Error(`File ${filePath} already exists`);

  const { token, userId } = env;
  const hrData = await getHeartRate(date, userId, token);
  const strigified = JSON.stringify(hrData, undefined, 2);

  writeFileSync(filePath, strigified);
};

const saveRange = async (startDate: string, endDate: string) => {
  if (!dateValidator.isValid(startDate, "YYYY-MM-DD"))
    throw new Error("Invalid startDate argument");
  if (!dateValidator.isValid(endDate, "YYYY-MM-DD"))
    throw new Error("Invalid endDate argument");

  const start = new Date(startDate);
  const end = new Date(endDate);

  const dates = [] as Date[];

  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  const toString = (date: Date) => date.toISOString().split("T")[0];
  await pMap(dates, (date) => save(toString(date)));
};

const errorWrapper = async (callback: Function, ...args: any[]) => {
  try {
    await callback(...args);
  } catch (e) {
    if (e instanceof AxiosError) {
      const { data } = e.response as {
        data: {
          success: boolean;
          errors: { errorType: string; message: string }[];
        };
      };
      const { errors } = data;
      if (errors.length && errors[0].errorType === "expired_token") {
        console.log(
          "Token is expired. Run `yarn auth-server` to re-authenticate"
        );
      }
      console.log(data);
    } else console.log((e as Error).message);
  }
};

const program = new Command();
program.version("1.0.0");
program.allowUnknownOption();

program
  .command("introspect")
  .description(
    "Displays more information about the current token in the environment"
  )
  .action(async () => errorWrapper(introspect));

program
  .command("refresh")
  .description(
    "Refreshes the token if the refresh token saved in the environment is still valid"
  )
  .action(async () => errorWrapper(refresh));

program
  .command("saveDay")
  .argument("-d, --date", "Get data of a certain day. Date format: YYYY-MM-DD")
  .description("Saves the heart rate data for a certain day")
  .action(async (date) => errorWrapper(save, date));

program
  .command("save")
  .requiredOption(
    "-sd, --start-date [date]",
    "Start date. Date format: YYYY-MM-DD"
  )
  .requiredOption("-ed, --end-date [date]", "End date. Date format: YYYY-MM-DD")
  .description(
    "Saves the heart rate data for a certain date range (start and end inclusive)"
  )
  .action(async ({ startDate, endDate }) =>
    errorWrapper(saveRange, startDate, endDate)
  );

program.parse(process.argv);