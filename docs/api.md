# SkillUp Website API Documentation

This document provides comprehensive API documentation for the SkillUp e-learning platform website. The API serves both students and instructors with endpoints for authentication, course management, learning progress, and user interactions.

## 🌐 Base Configuration

### API Base URL
```
Production: https://api.skillup.com
Development: http://localhost:8888/api
```

### Authentication
Most API requests require a valid JWT token in the Authorization header:
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

### POST /api/auth/register
User registration endpoint for students and instructors.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "STUDENT",
  "bio": "Passionate learner interested in web development"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 123,
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT",
      "bio": "Passionate learner interested in web development",
      "createdAt": "2025-08-10T10:30:00Z"
    }
  },
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters"
    }
  ]
}
```

### POST /api/auth/login
User login endpoint.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "userId": 123,
    "user": {
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT"
    }
  },
  "message": "Login successful"
}
```

### GET /api/auth/validate
Validate current JWT token.

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
      "id": 123,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "STUDENT"
    }
  }
}
```

### POST /api/auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Password reset email sent"
}
```

## 📚 Course Endpoints

### GET /api/courses
Retrieve list of courses with filtering and pagination.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12, max: 50)
- `search` (optional): Search term for title or description
- `category` (optional): Filter by category
- `level` (optional): Filter by difficulty level (`BEGINNER` | `INTERMEDIATE` | `ADVANCED`)
- `price` (optional): Filter by price range (`FREE` | `PAID`)
- `featured` (optional): Filter featured courses (boolean)
- `sortBy` (optional): Sort field (`title` | `price` | `rating` | `createdAt`)
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
        "description": "Learn JavaScript from beginner to advanced level with hands-on projects",
        "shortDescription": "Master JavaScript fundamentals and advanced concepts",
        "category": "Programming",
        "level": "INTERMEDIATE",
        "thumbnail": "https://api.skillup.com/course-thumbnails/45.jpg",
        "price": 99.99,
        "discountPrice": 79.99,
        "currency": "USD",
        "featured": true,
        "instructor": {
          "id": 67,
          "name": "Jane Smith",
          "avatar": "https://api.skillup.com/avatars/67.jpg",
          "title": "Senior JavaScript Developer"
        },
        "stats": {
          "enrollments": 1250,
          "rating": 4.8,
          "reviewCount": 245,
          "duration": "40 hours",
          "lessons": 25
        },
        "tags": ["JavaScript", "ES6", "Frontend", "Backend"],
        "lastUpdated": "2025-08-05T09:30:00Z",
        "createdAt": "2025-01-20T12:00:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 15,
      "totalItems": 180,
      "itemsPerPage": 12,
      "hasNext": true,
      "hasPrev": false
    },
    "filters": {
      "categories": ["Programming", "Design", "Business", "Marketing"],
      "levels": ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      "priceRanges": [
        {"label": "Free", "min": 0, "max": 0},
        {"label": "$1-$50", "min": 1, "max": 50},
        {"label": "$51-$100", "min": 51, "max": 100}
      ]
    }
  }
}
```

### GET /api/courses/search
Advanced course search with full-text search capabilities.

**Query Parameters:**
- `q`: Search query
- `filters`: JSON string with advanced filters
- `page`: Page number
- `limit`: Items per page

**Example Request:**
```
GET /api/courses/search?q=javascript react&filters={"category":"Programming","level":"INTERMEDIATE"}&page=1&limit=10
```

### GET /api/courses/:id
Get detailed course information.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 45,
    "title": "Complete JavaScript Course",
    "description": "Comprehensive JavaScript course covering ES6+, DOM manipulation, async programming, and modern frameworks. Perfect for beginners and intermediate developers.",
    "category": "Programming",
    "level": "INTERMEDIATE",
    "status": "PUBLISHED",
    "featured": true,
    "thumbnail": "https://api.skillup.com/course-thumbnails/45.jpg",
    "previewVideo": "https://api.skillup.com/course-previews/45.mp4",
    "pricing": {
      "price": 99.99,
      "discountPrice": 79.99,
      "currency": "USD",
      "discountExpiry": "2025-08-31T23:59:59Z"
    },
    "duration": "40 hours",
    "language": "English",
    "subtitles": ["English", "Spanish", "French"],
    "requirements": [
      "Basic computer knowledge",
      "No prior programming experience required",
      "Access to a computer with internet connection"
    ],
    "learningObjectives": [
      "Master JavaScript fundamentals and advanced concepts",
      "Build interactive web applications",
      "Understand modern ES6+ features and syntax",
      "Work with APIs and asynchronous programming"
    ],
    "targetAudience": [
      "Beginners who want to learn programming",
      "Developers looking to improve JavaScript skills",
      "Students preparing for web development careers"
    ],
    "instructor": {
      "id": 67,
      "name": "Jane Smith",
      "bio": "Senior JavaScript developer with 8+ years of experience in full-stack development",
      "avatar": "https://api.skillup.com/avatars/67.jpg",
      "title": "Senior JavaScript Developer",
      "company": "TechCorp Inc.",
      "credentials": [
        "Certified JavaScript Developer",
        "Google Developer Expert",
        "Microsoft MVP"
      ],
      "stats": {
        "totalStudents": 15000,
        "totalCourses": 12,
        "averageRating": 4.7
      },
      "socialLinks": {
        "linkedin": "https://linkedin.com/in/janesmith",
        "github": "https://github.com/janesmith",
        "website": "https://janesmith.dev"
      }
    },
    "curriculum": [
      {
        "id": 1,
        "title": "Introduction to JavaScript",
        "description": "Getting started with JavaScript basics",
        "order": 1,
        "lessons": [
          {
            "id": 1,
            "title": "What is JavaScript?",
            "description": "Introduction to JavaScript and its uses",
            "type": "VIDEO",
            "duration": "15 minutes",
            "order": 1,
            "preview": true,
            "resources": [
              {
                "title": "Lesson Notes",
                "type": "PDF",
                "url": "https://api.skillup.com/resources/lesson-1-notes.pdf"
              }
            ]
          },
          {
            "id": 2,
            "title": "Setting Up Development Environment",
            "type": "VIDEO",
            "duration": "20 minutes",
            "order": 2,
            "preview": false
          }
        ]
      },
      {
        "id": 2,
        "title": "JavaScript Fundamentals",
        "description": "Core JavaScript concepts and syntax",
        "order": 2,
        "lessons": [
          {
            "id": 3,
            "title": "Variables and Data Types",
            "type": "VIDEO",
            "duration": "25 minutes",
            "order": 1,
            "quiz": {
              "id": 1,
              "title": "Variables Quiz",
              "questions": 5
            }
          }
        ]
      }
    ],
    "stats": {
      "enrollments": 1250,
      "completions": 890,
      "rating": 4.8,
      "reviewCount": 245,
      "totalLessons": 25,
      "totalQuizzes": 5,
      "totalAssignments": 3
    },
    "reviews": [
      {
        "id": 123,
        "user": {
          "name": "Michael Johnson",
          "avatar": "https://api.skillup.com/avatars/123.jpg"
        },
        "rating": 5,
        "comment": "Excellent course! Very well structured and easy to follow. Jane is an amazing instructor.",
        "helpful": 15,
        "createdAt": "2025-08-01T14:30:00Z"
      }
    ],
    "tags": ["JavaScript", "ES6", "Frontend", "Backend", "Web Development"],
    "certificate": {
      "available": true,
      "completionRequired": 90
    },
    "createdAt": "2025-01-20T12:00:00Z",
    "updatedAt": "2025-08-05T09:30:00Z"
  }
}
```

