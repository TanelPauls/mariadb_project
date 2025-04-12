import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectMySQL } from "./db/connectMariaDB.js";
import router from "./routes/routes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3013;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "5mb" })); // To parse req.body
app.use(express.urlencoded({ extended: true }));

app.use("/", router);

const startServer = async () => {
  try {
    await connectMySQL(); // Ensure MySQL is connected
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error("Failed to start the server:", error.message);
    process.exit(1); // Stop execution if DB connections fail
  }
};

startServer();
