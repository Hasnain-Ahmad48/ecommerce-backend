import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { cloudinary } from '../utils/cloudinaryConfig.js';

// helper to sign token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
};

// register (multipart: allow profile picture)
const register = async (req, res) => {
  const { name, email, password } = req.body;

  // simple validation
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // handle profile picture if uploaded (multer-storage-cloudinary already uploaded file)
  let profilePic = {};
  if (req.file && req.file.path) {
    profilePic = {
      url: req.file.path,
      public_id: req.file.filename || req.file.filename // multer-storage-cloudinary sets these differently; test in your env
    };
  }

  const user = await User.create({
    name, email, password,
    profilePic
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

const getProfile = async (req, res) => {
  // protect middleware sets req.user
  const user = req.user;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      isAdmin: user.isAdmin
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
};

export { register, login, getProfile };
