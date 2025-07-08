const express = require("express");
const router = express.Router();
const userRouter = require("./users");
const clothingItemsRouter = require("./clothingItems");

const { createUser, login } = require("../controllers/users");



router.post("/signup", createUser);
router.post("/signin", login);

router.use("/users", userRouter);
router.use("/items", clothingItemsRouter);

module.exports = router;
