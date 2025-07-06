const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { JWT_SECRET } = require("../utils/config");

const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CONFLICT_STATUS_CODE,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Internal server error",
      });
    });
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "User not found" });
    }
    res.send(user);
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
    res.status(201).send({
      message: "User created successfully",
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
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.send({ token });
  } catch (err) {
    console.error(err);
    return res.status(BAD_REQUEST_STATUS_CODE).send({
      message: "Invalid email or password",
    });
  }
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid user ID format" });
      }
      if (err.message === "NotFound") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "User not found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: err.message });
    });
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
    res.send(user);
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
  getUsers,
  createUser,
  login,
  getUser,
  getCurrentUser,
  updateProfile,
};
