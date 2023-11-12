import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import fs, { mkdir } from "fs";
import path from "path";
import probe from "probe-image-size";
import { load } from "ts-dotenv";
import {
  deletionFailed,
  nofile,
  readError,
  serverError,
  unauth,
  wrongType,
} from "./lib/messages";
import {
  ErrorTypes,
  checkToken,
  checkType,
  createImagePaths,
  deleteFile,
  parseUploadBody,
  saveImage,
  saveImageDB,
  upload,
} from "./lib/utils";
import type { UploadRes } from "./types";

const env = load({
  PORT: Number,
  IMAGES_SECRET: String,
  BASE_URL: String,
  ORIGIN: String,
});
const PORT = env.PORT;
const BASE_URL = env.BASE_URL;
const SECRET = env.IMAGES_SECRET;
const ORIGIN = env.ORIGIN;

const options: cors.CorsOptions = {
  origin: ORIGIN,
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

app.delete(`/:entity/:folder/:id`, (req, res) => {
  if (req.body?.secret !== SECRET)
    return res
      .status(401)
      .json({ success: false, message: "Доступ запрещён!" });

  const filepath = path.join(
    "./files",
    req.params.entity,
    req.params.folder,
    req.params.id
  );
  const dir = path.join("./files", req.params.entity, req.params.folder);

  try {
    fs.rmSync(dir, { recursive: true });
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
    const { imageURLPath, imagePath, folderPath } = createImagePaths(
      decodeURI(file.originalname),
      entity
    );
    const { imageId } = await saveImageDB(
      userId,
      `${BASE_URL}/${imageURLPath}`,
      width / height
    );

    await saveImage(file.path, imagePath, folderPath);

    return res.status(200).json({ success: true, imageId });
  } catch (error) {
    console.log(error);
    if (file?.path) await deleteFile(file.path);
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

app.listen(PORT, () =>
  console.log(`Application is running at http://localhost:${PORT}`)
);
