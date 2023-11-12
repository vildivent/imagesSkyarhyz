import { uploadReqSchema } from "../validation";

const parseUploadBody = (body: unknown) => {
  return uploadReqSchema.safeParse(body);
};
export default parseUploadBody;
