# SkillUp Admin Dashboard API Documentation

This document provides comprehensive documentation for all API endpoints used by the SkillUp Admin Dashboard. The dashboard integrates with the SkillUp backend API to manage users, courses, analytics, and platform settings.

## 🌐 Base Configuration

### API Base URL
```
Production: https://api.skillup.com
Development: http://localhost:8888/api
```

### Authentication
All API requests (except login) require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Request/Response Format
- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **Character Encoding**: UTF-8

### Standard Response Structure
```json
{
  "success": boolean,
  "data": object | array | null,
  "message": string,
  "timestamp": "ISO 8601 string",
  "errors": array | null
}
```

## 🔐 Authentication Endpoints

### POST /auth/login
Administrator login endpoint.

**Request Body:**
```json
{
  "email": "admin@skillup.com",
  "password": "your_password"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@skillup.com",
      "role": "ADMIN",
      "permissions": ["USER_MANAGEMENT", "COURSE_MANAGEMENT", "ANALYTICS"]
    },
    "expiresIn": 3600
  },
  "message": "Login successful"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email or password",
  "errors": ["INVALID_CREDENTIALS"]
}
```

### GET /auth/validate
Validate current JWT token and return user information.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@skillup.com",
      "role": "ADMIN"
    }
  }
}
```

### POST /auth/logout
Invalidate current session token.

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

## 📊 Dashboard Analytics Endpoints

### GET /admin/dashboard/stats
Retrieve dashboard statistics and metrics.

**Query Parameters:**
- `period` (optional): `day` | `week` | `month` | `year` (default: `month`)
- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 15284,
    "totalCourses": 342,
    "totalInstructors": 89,
    "totalStudents": 14156,
    "revenue": {
      "total": 285750.50,
      "monthly": 45230.75,
      "growth": 12.5
    },
    "enrollments": {
      "total": 45678,
      "monthly": 2341,
      "growth": 8.3
    },
    "completionRate": 73.2,
    "chartData": {
      "userGrowth": [
        {"month": "Jan", "users": 1200, "courses": 25},
        {"month": "Feb", "users": 1350, "courses": 28},
        {"month": "Mar", "users": 1500, "courses": 32}
      ],
      "revenue": [
        {"month": "Jan", "amount": 35000},
        {"month": "Feb", "amount": 42000},
        {"month": "Mar", "amount": 45230}
      ]
    },
    "recentActivity": [
      {
        "id": 1,
        "type": "USER_REGISTRATION",
        "description": "New user registered: John Doe",
        "timestamp": "2025-08-10T10:30:00Z"
      },
      {
        "id": 2,
        "type": "COURSE_PUBLISHED",
        "description": "Course 'Advanced React' published by Jane Smith",
        "timestamp": "2025-08-10T09:15:00Z"
      }
    ]
  }
}
```

### GET /admin/analytics/revenue
Detailed revenue analytics.

**Query Parameters:**
- `period`: `day` | `week` | `month` | `quarter` | `year`
- `groupBy`: `course` | `instructor` | `category`
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalRevenue": 285750.50,
    "breakdown": [
      {
        "category": "Programming",
        "revenue": 125000.00,
        "percentage": 43.7
      },
      {
        "category": "Design",
        "revenue": 89500.25,
        "percentage": 31.3
      }
    ],
    "topCourses": [
      {
        "id": 15,
        "title": "Complete JavaScript Course",
        "revenue": 15750.00,
        "enrollments": 210
      }
    ]
  }
}
```

## 👥 User Management Endpoints

### GET /admin/users
Retrieve paginated list of users.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search term for name or email
- `role` (optional): Filter by role (`STUDENT` | `INSTRUCTOR` | `ADMIN`)
- `status` (optional): Filter by status (`ACTIVE` | `INACTIVE` | `SUSPENDED`)
- `sortBy` (optional): Sort field (`name` | `email` | `createdAt` | `lastLogin`)
- `sortOrder` (optional): Sort direction (`asc` | `desc`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 123,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "STUDENT",
        "status": "ACTIVE",
        "avatar": "https://api.skillup.com/avatars/123.jpg",
        "enrolledCourses": 5,
        "completedCourses": 2,
        "createdAt": "2025-01-15T08:30:00Z",
        "lastLogin": "2025-08-10T14:20:00Z",
        "verified": true
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 145,
      "totalItems": 2897,
      "itemsPerPage": 20,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### GET /admin/users/search
Advanced user search with filters.

**Query Parameters:**
- `q`: Search query
- `filters`: JSON string with advanced filters
- `page`: Page number
- `limit`: Items per page

**Example Request:**
```
GET /admin/users/search?q=john&filters={"role":"STUDENT","verified":true}&page=1&limit=10
```

### GET /admin/users/:id
Get detailed information about a specific user.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "status": "ACTIVE",
    "profile": {
      "bio": "Passionate learner interested in web development",
      "location": "New York, USA",
      "website": "https://johndoe.dev",
      "socialLinks": {
        "linkedin": "linkedin.com/in/johndoe",
        "github": "github.com/johndoe"
      }
    },
    "stats": {
      "enrolledCourses": 5,
      "completedCourses": 2,
      "certificatesEarned": 2,
      "totalLearningHours": 45.5,
      "averageRating": 4.7
    },
    "enrollments": [
      {
        "courseId": 45,
        "courseTitle": "React Development Bootcamp",
        "progress": 75,
        "enrolledAt": "2025-02-10T10:00:00Z",
        "lastAccessed": "2025-08-09T16:30:00Z"
      }
    ],
    "activityLog": [
      {
        "action": "COURSE_ENROLLMENT",
        "details": "Enrolled in 'React Development Bootcamp'",
        "timestamp": "2025-02-10T10:00:00Z"
      }
    ]
  }
}
```

