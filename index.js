import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { usersRouter } from "./routes/usersRouter.js";
import { adminRouter } from "./routes/adminRouter.js";


dotenv.config();

const app = express();

app.use(cors());

const PORT = process.env.PORT;

const MONGO_URL = process.env.MONGO_URL;

app.use(express.json());

async function createConnection() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

export const client = await createConnection();

app.get("/", (req, res) => {
  res.send(`Hello Everyone`);
});

app.use("/users", usersRouter);
app.use("/admin", adminRouter);

app.listen(PORT, () => console.log("Server started on the PORT", PORT));
