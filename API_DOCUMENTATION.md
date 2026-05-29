# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### 1. Sign Up
**POST** `/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@hostel.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "student",
  "rollNumber": "21CS001",
  "semester": 3
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@hostel.com",
    "role": "student"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Login
**POST** `/auth/login`

Authenticate and get JWT token.

**Request Body:**
```json
{
  "email": "admin@hostel.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "Admin User",
    "email": "admin@hostel.com",
    "role": "admin"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Get Current User
**GET** `/auth/me`

Get authenticated user's details.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "name": "John Doe",
  "email": "john@hostel.com",
  "phone": "9876543210",
  "role": "student",
  "rollNumber": "21CS001",
  "semester": 3,
  "roomNumber": "101"
}
```

---

## Student Management (Admin Only)

### 1. Get All Students
**GET** `/students`

Get list of all students.

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
    "name": "John Doe",
    "email": "john@hostel.com",
    "phone": "9876543210",
    "rollNumber": "21CS001",
    "semester": 3,
    "roomNumber": "101"
  }
]
```

---

### 2. Get Student by ID
**GET** `/students/:id`

Get specific student details.

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "name": "John Doe",
  "email": "john@hostel.com",
  "rollNumber": "21CS001"
}
```

---

### 3. Create Student
**POST** `/students`

Add a new student. (Admin only)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@hostel.com",
  "phone": "9876543212",
  "rollNumber": "21CS002",
  "semester": 2
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
  "name": "Jane Doe",
  "email": "jane@hostel.com",
  "rollNumber": "21CS002"
}
```

---

### 4. Update Student
**PUT** `/students/:id`

Update student information.

**Request Body:**
```json
{
  "name": "Jane Doe Updated",
  "phone": "9876543222",
  "semester": 3
}
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k2",
  "name": "Jane Doe Updated",
  "semester": 3
}
```

---

### 5. Delete Student
**DELETE** `/students/:id`

Remove a student. (Admin only)

**Response (200):**
```json
{
  "message": "Student deleted successfully"
}
```

---

## Room Management

### 1. Get All Rooms
**GET** `/rooms`

Get list of all rooms with student details.

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
    "roomNumber": "101",
    "floor": 1,
    "capacity": 2,
    "currentOccupancy": 2,
    "status": "occupied",
    "allocatedStudents": [
      {
        "_id": "64a1b2c3d4e5f6g7h8i9j0k1",
        "name": "John Doe",
        "rollNumber": "21CS001"
      }
    ]
  }
]
```

---

### 2. Get Room by ID
**GET** `/rooms/:id`

Get specific room details.

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "roomNumber": "101",
  "floor": 1,
  "capacity": 2,
  "currentOccupancy": 1,
  "status": "available"
}
```

---

### 3. Create Room (Admin)
**POST** `/rooms`

Create a new room.

**Request Body:**
```json
{
  "roomNumber": "103",
  "floor": 1,
  "capacity": 2
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k4",
  "roomNumber": "103",
  "floor": 1,
  "capacity": 2,
  "currentOccupancy": 0,
  "status": "available"
}
```

---

### 4. Allocate Student to Room (Admin)
**POST** `/rooms/:id/allocate`

Assign a student to a room.

**Request Body:**
```json
{
  "studentId": "64a1b2c3d4e5f6g7h8i9j0k1"
}
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "roomNumber": "101",
  "currentOccupancy": 2,
  "status": "occupied"
}
```

---

## Fee Management

### 1. Get All Fees (Admin)
**GET** `/fees`

Get list of all fee entries.

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
    "student": { "_id": "...", "name": "John Doe" },
    "studentName": "John Doe",
    "studentRoll": "21CS001",
    "amount": 5000,
    "dueDate": "2026-06-29",
    "status": "paid",
    "paidDate": "2026-05-25"
  }
]
```

---

### 2. Create Fee Entry (Admin)
**POST** `/fees`

Create a new fee entry.

**Request Body:**
```json
{
  "student": "64a1b2c3d4e5f6g7h8i9j0k1",
  "amount": 5000,
  "dueDate": "2026-06-30",
  "description": "Hostel Fee - June 2026"
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
  "student": "64a1b2c3d4e5f6g7h8i9j0k1",
  "amount": 5000,
  "status": "unpaid"
}
```

---

### 3. Mark Fee as Paid (Admin)
**PATCH** `/fees/:id/mark-paid`

Mark a fee as paid.

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k5",
  "amount": 5000,
  "status": "paid",
  "paidDate": "2026-05-29"
}
```

---

## Complaint Management

### 1. Get All Complaints (Admin)
**GET** `/complaints`

Get list of all complaints.

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
    "title": "Water tap is leaking",
    "description": "The water tap in room 101 is leaking",
    "category": "maintenance",
    "status": "pending",
    "priority": "high",
    "studentName": "John Doe"
  }
]
```

---

### 2. Create Complaint
**POST** `/complaints`

File a new complaint.

**Request Body:**
```json
{
  "title": "Noise in corridor",
  "description": "Students are making too much noise at night",
  "category": "cleanliness",
  "priority": "medium"
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
  "title": "Noise in corridor",
  "status": "pending",
  "studentName": "John Doe"
}
```

---

### 3. Update Complaint Status (Admin)
**PATCH** `/complaints/:id/status`

Update complaint status and resolution.

**Request Body:**
```json
{
  "status": "resolved",
  "resolution": "Issue has been resolved. Wardens notified."
}
```

**Response (200):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k6",
  "status": "resolved",
  "resolution": "Issue has been resolved"
}
```

---

## Notice Board

### 1. Get All Notices
**GET** `/notices`

Get list of all active notices.

**Response (200):**
```json
[
  {
    "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
    "title": "Hostel Maintenance Schedule",
    "content": "Maintenance will be conducted on...",
    "category": "maintenance",
    "createdAt": "2026-05-20"
  }
]
```

---

### 2. Create Notice (Admin)
**POST** `/notices`

Post a new notice.

**Request Body:**
```json
{
  "title": "Sports Day",
  "content": "Annual sports day will be on June 15",
  "category": "event"
}
```

**Response (201):**
```json
{
  "_id": "64a1b2c3d4e5f6g7h8i9j0k7",
  "title": "Sports Day",
  "category": "event"
}
```

---

## Analytics

### Get Dashboard Analytics (Admin)
**GET** `/analytics/dashboard`

Get hostel statistics and analytics.

**Response (200):**
```json
{
  "totalStudents": 150,
  "totalRooms": 50,
  "occupancyPercentage": 85,
  "totalOccupied": 42,
  "totalCapacity": 100,
  "totalRevenue": 750000,
  "pendingFees": 50000,
  "openComplaints": 5,
  "resolvedComplaints": 12,
  "feeCollectionPercentage": 75,
  "feesPaid": 120,
  "feesUnpaid": 30
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin role required."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Auth failed |
| 403 | Forbidden - Insufficient permission |
| 404 | Not Found - Resource not found |
| 500 | Server Error |

---

## Rate Limiting

Currently no rate limiting is implemented. It's recommended to add rate limiting for production.

---

## Pagination

Pagination support can be added to list endpoints with query parameters:
```
GET /api/students?page=1&limit=10
```

---

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hostel.com","password":"admin123"}'

# Get all students
curl -X GET http://localhost:5000/api/students \
  -H "Authorization: Bearer <token>"
```

---

**API Version:** 1.0  
**Last Updated:** 2026-05-29
