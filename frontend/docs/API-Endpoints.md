# API Endpoints

## 🔌 Overview

The Liberia Digital Insights API provides comprehensive RESTful endpoints for managing content, users, events, and platform features. This document outlines all available endpoints, their parameters, and response formats.

## 🌐 Base URL

```
Development: http://localhost:5000/api/v1
Production: https://liberia-digital-insights.vercel.app/api/v1
```

## 📝 API Standards

### Request Format
- **Content-Type**: `application/json`
- **Accept**: `application/json`
- **Authentication**: Bearer token (JWT) for protected endpoints

### Response Format

```javascript
// Success Response
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}

// Paginated Response
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🔐 Authentication Endpoints

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe",
      "first_name": "John",
      "last_name": "Doe",
      "role": "user",
      "avatar": "https://example.com/avatar.jpg"
    },
    "access_token": "jwt_access_token",
    "refresh_token": "jwt_refresh_token"
  }
}
```

### Register
```http
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe"
}
```

### Refresh Token
```http
POST /auth/refresh
```

**Request Body:**
```json
{
  "refresh_token": "jwt_refresh_token"
}

### Logout
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

### Forgot Password
```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "user@example.com"
}

### Reset Password
```http
POST /auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewPassword123!"
}

## 📰 Articles Endpoints

### Get Articles
```http
GET /articles?page=1&limit=20&category=tech&status=published&search=react
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `category` (string): Filter by category
- `status` (string): Filter by status (published, draft, archived)
- `search` (string): Search term
- `author` (string): Filter by author ID
- `tags` (string): Comma-separated tags

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Getting Started with React",
        "slug": "getting-started-with-react",
        "excerpt": "Learn the basics of React...",
        "content": "Full article content...",
        "featured_image": "https://example.com/image.jpg",
        "author": {
          "id": "uuid",
          "name": "John Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "category": {
          "id": "uuid",
          "name": "Technology",
          "slug": "tech"
        },
        "tags": ["react", "javascript", "frontend"],
        "status": "published",
        "published_at": "2024-01-15T10:30:00Z",
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "views": 1250,
        "likes": 45
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Get Article by ID
```http
GET /articles/{id}
```

### Get Article by Slug
```http
GET /articles/slug/{slug}
```

### Create Article
```http
POST /articles
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "title": "New Article Title",
  "content": "Article content...",
  "excerpt": "Article excerpt...",
  "featured_image": "https://example.com/image.jpg",
  "category_id": "uuid",
  "tags": ["tag1", "tag2"],
  "status": "draft"
}
```

### Update Article
```http
PUT /articles/{id}
Authorization: Bearer {access_token}
```

### Delete Article
```http
DELETE /articles/{id}
Authorization: Bearer {access_token}
```

## 🎧 Podcasts Endpoints

### Get Podcasts
```http
GET /podcasts?page=1&limit=20&category=tech&status=published
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Tech Talk Episode 1",
        "slug": "tech-talk-episode-1",
        "description": "Discussion about latest tech trends...",
        "audio_url": "https://example.com/audio.mp3",
        "duration": 3600,
        "file_size": 52428800,
        "cover_image": "https://example.com/cover.jpg",
        "host": {
          "id": "uuid",
          "name": "Jane Doe",
          "avatar": "https://example.com/avatar.jpg"
        },
        "guests": [
          {
            "id": "uuid",
            "name": "John Smith",
            "bio": "Tech expert...",
            "avatar": "https://example.com/guest-avatar.jpg"
          }
        ],
        "category": {
          "id": "uuid",
          "name": "Technology",
          "slug": "tech"
        },
        "tags": ["tech", "innovation", "trends"],
        "status": "published",
        "published_at": "2024-01-15T10:30:00Z",
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z",
        "plays": 1250,
        "downloads": 450,
        "likes": 67
      }
    ]
  }
}
```

### Create Podcast
```http
POST /podcasts
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "title": "New Podcast Episode",
  "description": "Episode description...",
  "audio_url": "https://example.com/audio.mp3",
  "duration": 3600,
  "cover_image": "https://example.com/cover.jpg",
  "category_id": "uuid",
  "guest_ids": ["uuid1", "uuid2"],
  "tags": ["tech", "innovation"],
  "status": "draft"
}
```

## 📅 Events Endpoints

