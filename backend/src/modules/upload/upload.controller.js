import fs from "fs";
import path from "path";
import sharp from "sharp";
import { v4 as uuid } from "uuid";

const saveImage = async (
  file,
  folder,
  width
) => {
  const filename = `${uuid()}.webp`;

  const directory = path.resolve(
    process.cwd(),
    "uploads",
    "destinations",
    folder
  );

  fs.mkdirSync(directory, {
    recursive: true
  });

  const filepath = path.join(
    directory,
    filename
  );

  await sharp(file.buffer)
    .resize({
      width,
      withoutEnlargement: true
    })
    .webp({
      quality: 85
    })
    .toFile(filepath);

  return {
    filename,
    path: `/uploads/destinations/${folder}/${filename}`
  };
};

export const uploadThumbnail = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded."
      });
    }

    const image = await saveImage(
      req.file,
      "thumbnails",
      600
    );

    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

export const uploadHero = async (
  req,
  res,
  next
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded."
      });
    }

    const image = await saveImage(
      req.file,
      "heroes",
      1920
    );

    res.json({
      success: true,
      data: image
    });
  } catch (error) {
    next(error);
  }
};

export const uploadGallery = async (
  req,
  res,
  next
) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({
        success: false,
        message: "No images uploaded."
      });
    }

    const images = [];

    for (const file of req.files) {
      const image = await saveImage(
        file,
        "gallery",
        1200
      );

      images.push(image);
    }

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    next(error);
  }
};