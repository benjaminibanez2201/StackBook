"use strict";
import cors from "cors";
import indexRoutes from "./routes/index.routes.js";
import express, { json, urlencoded } from "express";
import { HOST, PORT } from "./config/configEnv.js";
import { connectDB } from "./config/configDb.js";

async function setupServer() {
  try {
    const app = express();

    app.disable("x-powered-by");

    app.use(cors({
      credentials: true,
      origin: true,
    }));

    app.use(urlencoded({ extended: true, limit: "1mb" }));
    app.use(json({ limit: "1mb" }));

    app.use("/api", indexRoutes);

    app.listen(PORT, () => {
      console.log(`=> Servidor corriendo en ${HOST}:${PORT}/api`);
    });
  } catch (error) {
    console.log("Error en index.js -> setupServer():", error);
  }
}

async function setupAPI() {
  try {
    await connectDB();
    await setupServer();
  } catch (error) {
    console.log("Error en index.js -> setupAPI():", error);
  }
}

setupAPI()
  .then(() => console.log("=> API Iniciada exitosamente"))
  .catch((error) => console.log("Error en index.js -> setupAPI():", error));