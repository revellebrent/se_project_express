const express = require("express");

const router = express.Router();
const { createUser, login } = require("../controllers/users");

const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

module.exports = router;
