import prisma from "../lib/prisma.js";

function calculateReadTime(content) {
  const text = content
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = text.length ? text.split(" ").length : 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const category = req.query.category;

    const where = {
      status: "PUBLISHED",
      ...(category && category !== "All" ? { category } : {})
    };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          coverImage: true,
          category: true,
          publishedAt: true
        }
      }),
      prisma.blogPost.count({ where })
    ]);

    const items = posts.map((post) => ({
      ...post,
      readTime: calculateReadTime(post.content),
      content: undefined
    }));

    res.json({
      success: true,
      data: {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      select: { category: true },
      distinct: ["category"]
    });

    res.json({ success: true, data: rows.map((r) => r.category) });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

export const getPostBySlug = async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug }
    });

    if (!post || post.status !== "PUBLISHED") {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    res.json({
      success: true,
      data: { ...post, readTime: calculateReadTime(post.content) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch post" });
  }
};
