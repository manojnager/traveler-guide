const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.get("/", postController.getPosts);
router.get("/featured", postController.getFeaturedPost);
router.get("/:slug", postController.getPostBySlug);

module.exports = router;