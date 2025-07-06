const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { NOT_FOUND_STATUS_CODE } = require("./utils/errors");
const clothingItemsRouter = require("./routes/clothingItems");

const app = express();
const { PORT = 3001 } = process.env;

app.use(cors());
app.use(express.json());

app.use("/items", clothingItemsRouter);

app.use("/", mainRouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
    }
  })
  .catch(console.error);

app.use((req, res) => {
  res.status(NOT_FOUND_STATUS_CODE).send({ message: "Router Not Found" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is listening on port ${PORT}`);
  }
});
