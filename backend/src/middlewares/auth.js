import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const auth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized."
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        roleId: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatar: true,
        status: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found."
      });
    }

    req.user = user;

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid token."
    });
  }
};

export default auth;