### GET /api/courses/:id/reviews
Get course reviews with pagination.

**Query Parameters:**
- `page`: Page number
- `limit`: Items per page
- `sortBy`: Sort by (`rating` | `date` | `helpful`)
- `rating`: Filter by rating (1-5)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reviews": [
      {
        "id": 123,
        "user": {
          "name": "Michael Johnson",
          "avatar": "https://api.skillup.com/avatars/123.jpg"
        },
        "rating": 5,
        "comment": "Excellent course! Very well structured and easy to follow.",
        "helpful": 15,
        "reported": false,
        "createdAt": "2025-08-01T14:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 25,
      "totalItems": 245
    },
    "summary": {
      "averageRating": 4.8,
      "totalReviews": 245,
      "ratingDistribution": {
        "5": 156,
        "4": 67,
        "3": 15,
        "2": 5,
        "1": 2
      }
    }
  }
}
```

## 🎓 Enrollment & Learning Endpoints

### POST /api/enrollments
Enroll in a course.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "courseId": 45,
  "paymentMethod": "stripe",
  "paymentToken": "tok_1234567890"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "enrollmentId": 789,
    "courseId": 45,
    "userId": 123,
    "status": "ACTIVE",
    "progress": 0,
    "enrolledAt": "2025-08-10T15:30:00Z",
    "accessExpiry": "2025-08-10T15:30:00Z"
  },
  "message": "Successfully enrolled in course"
}
```

