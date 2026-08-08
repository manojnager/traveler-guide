import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";
import destinationRoutes from "./modules/destination/destination.routes.js";
import contactRoutes from "./modules/contact/contact.routes.js";

import bookingRoutes from "./modules/booking/booking.routes.js";

import uploadRoutes from "./modules/upload/upload.routes.js";

import adminRoutes from "./modules/admin/admin.routes.js";
import blockedDateRoutes from "./modules/blockedDate/blockedDate.routes.js";
import userRoutes from "./modules/user/user.routes.js";

import paymentRoutes from "./modules/payment/payment.routes.js";


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

app.use("/api/contact", contactRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/admin", adminRoutes);
app.use("/api/destinations", blockedDateRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Traveler Guide API is running."
  });
});

app.use(notFound);

app.use(errorHandler);

export default app;