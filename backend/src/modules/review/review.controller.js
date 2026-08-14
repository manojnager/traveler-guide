import { successResponse } from "../../responses/apiResponse.js";
import {
  getAdminReviews,
  getReviewById,
  setReviewVisibility,
  deleteReview,
  getMyReviewableBookings,
  createReview
} from "./review.service.js";
import { createReviewSchema } from "./review.validation.js";

export const adminIndex = async (req, res, next) => {
  try {
    const reviews = await getAdminReviews(req.query);
    return successResponse(res, "Reviews fetched successfully.", reviews);
  } catch (error) {
    next(error);
  }
};

export const adminShow = async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);
    return successResponse(res, "Review fetched successfully.", review);
  } catch (error) {
    next(error);
  }
};

export const updateVisibility = async (req, res, next) => {
  try {
    const review = await setReviewVisibility(
      req.params.id,
      Boolean(req.body.isHidden)
    );
    return successResponse(res, "Review visibility updated.", review);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteReview(req.params.id);
    return successResponse(res, "Review deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};

export const myReviewableBookings = async (req, res, next) => {
  try {
    const bookings = await getMyReviewableBookings(req.user.id);
    return successResponse(res, "Reviewable bookings fetched successfully.", bookings);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = createReviewSchema.parse(req.body);
    const review = await createReview(req.user.id, data);
    return successResponse(res, "Review submitted successfully.", review, 201);
  } catch (error) {
    next(error);
  }
};