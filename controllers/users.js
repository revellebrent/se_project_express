const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
} = require("../utils/errors");

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "User not found" });
    }
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error(err);
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
      message: "Internal server error",
    });
  }
};

// POST /users
const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password || !name) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email, password, and name are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(CONFLICT_STATUS_CODE)
        .send({ message: "Email already exists" });
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
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid user data" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: "Internal server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required" });
  }
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.send({ token });
  } catch (err) {
    console.error(err);
    if (err.message === "Incorrect email or password") {
      return res.status(UNAUTHORIZED_STATUS_CODE).send({
        message: "Invalid email or password",
      });
    }
    return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: "Internal server error" });
  }
};

const updateProfile = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!user) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "User not found" });
    }
    return res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid user data" });
    }
    return res
      .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
      .send({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