### PUT /admin/users/:id
Update user information.

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "role": "INSTRUCTOR",
  "status": "ACTIVE"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "INSTRUCTOR",
    "status": "ACTIVE",
    "updatedAt": "2025-08-10T15:45:00Z"
  },
  "message": "User updated successfully"
}
```

### DELETE /admin/users/:id
Delete a user account.

**Query Parameters:**
- `permanent` (optional): Boolean to permanently delete vs soft delete

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "User deleted successfully"
}
```

### POST /admin/users/:id/suspend
Suspend a user account.

**Request Body:**
```json
{
  "reason": "Violation of terms of service",
  "duration": 30,
  "notify": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": 123,
    "status": "SUSPENDED",
    "suspendedUntil": "2025-09-09T15:45:00Z",
    "reason": "Violation of terms of service"
  },
  "message": "User suspended successfully"
}
```

## 📚 Course Management Endpoints

### GET /admin/courses
Retrieve paginated list of courses.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `search` (optional): Search term for title or description
- `category` (optional): Filter by category
- `status` (optional): Filter by status (`DRAFT` | `PUBLISHED` | `ARCHIVED`)
- `featured` (optional): Filter featured courses (boolean)
- `sortBy` (optional): Sort field (`title` | `createdAt` | `enrollments` | `rating`)
- `sortOrder` (optional): Sort direction (`asc` | `desc`)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": 45,
        "title": "Complete JavaScript Course",
        "description": "Learn JavaScript from beginner to advanced level",
        "category": "Programming",
        "status": "PUBLISHED",
        "featured": true,
        "thumbnail": "https://api.skillup.com/course-thumbnails/45.jpg",
        "instructor": {
          "id": 67,
          "name": "Jane Smith",
          "email": "jane.smith@example.com",
          "avatar": "https://api.skillup.com/avatars/67.jpg"
        },
        "stats": {
          "enrollments": 1250,
          "completions": 890,
          "rating": 4.8,
          "reviewCount": 245
        },
        "pricing": {
          "price": 99.99,
          "currency": "USD",
          "discountPrice": 79.99
        },
        "createdAt": "2025-01-20T12:00:00Z",
        "updatedAt": "2025-08-05T09:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 18,
      "totalItems": 342,
      "itemsPerPage": 20
    }
  }
}
```

### GET /admin/courses/:id
Get detailed course information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 45,
    "title": "Complete JavaScript Course",
    "description": "Comprehensive JavaScript course covering ES6+, DOM manipulation, async programming, and modern frameworks.",
    "category": "Programming",
    "status": "PUBLISHED",
    "featured": true,
    "difficulty": "INTERMEDIATE",
    "duration": "40 hours",
    "language": "English",
    "requirements": [
      "Basic computer knowledge",
      "No prior programming experience required"
    ],
    "learningObjectives": [
      "Master JavaScript fundamentals",
      "Build interactive web applications",
      "Understand modern ES6+ features"
    ],
    "curriculum": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "lessons": [
          {
            "id": 1,
            "title": "What is JavaScript?",
            "type": "VIDEO",
            "duration": "15 minutes"
          }
        ]
      }
    ],
    "instructor": {
      "id": 67,
      "name": "Jane Smith",
      "bio": "Senior JavaScript developer with 8+ years experience",
      "credentials": ["Certified JavaScript Developer", "Google Developer Expert"],
      "socialLinks": {
        "linkedin": "linkedin.com/in/janesmith",
        "github": "github.com/janesmith"
      }
    },
    "analytics": {
      "enrollments": 1250,
      "completions": 890,
      "dropoutRate": 12.5,
      "averageCompletionTime": 35,
      "rating": 4.8,
      "reviewCount": 245,
      "revenue": 124875.00
    },
    "reviews": [
      {
        "id": 123,
        "user": {
          "name": "John Doe",
          "avatar": "https://api.skillup.com/avatars/123.jpg"
        },
        "rating": 5,
        "comment": "Excellent course! Very well structured.",
        "createdAt": "2025-08-01T14:30:00Z"
      }
    ]
  }
}
```

### PUT /admin/courses/:id
Update course information and settings.

**Request Body:**
```json
{
  "status": "PUBLISHED",
  "featured": true,
  "category": "Programming",
  "pricing": {
    "price": 89.99,
    "discountPrice": 69.99
  }
}
```

### DELETE /admin/courses/:id
Delete or archive a course.

