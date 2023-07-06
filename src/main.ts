import express from "express";
import { config } from "dotenv";
config();

const app = express();
const { PORT } = process.env;

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
