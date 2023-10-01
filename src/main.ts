import express from "express";
import { champ, summoner } from "./routes";
import { errorHandler } from "./routes/middlewares";
import cors from "cors";
import { connectToDatabase } from "./database/config";
import dotenv from "dotenv";
dotenv.config();

try {
  await connectToDatabase();

  cors({ origin: "http://lolmood.net" });

  const app = express();
  const PORT = 3001;

  app.use(cors());

  app.use("/api/summoner", summoner);
  app.use("/api/champ", champ);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} \n`);
  });
} catch (error) {
  console.error(error);
}
