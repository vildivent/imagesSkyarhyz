import type { TokenAPIReq } from "../../types";
import env from "../env";
import { tokenAPIResSchema } from "../validation";

const checkToken = async (token: string) => {
  // const res = await fetch(env.API_TOKEN_URL, {
  //   method: "POST",
  //   body: JSON.stringify({ secret: env.IMAGES_SECRET, token } as TokenAPIReq),
  // });

  //testing
  const res = {
    status: 200,
    json: () => ({ success: true, userId: "clokr6aez002nesb00f8serb5" }),
  };
  //
  return tokenAPIResSchema.parse(res.json());
};
export default checkToken;
