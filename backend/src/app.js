import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import destinationRoutes from "./modules/destination/destination.routes.js";
import uploadRoutes from "./modules/upload/upload.routes.js";

import adminRoutes from "./modules/admin/admin.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use(morgan("dev"));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(cookieParser());

app.use(
  "/uploads",
  express.static("uploads")
);

app.use("/api/auth", authRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/destinations", destinationRoutes);

app.use("/api/admin", adminRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Traveler Guide API is running."
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;