# Basic Calculator 

A simple RESTful calculator application built with **Node.js**, **Express**, and **MongoDB** that performs basic arithmetic operations and stores user calculation history.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Running Tests](#running-tests)
- [Folder Structure](#folder-structure)
- [License](#license)

## Overview

This calculator application performs arithmetic operations like addition, subtraction, multiplication, and division. It also provides functionalities to store, view, and manage calculation history for different users.

## Features

- **Basic Arithmetic Operations**: Addition, Subtraction, Multiplication, Division.
- **History Management**: Retrieve, delete individual records, and reset all history.
- **MongoDB Integration**: Uses MongoDB to store and manage user-specific history.
- **Swagger Documentation**: Provides API documentation via Swagger.
  
## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for cloud-based databases)

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/calculator-app.git
    cd calculator-app
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Create a `.env` file in the root directory and set the following environment variables:

```bash
MONGODB_URL=<Your MongoDB connection URL>
PORT=3000
```

## Usage

# Running the Application

- To start the server in development mode with nodemon:

```bash
npm run dev
```
- To start the server in production mode:

```bash
npm start
```

- The server will be running on http://localhost:3000.

- **API Documentation**: API documentation is available at http://localhost:3000/api-docs via Swagger UI.

# API Endpoints

- Base URL
```bash
http://localhost:3000
```

- Routes

| Method | Endpoint           | Description                                    |
|--------|--------------------|------------------------------------------------|
| POST   | `/operations`        | Perform an arithmetic operation.              |
| GET    | `/operations`          | Retrieve a user's calculation history.        |
| DELETE | `/operations/:id`      | Delete a specific calculation from history.   |
| DELETE | `/operations/reset`    | Reset the user's entire calculation history.  |

# Example Request

- Perform a Calculation

- **POST** `/operations`

- Request Body:

```json
{
  "email": "user@example.com",
  "operands": [5, 10],
  "operator": "+"
}
```
- Response:

```json
{
  "result": 15
}
```

# Running Tests

- To run tests:

```bash
npm test
```

- This will execute all the Jest tests defined in the tests folder.

# Folder Structure

```bash
Copy code
calculator-app/
│
├── src/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── services/
|   └── validators/
│   └── index.js
├── tests/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── services/
|   └── validators/
├── .env
├── package.json
└── README.md
```

# Key Directories

- `src/controllers/`: Contains route handler functions.
- `src/db/`: Database connection setup (MongoDB).
- `src/models/`: Mongoose models for operations.
- `src/routes/`: API route definitions.
- `src/services/`: Business logic (e.g., calculations, history management).
- `tests/`: Contains unit and integration tests.

# License

This project is licensed under the MIT License.
