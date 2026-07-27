import { successResponse } from "../../responses/apiResponse.js";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "./category.service.js";
import { categorySchema, updateCategorySchema } from "./category.validation.js";

export const index = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    return successResponse(res, "Categories fetched successfully.", categories);
  } catch (error) {
    next(error);
  }
};

export const show = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    return successResponse(res, "Category fetched successfully.", category);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await createCategory(data);
    return successResponse(res, "Category created successfully.", category, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateCategorySchema.parse(req.body);
    const category = await updateCategory(req.params.id, data);
    return successResponse(res, "Category updated successfully.", category);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteCategory(req.params.id);
    return successResponse(res, "Category deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};