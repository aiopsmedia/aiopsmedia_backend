import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Admin from './models/Admin.js';
import authRoutes from './routes/auth.js';
import leadRoutes from './routes/leads.js';
import projectRoutes from './routes/projects.js';
import letterHeadRoutes from './routes/letterHead.js';
import contactRoutes from './routes/contact.js';
import expenseRoutes from './routes/expenses.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/letterhead', letterHeadRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get(['/sitemap.xml', '/api/sitemap'], (req, res) => {
  const baseUrl = 'https://aiopsmedia.com';
  const pages = [
    { loc: '/', priority: 1.0, changefreq: 'weekly' },
    { loc: '/about', priority: 0.8, changefreq: 'monthly' },
    { loc: '/services', priority: 0.9, changefreq: 'monthly' },
    { loc: '/pricing', priority: 0.8, changefreq: 'monthly' },
    { loc: '/contact', priority: 0.7, changefreq: 'monthly' },
    { loc: '/privacy-policy', priority: 0.5, changefreq: 'yearly' },
    { loc: '/refund-policy', priority: 0.5, changefreq: 'yearly' },
    { loc: '/terms-conditions', priority: 0.5, changefreq: 'yearly' },
    { loc: '/disclaimer', priority: 0.5, changefreq: 'yearly' },
    { loc: '/cancellation-policy', priority: 0.5, changefreq: 'yearly' },
    { loc: '/data-security-policy', priority: 0.5, changefreq: 'yearly' },
    { loc: '/cookie-policy', priority: 0.5, changefreq: 'yearly' },
    { loc: '/admin', priority: 0.3, changefreq: 'daily' },
    { loc: '/admin/leads', priority: 0.3, changefreq: 'daily' },
    { loc: '/admin/projects', priority: 0.3, changefreq: 'daily' },
    { loc: '/admin/revenue', priority: 0.3, changefreq: 'daily' },
    { loc: '/admin/expenses', priority: 0.3, changefreq: 'daily' },
  ];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(p => `<url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>2026-01-01</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n  ')}
</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

const seedAdmin = async () => {
  try {
    const existing = await Admin.findOne({ email: 'ujjwalkarmakar@aiopsmedia.com' });
    if (!existing) {
      await Admin.create({
        email: 'ujjwalkarmakar@aiopsmedia.com',
        password: 'Admin@321',
        name: 'Ujjwal Karmakar',
      });
      console.log('Admin seeded: ujjwalkarmakar@aiopsmedia.com');
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  }
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await seedAdmin();
});
