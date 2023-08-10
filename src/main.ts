import express from "express";
import { summoner } from "./routes";

const app = express();
const PORT = 3000;

app.use("/api/summoner", summoner);

app.listen(PORT, async () => {
  console.log("Server is running on port 3000\n");
});
