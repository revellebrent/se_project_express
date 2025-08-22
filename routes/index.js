const express = require("express");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");
const { createUser, login } = require("../controllers/users");
const {
  validateUserBody,
  validateLogin,
} = require("../middlewares/validation");

const router = express.Router();

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateLogin, login);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

module.exports = router;
