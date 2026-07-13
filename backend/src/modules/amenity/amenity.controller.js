import { successResponse } from "../../responses/apiResponse.js";
import {
  getAllAmenities,
  getAmenityById,
  createAmenity,
  updateAmenity,
  deleteAmenity
} from "./amenity.service.js";
import { amenitySchema, updateAmenitySchema } from "./amenity.validation.js";

export const index = async (req, res, next) => {
  try {
    const amenities = await getAllAmenities();
    return successResponse(res, "Amenities fetched successfully.", amenities);
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const amenity = await getAmenityById(req.params.id);
    return successResponse(res, "Amenity fetched successfully.", amenity);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = amenitySchema.parse(req.body);
    const amenity = await createAmenity(data);
    return successResponse(res, "Amenity created successfully.", amenity, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateAmenitySchema.parse(req.body);
    const amenity = await updateAmenity(req.params.id, data);
    return successResponse(res, "Amenity updated successfully.", amenity);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteAmenity(req.params.id);
    return successResponse(res, "Amenity deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};