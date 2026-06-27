import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    enum: ['Software', 'Hardware', 'Marketing', 'Salary', 'Office', 'Travel', 'Food', 'Other'],
    default: 'Other',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Credit Card', 'UPI', 'Other'],
    default: 'Other',
  },
  notes: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
