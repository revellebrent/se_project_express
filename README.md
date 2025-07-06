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
- User Ownership: Only the owner of a clothing item can delete it.

## Authentication

- POST /signup to create a new user.
- POST /signin to log in a user and get a JWT token.
- GET /users/me to return the logged-in user's profile.
- PATCH /users/me to update the logged-in user's profile (name, avatar).

## Authorization

- JWT authentication for protected routes.
- Only authenticated users can create, delete, and like/unlike clothing items.

## Error Handling

- Centralized error handling with consistent status codes.

## Logging

- Environment-aware logging for different environments (production and test).

## Clean RESTful Routing

- Routes for users and clothing items are handled in their respective controllers and organized with Express Router.

## Linting

- ESLint configured to extend airbnb-base with an exception for \_id.

### Technologies

- Node.js
- Express
- MongoDB + Mongoose
- Postman (manual testing)
- ESLint
- JWT (JSON WEB TOKEN) (for authentication)
- Validator Package (for input validation)
- Bcryptjs (for password hashing)
