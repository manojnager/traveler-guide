import { successResponse } from "../../responses/apiResponse.js";
import {
  getAdminUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateOwnProfile,
  changeOwnPassword
} from "./user.service.js";
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema
} from "./user.validation.js";

export const adminIndex = async (req, res, next) => {
  try {
    const users = await getAdminUsers(req.query);
    return successResponse(res, "Users fetched successfully.", users);
  } catch (error) {
    next(error);
  }
};

export const adminShow = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);
    return successResponse(res, "User fetched successfully.", user);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = createUserSchema.parse(req.body);
    const user = await createUser(data);
    return successResponse(res, "User created successfully.", user, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateUserSchema.parse(req.body);
    const user = await updateUser(req.params.id, data, req.user.id);
    return successResponse(res, "User updated successfully.", user);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteUser(req.params.id, req.user.id);
    return successResponse(res, "User deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const data = updateProfileSchema.parse(req.body);
    const user = await updateOwnProfile(req.user.id, data);
    return successResponse(res, "Profile updated successfully.", user);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const data = changePasswordSchema.parse(req.body);
    const result = await changeOwnPassword(req.user.id, data.currentPassword, data.newPassword);
    return successResponse(res, result.message, null);
  } catch (error) {
    next(error);
  }
};