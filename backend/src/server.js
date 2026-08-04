import mongoose from "mongoose";
import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env, assertRequiredEnv } from "./config/env.js";

import { logger } from "./utils/logger.js";

let server;

function listenOnPort(port) {
  return new Promise((resolve, reject) => {
    const candidateServer = app.listen(port, () => resolve(candidateServer));
    candidateServer.on("error", (error) => reject(error));
  });
}

async function startServer() {
  try {
    assertRequiredEnv();

    await connectDB();

    const candidatePorts = [env.port, env.port + 1, env.port + 2, env.port + 3];
    let listeningPort = null;

    for (const port of candidatePorts) {
      try {
        server = await listenOnPort(port);
        listeningPort = port;
        logger.info(`Nebula AI Backend running on http://localhost:${port}`);
        break;
      } catch (error) {
        if (error.code !== "EADDRINUSE") {
          throw error;
        }
      }
    }

    if (!listeningPort) {
      throw new Error(`Unable to find an available port for Nebula backend.`);
    }
  } catch (error) {
    logger.error("Failed to start server.", error);
    process.exit(1);
  }
}

async function shutdown(signal) {
  logger.info(`${signal} received. Shutting down server...`);

  try {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }

    await mongoose.connection.close();

    logger.info("MongoDB connection closed.");
    logger.info("Server shut down successfully.");

    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown.", error);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

startServer();
