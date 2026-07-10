import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuid } from "uuid";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only images are allowed."));
  }

  cb(null, true);
};

export default multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});