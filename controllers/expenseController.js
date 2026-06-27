import Expense from '../models/Expense.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('project', 'title clientName')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
      .populate('project', 'title clientName');
    if (expense) res.json(expense);
    else res.status(404).json({ message: 'Expense not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    const populated = await expense.populate('project', 'title clientName');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('project', 'title clientName');
    if (expense) res.json(expense);
    else res.status(404).json({ message: 'Expense not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (expense) res.json({ message: 'Expense removed' });
    else res.status(404).json({ message: 'Expense not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