### GET /api/enrollments
Get user's enrolled courses.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status`: Filter by status (`ACTIVE` | `COMPLETED` | `PAUSED`)
- `page`: Page number
- `limit`: Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": 789,
        "course": {
          "id": 45,
          "title": "Complete JavaScript Course",
          "thumbnail": "https://api.skillup.com/course-thumbnails/45.jpg",
          "instructor": {
            "name": "Jane Smith"
          }
        },
        "progress": 75,
        "status": "ACTIVE",
        "completedLessons": 18,
        "totalLessons": 25,
        "lastAccessed": "2025-08-09T16:30:00Z",
        "enrolledAt": "2025-02-10T10:00:00Z",
        "estimatedCompletion": "2025-08-20T00:00:00Z"
      }
    ],
    "stats": {
      "totalEnrolled": 5,
      "completed": 2,
      "inProgress": 3,
      "totalLearningHours": 45.5
    }
  }
}
```

### GET /api/enrollments/:courseId/progress
Get detailed progress for a specific course.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "courseId": 45,
    "enrollmentId": 789,
    "overallProgress": 75,
    "completedLessons": 18,
    "totalLessons": 25,
    "timeSpent": 1800,
    "lastAccessed": "2025-08-09T16:30:00Z",
    "moduleProgress": [
      {
        "moduleId": 1,
        "title": "Introduction to JavaScript",
        "progress": 100,
        "completedLessons": 5,
        "totalLessons": 5
      },
      {
        "moduleId": 2,
        "title": "JavaScript Fundamentals",
        "progress": 60,
        "completedLessons": 3,
        "totalLessons": 5
      }
    ],
    "completedQuizzes": [
      {
        "quizId": 1,
        "title": "Variables Quiz",
        "score": 85,
        "completedAt": "2025-08-05T14:20:00Z"
      }
    ],
    "certificates": [
      {
        "id": 1,
        "title": "JavaScript Fundamentals Certificate",
        "earnedAt": "2025-08-09T16:30:00Z",
        "downloadUrl": "https://api.skillup.com/certificates/1.pdf"
      }
    ]
  }
}
```

### PUT /api/enrollments/:courseId/progress
Update lesson progress.

**Request Body:**
```json
{
  "lessonId": 3,
  "completed": true,
  "timeSpent": 300,
  "notes": "Great lesson on variables!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "lessonId": 3,
    "completed": true,
    "timeSpent": 300,
    "overallProgress": 80
  },
  "message": "Progress updated successfully"
}
```

## 👤 User Profile Endpoints

