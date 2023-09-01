import express from "express";
import { summoner } from "./routes";
import { errorHandler } from "./routes/middlewares";

const app = express();
const PORT = 3000;

app.use("/api/summoner", summoner);
app.use(errorHandler);

app.listen(PORT, async () => {
  console.log("Server is running on port 3000\n");
});
