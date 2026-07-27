import { successResponse } from "../../responses/apiResponse.js";
import {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  deleteCountry
} from "./country.service.js";
import { countrySchema, updateCountrySchema } from "./country.validation.js";

export const index = async (req, res, next) => {
  try {
    const countries = await getAllCountries();
    return successResponse(res, "Countries fetched successfully.", countries);
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const country = await getCountryById(req.params.id);
    return successResponse(res, "Country fetched successfully.", country);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = countrySchema.parse(req.body);
    const country = await createCountry(data);
    return successResponse(res, "Country created successfully.", country, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateCountrySchema.parse(req.body);
    const country = await updateCountry(req.params.id, data);
    return successResponse(res, "Country updated successfully.", country);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteCountry(req.params.id);
    return successResponse(res, "Country deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};