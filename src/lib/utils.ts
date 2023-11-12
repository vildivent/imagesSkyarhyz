import fs from "fs";
import { mkdir } from "fs/promises";
import multer from "multer";
import path from "path";
import { load } from "ts-dotenv";
import type { Entity, ImageAPIReq, TokenAPIReq } from "../types";
import {
  entitySchema,
  imageAPIResSchema,
  tokenAPIResSchema,
  uploadReqSchema,
} from "./validation";

const env = load({
  IMAGES_SECRET: String,
  API_TOKEN_URL: String,
  API_IMAGE_URL: String,
});

const FIELD_NAME = "image";
const TEMP_FOLDER = "./tmp";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_FOLDER);
  },
  filename: function (req, file, cb) {
    const uniquePreffix = Date.now().toString();
    cb(null, uniquePreffix + decodeURI(file.originalname));
  },
});
export const upload = multer({ storage }).single(FIELD_NAME);

export enum ErrorTypes {
  nofile = "no file",
  unauth = "unauthorized",
  wrongType = "wrong type",
}

const MIMETYPES = ["image/jpeg", "image/png", "image/webp"];
export const FILES_EXT = [".png", ".jpg", ".jpeg", ".webp"];
export const checkType = (type: string) => {
  for (const mimeType of MIMETYPES) {
    if (type === mimeType) return true;
  }
  return false;
};

export const parseUploadBody = (body: any) => {
  return uploadReqSchema.safeParse(body);
};

export const checkToken = async (token: string) => {
  // const res = await fetch(env.API_TOKEN_URL, {
  //   method: "POST",
  //   body: JSON.stringify({ secret: env.IMAGES_SECRET, token } as TokenAPIReq),
  // });
  //
  //testing
  const res = {
    status: 200,
    json: () => ({ success: true, userId: "clokr6aez002nesb00f8serb5" }),
  };
  //
  if (res.status >= 500) throw new Error("CheckToken server error");
  return tokenAPIResSchema.parse(res.json());
};

export const saveImageDB = async (
  userId: string,
  url: string,
  aspectRatio: number
) => {
  // const res = await fetch(env.API_IMAGE_URL, {
  //   method: "POST",
  //   body: JSON.stringify({
  //     secret: env.IMAGES_SECRET,
  //     userId,
  //     url,
  //     aspectRatio,
  //   } as ImageAPIReq),
  // });
  //
  //testing
  const res = {
    status: 200,
    json: () => ({ success: true, imageId: "clokr6aez002nesb00f8serb5" }),
  };
  //
  const parsedData = imageAPIResSchema.parse(res.json());
  if (!parsedData.success) throw new Error("SaveImageDB server error");
  return { imageId: parsedData.imageId };
};

export const saveImage = async (
  oldPath: string,
  newPath: string,
  newPathFolder: string
) => {
  await mkdir(newPathFolder, { recursive: true });
  await rename(oldPath, newPath);
};

export const rename = async (oldName: string, newName: string) => {
  return new Promise<void>((resolve) => {
    fs.access(newName, fs.constants.F_OK, (err) => {
      if (err) {
        return fs.rename(oldName, newName, (err) => {
          resolve();
        });
      }
      resolve();
    });
  });
};

export const deleteFile = async (pathname: string) => {
  return new Promise<void>((resolve) => {
    return fs.unlink(pathname, (err) => {
      resolve();
    });
  });
};

const parseEntity = (entity?: string) => {
  const parsedEntity = entitySchema.safeParse(entity);
  if (!parsedEntity.success) return "default";
  return parsedEntity.data;
};

export const createImagePaths = (filename: string, entity?: string) => {
  const parsedEntity = parseEntity(entity);
  const folderId = Date.now().toString();
  const folderPath = path.join("./files", parsedEntity, folderId);
  const imagePath = path.join(folderPath, filename);
  const imageURLPath = `${parsedEntity}/${folderId}/${filename}`;
  return { imageURLPath, imagePath, folderPath };
};
