import type { ImageAPIReq } from "../../types";
import env from "../env";
import { imageAPIResSchema } from "../validation";

const saveImageDB = async (
  userId: string,
  url: string,
  aspectRatio: number
) => {
  const res = await fetch(env.API_IMAGE_URL, {
    method: "POST",
    body: JSON.stringify({
      secret: env.IMAGES_SECRET,
      userId,
      url,
      aspectRatio,
    } as ImageAPIReq),
  });

  const parsedData = imageAPIResSchema.parse(res.json());
  if (!parsedData.success) throw new Error("SaveImageDB server error");
  return { imageId: parsedData.imageId };
};

export default saveImageDB;
