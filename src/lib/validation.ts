import { load } from "ts-dotenv";
import { z } from "zod";

const env = load({ IMAGES_SECRET: String });

//upload
export const uploadReqSchema = z.object({
  token: z.string().cuid(),
  entity: z.string().optional(),
});
const uploadSuccess = z.object({
  success: z.literal(true),
  imageId: z.string().cuid(),
});
const uploadError = z.object({
  success: z.literal(false),
  message: z.string(),
});
export const uploadResSchema = z.union([uploadSuccess, uploadError]);

export const tokenAPIReqSchema = z.object({
  secret: z.literal(env.IMAGES_SECRET),
  token: z.string().cuid(),
});
const tokenAPISuccess = z.object({
  success: z.literal(true),
  userId: z.string().cuid(),
});
const tokenAPIError = z.object({
  success: z.literal(false),
  message: z.string(),
});
export const tokenAPIResSchema = z.union([tokenAPISuccess, tokenAPIError]);

export const imageAPIReqSchema = z.object({
  secret: z.literal(env.IMAGES_SECRET),
  userId: z.string().cuid(),
  url: z.string().url(), //.startsWith("https://"),
  aspectRatio: z.number().positive(),
});
const imageAPISuccess = z.object({
  success: z.literal(true),
  imageId: z.string().cuid(),
});
const imageAPIError = z.object({
  success: z.literal(false),
  message: z.string(),
});
export const imageAPIResSchema = z.union([imageAPISuccess, imageAPIError]);

//delete
export const deleteReqSchema = z.object({
  secret: z.literal(env.IMAGES_SECRET),
});
const deleteSuccess = z.object({
  success: z.literal(true),
});
const deleteError = z.object({
  success: z.literal(false),
  message: z.string(),
});
export const deleteResSchema = z.union([imageAPISuccess, imageAPIError]);

export const entitySchema = z.enum(["post", "review", "photo", "user"]);
