const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');


const app = express();
const { PORT = 3001 } = process.env;

app.use(express.json());


// Middleware to mock user authentication for testing purposes
// In a real application, you would replace this with actual authentication middleware
// This is just for testing purposes to simulate a logged-in user
app.use((req, res, next) => {
  req.user = {
    _id: '685d6bb71b28d36aff259330', // Mock user ID for testing
  };
  next();
});


mongoose
.connect('mongodb://127.0.0.1:27017/wtwr_db')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch(console.error);

app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
