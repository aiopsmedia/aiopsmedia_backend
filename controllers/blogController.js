import Blog from '../models/Blog.js';
import { slugify } from '../utils/slugify.js';

export const getPublishedBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const tag = req.query.tag;

    const query = { published: true };
    if (tag) query.tags = tag;

    const [blogs, total] = await Promise.all([
      Blog.find(query).sort({ publishedAt: -1 }).skip(skip).limit(limit),
      Blog.countDocuments(query),
    ]);

    res.json({
      blogs,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublishedBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, published: true });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createBlog = async (req, res) => {
  try {
    let slug = req.body.slug || slugify(req.body.title);
    const existing = await Blog.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    if (req.body.title && !req.body.slug) {
      req.body.slug = slugify(req.body.title);
      const existing = await Blog.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
      if (existing) {
        req.body.slug = `${req.body.slug}-${Date.now()}`;
      }
    }
    if (req.body.published && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (blog) {
      res.json({ message: 'Blog removed' });
    } else {
      res.status(404).json({ message: 'Blog not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTags = async (req, res) => {
  try {
    const tags = await Blog.distinct('tags', { published: true });
    res.json(tags.sort());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
