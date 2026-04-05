# 💰 Finance Dashboard Backend

A **production-ready backend system** for managing financial records with **role-based access control**, **advanced analytics**, and **secure APIs**.

---

## 🚀 Overview

This project provides a robust backend for tracking income and expenses, generating insights, and managing users with different access levels.

It is designed with **scalability, security, and clean architecture** in mind.

---

## ✨ Key Features

### 🔐 Authentication & Security

* JWT-based authentication
* Password hashing using bcrypt
* Input validation using Joi
* Protected routes with middleware

---

### 👥 Role-Based Access Control (RBAC)

* **Viewer** → Read-only access
* **Analyst** → View + analytics
* **Admin** → Full access (CRUD + user management)

---

### 💰 Financial Records Management

* Create, update, delete (soft delete) records
* Filter by type and category
* Search across multiple fields
* Pagination support

---

### 📊 Dashboard Analytics

* Total Income & Expense
* Net Balance
* Category-wise breakdown
* Monthly & Yearly trends
* Recent transactions

---

### 🔄 Status Management

* Toggle user status (active/inactive)
* Inactive users:

  * ❌ Cannot log in
  * ❌ Cannot access APIs

---

### 🧹 Soft Delete

* Records are not permanently deleted
* Uses `isDeleted` flag for safe removal

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Joi Validation

---

## 🗄️ Database Schema

### 👤 User Model

```js
{
  name: String,
  email: String,
  password: String,
  role: "viewer" | "analyst" | "admin",
  status: "active" | "inactive",
  createdAt: Date,
  updatedAt: Date
}
```

---

### 💰 Record Model

```js
{
  userId: ObjectId (ref: User),
  amount: Number,
  type: "income" | "expense",
  category: String,
  date: Date,
  note: String,
  isDeleted: Boolean,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

> Each record is linked to a user using `userId`, ensuring user-specific data isolation.

---

## 📁 Project Structure

```
/config
/controllers
/models
/routes
/middleware
/utils
/postman
server.js
.env
```

---

## ▶️ Run Locally

### 1. Clone Repository

```bash
git clone https://github.com/Akhil007865678/Finance-Dashboard.git
cd Finance-Dashboard
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start Server

```bash
npm start
```

For development:

```bash
npm run dev
```

---

## 📡 API Documentation

### 🔐 Authentication

#### Register User

`POST /api/auth/register`

```json
{
  "name": "Akhil",
  "email": "akhil@test.com",
  "password": "123456"
}
```

---

#### Login User

`POST /api/auth/login`

```json
{
  "email": "akhil@test.com",
  "password": "123456"
}
```

---

### 💰 Records (Protected)

**Header Required:**

```
Authorization: Bearer <token>
```

* `POST /api/records` → Create record (Admin)
* `GET /api/records` → Get records (Admin, Analyst)
* `PUT /api/records/:id` → Update record (Admin)
* `DELETE /api/records/:id` → Soft delete

---

### 📊 Dashboard (Admin, Analyst)

* `GET /api/dashboard/summary`
* `GET /api/dashboard/trends?type=monthly|yearly`
* `GET /api/dashboard/recent`

---

### 👥 User Management (Admin Only)

* `GET /api/users`
* `PUT /api/users/:id` → Update role
* `PATCH /api/users/status/:id` → Toggle status

---

## 📘 Detailed API Reference

### 🔐 Authentication Endpoints

#### Register

**POST /api/auth/register**

```json
{
  "name": "Akhil",
  "email": "akhil@test.com",
  "password": "123456"
}
```

**Response**

```json
{
  "success": true,
  "token": "jwt_token"
}
```

---

#### Login

**POST /api/auth/login**

**Responses:**

* ✅ Success → Token returned
* ❌ Invalid email → validation error
* ❌ Wrong credentials → "Invalid credentials"
* ❌ Inactive → "Account is inactive"

---

### 💰 Records API

#### Create Record (Admin)

**POST /api/records**

#### Get Records

**GET /api/records?page=1&limit=10&search=salary**

#### Update Record

**PUT /api/records/:id**

#### Delete Record

**DELETE /api/records/:id**

---

### 📊 Dashboard APIs

* **GET /api/dashboard/summary**
* **GET /api/dashboard/trends**
* **GET /api/dashboard/recent**

---

### 👥 User APIs

* **GET /api/users**
* **PUT /api/users/:id**
* **PATCH /api/users/status/:id**

---

## ⚠️ Common Errors

```json
{
  "msg": "Access denied"
}
```

```json
{
  "msg": "No token"
}
```

```json
{
  "msg": "Account is inactive"
}
```

---

## ⚡ Design Decisions

* Soft delete for data safety
* Aggregation pipelines for analytics
* Middleware-based RBAC
* Joi validation for data integrity

---

## 🙌 Author

**Akhil Raj**

---

## 📌 Note

This project demonstrates **real-world backend architecture**, including authentication, authorization, analytics, and scalable API design.

---

⭐ If you found this useful, consider giving it a star!
