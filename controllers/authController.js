import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aiopsmedia_jwt_secret_2024', {
    expiresIn: '30d',
  });
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const seedAdmin = async (req, res) => {
  try {
    const existing = await Admin.findOne({ email: 'ujjwalkarmakar@aiopsmedia.com' });
    if (!existing) {
      await Admin.create({
        email: 'ujjwalkarmakar@aiopsmedia.com',
        password: 'Admin@321',
        name: 'Ujjwal Karmakar',
      });
      res.json({ message: 'Admin created successfully' });
    } else {
      res.json({ message: 'Admin already exists' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