### Get Events
```http
GET /events?page=1&limit=20&status=upcoming&category=meetup&search=tech
```

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page
- `status` (string): upcoming, past, cancelled
- `category` (string): Event category
- `search` (string): Search term
- `start_date` (string): Filter by start date (YYYY-MM-DD)
- `end_date` (string): Filter by end date (YYYY-MM-DD)

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Tech Meetup Monrovia",
        "slug": "tech-meetup-monrovia",
        "description": "Monthly tech meetup...",
        "banner_image": "https://example.com/banner.jpg",
        "start_date": "2024-02-15T18:00:00Z",
        "end_date": "2024-02-15T20:00:00Z",
        "location": {
          "venue": "Innovation Hub",
          "address": "123 Tech Street, Monrovia",
          "city": "Monrovia",
          "country": "Liberia",
          "coordinates": {
            "lat": 6.2903,
            "lng": -10.7606
          }
        },
        "organizer": {
          "id": "uuid",
          "name": "Tech Community Liberia",
          "logo": "https://example.com/logo.jpg"
        },
        "category": {
          "id": "uuid",
          "name": "Meetup",
          "slug": "meetup"
        },
        "capacity": 100,
        "registered_count": 75,
        "price": {
          "amount": 0,
          "currency": "USD",
          "type": "free"
        },
        "status": "upcoming",
        "registration_deadline": "2024-02-14T23:59:59Z",
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Register for Event
```http
POST /events/{id}/register
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "+231-xxx-xxxx",
  "company": "Tech Solutions",
  "notes": "Looking forward to attending"
}
```

## 🎓 Training Courses Endpoints

### Get Courses
```http
GET /training/courses?page=1&limit=20&category=web-dev&level=beginner&status=active
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Web Development Bootcamp",
        "slug": "web-development-bootcamp",
        "description": "Learn modern web development...",
        "thumbnail": "https://example.com/thumbnail.jpg",
        "instructor": {
          "id": "uuid",
          "name": "Jane Doe",
          "bio": "Senior Developer...",
          "avatar": "https://example.com/instructor.jpg"
        },
        "category": {
          "id": "uuid",
          "name": "Web Development",
          "slug": "web-dev"
        },
        "level": "beginner",
        "duration": 120,
        "lessons_count": 24,
        "price": {
          "amount": 99.99,
          "currency": "USD",
          "type": "paid"
        },
        "rating": 4.8,
        "enrollments_count": 1250,
        "status": "active",
        "created_at": "2024-01-10T00:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Enroll in Course
```http
POST /training/courses/{id}/enroll
Authorization: Bearer {access_token}
```

### Get Course Progress
```http
GET /training/courses/{id}/progress
Authorization: Bearer {access_token}
```

## 👥 Talent Directory Endpoints

### Get Talent Profiles
```http
GET /talents?page=1&limit=20&skills=react&location=monrovia&availability=job_seeking
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "first_name": "John",
        "last_name": "Doe",
        "professional_title": "Full Stack Developer",
        "bio": "Passionate developer with 5+ years experience...",
        "avatar": "https://example.com/avatar.jpg",
        "location": {
          "city": "Monrovia",
          "country": "Liberia",
          "remote_work": true
        },
        "skills": [
          {
            "name": "JavaScript",
            "level": "expert",
            "years_experience": 5,
            "verified": true
          }
        ],
        "availability": {
          "job_seeking": true,
          "freelance": true
        },
        "stats": {
          "profile_views": 1250,
          "endorsements": 67
        },
        "verification_status": {
          "identity_verified": true
        }
      }
    ]
  }
}
```

### Search Talent
```http
POST /talents/search
```

**Request Body:**
```json
{
  "keyword": "react developer",
  "skills": ["react", "node.js"],
  "location": "Monrovia",
  "availability": ["job_seeking"],
  "experience_level": ["senior", "mid"]
}
```

## 📧 Newsletter Endpoints

### Get Newsletters
```http
GET /newsletters?page=1&limit=20&status=sent
Authorization: Bearer {access_token}
```

### Create Newsletter
```http
POST /newsletters
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "title": "Monthly Tech Newsletter",
  "subject": "Latest Tech Trends & Opportunities",
  "content": {
    "header": {
      "logo_url": "https://example.com/logo.png",
      "tagline": "Empowering Liberia's Digital Future"
    },
    "sections": [...],
    "footer": {...}
  },
  "segments": ["all_subscribers"],
  "scheduled_at": "2024-01-20T09:00:00Z"
}
```

### Send Newsletter
```http
POST /newsletters/{id}/send
Authorization: Bearer {access_token}
```

### Get Newsletter Analytics
```http
GET /newsletters/{id}/analytics?range=7d
Authorization: Bearer {access_token}
```

## 🖼️ Gallery Endpoints

### Get Gallery Items
```http
GET /gallery?page=1&limit=20&type=event&category=tech
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "uuid",
        "title": "Tech Meetup Photos",
        "description": "Photos from our monthly tech meetup...",
        "type": "event",
        "images": [
          {
            "url": "https://example.com/image1.jpg",
            "thumbnail": "https://example.com/thumb1.jpg",
            "caption": "Group photo",
            "alt_text": "Tech meetup group photo"
          }
        ],
        "event": {
          "id": "uuid",
          "title": "Tech Meetup Monrovia",
          "date": "2024-01-15T18:00:00Z"
        },
        "category": {
          "id": "uuid",
          "name": "Technology",
          "slug": "tech"
        },
        "created_by": {
          "id": "uuid",
          "name": "John Doe"
        },
        "created_at": "2024-01-16T00:00:00Z",
        "updated_at": "2024-01-16T00:00:00Z"
      }
    ]
  }
}
```

## 📁 File Upload Endpoints

### Upload File
```http
POST /upload
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [binary file data]
type: image|audio|video|document
```

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://example.com/uploads/image.jpg",
    "filename": "image.jpg",
    "size": 524288,
    "type": "image",
    "mime_type": "image/jpeg"
  }
}
```