### GET /api/users/profile
Get current user's profile.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "STUDENT",
    "avatar": "https://api.skillup.com/avatars/123.jpg",
    "bio": "Passionate learner interested in web development",
    "location": "New York, USA",
    "website": "https://johndoe.dev",
    "socialLinks": {
      "linkedin": "https://linkedin.com/in/johndoe",
      "github": "https://github.com/johndoe",
      "twitter": "https://twitter.com/johndoe"
    },
    "preferences": {
      "language": "en",
      "timezone": "America/New_York",
      "emailNotifications": true,
      "pushNotifications": false
    },
    "stats": {
      "enrolledCourses": 5,
      "completedCourses": 2,
      "certificatesEarned": 2,
      "totalLearningHours": 45.5,
      "streak": 7
    },
    "achievements": [
      {
        "id": 1,
        "title": "First Course Completed",
        "description": "Completed your first course",
        "icon": "trophy",
        "earnedAt": "2025-03-15T10:00:00Z"
      }
    ],
    "createdAt": "2025-01-15T08:30:00Z",
    "lastLogin": "2025-08-10T14:20:00Z"
  }
}
```

### PUT /api/users/profile
Update user profile.

**Request Body:**
```json
{
  "name": "John Smith",
  "bio": "Full-stack developer passionate about learning new technologies",
  "location": "San Francisco, CA",
  "website": "https://johnsmith.dev",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/johnsmith",
    "github": "https://github.com/johnsmith"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "John Smith",
    "bio": "Full-stack developer passionate about learning new technologies",
    "updatedAt": "2025-08-10T15:45:00Z"
  },
  "message": "Profile updated successfully"
}
```

### POST /api/users/avatar
Upload user avatar.

**Headers:**
```
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data
```

**Request Body:**
```
avatar: [image file]
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "avatarUrl": "https://api.skillup.com/avatars/123.jpg"
  },
  "message": "Avatar updated successfully"
}
```

## 📊 Dashboard Endpoints

### GET /api/dashboard/stats
Get student dashboard statistics.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "enrolledCourses": 5,
    "completedCourses": 2,
    "inProgressCourses": 3,
    "totalLearningHours": 45.5,
    "certificatesEarned": 2,
    "currentStreak": 7,
    "longestStreak": 15,
    "weeklyGoal": {
      "target": 10,
      "completed": 7
    },
    "recentActivity": [
      {
        "id": 1,
        "type": "LESSON_COMPLETED",
        "description": "Completed 'Variables and Data Types' in JavaScript Course",
        "courseTitle": "Complete JavaScript Course",
        "timestamp": "2025-08-10T10:30:00Z"
      },
      {
        "id": 2,
        "type": "QUIZ_PASSED",
        "description": "Passed 'Variables Quiz' with score 85%",
        "courseTitle": "Complete JavaScript Course",
        "timestamp": "2025-08-09T16:20:00Z"
      }
    ],
    "upcomingDeadlines": [
      {
        "courseId": 45,
        "courseTitle": "Complete JavaScript Course",
        "assignmentTitle": "Build a Todo App",
        "dueDate": "2025-08-15T23:59:59Z"
      }
    ],
    "recommendedCourses": [
      {
        "id": 67,
        "title": "Advanced React Development",
        "thumbnail": "https://api.skillup.com/course-thumbnails/67.jpg",
        "reason": "Based on your JavaScript progress"
      }
    ]
  }
}
```

## 💬 Reviews & Ratings Endpoints

### POST /api/courses/:courseId/reviews
Submit a course review.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent course! Very well structured and the instructor explains concepts clearly."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "reviewId": 456,
    "courseId": 45,
    "rating": 5,
    "comment": "Excellent course! Very well structured and the instructor explains concepts clearly.",
    "createdAt": "2025-08-10T15:30:00Z"
  },
  "message": "Review submitted successfully"
}
```

### PUT /api/courses/:courseId/reviews/:reviewId
Update a course review.

**Request Body:**
```json
{
  "rating": 4,
  "comment": "Updated review: Great course with minor improvements needed in some areas."
}
```

### DELETE /api/courses/:courseId/reviews/:reviewId
Delete a course review.

**Response (200 OK):**
```json
{
  "success": true,
  "data": null,
  "message": "Review deleted successfully"
}
```

### POST /api/reviews/:reviewId/helpful
Mark a review as helpful.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "reviewId": 456,
    "helpful": true,
    "helpfulCount": 16
  }
}
```

