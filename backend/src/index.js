import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import { connectDB } from "./db/db.js";
import rootRouter from "./routes/index.js";
import cors from "cors";

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use("/api/v1", rootRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log("server running!!"));
  })
  .catch((e) => console.log(e));
