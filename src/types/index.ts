import { z } from "zod";
import {
  entitySchema,
  imageAPIReqSchema,
  imageAPIResSchema,
  tokenAPIReqSchema,
  tokenAPIResSchema,
  uploadReqSchema,
  uploadResSchema,
} from "../lib/validation";

export type UploadReq = z.infer<typeof uploadReqSchema>;
export type UploadRes = z.infer<typeof uploadResSchema>;
export type TokenAPIReq = z.infer<typeof tokenAPIReqSchema>;
export type TokenAPIRes = z.infer<typeof tokenAPIResSchema>;
export type ImageAPIReq = z.infer<typeof imageAPIReqSchema>;
export type ImageAPIRes = z.infer<typeof imageAPIResSchema>;
export type Entity = z.infer<typeof entitySchema>;
