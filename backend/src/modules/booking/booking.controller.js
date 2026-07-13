import { successResponse } from "../../responses/apiResponse.js";
import {
  getAdminBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
  createPublicBooking
} from "./booking.service.js";
import {
  updateBookingStatusSchema,
  createPublicBookingSchema
} from "./booking.validation.js";

export const adminIndex = async (req, res, next) => {
  try {
    const bookings = await getAdminBookings(req.query);
    return successResponse(res, "Bookings fetched successfully.", bookings);
  } catch (error) {
    next(error);
  }
};

export const adminShow = async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);
    return successResponse(res, "Booking fetched successfully.", booking);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = updateBookingStatusSchema.parse(req.body);
    const booking = await updateBookingStatus(req.params.id, status);
    return successResponse(res, "Booking status updated successfully.", booking);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteBooking(req.params.id);
    return successResponse(res, "Booking deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = createPublicBookingSchema.parse(req.body);
    const result = await createPublicBooking(data);
    return successResponse(res, "Booking created successfully.", result, 201);
  } catch (error) {
    next(error);
  }
};