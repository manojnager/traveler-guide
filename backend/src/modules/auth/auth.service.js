import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { generateToken } from "../../utils/jwt.js";
import { sendEmail } from "../../utils/mailer.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";

export const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (existingUser) {
    throw new AppError("Email already exists.", 400);
  }

  const customerRole = await prisma.role.findFirst({
    where: {
      name: "Customer"
    }
  });

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      roleId: customerRole.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone
    },
    select: {
      id: true,
      roleId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatar: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const token = generateToken(user);

  return {
    token,
    user
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      roleId: user.roleId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status
    }
  };
};

export const forgotPassword = async (email) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success even if the email doesn't exist — avoids leaking
  // which emails are registered (standard security practice)
  if (!user) {
    return { message: "If that email exists, a reset link has been sent." };
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: expiry
    }
  });

  const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${rawToken}`;

  await sendEmail({
    to: user.email,
    subject: "Reset Your Password — TravelerGuide",
    type: "password_reset",
    html: wrapEmailTemplate({
      title: "Reset Your Password",
      preheader: "Use the link below to reset your password. This link expires in 1 hour.",
      bodyHtml: `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:24px; font-weight:bold; color:#08111F; line-height:1.4;">Reset Your Password</td></tr>
        </table>

        <p style="margin:0 0 24px; font-size:15px; color:#4b5563; line-height:1.8;">
          Hi ${user.firstName}, we received a request to reset your password. Click the button below to
          choose a new one. This link will expire in 1 hour.
        </p>

        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td style="background-color:#C8A96A; border-radius:8px;">
              <a href="${resetUrl}" style="display:block; padding:14px 36px; font-size:13px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; color:#08111F; text-decoration:none;">
                Reset Password
              </a>
            </td>
          </tr>
        </table>

        <p style="margin:0; font-size:13px; color:#6c7a91; line-height:1.7;">
          If you didn't request this, you can safely ignore this email — your password will remain unchanged.
        </p>
      `
    })
  });

  return { message: "If that email exists, a reset link has been sent." };
};

export const resetPassword = async (rawToken, newPassword) => {
  const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetToken: hashedToken,
      resetTokenExpiry: { gt: new Date() }
    }
  });

  if (!user) {
    throw new AppError("This reset link is invalid or has expired.", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  });

  return { message: "Password has been reset successfully." };
};