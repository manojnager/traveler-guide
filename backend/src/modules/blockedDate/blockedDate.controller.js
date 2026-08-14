import { successResponse } from "../../responses/apiResponse.js";
import {
  getBlockedDatesForDestination,
  addBlockedDate,
  addBulkBlockedDates,
  removeBlockedDate
} from "./blockedDate.service.js";
import { createBlockedDateSchema, createBulkBlockedDatesSchema } from "./blockedDate.validation.js";

export const publicIndex = async (req, res, next) => {
  try {
    const dates = await getBlockedDatesForDestination(req.params.destinationId);
    return successResponse(res, "Blocked dates fetched successfully.", dates);
  } catch (error) {
    next(error);
  }
};

export const adminIndex = async (req, res, next) => {
  try {
    const dates = await getBlockedDatesForDestination(req.params.destinationId);
    return successResponse(res, "Blocked dates fetched successfully.", dates);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = createBlockedDateSchema.parse(req.body);
    const blockedDate = await addBlockedDate(req.params.destinationId, data);
    return successResponse(res, "Date blocked successfully.", blockedDate, 201);
  } catch (error) {
    next(error);
  }
};

export const storeBulk = async (req, res, next) => {
  try {
    const data = createBulkBlockedDatesSchema.parse(req.body);
    const result = await addBulkBlockedDates(req.params.destinationId, data);
    return successResponse(res, `${result.created} date(s) blocked, ${result.skipped} already existed.`, result, 201);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await removeBlockedDate(req.params.id);
    return successResponse(res, "Date unblocked successfully.", null);
  } catch (error) {
    next(error);
  }
};