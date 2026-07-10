import { successResponse } from "../../responses/apiResponse.js";
import { getDashboardStats } from "./dashboard.service.js";

export const stats = async (req, res, next) => {
  try {
    const data = await getDashboardStats();

    return successResponse(
      res,
      "Dashboard stats fetched successfully.",
      data
    );
  } catch (error) {
    next(error);
  }
};