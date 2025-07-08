const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_STATUS_CODE } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED_STATUS_CODE).send({ message: "Authorization header must be in the format: Bearer <token>" });
  }

  const token = authorization.replace("Bearer ", "").trim();
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(UNAUTHORIZED_STATUS_CODE).send({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
