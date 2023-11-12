import multer from "multer";
import { FIELD_NAME, LIMIT_FILE_SIZE, TEMP_FOLDER } from "../constants";
import { getUniqueString } from "../../utils";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_FOLDER);
  },
  filename: function (req, file, cb) {
    cb(null, getUniqueString() + "_" + decodeURI(file.originalname));
  },
});
const limits = { fileSize: LIMIT_FILE_SIZE };
const multerUpload = multer({ storage, limits }).single(FIELD_NAME);
export default multerUpload;
