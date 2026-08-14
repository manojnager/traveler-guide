import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const optionalAuth = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next();
    }

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
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

    if (user) {
      req.user = user;
    }

    next();
  } catch {
    // Invalid/expired token — treat as guest, don't block the request
    next();
  }
};

export default optionalAuth;