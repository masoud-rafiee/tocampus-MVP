# ToCampus MVP - API Documentation

## Base URL
- **Development:** `http://localhost:3001/api`
- **Production:** `https://your-railway-domain.railway.app/api`

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## 1. Authentication Endpoints

### 1.1 Register User
**POST** `/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "student@ubishops.ca",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "universityId": "uuid (optional)",
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
    "role": "STUDENT"
  }
}
```

**Error Responses:**
- `400 Bad Request` - User already exists
- `500 Internal Server Error` - Server error

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

**Error Responses:**
- `401 Unauthorized` - Invalid credentials

---

### 1.3 Forgot Password (FR2)
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
  "resetToken": "uuid-token (for development only)"
}
```

**Error Responses:**
- `404 Not Found` - User not found

---

### 1.4 Reset Password (FR2)
**POST** `/auth/reset-password`

Resets user password with token.

**Request Body:**
```json
{
  "token": "reset-token-uuid",
  "newPassword": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid or expired token

---

## 2. Events Endpoints

### 2.1 Get All Events
**GET** `/events`

Returns all published events for the user's university.

**Headers:** `Authorization: Bearer <token>` (required)

**Query Parameters:**
- `status` (optional) - Filter by status: `pending` returns unapproved events (admin only)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "universityId": "uuid",
    "creatorId": "uuid",
    "title": "Welcome Fair 2025",
    "description": "Discover clubs and resources at the annual welcome fair.",
    "startTime": "2025-02-05T14:00:00.000Z",
    "endTime": "2025-02-05T16:00:00.000Z",
    "location": "Campus Quad",
    "category": "Social",
    "status": "PUBLISHED",
    "isApproved": true,
    "attendeeCount": 24,
    "creator": {
      "firstName": "Bob",
      "lastName": "Staff"
    }
  }
]
```

---

### 2.2 Get Single Event
**GET** `/events/:id`

Returns detailed information about a specific event.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Event UUID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "universityId": "uuid",
  "creatorId": "uuid",
  "title": "Welcome Fair 2025",
  "description": "Discover clubs and resources...",
  "startTime": "2025-02-05T14:00:00.000Z",
  "endTime": "2025-02-05T16:00:00.000Z",
  "location": "Campus Quad",
  "category": "Social",
  "status": "PUBLISHED",
  "attendeeCount": 24,
  "creator": {
    "firstName": "Bob",
    "lastName": "Staff"
  },
  "attendees": [
    { "firstName": "John", "lastName": "Doe" },
    { "firstName": "Jane", "lastName": "Smith" }
  ]
}
```

**Error Responses:**
- `404 Not Found` - Event not found

---

### 2.3 Create Event
**POST** `/events`

Creates a new event (Staff/Faculty/Admin only).

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "title": "Chess Tournament",
  "description": "Annual campus chess championship",
  "startTime": "2025-03-15T10:00:00.000Z",
  "endTime": "2025-03-15T17:00:00.000Z",
  "location": "Student Center",
  "category": "Competition"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "universityId": "uuid",
  "creatorId": "uuid",
  "title": "Chess Tournament",
  "description": "Annual campus chess championship",
  "startTime": "2025-03-15T10:00:00.000Z",
  "endTime": "2025-03-15T17:00:00.000Z",
  "location": "Student Center",
  "category": "Competition",
  "status": "DRAFT",
  "isApproved": false,
  "rsvpIds": [],
  "createdAt": "2025-01-29T12:00:00.000Z"
}
```

**Error Responses:**
- `403 Forbidden` - Only staff and faculty can create events

---

### 2.4 RSVP to Event
**POST** `/events/:id/rsvp`

Register attendance for an event.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Event UUID

**Request Body (optional):**
```json
{
  "status": "GOING"
}
```

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "eventId": "uuid",
  "status": "GOING",
  "createdAt": "2025-01-29T12:00:00.000Z"
}
```

**Error Responses:**
- `404 Not Found` - Event not found

---

### 2.5 Approve Event (Admin Only)
**POST** `/events/:id/approve`

Approve an event for publication (Admin only).

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Event UUID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Chess Tournament",
  "isApproved": true,
  "status": "PUBLISHED",
  "message": "Event approved successfully"
}
```

**Error Responses:**
- `403 Forbidden` - Only admins can approve events
- `404 Not Found` - Event not found

---

### 2.6 Publish Event (Creator Only)
**POST** `/events/:id/publish`

Publish an approved event (Creator only).

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Event UUID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "title": "Chess Tournament",
  "status": "PUBLISHED",
  "message": "Event published successfully"
}
```

**Error Responses:**
- `400 Bad Request` - Event must be approved first
- `403 Forbidden` - Only the event creator can publish
- `404 Not Found` - Event not found

---

### 2.6 Share Event to Social Media (FR6a, FR6b)
**POST** `/events/:id/share`

Share an event to social media platforms.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Event UUID

**Request Body:**
```json
{
  "platforms": ["TWITTER", "FACEBOOK"]
}
```

