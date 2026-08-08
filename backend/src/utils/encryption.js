import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const KEY = process.env.SMTP_ENCRYPTION_KEY
  ? Buffer.from(process.env.SMTP_ENCRYPTION_KEY, "hex")
  : null;

export const encrypt = (text) => {
  if (!KEY) throw new Error("SMTP_ENCRYPTION_KEY is not set in .env");
  if (!text) return "";

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
};

export const decrypt = (encryptedText) => {
  if (!KEY) throw new Error("SMTP_ENCRYPTION_KEY is not set in .env");
  if (!encryptedText || !encryptedText.includes(":")) return "";

  const [ivHex, dataHex] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);

  return decrypted.toString("utf8");
};