## 🔍 Search Endpoints

### GET /api/search
Global search across courses, instructors, and content.

**Query Parameters:**
- `q`: Search query
- `type`: Search type (`courses` | `instructors` | `all`)
- `page`: Page number
- `limit`: Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "query": "javascript",
    "results": {
      "courses": [
        {
          "id": 45,
          "title": "Complete JavaScript Course",
          "description": "Learn JavaScript from beginner to advanced...",
          "thumbnail": "https://api.skillup.com/course-thumbnails/45.jpg",
          "instructor": {
            "name": "Jane Smith"
          },
          "rating": 4.8,
          "price": 79.99,
          "relevanceScore": 0.95
        }
      ],
      "instructors": [
        {
          "id": 67,
          "name": "Jane Smith",
          "title": "JavaScript Expert",
          "avatar": "https://api.skillup.com/avatars/67.jpg",
          "totalCourses": 12,
          "totalStudents": 15000,
          "relevanceScore": 0.87
        }
      ]
    },
    "pagination": {
      "currentPage": 1,
      "totalResults": 25
    },
    "suggestions": [
      "JavaScript fundamentals",
      "JavaScript ES6",
      "JavaScript frameworks"
    ]
  }
}
```

## 📱 Mobile App Endpoints

### GET /api/mobile/app-config
Get mobile app configuration.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "version": "1.2.0",
    "minVersion": "1.0.0",
    "updateRequired": false,
    "features": {
      "offlineDownloads": true,
      "pushNotifications": true,
      "darkMode": true
    },
    "endpoints": {
      "videoStreaming": "https://video.skillup.com",
      "fileDownloads": "https://downloads.skillup.com"
    }
  }
}
```

### POST /api/mobile/sync
Sync offline progress with server.

**Request Body:**
```json
{
  "progressData": [
    {
      "courseId": 45,
      "lessonId": 3,
      "completed": true,
      "timeSpent": 300,
      "timestamp": "2025-08-10T10:30:00Z"
    }
  ]
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
| `ALREADY_EXISTS` | Resource already exists | 409 |
| `SERVER_ERROR` | Internal server error | 500 |
| `RATE_LIMITED` | Too many requests | 429 |

### Error Response Format
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "errors": [
    {
      "code": "VALIDATION_ERROR",
      "field": "email",
      "message": "Email is required"
    }
  ],
  "timestamp": "2025-08-10T15:30:00Z"
}
```

## 🔄 Rate Limiting

The API implements rate limiting:

- **Authentication endpoints**: 5 requests per minute
- **Search endpoints**: 20 requests per minute
- **General endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute

## 📊 Pagination

Standard pagination format:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔐 Security Considerations

### Authentication Security
- JWT tokens expire after 24 hours
- Refresh tokens for extended sessions
- Secure token storage in httpOnly cookies

### Data Validation
- All inputs validated and sanitized
- File upload restrictions (type, size)
- SQL injection prevention
- XSS protection

## 📋 Request Examples

### cURL Examples

**Register User:**
```bash
curl -X POST https://api.skillup.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "STUDENT"
  }'
```

**Get Courses:**
```bash
curl -X GET "https://api.skillup.com/api/courses?category=Programming&limit=10" \
  -H "Accept: application/json"
```

**Enroll in Course:**
```bash
curl -X POST https://api.skillup.com/api/enrollments \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"courseId": 45}'
```

**Update Progress:**
```bash
curl -X PUT https://api.skillup.com/api/enrollments/45/progress \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": 3,
    "completed": true,
    "timeSpent": 300
  }'
```

---

## 📞 Support

For API support and questions:
- **Email**: api-support@skillup.com
- **Documentation**: https://docs.skillup.com
- **Developer Portal**: https://developers.skillup.com

Last updated: August 10, 2025