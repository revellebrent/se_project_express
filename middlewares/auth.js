const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ message: "Authorization header is required" });
  }

  const token = authorization.replace("Bearer ", "");
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;

    return next();
  } catch (error) {
    return res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = auth;
