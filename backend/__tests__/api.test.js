// ToCampus API Tests
// Uses supertest to test Express app directly (no running server needed)

const request = require('supertest');
const { app } = require('../server');

describe('ToCampus API', () => {
  let authToken;
  let staffToken;

  // ============================================
  // Health Check Tests
  // ============================================
  describe('Health Check', () => {
    test('GET /health should return ok status', async () => {
      const res = await request(app).get('/health');
      
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.timestamp).toBeDefined();
    });

    test('GET / should return API info', async () => {
      const res = await request(app).get('/');
      
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('ToCampus API');
      expect(res.body.version).toBe('2.0.0');
      expect(res.body.srsVersion).toBe('v3.0 (CS-410 Final)');
    });
  });

  // ============================================
  // Authentication Tests (FR1, FR2, FR3)
  // ============================================
  describe('Authentication', () => {
    test('POST /api/auth/login with valid credentials should return token', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@ubishops.ca',
          password: 'password123'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('student@ubishops.ca');
      expect(res.body.user.role).toBe('STUDENT');
      
      // Save token for later tests
      authToken = res.body.token;
    });

    test('POST /api/auth/login with invalid credentials should return 401', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@ubishops.ca',
          password: 'wrongpassword'
        });
      
      expect(res.status).toBe(401);
    });

    test('POST /api/auth/register with new user should create account', async () => {
      const uniqueEmail = `test${Date.now()}@ubishops.ca`;
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          email: uniqueEmail,
          password: 'TestPass123!',
          firstName: 'Test',
          lastName: 'User'
        });
      
      expect([200, 201]).toContain(res.status);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe(uniqueEmail);
    });

    test('POST /api/auth/forgot-password should return reset token', async () => {
      const res = await request(app)
        .post('/api/auth/forgot-password')
        .send({
          email: 'student@ubishops.ca'
        });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
    });
  });

  // ============================================
  // Protected Routes (No Token) Tests
  // ============================================
  describe('Protected Routes (No Token)', () => {
    test('GET /api/events without token should return 401', async () => {
      const res = await request(app).get('/api/events');
      expect(res.status).toBe(401);
    });

    test('GET /api/groups without token should return 401', async () => {
      const res = await request(app).get('/api/groups');
      expect(res.status).toBe(401);
    });

    test('GET /api/announcements without token should return 401', async () => {
      const res = await request(app).get('/api/announcements');
      expect(res.status).toBe(401);
    });
  });

  // ============================================
  // Events Tests (FR4, FR5)
  // ============================================
  describe('Events', () => {
    beforeAll(async () => {
      // Get student token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'student@ubishops.ca',
          password: 'password123'
        });
      authToken = res.body.token;
    });

    test('GET /api/events should return events list', async () => {
      const res = await request(app)
        .get('/api/events')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /api/events as student should create event with PENDING status', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Student Test Event',
          description: 'Test Description for student event',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
          location: 'Test Location',
          category: 'Social'
        });
      
      // Students CAN create events - they go to PENDING status for admin approval
      expect(res.status).toBe(201);
      expect(res.body.status).toBe('PENDING');
      expect(res.body.isApproved).toBe(false);
    });
  });

  // ============================================
  // Groups Tests (FR7)
  // ============================================
  describe('Groups', () => {
    test('GET /api/groups should return groups list', async () => {
      const res = await request(app)
        .get('/api/groups')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================
  // Announcements Tests (FR6)
  // ============================================
  describe('Announcements', () => {
    test('GET /api/announcements should return announcements list', async () => {
      const res = await request(app)
        .get('/api/announcements')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================
  // Notifications Tests (FR12)
  // ============================================
  describe('Notifications', () => {
    test('GET /api/notifications should return notifications list', async () => {
      const res = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // ============================================
  // Staff Permissions Tests (FR3)
  // ============================================
  describe('Staff Permissions', () => {
    beforeAll(async () => {
      // Get staff token
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'staff@ubishops.ca',
          password: 'password123'
        });
      staffToken = res.body.token;
    });

    test('POST /api/events as staff should succeed', async () => {
      const res = await request(app)
        .post('/api/events')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          title: 'Staff Test Event',
          description: 'Created by staff in CI test',
          date: new Date(Date.now() + 86400000).toISOString(),
          location: 'Test Hall',
          category: 'ACADEMIC'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Staff Test Event');
    });

    test('POST /api/announcements as staff should succeed', async () => {
      const res = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${staffToken}`)
        .send({
          title: 'Staff Test Announcement',
          content: 'Created by staff in CI test',
          scope: 'GLOBAL'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Staff Test Announcement');
    });
  });

  // ============================================
  // SRS v3.0 NEW FEATURE TESTS
  // ============================================

  // User Profiles (FR28-33)
  describe('User Profiles (FR28-33)', () => {
    test('GET /api/preferences should return user preferences', async () => {
      const res = await request(app)
        .get('/api/preferences')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.notifications).toBeDefined();
    });

    test('PATCH /api/preferences should update preferences', async () => {
      const res = await request(app)
        .patch('/api/preferences')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          notifications: { eventReminders: false }
        });
      
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Preferences updated');
    });
  });

  // Social Graph (FR34-36)
  describe('Social Graph (FR34-36)', () => {
    let targetUserId;

    beforeAll(async () => {
      // Get staff user ID to follow
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: 'staff@ubishops.ca', password: 'password123' });
      
      // Decode JWT to get user ID (simple extraction)
      const tokenPayload = JSON.parse(Buffer.from(loginRes.body.token.split('.')[1], 'base64').toString());
      targetUserId = tokenPayload.userId;
    });

    test('POST /api/users/:id/follow should follow user', async () => {
      const res = await request(app)
        .post(`/api/users/${targetUserId}/follow`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect([201, 400]).toContain(res.status); // 201 if not following, 400 if already following
    });

    test('GET /api/users/:id/followers should return followers list', async () => {
      const res = await request(app)
        .get(`/api/users/${targetUserId}/followers`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.followers).toBeDefined();
      expect(Array.isArray(res.body.followers)).toBe(true);
    });

    test('GET /api/users/:id/following should return following list', async () => {
      const res = await request(app)
        .get(`/api/users/${targetUserId}/following`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.following).toBeDefined();
    });
  });

  // Marketplace (FR37-40)
  describe('Marketplace (FR37-40)', () => {
    let listingId;

    test('GET /api/marketplace should return listings', async () => {
      const res = await request(app)
        .get('/api/marketplace')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.listings).toBeDefined();
      expect(res.body.categories).toContain('textbooks');
    });

    test('POST /api/marketplace should create listing', async () => {
      const res = await request(app)
        .post('/api/marketplace')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Textbook',
          description: 'A test listing',
          price: 25.00,
          category: 'textbooks',
          condition: 'good'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.listing).toBeDefined();
      listingId = res.body.listing.id;
    });

    test('GET /api/marketplace/:id should return listing details', async () => {
      // Use existing listing from sample data
      const listRes = await request(app)
        .get('/api/marketplace')
        .set('Authorization', `Bearer ${authToken}`);
      
      if (listRes.body.listings.length > 0) {
        const res = await request(app)
          .get(`/api/marketplace/${listRes.body.listings[0].id}`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(res.status).toBe(200);
        expect(res.body.title).toBeDefined();
      }
    });

    test('GET /api/marketplace with filters should filter listings', async () => {
      const res = await request(app)
        .get('/api/marketplace?category=textbooks&maxPrice=100')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      if (res.body.listings.length > 0) {
        expect(res.body.listings.every(l => l.category === 'textbooks')).toBe(true);
      }
    });
  });

  // Recommendations (FR41-43)
  describe('Recommendations (FR41-43)', () => {
    test('GET /api/recommendations/events should return recommended events', async () => {
      const res = await request(app)
        .get('/api/recommendations/events')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.recommendations).toBeDefined();
      expect(Array.isArray(res.body.recommendations)).toBe(true);
    });

    test('GET /api/recommendations/groups should return recommended groups', async () => {
      const res = await request(app)
        .get('/api/recommendations/groups')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.recommendations).toBeDefined();
    });

    test('GET /api/feed should return personalized feed', async () => {
      const res = await request(app)
        .get('/api/feed')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.feed).toBeDefined();
    });

    test('POST /api/interactions should track interaction', async () => {
      const res = await request(app)
        .post('/api/interactions')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          contentType: 'event',
          contentId: 'test-id',
          interactionType: 'view'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Interaction recorded');
    });
  });

  // Chatbot (FR44-47)
  describe('LLM Chatbot (FR44-47)', () => {
    let conversationId;

    test('POST /api/chatbot/conversations should create conversation', async () => {
      const res = await request(app)
        .post('/api/chatbot/conversations')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(201);
      expect(res.body.conversationId).toBeDefined();
      conversationId = res.body.conversationId;
    });

    test('POST /api/chatbot/conversations/:id/messages should get bot response', async () => {
      // First create a conversation
      const convRes = await request(app)
        .post('/api/chatbot/conversations')
        .set('Authorization', `Bearer ${authToken}`);
      
      const res = await request(app)
        .post(`/api/chatbot/conversations/${convRes.body.conversationId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'What events are happening?' });
      
      expect(res.status).toBe(200);
      expect(res.body.botResponse).toBeDefined();
      expect(res.body.botResponse.content).toBeDefined();
      expect(res.body.botResponse.suggestions).toBeDefined();
    });

    test('GET /api/chatbot/conversations/:id/messages should return history', async () => {
      // First create a conversation with message
      const convRes = await request(app)
        .post('/api/chatbot/conversations')
        .set('Authorization', `Bearer ${authToken}`);
      
      await request(app)
        .post(`/api/chatbot/conversations/${convRes.body.conversationId}/messages`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ message: 'Hello' });
      
      const res = await request(app)
        .get(`/api/chatbot/conversations/${convRes.body.conversationId}/messages`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.messages).toBeDefined();
      expect(res.body.messages.length).toBeGreaterThan(0);
    });
  });

  // Admin Analytics (FR24-27)
  describe('Admin Analytics (FR24-27)', () => {
    let adminToken;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@ubishops.ca', password: 'password123' });
      adminToken = res.body.token;
    });

    test('GET /api/admin/analytics should return analytics for admin', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.users).toBeDefined();
      expect(res.body.events).toBeDefined();
      expect(res.body.groups).toBeDefined();
      expect(res.body.marketplace).toBeDefined();
    });

    test('GET /api/admin/analytics should return 403 for non-admin', async () => {
      const res = await request(app)
        .get('/api/admin/analytics')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(403);
    });

    test('GET /api/admin/audit-logs should return logs for admin', async () => {
      const res = await request(app)
        .get('/api/admin/audit-logs')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.logs).toBeDefined();
    });
  });

  // Search (Enhanced)
  describe('Search', () => {
    test('GET /api/search should search across content types', async () => {
      const res = await request(app)
        .get('/api/search?q=welcome')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.events).toBeDefined();
      expect(res.body.groups).toBeDefined();
      expect(res.body.announcements).toBeDefined();
    });
  });
});