**Response (201 Created):**
```json
{
  "message": "Event shared to TWITTER, FACEBOOK",
  "share": {
    "id": "uuid",
    "contentType": "EVENT",
    "contentId": "event-uuid",
    "userId": "user-uuid",
    "platforms": ["TWITTER", "FACEBOOK"],
    "sharedAt": "2025-01-29T12:00:00.000Z",
    "status": "SHARED"
  }
}
```

**Valid Platforms:** `TWITTER`, `FACEBOOK`, `INSTAGRAM`, `LINKEDIN`

**Error Responses:**
- `400 Bad Request` - Invalid or missing platforms
- `404 Not Found` - Event not found

---

## 3. Groups Endpoints

### 3.1 Get All Groups
**GET** `/groups`

Returns all groups for the user's university.

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "universityId": "uuid",
    "name": "Chess Club",
    "description": "For lovers of strategy and fun",
    "category": "Recreation",
    "memberCount": 18,
    "createdAt": "2025-01-15T10:00:00.000Z"
  }
]
```

---

### 3.2 Create Group
**POST** `/groups`

Creates a new group (Staff/Faculty/Admin only).

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "name": "Photography Club",
  "description": "Capture moments, share perspectives",
  "category": "Arts"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "universityId": "uuid",
  "name": "Photography Club",
  "description": "Capture moments, share perspectives",
  "category": "Arts",
  "membershipIds": ["uuid"],
  "createdAt": "2025-01-29T12:00:00.000Z"
}
```

---

### 3.3 Join Group
**POST** `/groups/:id/join`

Join a group as a member.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Group UUID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "groupId": "uuid",
  "role": "MEMBER",
  "joinedAt": "2025-01-29T12:00:00.000Z"
}
```

---

### 3.4 Leave Group
**DELETE** `/groups/:id/leave`

Leave a group.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Group UUID

**Response (200 OK):**
```json
{
  "message": "Successfully left the group"
}
```

**Error Responses:**
- `400 Bad Request` - Not a member of this group
- `404 Not Found` - Group not found

---

## 4. Announcements Endpoints

### 4.1 Get All Announcements
**GET** `/announcements`

Returns all announcements for the user's university (sorted by newest first).

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "universityId": "uuid",
    "authorId": "uuid",
    "title": "Library Extended Hours",
    "content": "The library will be open 24/7 during finals week.",
    "scope": "GLOBAL",
    "groupId": null,
    "likeCount": 45,
    "commentCount": 8,
    "author": {
      "firstName": "Bob",
      "lastName": "Staff"
    },
    "createdAt": "2025-01-29T10:00:00.000Z"
  }
]
```

---

### 4.2 Post Announcement
**POST** `/announcements`

Creates a new announcement (Staff/Faculty/Admin only).

**Headers:** `Authorization: Bearer <token>` (required)

**Request Body:**
```json
{
  "title": "Campus Closure Notice",
  "content": "The campus will be closed on Monday for maintenance.",
  "scope": "GLOBAL",
  "groupId": null
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "universityId": "uuid",
  "authorId": "uuid",
  "title": "Campus Closure Notice",
  "content": "The campus will be closed on Monday for maintenance.",
  "scope": "GLOBAL",
  "groupId": null,
  "commentIds": [],
  "likeUserIds": [],
  "createdAt": "2025-01-29T12:00:00.000Z"
}
```

---

### 4.3 Like/Unlike Announcement
**POST** `/announcements/:id/like`

Toggle like status for an announcement.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Announcement UUID

**Response (200 OK):**
```json
{
  "likeCount": 46
}
```

---

### 4.4 Add Comment
**POST** `/announcements/:id/comments`

Add a comment to an announcement.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Announcement UUID

**Request Body:**
```json
{
  "content": "This is great news!"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "announcementId": "uuid",
  "authorId": "uuid",
  "content": "This is great news!",
  "createdAt": "2025-01-29T12:00:00.000Z"
}
```

---

### 4.5 Share Announcement to Social Media (FR6a, FR6b)
**POST** `/announcements/:id/share`

Share an announcement to social media platforms.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Announcement UUID

**Request Body:**
```json
{
  "platforms": ["TWITTER", "LINKEDIN"]
}
```

**Response (201 Created):**
```json
{
  "message": "Announcement shared to TWITTER, LINKEDIN",
  "share": {
    "id": "uuid",
    "contentType": "ANNOUNCEMENT",
    "contentId": "announcement-uuid",
    "userId": "user-uuid",
    "platforms": ["TWITTER", "LINKEDIN"],
    "sharedAt": "2025-01-29T12:00:00.000Z",
    "status": "SHARED"
  }
}
```

**Valid Platforms:** `TWITTER`, `FACEBOOK`, `INSTAGRAM`, `LINKEDIN`

---

## 5. Social Media Endpoints

### 5.1 Get User's Social Shares
**GET** `/social/shares`

