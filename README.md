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

# Customer Search and Filter API

## **Endpoint**

`GET /search`

---

## **Description**

This endpoint allows users to search and filter customers based on multiple parameters like `name`, `email`, `phone`, and `company`. It supports pagination to retrieve results in smaller chunks for better performance.

---

## **Query Parameters**

| Parameter | Type   | Required | Description                                              |
| --------- | ------ | -------- | -------------------------------------------------------- |
| `name`    | String | Optional | Search for customers by name (case-insensitive).         |
| `email`   | String | Optional | Search for customers by email (case-insensitive).        |
| `phone`   | String | Optional | Search for customers by phone number (case-insensitive). |
| `company` | String | Optional | Search for customers by company name (case-insensitive). |
| `page`    | Number | Optional | Page number for pagination. Defaults to `1`.             |
| `limit`   | Number | Optional | Number of customers per page. Defaults to `10`.          |

---

## **Responses**

### **Success Response**

- **Status Code**: `200 OK`
- **Body**:
  ```json
  {
    "data": [
      {
        "_id": "customer_id_1",
        "name": "John Doe",
        "email": "johndoe@example.com",
        "phone": "1234567890",
        "company": "Example Inc"
      },
      {
        "_id": "customer_id_2",
        "name": "Jane Smith",
        "email": "janesmith@example.com",
        "phone": "0987654321",
        "company": "Another Co"
      }
    ],
    "page": 1,
    "limit": 10
  }
  ```

---

### **Error Responses**

1. **No Customers Found**

   - **Status Code**: `404 Not Found`
   - **Body**:
     ```json
     {
       "message": "No customers found"
     }
     ```

2. **Internal Server Error**
   - **Status Code**: `500 Internal Server Error`
   - **Body**:
     ```json
     {
       "message": "An error occurred.",
       "error": "Detailed error message"
     }
     ```

---

## **Example Requests**

1. **Search by Name**
   ```http
   GET /search?name=John
   Search by Multiple Filters
   ```

http
Copy
Edit
GET /search?name=John&email=johndoe@example.com
Paginated Search

http
Copy
Edit
GET /search?company=Example&page=2&limit=5
Notes
The name, email, phone, and company fields support partial and case-insensitive matching using regex.
The page and limit parameters help in controlling the number of results returned per request.

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






# Higher Authority Router Documentation

## Overview
This module defines routes for higher authority operations such as managing users and customers, enabling authorized personnel to view, update, and delete resources. The routes are built using `Express.js` and interact with a `MongoDB` database via Mongoose.

## Dependencies

```javascript
const express = require("express");
const higherAuthorityRouter = express.Router();

const UserModel = require("../models/user.model");
const CustomerModel = require("../models/customer.model");
```

## Routes

### Get All Users

#### Endpoint
`GET /users`

#### Description
Retrieves all users registered in the system.

#### Response
- `200 OK`: Returns a list of all users.
- `404 Not Found`: No users found.
- `500 Internal Server Error`: An error occurred.

### Delete a User

#### Endpoint
`DELETE /user/:id`

#### Description
Deletes a specific user based on their ID.

#### Request Parameters
- `id` (string): User ID.

#### Response
- `200 OK`: User deleted successfully.
- `404 Not Found`: User does not exist.
- `500 Internal Server Error`: An error occurred.

### Get All Customers

#### Endpoint
`GET /customers`

#### Description
Retrieves all customers registered in the system.

#### Response
- `200 OK`: Returns a list of all customers.
- `404 Not Found`: No customers found.
- `500 Internal Server Error`: An error occurred.

### Delete a Customer

#### Endpoint
`DELETE /customer/:id`

#### Description
Deletes a specific customer based on their ID.

#### Request Parameters
- `id` (string): Customer ID.

#### Response
- `200 OK`: Customer deleted successfully.
- `404 Not Found`: Customer does not exist.
- `500 Internal Server Error`: An error occurred.

## Error Handling
All routes handle errors gracefully by returning appropriate HTTP status codes and error messages.

## Authorization
These routes are protected and require higher authority credentials to access. Ensure proper authentication and authorization middleware is applied.

## Example Usage

### Get All Users
```javascript
GET /users
```

### Delete a User
```javascript
DELETE /user/12345
```

### Get All Customers
```javascript
GET /customers
```

### Delete a Customer
```javascript
DELETE /customer/67890




# Statistics Router Documentation

## Overview
This router provides statistical data about customers and users. The endpoints allow fetching metrics such as total counts, new additions, and activity levels. It is built using `Express.js`, `Mongoose`, and the `moment` library for date manipulation.

---

## Dependencies

```javascript
const express = require("express");
const statisticsRouter = express.Router();
const moment = require("moment");

const UserModel = require("../models/user.model");
const CustomerModel = require("../models/customer.model");
```

---

## Routes

### Get Customer Statistics

#### Endpoint
`GET /customers`

#### Description
Fetches statistical data about customers, including:
- Total customers in the database.
- Number of new customers added since the start of the current month.
- Number of active customers in the last 30 days (based on updates).

#### Response
- **`200 OK`**: Returns an object with customer statistics:
  - `totalCustomers`: Total number of customers.
  - `newCustomers`: Customers added since the start of the month.
  - `activeCustomers`: Customers updated within the last 30 days.
- **`500 Internal Server Error`**: Returns an error message if the request fails.

#### Example Response
```json
{
  "data": {
    "totalCustomers": 150,
    "newCustomers": 20,
    "activeCustomers": 45
  }
}
```

---

### Get User Role Statistics

#### Endpoint
`GET /users`

#### Description
Fetches aggregated data on users grouped by their roles.

#### Response
- **`200 OK`**: Returns an array of objects, each containing:
  - `_id`: The role name (e.g., `admin`, `user`).
  - `role_count`: The number of users with that role.
- **`500 Internal Server Error`**: Returns an error message if the request fails.

#### Example Response
```json
{
  "data": [
    { "_id": "admin", "role_count": 10 },
    { "_id": "user", "role_count": 40 }
  ]
}
```

---

## Error Handling
All routes implement error handling to ensure appropriate responses are sent in case of issues. Errors return a `500 Internal Server Error` status with a descriptive message.

---

## Example Usage

### Fetch Customer Statistics
```bash
GET /customers
```

### Fetch User Role Statistics
```bash
GET /users
```

---

## Future Enhancements
- Add more granular filters for date ranges.
- Provide support for role-based access control to secure endpoints.
- Include additional customer and user metrics as needed.

---

## Module Export

```javascript
module.exports = statisticsRouter;
