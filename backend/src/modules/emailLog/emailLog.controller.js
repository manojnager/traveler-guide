import { successResponse } from "../../responses/apiResponse.js";
import { getAdminEmailLogs } from "./emailLog.service.js";

export const adminIndex = async (req, res, next) => {
  try {
    const logs = await getAdminEmailLogs(req.query);
    return successResponse(res, "Email logs fetched successfully.", logs);
  } catch (error) {
    next(error);
  }
};