import express = require("express");
import type { NextFunction, Request, Response } from "express";
import * as functions from "firebase-functions";
import cors = require("cors");

// Initialize the Express App for the back end
export const media_metadata_manager = (() => {
  const app = express();

  // Automatically allow cross-origin requests
  // Required to connect the localhost site to the emulator
  // TODO: Fix this for production in the future
  app.use(cors({ origin: true }));

  const helloWorld = (req: Request, res: Response, next: NextFunction) => {
    functions.logger.info("Hello logs!", { structuredData: true });
    res.send({ data: "Hello from Firebase!" });
  };

  app.all("/", helloWorld);

  return functions.https.onRequest(app);
})();
