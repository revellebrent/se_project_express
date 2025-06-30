# WTWR (What to Wear?): Back End
This is the back-end server for the WTWR (What to Wear?) project. It handles all API requests related to clothing items and user accounts, including CRUD operations, likes, and authorization (currently mocked for developing). Built with **Express** and **MongoDB**. 

## Features

- Full CRUD for clothing Items
- Like/unlike system with `$addToSet` and `$pull`
- User validation (mocked with middleware for current testing)
- Centralized error handling with consistent status codes
- Clean RESTful routing using Express Router
- Environment-aware logging (production vs. test)
- Linting with ESLint

### Technologies

- Node.js
- Express
- MongoDB + Mongoose
- Postman (manual testing)
- ESLint

