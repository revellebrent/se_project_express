const router = require("express").Router();
const { getUsers, getUser, getCurrentUser, updateProfile } = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.get("/:userId", getUser);

router.patch("/me", auth, updateProfile);

module.exports = router;
