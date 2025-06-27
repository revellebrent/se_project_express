const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Internal server error",
      });
    });
};


// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid user data" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: "Internal server error" });
    });
};

// GET /users/:userId
const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => new Error("NotFound"))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid user ID format" });
      }
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({ message: err.message });
    });

  };


module.exports = { getUsers, createUser, getUser };
