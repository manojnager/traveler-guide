import { successResponse } from "../../responses/apiResponse.js";
import { getAllRoles } from "./role.service.js";

export const index = async (req, res, next) => {
  try {
    const roles = await getAllRoles();
    return successResponse(res, "Roles fetched successfully.", roles);
  } catch (error) {
    next(error);
  }
};