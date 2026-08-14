import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} from "./auth.validation.js";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword
} from "./auth.service.js";
import { successResponse } from "../../responses/apiResponse.js";

export const register = async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await registerUser(data);
    return successResponse(
      res,
      "Registration successful.",
      result,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await loginUser(data);
    return successResponse(
      res,
      "Login successful.",
      result
    );
  } catch (error) {
    next(error);
  }
};

export const me = async (req, res) => {
  return successResponse(
    res,
    "User profile.",
    req.user
  );
};

export const forgotPasswordHandler = async (req, res, next) => {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const result = await forgotPassword(email);
    return successResponse(res, result.message, null);
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler = async (req, res, next) => {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const result = await resetPassword(token, password);
    return successResponse(res, result.message, null);
  } catch (error) {
    next(error);
  }
};