import fs from "fs/promises";
import path from "path";

const deleteFileAsync = async (pathname: string, withDir?: boolean) => {
  await fs.rm(withDir ? path.dirname(pathname) : pathname, { recursive: true });
};
export default deleteFileAsync;
