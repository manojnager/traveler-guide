import {
  registerSchema,
  loginSchema
} from "./auth.validation.js";

import {
  registerUser,
  loginUser
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