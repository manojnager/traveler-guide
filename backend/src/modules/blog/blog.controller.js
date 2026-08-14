import { successResponse } from "../../responses/apiResponse.js";
import {
  getAdminBlogPosts,
  getAdminBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getPublicBlogPosts,
  getPublicBlogCategories,
  getPublicBlogPostBySlug
} from "./blog.service.js";

import { createBlogPostSchema, updateBlogPostSchema } from "./blog.validation.js";

export const adminIndex = async (req, res, next) => {
  try {
    const posts = await getAdminBlogPosts(req.query);
    return successResponse(res, "Posts fetched successfully.", posts);
  } catch (error) {
    next(error);
  }
};

export const adminShow = async (req, res, next) => {
  try {
    const post = await getAdminBlogPostById(req.params.id);
    return successResponse(res, "Post fetched successfully.", post);
  } catch (error) {
    next(error);
  }
};

export const store = async (req, res, next) => {
  try {
    const data = createBlogPostSchema.parse(req.body);
    const post = await createBlogPost(req.user.id, data);
    return successResponse(res, "Post created successfully.", post, 201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const data = updateBlogPostSchema.parse(req.body);
    const post = await updateBlogPost(req.params.id, data);
    return successResponse(res, "Post updated successfully.", post);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteBlogPost(req.params.id);
    return successResponse(res, "Post deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};

export const publicIndex = async (req, res, next) => {
  try {
    const posts = await getPublicBlogPosts(req.query);
    return successResponse(res, "Posts fetched successfully.", posts);
  } catch (error) {
    next(error);
  }
};

export const publicCategories = async (req, res, next) => {
  try {
    const categories = await getPublicBlogCategories();
    return successResponse(res, "Categories fetched successfully.", categories);
  } catch (error) {
    next(error);
  }
};

export const publicShow = async (req, res, next) => {
  try {
    const post = await getPublicBlogPostBySlug(req.params.slug);
    return successResponse(res, "Post fetched successfully.", post);
  } catch (error) {
    next(error);
  }
};

export const publicLatest = async (req, res, next) => {
  try {
    const posts = await getLatestBlogPosts(req.query.limit);
    return successResponse(res, "Latest posts fetched successfully.", posts);
  } catch (error) {
    next(error);
  }
};