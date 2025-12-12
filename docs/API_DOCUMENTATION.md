# ToCampus API Documentation v3.0

## Overview
ToCampus API v3.0 implements the complete SRS v3.0 specification for a University Social & Event Platform. This is a **production-ready** API with 48 RESTful endpoints.

## Base URL
- **Development:** `http://localhost:3001/api`
- **Production:** `https://your-railway-domain.railway.app/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

Tokens are valid for 7 days and use HS256 signing.

---

## API Endpoints Summary

| Category | Endpoints |
|----------|-----------|
| Authentication | 4 endpoints |
| User Profiles | 4 endpoints |
| Social Graph | 5 endpoints |
| Events | 6 endpoints |
| Groups | 5 endpoints |
| Announcements | 5 endpoints |
| Marketplace | 6 endpoints |
| Recommendations | 4 endpoints |
| Chatbot | 3 endpoints |
| Notifications | 2 endpoints |
| Preferences | 2 endpoints |
| Admin | 2 endpoints |
| **Total** | **48 endpoints** |

---

## 1. Authentication Endpoints (FR1-FR4)

### 1.1 Register User
**POST** `/auth/register`

Creates a new user account with university email validation.

**Request Body:**
```json
{
  "email": "student@ubishops.ca",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "student@ubishops.ca",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "program": null,
    "yearOfStudy": null,
    "interests": [],
    "followerCount": 0,
    "followingCount": 0
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email format or user already exists
- `400 Bad Request` - Password must be at least 6 characters

---

### 1.2 Login
**POST** `/auth/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "student@ubishops.ca",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "student@ubishops.ca",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

---

### 1.3 Forgot Password
**POST** `/auth/forgot-password`

Initiates password reset process.

**Request Body:**
```json
{
  "email": "student@ubishops.ca"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset email sent",
  "resetToken": "123456"
}
```

---

### 1.4 Reset Password
**POST** `/auth/reset-password`

Completes password reset with token.

**Request Body:**
```json
{
  "email": "student@ubishops.ca",
  "token": "123456",
  "newPassword": "newpassword123"
}
```

---

## 2. User Profiles (FR28-FR33)

### 2.1 Get User Profile
**GET** `/users/:id`

Retrieves a user's public profile. Fields returned depend on privacy settings.

**Response (200 OK):**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "bio": "Computer science student passionate about AI",
  "program": "Computer Science",
  "yearOfStudy": 3,
  "interests": ["tech", "gaming", "coffee"],
  "avatarUrl": null,
  "followerCount": 42,
  "followingCount": 67,
  "isFollowing": false,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

---

### 2.2 Update User Profile
**PATCH** `/users/:id`

Updates the authenticated user's profile.

**Request Body:**
```json
{
  "bio": "Updated bio text",
  "program": "Software Engineering",
  "yearOfStudy": 4,
  "interests": ["tech", "music", "sports"],
  "privacySettings": {
    "showEmail": false,
    "showProgram": true,
    "profileVisibility": "university"
  }
}
```

**Allowed Fields:**
- `firstName`, `lastName`, `bio`, `program`, `yearOfStudy`
- `interests` (array of strings)
- `classes` (array of strings)
- `socialLinks` (object)
- `avatarUrl`
- `privacySettings`

---

## 3. Social Graph (FR34-FR36)

### 3.1 Follow User
**POST** `/users/:id/follow`

Follow another user.

**Response (201 Created):**
```json
{
  "message": "Now following John Doe",
  "followingCount": 68
}
```

---

### 3.2 Unfollow User
**DELETE** `/users/:id/follow`

Unfollow a user.

**Response (200 OK):**
```json
{
  "message": "Unfollowed successfully",
  "followingCount": 67
}
```

---

### 3.3 Get Followers
**GET** `/users/:id/followers?page=1&limit=20`

Get paginated list of followers.

**Response:**
```json
{
  "followers": [
    {
      "id": "uuid",
      "firstName": "Jane",
      "lastName": "Smith",
      "avatarUrl": null,
      "program": "Business",
      "followedAt": "2024-01-10T08:00:00.000Z"
    }
  ],
  "totalCount": 42,
  "page": 1,
  "limit": 20
}
```

---

### 3.4 Get Following
**GET** `/users/:id/following?page=1&limit=20`

Get paginated list of users being followed.

---

### 3.5 Get Mutual Friends
**GET** `/users/:id/mutual-friends`

Find mutual connections between authenticated user and target user.

**Response:**
```json
{
  "mutualFriends": [
    {
      "id": "uuid",
      "firstName": "Alex",
      "lastName": "Johnson",
      "avatarUrl": null,
      "program": "Psychology"
    }
  ],
  "count": 5
}
```

---

## 4. Events (FR5-FR7)

### 4.1 List Events
**GET** `/events?category=Social&status=PUBLISHED`

Get all events for the user's university.

**Query Parameters:**
- `category` - Filter by category (Social, Academic, Sports, etc.)
- `status` - Filter by status (DRAFT, PUBLISHED)

---

### 4.2 Get Event Details
**GET** `/events/:id`

Get detailed information about a specific event.

---

### 4.3 Create Event
**POST** `/events`

Create a new event. Requires STAFF, FACULTY, or ADMIN role.

**Request Body:**
```json
{
  "title": "Tech Talk: AI in Education",
  "description": "Join us for an insightful discussion...",
  "startTime": "2024-03-15T14:00:00.000Z",
  "endTime": "2024-03-15T16:00:00.000Z",
  "location": "Science Building, Room 101",
  "category": "Academic"
}
```

---

### 4.4 RSVP to Event
**POST** `/events/:id/rsvp`

RSVP to an event.

**Request Body:**
```json
{
  "status": "GOING"
}
```

---

### 4.5 Cancel RSVP
**DELETE** `/events/:id/rsvp`

Remove RSVP from an event.

---

### 4.6 Approve Event (Admin)
**POST** `/events/:id/approve`

Approve a pending event. Admin only.

---

## 5. Marketplace (FR37-FR40)

### 5.1 List Marketplace Items
**GET** `/marketplace?category=textbooks&minPrice=10&maxPrice=100&search=calculus`

Get all active listings for the user's university.

**Query Parameters:**
- `category` - textbooks, electronics, furniture, clothing, other
- `minPrice`, `maxPrice` - Price range filter
- `condition` - like_new, excellent, good, fair, poor
- `search` - Search in title and description
- `page`, `limit` - Pagination

**Response:**
```json
{
  "listings": [
    {
      "id": "uuid",
      "title": "Calculus Textbook 8th Edition",
      "description": "Barely used, some highlighting",
      "price": 45.00,
      "currency": "CAD",
      "category": "textbooks",
      "condition": "good",
      "status": "active",
      "pickupLocation": "Library",
      "seller": {
        "id": "uuid",
        "firstName": "John",
        "lastName": "D."
      },
      "createdAt": "2024-01-20T10:00:00.000Z"
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20,
  "categories": ["textbooks", "electronics", "furniture", "clothing", "other"]
}
```

---

### 5.2 Get Listing Details
**GET** `/marketplace/:id`

Get full details of a listing including seller information.

---

### 5.3 Create Listing
**POST** `/marketplace`

Create a new marketplace listing.

**Request Body:**
```json
{
  "title": "Mini Fridge for Dorm",
  "description": "Works perfectly, selling because moving off campus",
  "price": 80.00,
  "category": "furniture",
  "condition": "excellent",
  "pickupLocation": "Residence Hall B"
}
```

---

### 5.4 Update Listing
**PATCH** `/marketplace/:id`

Update an existing listing. Owner or admin only.

---

### 5.5 Delete Listing
**DELETE** `/marketplace/:id`

Remove a listing. Owner or admin only.

---

### 5.6 Message Seller
**POST** `/marketplace/:id/message`

Send a message to the seller about a listing.

**Request Body:**
```json
{
  "message": "Hi! Is this item still available?"
}
```

---

## 6. Recommendations (FR41-FR43)

### 6.1 Get Recommended Events
**GET** `/recommendations/events?limit=10`

Get personalized event recommendations based on interests, social graph, and engagement history.

**Response:**
```json
{
  "recommendations": [
    {
      "id": "uuid",
      "title": "Tech Meetup",
      "description": "Monthly tech community gathering",
      "startTime": "2024-02-01T18:00:00.000Z",
      "category": "Tech",
      "attendeeCount": 45,
      "recommendationScore": 85,
      "matchReasons": ["interestMatch", "socialProof", "recency"]
    }
  ],
  "count": 10
}
```

---

### 6.2 Get Recommended Groups
**GET** `/recommendations/groups?limit=10`

Get personalized group recommendations.

---

### 6.3 Get Personalized Feed
**GET** `/feed?page=1&limit=20`

Get a mixed feed of events and announcements ranked by relevance.

---

### 6.4 Track Interaction
**POST** `/interactions`

Record user interactions to improve recommendations.

**Request Body:**
```json
{
  "contentType": "event",
  "contentId": "uuid",
  "interactionType": "view"
}
```

**Interaction Types:** view, click, rsvp, like, share, bookmark

---

## 7. LLM Chatbot (FR44-FR47)

### 7.1 Create Conversation
**POST** `/chatbot/conversations`

Start a new chatbot conversation.

**Response:**
```json
{
  "conversationId": "uuid"
}
```

---

### 7.2 Send Message
**POST** `/chatbot/conversations/:id/messages`

Send a message and receive AI response.

**Request Body:**
```json
{
  "message": "What events are happening this week?"
}
```

**Response:**
```json
{
  "userMessage": {
    "id": "uuid",
    "content": "What events are happening this week?"
  },
  "botResponse": {
    "id": "uuid",
    "content": "Here are some upcoming events...",
    "suggestions": ["Tell me more about the first event", "Show sports events"],
    "relatedContent": [
      {"type": "event", "id": "uuid", "title": "Welcome Fair"}
    ]
  }
}
```

---

### 7.3 Get Conversation History
**GET** `/chatbot/conversations/:id/messages`

Retrieve all messages in a conversation.

---

## 8. Notifications

### 8.1 Get Notifications
**GET** `/notifications`

Get all notifications for the authenticated user.

---

### 8.2 Mark as Read
**PATCH** `/notifications/:id/read`

Mark a notification as read.

---

## 9. User Preferences (FR32-FR33)

### 9.1 Get Preferences
**GET** `/preferences`

Get user's notification and feed preferences.

**Response:**
```json
{
  "userId": "uuid",
  "notifications": {
    "eventReminders": true,
    "newAnnouncements": true,
    "groupUpdates": true,
    "newFollowers": true,
    "marketplaceMessages": true,
    "recommendationDigest": "weekly"
  },
  "feed": {
    "showRecommended": true,
    "prioritizeFollowing": true
  }
}
```

---

### 9.2 Update Preferences
**PATCH** `/preferences`

Update user preferences.

---

## 10. Admin Endpoints (FR24-FR27)

### 10.1 Get Analytics
**GET** `/admin/analytics`

Get platform analytics. Admin only.

**Response:**
```json
{
  "users": {
    "total": 150,
    "newThisWeek": 12,
    "newThisMonth": 45,
    "byRole": {
      "students": 140,
      "staff": 8,
      "admins": 2
    }
  },
  "events": {
    "total": 25,
    "active": 8,
    "pending": 2,
    "totalRSVPs": 320
  },
  "groups": {
    "total": 15,
    "totalMemberships": 450
  },
  "marketplace": {
    "totalListings": 30,
    "activeListings": 22
  },
  "engagement": {
    "weeklyInteractions": 1250,
    "avgInteractionsPerUser": "8.33"
  }
}
```

---

### 10.2 Get Audit Logs
**GET** `/admin/audit-logs?action=create&resourceType=event&page=1`

Get system audit logs. Admin only.

---

## 11. Search

### 11.1 Global Search
**GET** `/search?q=welcome&type=all`

Search across events, groups, and announcements.

**Query Parameters:**
- `q` - Search query (min 2 characters)
- `type` - events, groups, announcements, or all

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently no rate limiting in development. Production should implement:
- 100 requests/minute for authenticated users
- 20 requests/minute for unauthenticated endpoints

---

## Versioning

API version is included in the root endpoint response:

```json
{
  "name": "ToCampus API",
  "version": "2.0.0",
  "srsVersion": "v3.0 (CS-410 Final)"
}
```
