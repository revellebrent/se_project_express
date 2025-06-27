const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());

// Middleware to mock user authentication for testing purposes
// This is just for testing purposes to simulate a logged-in user
app.use((req, res, next) => {
  req.user = {
    _id: "685d6bb71b28d36aff259331", // Mock user ID for testing
  };
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      console.log("Connected to MongoDB");
    }
  })
  .catch(console.error);

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(404).send({ message: "Router Not Found" });
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is listening on port ${PORT}`);
  }
});