## 📊 Analytics Endpoints

### Get Dashboard Analytics
```http
GET /analytics/dashboard
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total_users": 1250,
      "total_articles": 150,
      "total_events": 25,
      "total_courses": 12
    },
    "growth": {
      "users_growth": 15.5,
      "articles_growth": 8.2,
      "events_growth": 20.0,
      "courses_growth": 12.5
    },
    "popular_content": [
      {
        "type": "article",
        "title": "Getting Started with React",
        "views": 1250,
        "likes": 45
      }
    ]
  }
}
```

## 🏷️ Categories Endpoints

### Get Categories
```http
GET /categories?type=articles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Technology",
      "slug": "tech",
      "description": "Technology related content",
      "type": "articles",
      "icon": "https://example.com/icon.svg",
      "color": "#3B82F6",
      "items_count": 150,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## 🔍 Search Endpoint

### Global Search
```http
GET /search?q=react&type=articles,podcasts&page=1&limit=20
```

**Query Parameters:**
- `q` (string): Search query (required)
- `type` (string): Content types to search (comma-separated)
- `page` (number): Page number
- `limit` (number): Results per page

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "article",
        "id": "uuid",
        "title": "Getting Started with React",
        "excerpt": "Learn the basics of React...",
        "url": "/articles/getting-started-with-react",
        "relevance_score": 0.95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45
    }
  }
}
```

## 📋 System Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "1.0.0",
    "environment": "production",
    "services": {
      "database": "connected",
      "redis": "connected",
      "storage": "connected"
    }
  }
}
```

### System Info
```http
GET /system/info
Authorization: Bearer {access_token}
```

## 📝 Response Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request successful, no content returned |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## 🔄 Rate Limiting

- **General Endpoints**: 100 requests per minute
- **Authentication**: 5 requests per minute per IP
- **Upload**: 10 requests per minute per user
- **Search**: 30 requests per minute per user

## 📚 SDK Examples

### JavaScript/Node.js
```javascript
// Using fetch API
const response = await fetch('/api/v1/articles', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();

// Using axios
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Python
```python
import requests

# Base configuration
BASE_URL = 'http://localhost:5000/api/v1'
headers = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {token}'
}

# GET request
response = requests.get(f'{BASE_URL}/articles', headers=headers)
data = response.json()

# POST request
article_data = {
    'title': 'New Article',
    'content': 'Article content...'
}
response = requests.post(
    f'{BASE_URL}/articles',
    json=article_data,
    headers=headers
)
```

This API provides comprehensive endpoints for all Liberia Digital Insights platform features with proper authentication, pagination, and error handling.