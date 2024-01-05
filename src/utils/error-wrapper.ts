import { AxiosError } from "axios";

export const errorWrapper = async (callback: Function, ...args: any[]) => {
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