Returns all social media shares made by the authenticated user.

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "contentType": "EVENT",
    "contentId": "event-uuid",
    "userId": "user-uuid",
    "platforms": ["TWITTER", "FACEBOOK"],
    "sharedAt": "2025-01-29T12:00:00.000Z",
    "status": "SHARED"
  }
]
```

---

## 6. Notifications Endpoints

### 5.1 Get User Notifications
**GET** `/notifications`

Returns all notifications for the authenticated user.

**Headers:** `Authorization: Bearer <token>` (required)

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "type": "EVENT_REMINDER",
    "title": "Event Tomorrow",
    "message": "Welcome Fair 2025 starts in 24 hours",
    "isRead": false,
    "createdAt": "2025-01-28T12:00:00.000Z"
  }
]
```

---

### 6.2 Mark Notification as Read
**PATCH** `/notifications/:id/read`

Mark a notification as read.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Notification UUID

**Response (200 OK):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "type": "EVENT_REMINDER",
  "title": "Event Tomorrow",
  "message": "Welcome Fair 2025 starts in 24 hours",
  "isRead": true,
  "createdAt": "2025-01-28T12:00:00.000Z"
}
```

---

## 7. Search Endpoints

### 7.1 Global Search
**GET** `/search`

Search across events, groups, and announcements.

**Headers:** `Authorization: Bearer <token>` (required)

**Query Parameters:**
- `q` (required) - Search query (minimum 2 characters)
- `type` (optional) - Filter by type: `events`, `groups`, `announcements`, or `all` (default)

**Example:** `/api/search?q=chess&type=all`

**Response (200 OK):**
```json
{
  "events": [
    {
      "id": "uuid",
      "title": "Chess Tournament",
      "description": "Annual campus chess championship...",
      "category": "Competition",
      "startTime": "2025-03-15T10:00:00.000Z",
      "type": "event"
    }
  ],
  "groups": [
    {
      "id": "uuid",
      "name": "Chess Club",
      "description": "Weekly meetings for chess enthusiasts...",
      "category": "Recreation",
      "memberCount": 47,
      "type": "group"
    }
  ],
  "announcements": [
    {
      "id": "uuid",
      "title": "Chess Club Meeting Cancelled",
      "content": "Due to weather conditions...",
      "createdAt": "2025-01-29T12:00:00.000Z",
      "type": "announcement"
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request` - Search query must be at least 2 characters

---

## 8. Comments Endpoints

### 8.1 Get Comments for Announcement
**GET** `/announcements/:id/comments`

Returns all comments for an announcement.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Announcement UUID

**Response (200 OK):**
```json
[
  {
    "id": "uuid",
    "announcementId": "uuid",
    "authorId": "uuid",
    "content": "Great announcement!",
    "createdAt": "2025-01-29T12:00:00.000Z",
    "author": {
      "id": "uuid",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    }
  }
]
```

**Error Responses:**
- `404 Not Found` - Announcement not found

---

### 8.2 Add Comment to Announcement
**POST** `/announcements/:id/comments`

Add a new comment to an announcement.

**Headers:** `Authorization: Bearer <token>` (required)

**URL Parameters:**
- `id` - Announcement UUID

**Request Body:**
```json
{
  "content": "Great announcement!"
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "announcementId": "uuid",
  "authorId": "uuid",
  "content": "Great announcement!",
  "createdAt": "2025-01-29T12:00:00.000Z",
  "author": {
    "id": "uuid",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT"
  }
}
```

**Error Responses:**
- `404 Not Found` - Announcement not found

---

## 9. Health Check

### 9.1 Health Check
**GET** `/health`

Returns server health status.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-01-29T12:00:00.000Z"
}
```

---

## Error Response Format

All error responses follow this format:

```json
{
  "error": "Error message describing the issue"
}
```

**Common HTTP Status Codes:**
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Enums

### User Roles
- `STUDENT` - Regular student
- `STAFF` - University staff
- `FACULTY` - Faculty member
- `ADMIN` - Administrator

### Event Status
- `DRAFT` - Created, awaiting approval
- `PUBLISHED` - Approved and visible
- `CANCELLED` - Event cancelled

### Announcement Scope
- `GLOBAL` - Visible to all university users
- `GROUP` - Visible only to group members

### Notification Types
- `EVENT_REMINDER` - Upcoming event alert
- `NEW_ANNOUNCEMENT` - New announcement posted
- `ANNOUNCEMENT` - Global announcement notification
- `GROUP_ANNOUNCEMENT` - Group-specific announcement
- `RSVP_CONFIRMATION` - RSVP confirmed
- `EVENT_APPROVED` - Event approved by admin
- `GROUP_JOIN` - New member joined group
- `GROUP_LEAVE` - Member left group

---

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@ubishops.ca | password123 |
| Staff | staff@ubishops.ca | password123 |
| Student | student@ubishops.ca | password123 |

---

## Rate Limits
Currently no rate limiting in MVP. Production will implement:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user
