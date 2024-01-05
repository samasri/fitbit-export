import * as readline from "readline";

export const askQuestion = (query: string): Promise<string> => {
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
