import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

export default {
  JWT_SECRET: process.env.JWT_SECRET,
};
