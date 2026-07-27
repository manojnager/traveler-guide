import { successResponse } from "../../responses/apiResponse.js";
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  deleteCity
} from "./city.service.js";
import { citySchema, updateCitySchema } from "./city.validation.js";

export const index = async (req, res, next) => {
  try {
    const cities = await getAllCities(req.query);
    return successResponse(res, "Cities fetched successfully.", cities);
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const city = await getCityById(req.params.id);
    return successResponse(res, "City fetched successfully.", city);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = citySchema.parse(req.body);
    const city = await createCity(data);
    return successResponse(res, "City created successfully.", city, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateCitySchema.parse(req.body);
    const city = await updateCity(req.params.id, data);
    return successResponse(res, "City updated successfully.", city);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteCity(req.params.id);
    return successResponse(res, "City deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};