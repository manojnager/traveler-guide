import { successResponse } from "../../responses/apiResponse.js";

import {
  createDestination,
  updateDestination,
  deleteDestination,
  getDestinations,
  getDestinationBySlug,
  getAdminDestinations,
  getAdminDestinationById
} from "./destination.service.js";

import {
  createDestinationSchema,
  updateDestinationSchema
} from "./destination.validation.js";

export const store = async (req, res, next) => {
  try {
    const data = createDestinationSchema.parse(req.body);

    const destination = await createDestination(data);

    return successResponse(
      res,
      "Destination created successfully.",
      destination,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateDestinationSchema.parse(req.body);

    const destination = await updateDestination(
      req.params.id,
      data
    );

    return successResponse(
      res,
      "Destination updated successfully.",
      destination
    );
  } catch (error) {
    next(error);
  }
};

export const destroy = async (
  req,
  res,
  next
) => {
  try {
    await deleteDestination(
      req.params.id
    );

    return successResponse(
      res,
      "Destination deleted successfully."
    );
  } catch (error) {
    next(error);
  }
};

export const adminIndex = async (
  req,
  res,
  next
) => {
  try {
    const destinations =
      await getAdminDestinations(
        req.query
      );

    return successResponse(
      res,
      "Destinations fetched successfully.",
      destinations
    );
  } catch (error) {
    next(error);
  }
};

export const adminShow = async (
  req,
  res,
  next
) => {
  try {
    const destination =
      await getAdminDestinationById(
        req.params.id
      );

    return successResponse(
      res,
      "Destination fetched successfully.",
      destination
    );
  } catch (error) {
    next(error);
  }
};

export const index = async (req, res, next) => {
  try {
    const destinations = await getDestinations();

    return successResponse(
      res,
      "Destinations fetched successfully.",
      destinations
    );
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const destination = await getDestinationBySlug(
      req.params.slug
    );

    return successResponse(
      res,
      "Destination fetched successfully.",
      destination
    );
  } catch (error) {
    next(error);
  }
};