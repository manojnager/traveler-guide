import nodemailer from "nodemailer";
import prisma from "../lib/prisma.js";
import { decrypt } from "./encryption.js";

const getSmtpConfig = async () => {
  const rows = await prisma.setting.findMany({ where: { group: "smtp" } });
  const config = {};
  rows.forEach((row) => {
    config[row.key] = row.value;
  });

  return {
    host: config.smtp_host || "",
    port: Number(config.smtp_port) || 587,
    secure: config.smtp_security === "ssl",
    user: config.smtp_username || "",
    password: config.smtp_password ? decrypt(config.smtp_password) : "",
    fromName: config.smtp_from_name || "TravelerGuide",
    fromEmail: config.smtp_from_email || config.smtp_username || "",
    notifyEmail: config.smtp_notify_email || config.smtp_from_email || ""
  };
};

export const sendEmail = async ({ to, subject, html, type }) => {
  const smtp = await getSmtpConfig();

  if (!smtp.host || !smtp.user || !smtp.password) {
    await prisma.emailLog.create({
      data: {
        toEmail: to,
        subject,
        type,
        status: "FAILED",
        errorMessage: "SMTP settings are not configured."
      }
    });
    return { success: false, error: "SMTP settings are not configured." };
  }
  
  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure,
    auth: {
      user: smtp.user,
      pass: smtp.password
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.sendMail({
      from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
      to,
      subject,
      html
    });

    await prisma.emailLog.create({
      data: { toEmail: to, subject, type, status: "SENT" }
    });

    return { success: true };
  } catch (error) {
    await prisma.emailLog.create({
      data: {
        toEmail: to,
        subject,
        type,
        status: "FAILED",
        errorMessage: error.message || "Unknown error"
      }
    });

    return { success: false, error: error.message };
  }
};

export const getSmtpNotifyEmail = async () => {
  const smtp = await getSmtpConfig();
  return smtp.notifyEmail;
};