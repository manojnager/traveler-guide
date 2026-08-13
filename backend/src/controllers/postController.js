const prisma = require("../config/prisma");

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const category = req.query.category;

    const where = {
      isPublished: true,
      ...(category && category !== "All" ? { category } : {})
    };

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.post.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        items: posts,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

exports.getFeaturedPost = async (req, res) => {
  try {
    const post = await prisma.post.findFirst({
      where: { isPublished: true, isFeatured: true },
      orderBy: { publishedAt: "desc" }
    });

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch featured post" });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug }
    });

    if (!post || !post.isPublished) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch post" });
  }
};