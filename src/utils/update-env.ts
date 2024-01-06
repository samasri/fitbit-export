import { readFileSync, writeFileSync } from "fs";

export const updateEnv = ({
  access_token,
  refresh_token,
}: {
  access_token?: string;
  refresh_token?: string;
}) => {
  const oldEnv = readFileSync(".env", "utf-8").split("\n");
  const newEnv = oldEnv.map((line) => {
    if (access_token && line.startsWith("ACCESS_TOKEN"))
      return `ACCESS_TOKEN="${access_token}"`;
    else if (refresh_token && line.startsWith("REFRESH_TOKEN"))
      return `REFRESH_TOKEN="${refresh_token}"`;
    else return line;
  });

  if (!newEnv.some((line) => line.startsWith("ACCESS_TOKEN")))
    newEnv.push(`ACCESS_TOKEN=${access_token}`);
  if (!newEnv.some((line) => line.startsWith("REFRESH_TOKEN")))
    newEnv.push(`REFRESH_TOKEN=${refresh_token}`);
  writeFileSync(".env", newEnv.join("\n"));
};
