import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import type { UploadRes } from "../../types";
import { multerUpload } from "../helpers";
import { serverError, sizeLimit } from "../messages";

const upload = (req: Request, res: Response<UploadRes>, next: NextFunction) => {
  multerUpload(req, res, function (err) {
    if (err) console.log(err);
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE")
        return res.status(400).json({ success: false, message: sizeLimit });
      return res.status(500).json({ success: false, message: serverError });
    } else if (err) {
      return res.status(500).json({ success: false, message: serverError });
    }
    next();
  });
};
export default upload;
