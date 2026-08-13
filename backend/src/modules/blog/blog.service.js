import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

const sanitizeContent = (html) => {
  if (!html) return html;
  return html.replace(/&nbsp;/g, " ").replace(/\u00A0/g, " ");
};

const postSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  category: true,
  status: true,
  publishedAt: true,
  createdAt: true,
  author: {
    select: { id: true, firstName: true, lastName: true }
  }
};

// ---------- Admin ----------

export const getAdminBlogPosts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.category) {
    where.category = query.category;
  }

  if (query.search) {
    where.OR = [
      { title: { contains: query.search } },
      { excerpt: { contains: query.search } }
    ];
  }

  const [items, totalItems] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      select: postSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.blogPost.count({ where })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

export const getAdminBlogPostById = async (id) => {
  const post = await prisma.blogPost.findUnique({
    where: { id: Number(id) },
    select: postSelect
  });

  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  return post;
};

export const createBlogPost = async (authorId, data) => {
  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } });

  if (existing) {
    throw new AppError("A post with this slug already exists.", 409);
  }

  return prisma.blogPost.create({
    data: {
      ...data,
      content: sanitizeContent(data.content),
      authorId,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null
    },
    select: postSelect
  });
};

export const updateBlogPost = async (id, data) => {
  const existing = await prisma.blogPost.findUnique({ where: { id: Number(id) } });

  if (!existing) {
    throw new AppError("Post not found.", 404);
  }

  if (data.slug && data.slug !== existing.slug) {
    const slugTaken = await prisma.blogPost.findFirst({
      where: { slug: data.slug, id: { not: Number(id) } }
    });

    if (slugTaken) {
      throw new AppError("A post with this slug already exists.", 409);
    }
  }

  const wasPublished = existing.status === "PUBLISHED";
  const willBePublished = data.status ? data.status === "PUBLISHED" : wasPublished;

  return prisma.blogPost.update({
    where: { id: Number(id) },
    data: {
      ...data,
      ...(data.content && { content: sanitizeContent(data.content) }),
      ...(willBePublished && !wasPublished && { publishedAt: new Date() })
    },
    select: postSelect
  });
};

export const deleteBlogPost = async (id) => {
  const existing = await prisma.blogPost.findUnique({ where: { id: Number(id) } });

  if (!existing) {
    throw new AppError("Post not found.", 404);
  }

  return prisma.blogPost.delete({ where: { id: Number(id) } });
};

// ---------- Public ----------

const withReadTime = (post) => {
  const wordCount = post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return { ...post, readTime: `${minutes} min read` };
};

export const getPublicBlogPosts = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 9;
  const skip = (page - 1) * limit;

  const where = { status: "PUBLISHED" };

  if (query.category && query.category !== "All") {
    where.category = query.category;
  }

  const [items, totalItems] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      select: postSelect,
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit
    }),
    prisma.blogPost.count({ where })
  ]);

  return {
    items: items.map(withReadTime),
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit)
  };
};

export const getPublicBlogCategories = async () => {
  const categories = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    select: { category: true },
    distinct: ["category"]
  });

  return categories.map((c) => c.category).sort();
};

export const getPublicBlogPostBySlug = async (slug) => {
  const post = await prisma.blogPost.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: postSelect
  });

  if (!post) {
    throw new AppError("Post not found.", 404);
  }

  return withReadTime(post);
};