🔐 Authentication Endpoints

1. User Registration
Endpoint: POST /api/auth/register

Description: Registers a new user. By default, all users are assigned the Viewer role for security purposes.

Request Body (JSON):
{
  "name":"Rohit",
  "email": "rohit@test.com",
  "password": "123456"
}

Success Response (201 Created):
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......."
}

Error Response (400 Bad Request - Validation Error):
Occurs when the email format is incorrect.
{
    "success": false,
    "message": "\"email\" must be a valid email"
}

2. User Login
Endpoint: POST /api/auth/login

Description: Authenticates the user and returns a JSON Web Token (JWT) required for all protected routes.

Request Body (JSON):
{
  "email": "rohit@test.com",
  "password": "123456"
}

Success Response (200 OK):
{
    "success": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9......"
}

Error Response (400 Bad Request - Invalid Email Format):
{
    "success": false,
    "message": "\"email\" must be a valid email"
}
Error Response (401 Unauthorized - Wrong Credentials):
{
    "success": false,
    "message": "Invalid credentials"
}
Error Response (403 Forbidden - Account Inactive):
{
    "msg": "Account is inactive. Contact admin."
}


📊 Financial Records Management (Protected)
Note: All endpoints below require a valid JWT token in the header:

Authorization: Bearer <token>

1. Create a Record
Endpoint: POST /api/records

Access: Admin Only 
Description: Adds a new financial transaction to the system.

Request Body (JSON):
{
  "amount": 1200,
  "type": "income",
  "category": "Freelance",
  "date": "2026-04-04",
  "description": "Project payment"
}

Success Response (201 Created):
{
    "success": true,
    "data": {
        "userId": "69d0cb0202e8f1983a39a1ee",
        "amount": 1200,
        "type": "income",
        "category": "Freelance",
        "date": "2026-04-04T00:00:00.000Z",
        "note": "Project payment",
        "isDeleted": false,
        "deletedAt": null,
        "_id": "69d1228a74e57798e8a38666",
        "createdAt": "2026-04-04T14:39:06.771Z",
        "updatedAt": "2026-04-04T14:39:06.771Z",
        "__v": 0
    }
}

2. Get All Records (with Pagination)
Endpoint: GET /api/records

Access: Admin, Analyst 
Description: Retrieves a list of transactions. Supports pagination and excludes soft-deleted items.

Query Parameters: ?page=1&limit=10

Success Response (200 OK):
{
    "success": true,
    "totalRecords": 1,
    "currentPage": 1,
    "totalPages": 1,
    "data": [......]
}

3. Update a Record
Endpoint: PUT /api/records/:id

Access: Admin Only 
Description: Updates the details of an existing transaction.

Request Body (JSON):
{
  "amount": 2000,
  "category": "Salary"
}

Success Response (200 OK):
{
    "success": true,
    "message": "Record updated successfully",
    "data": {......}
}

4. Delete a Record (Soft Delete)
Endpoint: DELETE /api/records/:id

Access: Admin Only 
Description: Performs a "Soft Delete" by setting isDeleted: true. The record remains in the database for audit purposes but is hidden from standard lists.

Success Response (200 OK):
{
    "success": true,
    "message": "Record soft deleted",
    "data": {.....}
}

⚠️Common Error Responses (RBAC)
Error Response (403 Forbidden):
Occurs when a Viewer tries to POST, PUT, or DELETE, or an Analyst tries to DELETE.

{
    "msg": "Access denied"
}

Error Response (401 Unauthorized):
Occurs when no token is provided or the token is invalid.

{
    "msg": "No token"
}


📈 Financial Analytics & Insights
Note: These endpoints are optimized for high performance using MongoDB Aggregation Pipelines and are restricted to specialized roles.

1. Dashboard Summary
Endpoint: GET /api/dashboard/summary

Access: Admin, Analyst 
Description: Returns the high-level financial health of the account. It calculates the total income, total expenses, and the current net balance.

Success Response (200 OK):
{
    "success": true,
    "totalIncome": 7000,
    "totalExpense": 1200,
    "netBalance": 5800,
    "categoryWise": [
        {
            "total": 7000,
            "category": "Freelance"
        },
        {
            "total": 1200,
            "category": "Foodinge"
        }
    ]
}

2. Spending Trends (Category Breakdown)
Endpoint: GET /api/dashboard/trends

Access: Admin, Analyst 
Description: Aggregates non-deleted transactions by category to visualize spending habits. It dynamically adjusts the time window based on the query type.

Query Parameters:
    type: (Optional) Choose between monthly (default) or yearly.

Success Response (200 OK):
{
    "success": true,
    "data": [
        {
            "_id": {
                "year": 2026
            },
            "income": 7000,
            "expense": 1200
        }
    ]
}

3. Recent Transactions
Endpoint: GET /api/dashboard/recent

Access: Admin, Analyst 
Description: Fetches the 5 most recent transactions (sorted by date descending) to populate the "Quick View" section of the dashboard.

Success Response (200 OK):
{
    "success": true,
    "data": [
        {
            "_id": "69d14755138f44d2c53164bb",
            "userId": "69d0cb0202e8f1983a39a1ee",
            "amount": 1200,
            "type": "expense",
            "category": "Foodinge",
            "date": "2026-04-04T00:00:00.000Z",
            "isDeleted": false,
            "deletedAt": null,
            "createdAt": "2026-04-04T17:16:05.095Z",
            "updatedAt": "2026-04-04T17:16:05.095Z",
            "__v": 0
        },
        {....},{....},
    ]
}

👥 User & Role Management (Super Admin)
Note: These endpoints are restricted to the Admin role only. They allow for system-wide oversight and permission adjustments.

1. Get All Registered Users
Endpoint: GET /api/users

Access: Admin Only 
Description: Retrieves a complete list of all users in the system. This is used by the Admin to monitor account activity and current roles.

Success Response (200 OK):
{
    "success": true,
    "data": [....]
}

2. Update User Role
Endpoint: PUT /api/users/:id

Access: Admin Only Description: Promotes or demotes a user's access level. This is the only way to move a user from the default Viewer role to Analyst or Admin.

Request Body (JSON):
{
  "role": "viewer"
}
Success Response (200 OK):
{
    "success": true,
    "message": "User role updated",
    "data": {
        "_id": "69d13f27dced88eccbb2e51b",
        "name": "Rahul",
        "email": "rahul@test.com",
        "password": "$2b$10$JzptNazG5OsId1rk9tHn.OVaBGXscFgNVz9ZkKBWaL.c6XrYObi8i",
        "role": "viewer",
        "status": "active",
        "createdAt": "2026-04-04T16:41:11.225Z",
        "updatedAt": "2026-04-05T07:28:48.566Z",
        "__v": 0
    }
}

⚠️ Security Error Response (Crucial)
Error Response (403 Forbidden):
Occurs when an Analyst or Viewer tries to access these admin-only routes.
{
    "msg": "Access denied"
}

3. Toggle User Status (Active/Inactive)
Endpoint: PATCH /api/users/status/:id

Access: Admin Only 
Description: Switches a user's account status between active and inactive. If a user is inactive, the protect middleware should block their login or API requests, even if their password is correct.

Success Response (200 OK):
{
    "msg": "User is now inactive",
    "user": {....}
}