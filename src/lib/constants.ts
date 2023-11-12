export enum ErrorTypes {
  nofile = "no file",
  unauth = "unauthorized",
  wrongType = "wrong type",
  sizeLimit = "size limit exceeded",
}
export const MIMETYPES = ["image/jpeg", "image/png", "image/webp"];
export const FILES_EXT = [".png", ".jpg", ".jpeg", ".webp"];
export const FIELD_NAME = "image";
export const TEMP_FOLDER = "./tmp";
export const LIMIT_FILE_SIZE = 10 * 1024 * 1024; //bytes
