import mongoose from 'mongoose';

const letterHeadSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Quotation', 'Offer Letter', 'Payslip', 'Bill', 'Invoice'],
    required: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  clientAddress: {
    type: String,
    default: '',
  },
  clientEmail: {
    type: String,
    default: '',
  },
  clientPhone: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  validTill: {
    type: Date,
  },
  items: [{
    description: String,
    quantity: Number,
    rate: Number,
    amount: Number,
  }],
  subtotal: {
    type: Number,
    default: 0,
  },
  tax: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    default: 0,
  },
  notes: {
    type: String,
    default: '',
  },
  terms: {
    type: String,
    default: 'Payment due within 15 days. Thank you for your business.',
  },
}, { timestamps: true });

export default mongoose.model('LetterHead', letterHeadSchema);
