import Lead from '../models/Lead.js';
import Project from '../models/Project.js';
import Contact from '../models/Contact.js';
import LetterHead from '../models/LetterHead.js';
import Expense from '../models/Expense.js';

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

    const totalExpenses = await Expense.countDocuments();
    const totalExpenseAmount = await Expense.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const expensesByCategory = await Expense.aggregate([
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
    ]);
    const recentExpenses = await Expense.find()
      .populate('project', 'title')
      .sort({ date: -1 })
      .limit(5);

    const netRevenue = (totalRevenue || 0) - (totalExpenseAmount[0]?.total || 0);

    const uniqueClients = await Project.distinct('clientEmail');
    const totalCustomers = uniqueClients.length;
    const totalEnquiries = totalMessages;

    const salesAgg = await LetterHead.aggregate([
      { $match: { type: { $in: ['Invoice', 'Bill'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalSales = salesAgg[0]?.total || 0;

    const pendingProjects = await Project.countDocuments({ status: { $in: ['Pending', 'In Progress'] } });

    const totalDocs = await LetterHead.countDocuments();

    res.json({
      totalLeads,
      newLeads,
      totalProjects,
      activeProjects,
      pendingProjects,
      totalMessages,
      unreadMessages,
      totalRevenue,
      paidRevenue,
      partialRevenue,
      totalExpenses,
      totalExpenseAmount: totalExpenseAmount[0]?.total || 0,
      netRevenue,
      expensesByCategory,
      recentExpenses,
      recentLeads,
      recentProjects,
      totalCustomers,
      totalEnquiries,
      totalSales,
      totalDocs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
