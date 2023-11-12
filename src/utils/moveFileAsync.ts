import fs from "fs/promises";
import path from "path";

const moveFileAsync = async (oldPath: string, newPath: string) => {
  await fs.mkdir(path.dirname(newPath), { recursive: true });
  await fs.rename(oldPath, newPath);
};
export default moveFileAsync;
