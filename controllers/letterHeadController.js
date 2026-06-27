import LetterHead from '../models/LetterHead.js';

const generateNumber = async (type) => {
  const prefix = {
    Quotation: 'QTN',
    'Offer Letter': 'OFL',
    Payslip: 'PSL',
    Bill: 'BIL',
    Invoice: 'INV',
  };
  const count = await LetterHead.countDocuments({ type });
  return `${prefix[type]}-${String(count + 1).padStart(4, '0')}`;
};

export const getLetterHeads = async (req, res) => {
  try {
    const docs = await LetterHead.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLetterHeadById = async (req, res) => {
  try {
    const doc = await LetterHead.findById(req.params.id);
    if (doc) res.json(doc);
    else res.status(404).json({ message: 'Document not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createLetterHead = async (req, res) => {
  try {
    const number = await generateNumber(req.body.type);
    const doc = await LetterHead.create({ ...req.body, number });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLetterHead = async (req, res) => {
  try {
    const doc = await LetterHead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (doc) res.json(doc);
    else res.status(404).json({ message: 'Document not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteLetterHead = async (req, res) => {
  try {
    const doc = await LetterHead.findByIdAndDelete(req.params.id);
    if (doc) res.json({ message: 'Document removed' });
    else res.status(404).json({ message: 'Document not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
