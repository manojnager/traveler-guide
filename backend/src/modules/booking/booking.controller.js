import { successResponse } from "../../responses/apiResponse.js";
import {
  getAdminBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} from "./booking.service.js";
import { updateBookingStatusSchema } from "./booking.validation.js";

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