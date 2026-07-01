import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  excerpt: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  author: {
    type: String,
    default: 'AiOpsMedia',
  },
  tags: [{
    type: String,
    trim: true,
  }],
  published: {
    type: Boolean,
    default: false,
  },
  publishedAt: {
    type: Date,
  },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.published && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

export default mongoose.model('Blog', blogSchema);
