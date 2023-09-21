import express from "express";
import { champ, summoner } from "./routes";
import { errorHandler } from "./routes/middlewares";
import cors from "cors";

cors({ origin: "http://localhost:3001" });
const app = express();
const PORT = 3000;

app.use(cors());
app.use("/api/summoner", summoner);
app.use("/api/champ", champ);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("Server is running on port 3000\n");
});
