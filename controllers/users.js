const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/bad-request-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unauthorized-err");

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    return next(err);
  }
};

// POST /users
const createUser = async (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password || !name) {
    return next(new BadRequestError("Email, password, and name are required"));
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("Email already exists"));
    }

    const user = new User({ name, avatar, email, password });
    await user.save();
    return res.status(201).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (err) {
    if (
      err.message === "Incorrect email or password" ||
      err.message === "Invalid email or password"
    ) {
      return next(new UnauthorizedError("Invalid email or password"));
    }
    return next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return next(new NotFoundError("User not found"));
    }
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};

