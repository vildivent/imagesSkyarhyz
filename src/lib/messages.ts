import { arrayToString } from "../utils";
import { FILES_EXT, LIMIT_FILE_SIZE } from "./constants";

export const nofile = "Отсутствует файл";
export const unauth =
  "Для сохранения изображения необходима авторизация. Авторизуйтесь и повторите попытку.";
export const wrongType = `Произошла ошибка загрузки. Допускаются только файлы с расширениями: ${arrayToString(
  FILES_EXT
)}.`;
export const serverError =
  "При загрузке изображения произошла ошибка. Повторите попытку позже или обратитесь к администратору.";
export const readError =
  "Произошла ошибка чтения файла. Возможно, файл имеет неподходящий формат или повреждён. Попробуйте загрузить другой.";
export const deletionFailed = "Не удалось удалить файл.";
export const sizeLimit = `Не удалось загрузить изображение. Превышен максимальный размер файла: ${
  LIMIT_FILE_SIZE / 1024 / 1024
} MB`;
export const deleteUnauth = "Доступ запрещён.";
