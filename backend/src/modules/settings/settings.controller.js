import { successResponse } from "../../responses/apiResponse.js";
import { getAllSettings, updateSettings } from "./settings.service.js";

export const index = async (req, res, next) => {
  try {
    const settings = await getAllSettings();
    return successResponse(res, "Settings fetched successfully.", settings);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const settings = await updateSettings(req.body);
    return successResponse(res, "Settings updated successfully.", settings);
  } catch (error) {
    next(error);
  }
};