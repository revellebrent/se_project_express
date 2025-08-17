const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const NotFoundError = require("./errors/not-found-err");
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
    }
  })
  .catch(console.error);

app.use((req, res, next) => {
  next(new NotFoundError("Router Not Found"));
});

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is running on port ${PORT}`);
  }
});
