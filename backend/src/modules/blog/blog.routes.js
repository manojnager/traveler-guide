import { Router } from "express";
import { publicIndex, publicCategories, publicShow } from "./blog.controller.js";

const router = Router();

router.get("/", publicIndex);
router.get("/categories", publicCategories);
router.get("/:slug", publicShow);

export default router;