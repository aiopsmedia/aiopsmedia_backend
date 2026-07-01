import express from 'express';
import {
  getPublishedBlogs,
  getPublishedBlogBySlug,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllTags,
} from '../controllers/blogController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/tags', getAllTags);
router.get('/slug/:slug', getPublishedBlogBySlug);
router.get('/', getPublishedBlogs);

router.route('/:id')
  .get(protect, getBlogById)
  .put(protect, updateBlog)
  .delete(protect, deleteBlog);

router.post('/', protect, createBlog);

export default router;
