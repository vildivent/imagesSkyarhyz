import { load } from "ts-dotenv";

const env = load({
  PORT: Number,
  IMAGES_SECRET: String,
  API_TOKEN_URL: String,
  API_IMAGE_URL: String,
  BASE_URL: String,
  ORIGIN: String,
});

export default env;
