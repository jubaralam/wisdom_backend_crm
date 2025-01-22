# wisdom_backend_crm

# User Router Documentation

This documentation provides an overview of the `userRouter` routes for user management, including registration, login, updating, and deleting users. The router is built using Express.js and integrates with MongoDB for data persistence.

---

## Prerequisites

- **Modules Used:**
  - `express`: Framework for building the API.
  - `bcrypt`: Used for hashing passwords.
  - `jsonwebtoken`: Used for generating authentication tokens.
  - `UserModel`: MongoDB model for user management.
- **Environment Variables:**
  - `process.env.secretKey`: Secret key for JWT token generation.
  - `process.env.saltRound` (optional): Salt rounds for bcrypt (default: `10`).

---

## Routes

### 1. **User Registration**

**Endpoint:** `POST /register`

Registers a new user. All fields are required.

#### Request Body:

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone_no": "1234567890",
  "company": "ExampleCorp"
}
```

#### Response:

- **201:** User registered successfully.
- **400:** Missing required fields.
- **409:** User already registered.
- **500:** Internal server error.

---

### 2. **User Login**

**Endpoint:** `POST /login`

Authenticates a user and returns a JWT token.

#### Request Body:

```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

#### Response:

- **200:** Login successful, returns a JWT token.
- **401:** Invalid credentials.
- **404:** User not found.
- **500:** Internal server error.

---

### 3. **Update User**

**Endpoint:** `PUT /update/:id`

Updates user details. Password, if provided, is hashed before saving.

#### Parameters:

- `id`: User ID to update.

#### Request Body (optional fields):

```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone_no": "9876543210",
  "company": "UpdatedCorp",
  "password": "newpassword"
}
```

#### Response:

- **200:** User updated successfully.
- **404:** User not found.
- **500:** Internal server error.

---

### 4. **Delete User**

**Endpoint:** `DELETE /delete/:id`

Deletes a user by their ID.

#### Parameters:

- `id`: User ID to delete.

#### Response:

- **200:** User deleted successfully.
- **404:** User not found.
- **500:** Internal server error.

---

## Error Handling

All routes handle errors and return appropriate HTTP status codes with error messages.

---

## Notes

- **Password Hashing:**

  - Bcrypt is used for hashing passwords before saving them to the database.
  - Default salt rounds are set to `10` if `process.env.saltRound` is not defined.

- **JWT Tokens:**
  - Generated tokens expire in 1 hour.
  - Tokens are signed using the `process.env.secretKey`.

---

## Sample Usage

**Register a User:**

```bash
curl -X POST http://localhost:3000/register \
-H "Content-Type: application/json" \
-d '{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "phone_no": "1234567890",
  "company": "ExampleCorp"
}'
```

**Login a User:**

```bash
curl -X POST http://localhost:3000/login \
-H "Content-Type: application/json" \
-d '{
  "email": "john.doe@example.com",
  "password": "password123"
}'
```

**Update a User:**

```bash
curl -X PUT http://localhost:3000/update/USER_ID \
-H "Content-Type: application/json" \
-d '{
  "name": "Updated Name",
  "password": "newpassword"
}'
```

**Delete a User:**

````bash
curl -X DELETE http://localhost:3000/delete/USER_ID



---
___



# User Router Documentation

## Overview
This module defines routes for user operations such as registration, login, updating user details, and deleting a user. The routes are built using `Express.js` and interact with a `MongoDB` database using Mongoose.

## Dependencies

```javascript
const express = require("express");
const customerRouter = express.Router();

const CustomerModel = require("../models/customer.model");
````

## Routes

### Customer Registration

## base url domain-name/api/customer

#### Endpoint

`  POST domain-name/api/customer/register`

#### Description

Registers a new customer.

#### Request Body

- `name` (string, required): Customer's name.
- `email` (string, required): Customer's email.
- `phone_no` (string, required): Customer's phone number.
- `company` (string, required): Customer's company.

#### Response

- `201 Created`: Customer registered successfully.
- `400 Bad Request`: Missing required fields.
- `409 Conflict`: Email is already registered.
- `500 Internal Server Error`: An error occurred.

### Get Customer by ID

#### Endpoint

`GET /:id`

#### Description

Fetches a specific customer's details by ID.

#### Request Parameters

- `id` (string): Customer ID.

#### Response

- `200 OK`: Returns the customer details.
- `403 Forbidden`: User does not own the requested customer.
- `404 Not Found`: Customer does not exist.
- `500 Internal Server Error`: An error occurred.

### Get All Customers

#### Endpoint

`GET /`

#### Description

Fetches all customers created by the authenticated user.

#### Response

- `200 OK`: Returns a list of customers.
- `404 Not Found`: No customers found.
- `500 Internal Server Error`: An error occurred.

### Update Customer

#### Endpoint

`PUT /update/:id`

#### Description

Updates an existing customer's details.

#### Request Parameters

- `id` (string): Customer ID.

#### Request Body

- `name` (string, optional): Updated name.
- `email` (string, optional): Updated email.
- `phone_no` (string, optional): Updated phone number.
- `company` (string, optional): Updated company name.

#### Response

- `200 OK`: Customer updated successfully.
- `403 Forbidden`: User does not own the customer.
- `404 Not Found`: Customer does not exist.
- `500 Internal Server Error`: An error occurred.

### Delete Customer

#### Endpoint

`DELETE /delete/:id`

#### Description

Deletes a specific customer.

#### Request Parameters

- `id` (string): Customer ID.

#### Response

- `200 OK`: Customer deleted successfully.
- `403 Forbidden`: User does not own the customer.
- `404 Not Found`: Customer does not exist.
- `500 Internal Server Error`: An error occurred.

## Error Handling

All routes handle errors gracefully by returning appropriate HTTP status codes and error messages.

## Authorization

Each route checks if the authenticated user owns the customer resource before allowing updates or deletions.

## Example Usage

### Register a Customer

```javascript
POST /register
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "phone_no": "1234567890",
  "company": "Acme Corp"
}
```

### Get All Customers

```javascript
GET /
```

### Update a Customer

```javascript
PUT /update/12345
{
  "name": "Jane Doe",
  "email": "janedoe@example.com"
}
```

### Delete a Customer

```javascript
DELETE /delete/12345
```
