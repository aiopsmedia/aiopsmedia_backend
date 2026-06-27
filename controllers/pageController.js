import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import Contact from '../models/Contact.js';
import LetterHead from '../models/LetterHead.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });
    const totalMessages = await Contact.countDocuments();
    const unreadMessages = await Contact.countDocuments({ isRead: false });

    const projects = await Project.find();
    const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const paidRevenue = projects
      .filter(p => p.paymentStatus === 'Paid')
      .reduce((sum, p) => sum + (p.budget || 0), 0);
    const partialRevenue = projects
      .filter(p => p.paymentStatus === 'Partial')
      .reduce((sum, p) => sum + (p.budget || 0), 0);

    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
    const recentProjects = await Project.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalLeads,
      newLeads,
      totalProjects,
      activeProjects,
      totalMessages,
      unreadMessages,
      totalRevenue,
      paidRevenue,
      partialRevenue,
      recentLeads,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
