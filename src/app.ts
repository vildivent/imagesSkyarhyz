import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import fs from "fs";
import path from "path";
import probe from "probe-image-size";
import {
  deleteUnauth,
  deletionFailed,
  nofile,
  readError,
  serverError,
  unauth,
  wrongType,
} from "./lib/messages";
import upload from "./lib/middlewares/upload";
import type { UploadRes } from "./types";
import { deleteFileAsync, env, moveFileAsync } from "./utils";
import { ErrorTypes } from "./lib/constants";
import { checkType, createImagePaths, parseUploadBody } from "./lib/helpers";
import { checkToken, saveImageDB } from "./lib/services";

const options: cors.CorsOptions = {
  origin: env.ORIGIN,
  preflightContinue: true,
};

const app = express();
app.use(cors(options));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "index.html"));
});

app.get(`/:entity/:folder/:id`, (req, res) => {
  const filepath = path.join(
    __dirname,
    "..",
    "files",
    req.params.entity,
    req.params.folder,
    req.params.id
  );
  console.log(filepath);
  if (fs.existsSync(filepath)) return res.sendFile(filepath);
  return res.status(400).json({ success: false, message: nofile });
});

app.delete(`/:entity/:folder/:id`, async (req, res) => {
  try {
    if (req.body?.secret !== env.IMAGES_SECRET)
      return res.status(401).json({ success: false, message: deleteUnauth });

    const filepath = path.join(
      "./files",
      req.params.entity,
      req.params.folder,
      req.params.id
    );

    await deleteFileAsync(filepath, true);

    return res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: deletionFailed });
  }
});

app.post("/upload", upload, async (req: Request, res: Response<UploadRes>) => {
  const file = req.file;
  try {
    if (!file) throw new Error(ErrorTypes.nofile);

    const body = parseUploadBody(req.body);
    if (!body.success) throw new Error(ErrorTypes.unauth);
    const { token, entity } = body.data;

    const checkTokenRes = await checkToken(token);
    if (!checkTokenRes.success) throw new Error(ErrorTypes.unauth);
    const { userId } = checkTokenRes;

    if (!checkType(file.mimetype)) throw new Error(ErrorTypes.wrongType);

    const { width, height } = await probe(fs.createReadStream(file.path));
    const { imageURLPath, imagePath } = createImagePaths(
      decodeURI(file.originalname),
      entity
    );
    const { imageId } = await saveImageDB(
      userId,
      `${env.BASE_URL}/${imageURLPath}`,
      width / height
    );

    await moveFileAsync(file.path, imagePath);

    return res.status(200).json({ success: true, imageId });
  } catch (error) {
    console.log(error);
    if (file?.path) await deleteFileAsync(file.path);
    if (error instanceof probe.Error)
      return res.status(400).json({ success: false, message: readError });
    if (error instanceof Error) {
      if (error.message.includes(ErrorTypes.nofile))
        return res.status(400).json({ success: false, message: nofile });
      if (error.message.includes(ErrorTypes.wrongType))
        return res.status(400).json({ success: false, message: wrongType });
      if (error.message.includes(ErrorTypes.unauth))
        return res.status(401).json({ success: false, message: unauth });
    }
    return res.status(500).json({ success: false, message: serverError });
  }
});

app.listen(env.PORT, () =>
  console.log(`Application is running at http://localhost:${env.PORT}`)
);