**Query Parameters:**
- `archive` (optional): Boolean to archive vs permanently delete

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Course archived successfully"
}
```

### POST /admin/courses/:id/feature
Feature or unfeature a course.

**Request Body:**
```json
{
  "featured": true,
  "featuredOrder": 1
}
```

### GET /admin/courses/:id/enrollments
Get course enrollment details.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `status`: Filter by enrollment status

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": 789,
        "student": {
          "id": 123,
          "name": "John Doe",
          "email": "john.doe@example.com"
        },
        "progress": 75,
        "status": "ACTIVE",
        "enrolledAt": "2025-02-10T10:00:00Z",
        "lastAccessed": "2025-08-09T16:30:00Z",
        "completedLessons": 15,
        "totalLessons": 20
      }
    ],
    "stats": {
      "totalEnrollments": 1250,
      "activeStudents": 890,
      "completedStudents": 245,
      "averageProgress": 68.5
    }
  }
}
```

## 📋 Content Moderation Endpoints

### GET /admin/content/pending
Get content requiring moderation review.

**Query Parameters:**
- `type`: Content type (`COURSE` | `REVIEW` | `COMMENT` | `USER_PROFILE`)
- `page`: Page number
- `limit`: Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pendingItems": [
      {
        "id": 456,
        "type": "COURSE",
        "title": "New Course Submission",
        "submittedBy": {
          "id": 67,
          "name": "Jane Smith"
        },
        "submittedAt": "2025-08-10T09:00:00Z",
        "content": {
          "title": "Advanced React Patterns",
          "description": "Learn advanced React patterns..."
        },
        "status": "PENDING_REVIEW"
      }
    ]
  }
}
```

### POST /admin/content/:id/approve
Approve pending content.

**Request Body:**
```json
{
  "approved": true,
  "feedback": "Content approved with minor suggestions",
  "publishImmediately": true
}
```

### POST /admin/content/:id/reject
Reject pending content.

**Request Body:**
```json
{
  "reason": "Content does not meet quality standards",
  "feedback": "Please revise the course structure and add more detailed explanations"
}
```

## 🔧 System Settings Endpoints

### GET /admin/settings
Get current platform settings.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "platform": {
      "name": "SkillUp",
      "description": "Professional e-learning platform",
      "supportEmail": "support@skillup.com",
      "maintenanceMode": false
    },
    "registration": {
      "allowPublicRegistration": true,
      "requireEmailVerification": true,
      "defaultRole": "STUDENT"
    },
    "courses": {
      "requireApproval": true,
      "allowFreeContent": true,
      "maxFileSize": 100,
      "supportedFormats": ["MP4", "PDF", "DOCX"]
    },
    "payments": {
      "currency": "USD",
      "taxRate": 8.25,
      "processingFee": 2.9
    }
  }
}
```

### PUT /admin/settings
Update platform settings.

**Request Body:**
```json
{
  "platform": {
    "maintenanceMode": false
  },
  "registration": {
    "allowPublicRegistration": true
  }
}
```

## 🚨 Error Handling

### Standard Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `UNAUTHORIZED` | Invalid or expired token | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `VALIDATION_ERROR` | Invalid request data | 400 |
| `SERVER_ERROR` | Internal server error | 500 |
| `RATE_LIMITED` | Too many requests | 429 |

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "message": "Resource not found",
  "errors": [
    {
      "code": "NOT_FOUND",
      "field": "userId",
      "message": "User with ID 999 does not exist"
    }
  ],
  "timestamp": "2025-08-10T15:30:00Z"
}
```

## 🔄 Rate Limiting

The API implements rate limiting to prevent abuse:

- **Authentication endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute
- **Search endpoints**: 20 requests per minute
- **Upload endpoints**: 10 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 85
X-RateLimit-Reset: 1628614800
```

## 📝 API Versioning

The API uses URL versioning:
- Current version: `v1`
- Base URL: `https://api.skillup.com/v1`

## 🔐 Security Considerations

### Authentication Security
- JWT tokens expire after 1 hour
- Refresh tokens available for extended sessions
- Secure token storage recommended (httpOnly cookies)

### Data Protection
- All sensitive data is encrypted in transit (HTTPS)
- PII data is encrypted at rest
- Audit logs maintained for all admin actions

### Input Validation
- All inputs are validated and sanitized
- SQL injection protection implemented
- XSS prevention measures in place

## 📊 Pagination

Standard pagination parameters:
- `page`: Page number (1-based)
- `limit`: Items per page (max 100)

Pagination response format:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 200,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 📋 Request Examples

### cURL Examples

**Login:**
```bash
curl -X POST https://api.skillup.com/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@skillup.com","password":"your_password"}'
```

**Get Users:**
```bash
curl -X GET "https://api.skillup.com/v1/admin/users?page=1&limit=20" \
  -H "Authorization: Bearer your_jwt_token"
```

**Update Course:**
```bash
curl -X PUT https://api.skillup.com/v1/admin/courses/45 \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"featured":true,"status":"PUBLISHED"}'
```

---

## 📞 Support

For API support and questions:
- **Email**: dev-support@skillup.com
- **Documentation**: https://docs.skillup.com
- **Status Page**: https://status.skillup.com

Last updated: August 10, 2025