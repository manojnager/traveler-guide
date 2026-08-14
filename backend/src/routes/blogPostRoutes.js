import express from "express";
import { getPosts, getCategories, getPostBySlug } from "../controllers/blogPostController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/:slug", getPostBySlug);
router.get("/", getPosts);

export default router;
