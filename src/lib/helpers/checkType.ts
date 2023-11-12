import { MIMETYPES } from "../constants";

const checkType = (type: string) => {
  for (const mimeType of MIMETYPES) {
    if (type === mimeType) return true;
  }
  return false;
};
export default checkType;
