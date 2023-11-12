import path from "path";
import { getUniqueString } from "../../utils";
import { entitySchema } from "../validation";

const parseEntity = (entity?: string) => {
  const parsedEntity = entitySchema.safeParse(entity);
  if (!parsedEntity.success) return "default";
  return parsedEntity.data;
};

const createImagePaths = (filename: string, entity?: string) => {
  const parsedEntity = parseEntity(entity);
  const folderId = getUniqueString();
  const imagePath = path.join("./files", parsedEntity, folderId, filename);
  const imageURLPath = `${parsedEntity}/${folderId}/${filename}`;
  return { imageURLPath, imagePath };
};
export default createImagePaths;
