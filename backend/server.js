/**
 * ToCampus Backend API Server v3.0
 * 
 * Production-ready Express.js server implementing SRS v3.0
 * 48 RESTful endpoints for university social platform
 * 
 * @version 3.0.0
 * @author Masoud Rafiee
 * @license MIT
 */

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend build in production
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendBuildPath));
}

// In-memory database (matches SRS v3.0 Data Model - Section 6)
const DB = {
  // Core entities
  universities: new Map(),
  users: new Map(),
  events: new Map(),
  rsvps: new Map(),
  groups: new Map(),
  memberships: new Map(),
  announcements: new Map(),
  comments: new Map(),
  notifications: new Map(),
  messages: new Map(),
  socialShares: new Map(),
  sessions: new Map(),
  
  // SRS v3.0 New Entities (Section 6)
  followRelations: new Map(),      // FR34-36: Social Graph
  marketplaceListings: new Map(),  // FR37-40: Marketplace
  marketplaceMessages: new Map(),  // FR37-40: Marketplace messaging
  recommendationScores: new Map(), // FR41-43: Recommendation Engine
  postInteractions: new Map(),     // FR41-43: Engagement tracking
  chatbotConversations: new Map(), // FR44-47: LLM Chatbot
  chatbotMessages: new Map(),      // FR44-47: LLM Chatbot
  auditLogs: new Map(),            // FR24-27: Admin audit trail
  userPreferences: new Map()       // FR32-33: Privacy/notification preferences
};

// Initialize sample data
const initializeData = () => {
  // Create university
  const universityId = uuidv4();
  DB.universities.set(universityId, {
    id: universityId,
    name: "Bishop's University",
    domain: 'ubishops.ca',
    locale: 'en_CA',
    timezone: 'America/Toronto',
    brandingConfig: {},
    socialMediaConfig: {},
    createdAt: new Date().toISOString()
  });

  // Create users
  const passwordHash = bcrypt.hashSync('password123', 10);
  
  const adminId = uuidv4();
  DB.users.set(adminId, {
    id: adminId,
    universityId,
    email: 'admin@ubishops.ca',
    passwordHash,
    firstName: 'Alice',
    lastName: 'Admin',
    role: 'ADMIN',
    // SRS v3.0 Rich Profile Fields (FR28-33)
    program: 'Computer Science',
    yearOfStudy: 4,
    bio: 'University administrator passionate about student success.',
    interests: ['tech', 'reading', 'coffee'],
    classes: ['CS410', 'CS411'],
    socialLinks: { linkedin: 'alice-admin', twitter: 'aliceadmin' },
    avatarUrl: null,
    // Privacy settings (FR32-33)
    privacySettings: {
      showEmail: false,
      showProgram: true,
      showYear: true,
      showInterests: true,
      profileVisibility: 'university' // 'public', 'university', 'connections', 'private'
    },
    // Social stats
    followerCount: 0,
    followingCount: 0,
    createdAt: new Date().toISOString()
  });

  const staffId = uuidv4();
  DB.users.set(staffId, {
    id: staffId,
    universityId,
    email: 'staff@ubishops.ca',
    passwordHash,
    firstName: 'Bob',
    lastName: 'Staff',
    role: 'STAFF',
    // SRS v3.0 Rich Profile Fields (FR28-33)
    program: 'Business Administration',
    yearOfStudy: 3,
    bio: 'Event coordinator and student engagement specialist.',
    interests: ['music', 'sports', 'photography'],
    classes: ['BUS301', 'BUS302'],
    socialLinks: { instagram: 'bobstaff' },
    avatarUrl: null,
    privacySettings: {
      showEmail: true,
      showProgram: true,
      showYear: true,
      showInterests: true,
      profileVisibility: 'university'
    },
    followerCount: 0,
    followingCount: 0,
    createdAt: new Date().toISOString()
  });

  const studentId = uuidv4();
  DB.users.set(studentId, {
    id: studentId,
    universityId,
    email: 'student@ubishops.ca',
    passwordHash,
    firstName: 'Charlie',
    lastName: 'Student',
    role: 'STUDENT',
    // SRS v3.0 Rich Profile Fields (FR28-33)
    program: 'Software Engineering',
    yearOfStudy: 2,
    bio: 'Tech enthusiast, coffee lover, always learning something new!',
    interests: ['tech', 'gaming', 'coffee', 'music'],
    classes: ['CS201', 'CS220', 'MATH201'],
    socialLinks: { github: 'charliestudent', linkedin: 'charlie-student' },
    avatarUrl: null,
    privacySettings: {
      showEmail: false,
      showProgram: true,
      showYear: true,
      showInterests: true,
      profileVisibility: 'university'
    },
    followerCount: 0,
    followingCount: 0,
    createdAt: new Date().toISOString()
  });

  // Create events (3 events)
  const event1Id = uuidv4();
  DB.events.set(event1Id, {
    id: event1Id,
    universityId,
    creatorId: staffId,
    title: 'Welcome Fair 2025',
    description: 'Discover clubs and resources at the annual welcome fair. Meet new friends, explore opportunities, and get involved in campus life! Free food and giveaways.',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(),
    location: 'Campus Quad',
    category: 'Social',
    status: 'PUBLISHED',
    isApproved: true,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: [],
    defaultAttendeeCount: 124
  });

  const event2Id = uuidv4();
  DB.events.set(event2Id, {
    id: event2Id,
    universityId,
    creatorId: staffId,
    title: 'Career Workshop: Resume Building',
    description: 'Learn how to craft the perfect resume with industry professionals. Bring your laptop and current resume for hands-on feedback.',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
    location: 'Career Center, Room 201',
    category: 'Academic',
    status: 'PUBLISHED',
    isApproved: true,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: [],
    defaultAttendeeCount: 45
  });

  const event3Id = uuidv4();
  DB.events.set(event3Id, {
    id: event3Id,
    universityId,
    creatorId: staffId,
    title: 'Basketball Tournament Finals',
    description: 'Cheer on your favorite intramural teams as they compete for the championship title! Refreshments provided.',
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
    location: 'Sports Complex Gymnasium',
    category: 'Sports',
    status: 'PUBLISHED',
    isApproved: true,
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: [],
    defaultAttendeeCount: 89
  });

  // Create groups (3 groups)
  const group1Id = uuidv4();
  DB.groups.set(group1Id, {
    id: group1Id,
    universityId,
    name: 'Chess Club',
    description: 'Weekly meetings for chess enthusiasts of all skill levels. Tournaments, casual games, and lessons available.',
    category: 'Recreation',
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: [],
    defaultMemberCount: 47
  });

  const group2Id = uuidv4();
  DB.groups.set(group2Id, {
    id: group2Id,
    universityId,
    name: 'Photography Society',
    description: 'Capture campus life! Photo walks, editing workshops, and exhibitions. Camera not required - phone photography welcome!',
    category: 'Arts',
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: [],
    defaultMemberCount: 82
  });

  const group3Id = uuidv4();
  DB.groups.set(group3Id, {
    id: group3Id,
    universityId,
    name: 'Computer Science Club',
    description: 'Hackathons, coding challenges, tech talks, and networking with industry professionals. All majors welcome!',
    category: 'Academic',
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: [],
    defaultMemberCount: 156
  });

  // Create announcements (3 announcements)
  const ann1Id = uuidv4();
  DB.announcements.set(ann1Id, {
    id: ann1Id,
    universityId,
    authorId: staffId,
    title: '📚 Library Extended Hours for Finals',
    content: 'Great news! The John Chicken Library will be open 24/7 during finals week (Dec 9-20). Quiet study zones, group study rooms, and free coffee available after 10 PM. Good luck on your exams!',
    scope: 'GLOBAL',
    groupId: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  });

  const ann2Id = uuidv4();
  DB.announcements.set(ann2Id, {
    id: ann2Id,
    universityId,
    authorId: staffId,
    title: '🎉 Winter Break Shuttle Service',
    content: 'Free shuttle service to Montreal and Sherbrooke airports will run Dec 15-22. Book your seat through the Student Portal by Dec 10. Limited spots available!',
    scope: 'GLOBAL',
    groupId: null,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  });

  const ann3Id = uuidv4();
  DB.announcements.set(ann3Id, {
    id: ann3Id,
    universityId,
    authorId: adminId,
    title: '🍕 Free Pizza Friday This Week!',
    content: 'Join us this Friday at the Student Union Building for Free Pizza Friday! All students welcome. Starts at 12 PM while supplies last. Vegetarian and gluten-free options available.',
    scope: 'GLOBAL',
    groupId: null,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  });

  // Create notifications for student (3 notifications)
  const notif1Id = uuidv4();
  DB.notifications.set(notif1Id, {
    id: notif1Id,
    userId: studentId,
    type: 'EVENT_REMINDER',
    title: '⏰ Event Reminder',
    message: 'Career Workshop: Resume Building starts in 3 days. Don\'t forget to bring your laptop!',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  });

  const notif2Id = uuidv4();
  DB.notifications.set(notif2Id, {
    id: notif2Id,
    userId: studentId,
    type: 'NEW_ANNOUNCEMENT',
    title: '📢 New Announcement',
    message: 'Library Services posted: Library Extended Hours for Finals',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  });

  const notif3Id = uuidv4();
  DB.notifications.set(notif3Id, {
    id: notif3Id,
    userId: studentId,
    type: 'GROUP_UPDATE',
    title: '👥 Group Activity',
    message: 'Computer Science Club: New hackathon registration is now open!',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  });

  // ============================
  // SRS v3.0 NEW SAMPLE DATA
  // ============================

  // Marketplace Listings (FR37-40)
  const listing1Id = uuidv4();
  DB.marketplaceListings.set(listing1Id, {
    id: listing1Id,
    universityId,
    sellerId: studentId,
    title: 'Calculus Textbook - 8th Edition',
    description: 'Barely used calculus textbook. Some highlighting but in great condition. Perfect for MATH201.',
    price: 45.00,
    currency: 'CAD',
    category: 'textbooks',
    condition: 'good',
    images: [],
    status: 'active', // active, sold, reserved, removed
    pickupLocation: 'Library or Student Center',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  });

  const listing2Id = uuidv4();
  DB.marketplaceListings.set(listing2Id, {
    id: listing2Id,
    universityId,
    sellerId: staffId,
    title: 'Mini Fridge - Perfect for Dorm',
    description: 'Compact mini fridge, 3.2 cubic feet. Works perfectly, selling because I\'m moving off campus.',
    price: 80.00,
    currency: 'CAD',
    category: 'furniture',
    condition: 'excellent',
    images: [],
    status: 'active',
    pickupLocation: 'Residence Hall B',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  });

  const listing3Id = uuidv4();
  DB.marketplaceListings.set(listing3Id, {
    id: listing3Id,
    universityId,
    sellerId: studentId,
    title: 'Study Lamp with USB Port',
    description: 'LED desk lamp with adjustable brightness and built-in USB charging port. Like new!',
    price: 25.00,
    currency: 'CAD',
    category: 'electronics',
    condition: 'like_new',
    images: [],
    status: 'active',
    pickupLocation: 'Campus Quad or Library',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  });

  // Social Graph - Follow Relations (FR34-36)
  // Staff follows Student
  const follow1Id = uuidv4();
  DB.followRelations.set(follow1Id, {
    id: follow1Id,
    followerId: staffId,
    followingId: studentId,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  });
  // Update counters
  const staffUser = DB.users.get(staffId);
  staffUser.followingCount = 1;
  const studentUser = DB.users.get(studentId);
  studentUser.followerCount = 1;

  // User Preferences (FR32-33)
  DB.userPreferences.set(studentId, {
    userId: studentId,
    notifications: {
      eventReminders: true,
      newAnnouncements: true,
      groupUpdates: true,
      newFollowers: true,
      marketplaceMessages: true,
      recommendationDigest: 'weekly' // 'daily', 'weekly', 'never'
    },
    feed: {
      showRecommended: true,
      prioritizeFollowing: true
    },
    updatedAt: new Date().toISOString()
  });

  // Initialize Recommendation Scores (FR41-43)
  // Compute basic recommendation for student based on interests
  const recScore1Id = uuidv4();
  DB.recommendationScores.set(recScore1Id, {
    id: recScore1Id,
    userId: studentId,
    contentType: 'event',
    contentId: event1Id, // Welcome Fair
    score: 0.85,
    factors: {
      categoryMatch: 0.3,
      socialProof: 0.2,
      recency: 0.35
    },
    computedAt: new Date().toISOString()
  });
};

// ============================
// HELPER FUNCTIONS
// ============================

// Compute recommendation score for a user-content pair (FR41-43)
const computeRecommendationScore = (user, content, contentType) => {
  let score = 0;
  const factors = {};

  // Interest match (30% weight)
  if (user.interests && content.category) {
    const categoryMap = {
      'Social': ['coffee', 'music'],
      'Academic': ['reading', 'tech'],
      'Sports': ['sports', 'fitness'],
      'Arts': ['arts', 'photography'],
      'Tech': ['tech', 'gaming'],
      'Music': ['music', 'podcasts']
    };
    const matchingInterests = categoryMap[content.category]?.filter(i => 
      user.interests.includes(i)
    ) || [];
    factors.interestMatch = matchingInterests.length * 0.15;
    score += factors.interestMatch;
  }

  // Social proof - friends attending/interested (25% weight)
  const userFollowing = Array.from(DB.followRelations.values())
    .filter(f => f.followerId === user.id)
    .map(f => f.followingId);
  
  if (contentType === 'event' && content.rsvpIds) {
    const friendsAttending = content.rsvpIds.filter(id => userFollowing.includes(id)).length;
    factors.socialProof = Math.min(friendsAttending * 0.1, 0.25);
    score += factors.socialProof;
  }

  // Recency boost (20% weight)
  const ageHours = (Date.now() - new Date(content.createdAt).getTime()) / (1000 * 60 * 60);
  factors.recency = Math.max(0, 0.2 - (ageHours / 168) * 0.2); // Decays over a week
  score += factors.recency;

  // Engagement history (15% weight)
  const pastInteractions = Array.from(DB.postInteractions.values())
    .filter(i => i.userId === user.id && i.contentType === contentType);
  factors.engagement = Math.min(pastInteractions.length * 0.03, 0.15);
  score += factors.engagement;

  // Random diversity factor (10% weight) - prevents filter bubble
  factors.diversity = Math.random() * 0.1;
  score += factors.diversity;

  return { score: Math.min(score, 1), factors };
};

// Create notification helper
const createNotification = (userId, type, title, message, metadata = {}) => {
  const notifId = uuidv4();
  DB.notifications.set(notifId, {
    id: notifId,
    userId,
    type,
    title,
    message,
    isRead: false,
    metadata,
    createdAt: new Date().toISOString()
  });
  return notifId;
};

// Audit log helper (FR24-27)
const createAuditLog = (userId, action, resourceType, resourceId, details = {}) => {
  const logId = uuidv4();
  DB.auditLogs.set(logId, {
    id: logId,
    userId,
    action, // 'create', 'update', 'delete', 'approve', 'reject', 'login', etc.
    resourceType, // 'event', 'announcement', 'user', 'group', 'listing'
    resourceId,
    details,
    timestamp: new Date().toISOString()
  });
  return logId;
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = DB.users.get(user.userId);
    next();
  });
};

// Helper: Validate university email domain
const validateUniversityEmail = (email) => {
  // Get all valid university domains
  const validDomains = Array.from(DB.universities.values()).map(u => u.domain);
  const emailDomain = email.split('@')[1];
  return validDomains.includes(emailDomain);
};

// Routes

// Authentication
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, universityId, role = 'STUDENT' } = req.body;
    
    // Validate email format
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate university email domain (SRS FR1)
    if (!validateUniversityEmail(email)) {
      return res.status(400).json({ error: 'Please use a valid university email address' });
    }

    // Validate password strength (SRS FR1)
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    
    // Check if user exists
    for (const user of DB.users.values()) {
      if (user.email === email) {
        return res.status(400).json({ error: 'User already exists' });
      }
    }

    const userId = uuidv4();
    const passwordHash = await bcrypt.hash(password, 10);

    // Find university by email domain
    const emailDomain = email.split('@')[1];
    let userUniversityId = universityId;
    if (!userUniversityId) {
      for (const [id, uni] of DB.universities.entries()) {
        if (uni.domain === emailDomain) {
          userUniversityId = id;
          break;
        }
      }
    }

    const newUser = {
      id: userId,
      universityId: userUniversityId || Array.from(DB.universities.keys())[0],
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString()
    };

    DB.users.set(userId, newUser);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset Request (SRS FR2)
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    let user = null;
    for (const u of DB.users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token (6 digit code for simplicity in MVP)
    const resetToken = Math.random().toString().slice(2, 8);
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Store reset token
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetExpiry.toISOString();

    // In production, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);

    res.json({ message: 'If the email exists, a reset link has been sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Password Reset (SRS FR2)
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    // Find user by email
    let user = null;
    for (const u of DB.users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    if (!user || !user.resetToken) {
      return res.status(400).json({ error: 'Invalid reset request' });
    }

    // Check token validity
    if (user.resetToken !== token) {
      return res.status(400).json({ error: 'Invalid reset token' });
    }

    // Check token expiry
    if (new Date() > new Date(user.resetTokenExpiry)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Update password
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = null;
    for (const u of DB.users.values()) {
      if (u.email === email) {
        user = u;
        break;
      }
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Events
app.get('/api/events', authenticateToken, (req, res) => {
  const { status } = req.query;
  
  let events = Array.from(DB.events.values())
    .filter(e => e.universityId === req.user.universityId);
  
  // Admin can see pending and approved events
  if (req.user.role === 'ADMIN') {
    // Admin filter: show pending for approval workflow
    if (status === 'pending') {
      events = events.filter(e => e.status === 'PENDING');
    } else {
      // Default: show approved and published events
      events = events.filter(e => e.isApproved === true || e.status === 'PUBLISHED');
    }
  } else {
    // Regular users (STUDENT, STAFF, FACULTY) only see approved/published events
    events = events.filter(e => e.isApproved === true || e.status === 'PUBLISHED');
  }
  
  events = events.map(event => ({
    ...event,
    attendeeCount: event.rsvpIds?.length || event.defaultAttendeeCount || 0,
    creator: (() => {
      const creator = DB.users.get(event.creatorId);
      return creator ? { firstName: creator.firstName, lastName: creator.lastName } : null;
    })()
  }));
  
  res.json(events);
});

// Get single event by ID
app.get('/api/events/:id', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  
  // Check authorization: only approved events visible to non-admins, or creator sees own pending events
  if (req.user.role !== 'ADMIN' && !event.isApproved && event.creatorId !== req.user.id) {
    return res.status(403).json({ error: 'This event is pending admin approval' });
  }
  
  const creator = DB.users.get(event.creatorId);
  const rsvps = (event.rsvpIds || []).map(id => {
    const rsvp = DB.rsvps.get(id);
    if (!rsvp) return null;
    const user = DB.users.get(rsvp.userId);
    return user ? { firstName: user.firstName, lastName: user.lastName } : null;
  }).filter(Boolean);
  
  res.json({
    ...event,
    attendeeCount: event.rsvpIds?.length || event.defaultAttendeeCount || 0,
    creator: creator ? { firstName: creator.firstName, lastName: creator.lastName } : null,
    attendees: rsvps
  });
});

app.post('/api/events', authenticateToken, (req, res) => {
  // FR5: All registered users (STUDENT, STAFF, FACULTY, ADMIN) can create events
  // SRS requirement: Events require admin approval before publishing
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const eventId = uuidv4();
  const newEvent = {
    id: eventId,
    universityId: req.user.universityId,
    creatorId: req.user.id,
    ...req.body,
    status: 'PENDING',  // Changed: Requires admin approval
    isApproved: false,  // Explicitly not approved until admin reviews
    createdAt: new Date().toISOString(),
    rsvpIds: [],
    socialShareIds: []
  };

  DB.events.set(eventId, newEvent);

  // Create notification for admins about new event pending approval
  for (const user of DB.users.values()) {
    if (user.role === 'ADMIN' && user.universityId === req.user.universityId) {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: user.id,
        type: 'EVENT_PENDING',
        title: '📋 Event Pending Approval',
        message: `New event "${newEvent.title}" awaits your approval`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  res.status(201).json(newEvent);
});

// Event Approval (SRS FR5a - Admin workflow - Policy Compliance Check)
// Admin reviews event to ensure it follows university policy before publishing
app.post('/api/events/:id/approve', authenticateToken, (req, res) => {
  // Only admins can approve events after policy review
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only admins can approve events' });
  }

  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Admin must provide reason/notes for approval (optional in this implementation)
  const { policyNotes } = req.body;

  event.isApproved = true;
  event.status = 'PUBLISHED';
  event.approvedAt = new Date().toISOString();
  event.approvedBy = req.user.id;
  event.policyNotes = policyNotes || 'Approved by admin - follows university policy';

  // Log approval action in audit log (FR25)
  const auditId = uuidv4();
  DB.auditLogs.set(auditId, {
    id: auditId,
    universityId: req.user.universityId,
    actorId: req.user.id,
    actionType: 'EVENT_APPROVED',
    entityType: 'Event',
    entityId: event.id,
    timestamp: new Date().toISOString(),
    details: { title: event.title, reason: policyNotes || 'Standard policy compliance check' }
  });

  // Notify the event creator
  const notifId = uuidv4();
  DB.notifications.set(notifId, {
    id: notifId,
    userId: event.creatorId,
    type: 'EVENT_APPROVED',
    title: '✅ Event Approved',
    message: `Your event "${event.title}" has been approved by admin and is now published`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json(event);
});

// Event Publication (SRS FR4)
app.post('/api/events/:id/publish', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Only creator or admin can publish
  if (event.creatorId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Only event creator or admin can publish' });
  }

  // Must be approved before publishing
  if (!event.isApproved) {
    return res.status(400).json({ error: 'Event must be approved before publishing' });
  }

  event.status = 'PUBLISHED';

  // Create notifications for all users in the university (SRS FR12)
  for (const user of DB.users.values()) {
    if (user.universityId === event.universityId && user.id !== event.creatorId) {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: user.id,
        type: 'NEW_EVENT',
        title: '🎉 New Event',
        message: `New event: "${event.title}" on ${new Date(event.startTime).toLocaleDateString()}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  // Trigger social media sharing (SRS FR6a, FR6b)
  if (req.body.shareTo && req.body.shareTo.length > 0) {
    req.body.shareTo.forEach(platform => {
      const shareId = uuidv4();
      DB.socialShares.set(shareId, {
        id: shareId,
        eventId: event.id,
        platform: platform.toUpperCase(),
        status: 'PENDING',
        createdAt: new Date().toISOString()
      });
      event.socialShareIds.push(shareId);
    });
  }

  res.json(event);
});

// Cancel RSVP
app.delete('/api/events/:id/rsvp', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Find and remove user's RSVP
  const rsvpIndex = event.rsvpIds.findIndex(rsvpId => {
    const rsvp = DB.rsvps.get(rsvpId);
    return rsvp && rsvp.userId === req.user.id;
  });

  if (rsvpIndex === -1) {
    return res.status(404).json({ error: 'RSVP not found' });
  }

  const rsvpId = event.rsvpIds[rsvpIndex];
  DB.rsvps.delete(rsvpId);
  event.rsvpIds.splice(rsvpIndex, 1);

  res.json({ message: 'RSVP cancelled' });
});

app.post('/api/events/:id/rsvp', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  // Check if already RSVPed
  for (const rsvpId of event.rsvpIds) {
    const rsvp = DB.rsvps.get(rsvpId);
    if (rsvp && rsvp.userId === req.user.id) {
      return res.json(rsvp); // Return existing RSVP
    }
  }

  const rsvpId = uuidv4();
  const newRSVP = {
    id: rsvpId,
    userId: req.user.id,
    eventId: event.id,
    status: req.body.status || 'GOING',
    createdAt: new Date().toISOString()
  };

  DB.rsvps.set(rsvpId, newRSVP);
  event.rsvpIds.push(rsvpId);

  // Send confirmation notification (SRS FR5)
  const notifId = uuidv4();
  DB.notifications.set(notifId, {
    id: notifId,
    userId: req.user.id,
    type: 'RSVP_CONFIRMATION',
    title: '✅ RSVP Confirmed',
    message: `You're registered for "${event.title}"`,
    isRead: false,
    createdAt: new Date().toISOString()
  });

  res.json(newRSVP);
});

// Groups
app.get('/api/groups', authenticateToken, (req, res) => {
  const groups = Array.from(DB.groups.values())
    .filter(g => g.universityId === req.user.universityId)
    .map(group => ({
      ...group,
      // Use actual member count or default display count
      memberCount: group.membershipIds?.length || group.defaultMemberCount || 0
    }));
  res.json(groups);
});

// Get single group by ID
app.get('/api/groups/:id', authenticateToken, (req, res) => {
  const group = DB.groups.get(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }
  
  // Get members
  const members = (group.membershipIds || []).map(id => {
    const membership = DB.memberships.get(id);
    if (!membership) return null;
    const user = DB.users.get(membership.userId);
    return user ? {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: membership.role,
      joinedAt: membership.joinedAt
    } : null;
  }).filter(Boolean);
  
  // Check if current user is a member
  const isMember = members.some(m => m.id === req.user.id);
  
  res.json({
    ...group,
    memberCount: group.membershipIds?.length || group.defaultMemberCount || 0,
    members,
    isMember
  });
});

app.post('/api/groups', authenticateToken, (req, res) => {
  if (!['STAFF', 'FACULTY', 'ADMIN'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only staff and faculty can create groups' });
  }

  const groupId = uuidv4();
  const newGroup = {
    id: groupId,
    universityId: req.user.universityId,
    ...req.body,
    createdAt: new Date().toISOString(),
    membershipIds: [],
    announcementIds: []
  };

  DB.groups.set(groupId, newGroup);

  // Add creator as admin
  const membershipId = uuidv4();
  const membership = {
    id: membershipId,
    userId: req.user.id,
    groupId,
    role: 'ADMIN',
    joinedAt: new Date().toISOString()
  };
  DB.memberships.set(membershipId, membership);
  newGroup.membershipIds.push(membershipId);

  res.status(201).json(newGroup);
});

app.post('/api/groups/:id/join', authenticateToken, (req, res) => {
  const group = DB.groups.get(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  // Check if already member
  for (const membershipId of group.membershipIds) {
    const membership = DB.memberships.get(membershipId);
    if (membership.userId === req.user.id) {
      return res.json(membership);
    }
  }

  const membershipId = uuidv4();
  const membership = {
    id: membershipId,
    userId: req.user.id,
    groupId: group.id,
    role: 'MEMBER',
    joinedAt: new Date().toISOString()
  };

  DB.memberships.set(membershipId, membership);
  group.membershipIds.push(membershipId);

  // Send notification about new member (SRS FR9)
  // Notify group admins
  for (const memId of group.membershipIds) {
    const mem = DB.memberships.get(memId);
    if (mem && mem.role === 'ADMIN' && mem.userId !== req.user.id) {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: mem.userId,
        type: 'GROUP_MEMBER_JOINED',
        title: '👥 New Member',
        message: `${req.user.firstName} ${req.user.lastName} joined ${group.name}`,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    }
  }

  res.json(membership);
});

// Leave Group (SRS FR7)
app.delete('/api/groups/:id/leave', authenticateToken, (req, res) => {
  const group = DB.groups.get(req.params.id);
  if (!group) {
    return res.status(404).json({ error: 'Group not found' });
  }

  // Find membership
  let membershipToRemove = null;
  let membershipIndex = -1;
  
  for (let i = 0; i < group.membershipIds.length; i++) {
    const membership = DB.memberships.get(group.membershipIds[i]);
    if (membership && membership.userId === req.user.id) {
      membershipToRemove = membership;
      membershipIndex = i;
      break;
    }
  }

  if (!membershipToRemove) {
    return res.status(404).json({ error: 'Not a member of this group' });
  }

  // Cannot leave if you're the only admin
  if (membershipToRemove.role === 'ADMIN') {
    const adminCount = group.membershipIds.filter(id => {
      const m = DB.memberships.get(id);
      return m && m.role === 'ADMIN';
    }).length;
    
    if (adminCount === 1) {
      return res.status(400).json({ error: 'Cannot leave as the only admin. Transfer ownership first.' });
    }
  }

  // Remove membership
  DB.memberships.delete(membershipToRemove.id);
  group.membershipIds.splice(membershipIndex, 1);

  res.json({ message: 'Left group successfully' });
});

// Announcements
app.get('/api/announcements', authenticateToken, (req, res) => {
  // FR8: Filter announcements based on approval status and user role
  let announcements = Array.from(DB.announcements.values())
    .filter(a => a.universityId === req.user.universityId);
  
  // Admin can see pending and approved announcements
  if (req.user.role === 'ADMIN') {
    // Admin view includes pending announcements for approval workflow
    // No additional filtering - show all announcements
  } else {
    // Regular users (STUDENT, STAFF, FACULTY) only see approved/published announcements
    announcements = announcements.filter(a => a.isApproved === true || a.status === 'PUBLISHED');
  }
  
  announcements = announcements
    .map(announcement => ({
      ...announcement,
      likeCount: announcement.likeUserIds.length,
      commentCount: announcement.commentIds.length,
      author: (() => {
        const author = DB.users.get(announcement.authorId);
        return author ? { firstName: author.firstName, lastName: author.lastName } : null;
      })()
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(announcements);
});

app.post('/api/announcements', authenticateToken, (req, res) => {
  // FR8: All registered users (STUDENT, STAFF, FACULTY, ADMIN) can post announcements
  // SRS requirement: Announcements require admin approval before publishing
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const announcementId = uuidv4();
  const newAnnouncement = {
    id: announcementId,
    universityId: req.user.universityId,
    authorId: req.user.id,
    ...req.body,
    scope: req.body.scope || 'GLOBAL',
    status: 'PENDING',  // Changed: Requires admin approval
    isApproved: false,  // Explicitly not approved until admin reviews
    createdAt: new Date().toISOString(),
    commentIds: [],
    likeUserIds: [],
    socialShareIds: []
  };

  DB.announcements.set(announcementId, newAnnouncement);

  // Create notifications for users (FR12 - Notification System)
  const author = DB.users.get(req.user.id);
  const authorName = author ? `${author.firstName} ${author.lastName}` : 'Staff';
  
  // If group-scoped, notify group members
  if (req.body.groupId) {
    const memberships = Array.from(DB.memberships.values())
      .filter(m => m.groupId === req.body.groupId);
    
    memberships.forEach(membership => {
      if (membership.userId !== req.user.id) {
        const notifId = uuidv4();
        DB.notifications.set(notifId, {
          id: notifId,
          userId: membership.userId,
          type: 'GROUP_ANNOUNCEMENT',
          title: 'New Group Announcement',
          message: `${authorName} posted: ${newAnnouncement.title || 'New announcement'}`,
          relatedId: announcementId,
          isRead: false,
          createdAt: new Date().toISOString()
        });
      }
    });
  } else {
    // Global announcement - notify all users at same university
    const users = Array.from(DB.users.values())
      .filter(u => u.universityId === req.user.universityId && u.id !== req.user.id);
    
    users.forEach(user => {
      const notifId = uuidv4();
      DB.notifications.set(notifId, {
        id: notifId,
        userId: user.id,
        type: 'ANNOUNCEMENT',
        title: 'New Announcement',
        message: `${authorName} posted: ${newAnnouncement.title || 'New announcement'}`,
        relatedId: announcementId,
        isRead: false,
        createdAt: new Date().toISOString()
      });
    });
  }

  res.status(201).json(newAnnouncement);
});

app.post('/api/announcements/:id/like', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const index = announcement.likeUserIds.indexOf(req.user.id);
  if (index > -1) {
    announcement.likeUserIds.splice(index, 1);
  } else {
    announcement.likeUserIds.push(req.user.id);
  }

  res.json({ likeCount: announcement.likeUserIds.length });
});

// GET comments for an announcement
app.get('/api/announcements/:id/comments', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const comments = (announcement.commentIds || [])
    .map(id => DB.comments.get(id))
    .filter(Boolean)
    .map(comment => {
      const author = DB.users.get(comment.authorId);
      return {
        ...comment,
        author: author ? {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
          role: author.role
        } : null
      };
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(comments);
});

app.post('/api/announcements/:id/comments', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const commentId = uuidv4();
  const newComment = {
    id: commentId,
    announcementId: announcement.id,
    authorId: req.user.id,
    content: req.body.content,
    createdAt: new Date().toISOString()
  };

  DB.comments.set(commentId, newComment);
  if (!announcement.commentIds) announcement.commentIds = [];
  announcement.commentIds.push(commentId);
  
  // Include author info in response
  const author = DB.users.get(req.user.id);
  res.status(201).json({
    ...newComment,
    author: author ? {
      id: author.id,
      firstName: author.firstName,
      lastName: author.lastName,
      role: author.role
    } : null
  });
});

// Social Sharing (FR6a, FR6b - Social Media Selection & Cross-Posting)
app.post('/api/events/:id/share', authenticateToken, (req, res) => {
  const event = DB.events.get(req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const { platforms } = req.body; // ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN']
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'Please select at least one social platform' });
  }

  const validPlatforms = ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'];
  const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
  if (invalidPlatforms.length > 0) {
    return res.status(400).json({ error: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
  }

  const shareId = uuidv4();
  const socialShare = {
    id: shareId,
    contentType: 'EVENT',
    contentId: event.id,
    userId: req.user.id,
    platforms: platforms,
    sharedAt: new Date().toISOString(),
    status: 'SHARED' // In production, this would track actual posting status
  };

  DB.socialShares.set(shareId, socialShare);
  if (!event.socialShareIds) event.socialShareIds = [];
  event.socialShareIds.push(shareId);

  res.status(201).json({
    message: `Event shared to ${platforms.join(', ')}`,
    share: socialShare
  });
});

app.post('/api/announcements/:id/share', authenticateToken, (req, res) => {
  const announcement = DB.announcements.get(req.params.id);
  if (!announcement) {
    return res.status(404).json({ error: 'Announcement not found' });
  }

  const { platforms } = req.body;
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return res.status(400).json({ error: 'Please select at least one social platform' });
  }

  const validPlatforms = ['TWITTER', 'FACEBOOK', 'INSTAGRAM', 'LINKEDIN'];
  const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));
  if (invalidPlatforms.length > 0) {
    return res.status(400).json({ error: `Invalid platforms: ${invalidPlatforms.join(', ')}` });
  }

  const shareId = uuidv4();
  const socialShare = {
    id: shareId,
    contentType: 'ANNOUNCEMENT',
    contentId: announcement.id,
    userId: req.user.id,
    platforms: platforms,
    sharedAt: new Date().toISOString(),
    status: 'SHARED'
  };

  DB.socialShares.set(shareId, socialShare);
  if (!announcement.socialShareIds) announcement.socialShareIds = [];
  announcement.socialShareIds.push(shareId);

  res.status(201).json({
    message: `Announcement shared to ${platforms.join(', ')}`,
    share: socialShare
  });
});

app.get('/api/social/shares', authenticateToken, (req, res) => {
  const shares = Array.from(DB.socialShares.values())
    .filter(s => s.userId === req.user.id)
    .sort((a, b) => new Date(b.sharedAt) - new Date(a.sharedAt));
  res.json(shares);
});

// Notifications
app.get('/api/notifications', authenticateToken, (req, res) => {
  const notifications = Array.from(DB.notifications.values())
    .filter(n => n.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(notifications);
});

app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const notification = DB.notifications.get(req.params.id);
  if (!notification) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  notification.isRead = true;
  res.json(notification);
});

// Root welcome page
app.get('/', (req, res) => {
  res.json({
    name: 'ToCampus API',
    version: '2.0.0',
    status: 'running',
    srsVersion: 'v3.0 (CS-410 Final)',
    endpoints: {
      health: '/health',
      auth: '/api/auth/login, /api/auth/register, /api/auth/forgot-password',
      users: '/api/users/:id, /api/users/:id/follow, /api/users/:id/followers, /api/users/:id/following',
      events: '/api/events, /api/events/:id, /api/events/:id/rsvp',
      groups: '/api/groups, /api/groups/:id, /api/groups/:id/join',
      announcements: '/api/announcements, /api/announcements/:id/comments',
      marketplace: '/api/marketplace, /api/marketplace/:id, /api/marketplace/:id/message',
      recommendations: '/api/recommendations/events, /api/recommendations/groups, /api/feed',
      chatbot: '/api/chatbot/conversations, /api/chatbot/conversations/:id/messages',
      notifications: '/api/notifications',
      preferences: '/api/preferences',
      admin: '/api/admin/analytics, /api/admin/audit-logs',
      search: '/api/search'
    },
    frontend: 'http://localhost:3000'
  });
});

// Global Search endpoint (Search across events, groups, announcements)
app.get('/api/search', authenticateToken, (req, res) => {
  const { q, type } = req.query;
  
  if (!q || q.length < 2) {
    return res.status(400).json({ error: 'Search query must be at least 2 characters' });
  }
  
  const query = q.toLowerCase();
  const results = { events: [], groups: [], announcements: [] };
  
  // Search events
  if (!type || type === 'events' || type === 'all') {
    results.events = Array.from(DB.events.values())
      .filter(e => 
        e.universityId === req.user.universityId && 
        e.status === 'PUBLISHED' &&
        (e.title.toLowerCase().includes(query) || 
         e.description.toLowerCase().includes(query) ||
         e.category?.toLowerCase().includes(query))
      )
      .slice(0, 10)
      .map(event => ({
        id: event.id,
        title: event.title,
        description: event.description.substring(0, 100) + '...',
        category: event.category,
        startTime: event.startTime,
        type: 'event'
      }));
  }
  
  // Search groups
  if (!type || type === 'groups' || type === 'all') {
    results.groups = Array.from(DB.groups.values())
      .filter(g => 
        g.universityId === req.user.universityId &&
        (g.name.toLowerCase().includes(query) || 
         g.description.toLowerCase().includes(query) ||
         g.category?.toLowerCase().includes(query))
      )
      .slice(0, 10)
      .map(group => ({
        id: group.id,
        name: group.name,
        description: group.description.substring(0, 100) + '...',
        category: group.category,
        memberCount: group.membershipIds?.length || group.defaultMemberCount || 0,
        type: 'group'
      }));
  }
  
  // Search announcements
  if (!type || type === 'announcements' || type === 'all') {
    results.announcements = Array.from(DB.announcements.values())
      .filter(a => 
        a.universityId === req.user.universityId &&
        (a.title.toLowerCase().includes(query) || 
         a.content.toLowerCase().includes(query))
      )
      .slice(0, 10)
      .map(ann => ({
        id: ann.id,
        title: ann.title,
        content: ann.content.substring(0, 100) + '...',
        createdAt: ann.createdAt,
        type: 'announcement'
      }));
  }
  
  res.json(results);
});

// ============================
// USER PROFILES (FR28-33)
// ============================

// Get user profile
app.get('/api/users/:id', authenticateToken, (req, res) => {
  const user = DB.users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check privacy settings
  const isOwnProfile = req.user.id === user.id;
  const isFollowing = Array.from(DB.followRelations.values())
    .some(f => f.followerId === req.user.id && f.followingId === user.id);

  const visibility = user.privacySettings?.profileVisibility || 'university';
  
  // Determine what to show based on privacy
  if (!isOwnProfile && visibility === 'private') {
    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      restricted: true
    });
  }

  if (!isOwnProfile && visibility === 'connections' && !isFollowing) {
    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      followerCount: user.followerCount || 0,
      followingCount: user.followingCount || 0,
      restricted: true
    });
  }

  // Build profile response
  const profile = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    bio: user.bio,
    avatarUrl: user.avatarUrl,
    followerCount: user.followerCount || 0,
    followingCount: user.followingCount || 0,
    createdAt: user.createdAt
  };

  // Add fields based on privacy settings
  if (isOwnProfile || user.privacySettings?.showProgram !== false) {
    profile.program = user.program;
  }
  if (isOwnProfile || user.privacySettings?.showYear !== false) {
    profile.yearOfStudy = user.yearOfStudy;
  }
  if (isOwnProfile || user.privacySettings?.showInterests !== false) {
    profile.interests = user.interests;
  }
  if (isOwnProfile || user.privacySettings?.showEmail !== false) {
    profile.email = user.email;
  }
  if (isOwnProfile) {
    profile.classes = user.classes;
    profile.socialLinks = user.socialLinks;
    profile.privacySettings = user.privacySettings;
  }

  // Check if current user is following this user
  profile.isFollowing = isFollowing;

  res.json(profile);
});

// Update user profile
app.patch('/api/users/:id', authenticateToken, (req, res) => {
  if (req.user.id !== req.params.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Not authorized to update this profile' });
  }

  const user = DB.users.get(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const allowedFields = ['firstName', 'lastName', 'bio', 'program', 'yearOfStudy', 
                         'interests', 'classes', 'socialLinks', 'avatarUrl', 'privacySettings'];
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      user[field] = req.body[field];
    }
  }

  createAuditLog(req.user.id, 'update', 'user', user.id, { fields: Object.keys(req.body) });

  res.json({ message: 'Profile updated', user: { ...user, passwordHash: undefined } });
});

// Get current user profile
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = { ...req.user };
  delete user.passwordHash;
  res.json(user);
});

// ============================
// SOCIAL GRAPH (FR34-36)
// ============================

// Follow a user
app.post('/api/users/:id/follow', authenticateToken, (req, res) => {
  const targetUserId = req.params.id;
  
  if (targetUserId === req.user.id) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  const targetUser = DB.users.get(targetUserId);
  if (!targetUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Check if already following
  const existingFollow = Array.from(DB.followRelations.values())
    .find(f => f.followerId === req.user.id && f.followingId === targetUserId);
  
  if (existingFollow) {
    return res.status(400).json({ error: 'Already following this user' });
  }

  // Create follow relation
  const followId = uuidv4();
  DB.followRelations.set(followId, {
    id: followId,
    followerId: req.user.id,
    followingId: targetUserId,
    createdAt: new Date().toISOString()
  });

  // Update counts
  const currentUser = DB.users.get(req.user.id);
  currentUser.followingCount = (currentUser.followingCount || 0) + 1;
  targetUser.followerCount = (targetUser.followerCount || 0) + 1;

  // Create notification for target user
  createNotification(
    targetUserId,
    'NEW_FOLLOWER',
    '👤 New Follower',
    `${currentUser.firstName} ${currentUser.lastName} started following you`,
    { followerId: req.user.id }
  );

  res.status(201).json({ 
    message: `Now following ${targetUser.firstName} ${targetUser.lastName}`,
    followingCount: currentUser.followingCount
  });
});

// Unfollow a user
app.delete('/api/users/:id/follow', authenticateToken, (req, res) => {
  const targetUserId = req.params.id;

  const followRelation = Array.from(DB.followRelations.entries())
    .find(([_, f]) => f.followerId === req.user.id && f.followingId === targetUserId);
  
  if (!followRelation) {
    return res.status(400).json({ error: 'Not following this user' });
  }

  DB.followRelations.delete(followRelation[0]);

  // Update counts
  const currentUser = DB.users.get(req.user.id);
  const targetUser = DB.users.get(targetUserId);
  currentUser.followingCount = Math.max(0, (currentUser.followingCount || 1) - 1);
  if (targetUser) {
    targetUser.followerCount = Math.max(0, (targetUser.followerCount || 1) - 1);
  }

  res.json({ message: 'Unfollowed successfully', followingCount: currentUser.followingCount });
});

// Get user's followers
app.get('/api/users/:id/followers', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const { page = 1, limit = 20 } = req.query;
  
  const followers = Array.from(DB.followRelations.values())
    .filter(f => f.followingId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice((page - 1) * limit, page * limit)
    .map(f => {
      const user = DB.users.get(f.followerId);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        program: user.privacySettings?.showProgram !== false ? user.program : null,
        followedAt: f.createdAt
      };
    });

  const totalCount = Array.from(DB.followRelations.values())
    .filter(f => f.followingId === userId).length;

  res.json({ followers, totalCount, page: parseInt(page), limit: parseInt(limit) });
});

// Get user's following
app.get('/api/users/:id/following', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const { page = 1, limit = 20 } = req.query;
  
  const following = Array.from(DB.followRelations.values())
    .filter(f => f.followerId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice((page - 1) * limit, page * limit)
    .map(f => {
      const user = DB.users.get(f.followingId);
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        program: user.privacySettings?.showProgram !== false ? user.program : null,
        followedAt: f.createdAt
      };
    });

  const totalCount = Array.from(DB.followRelations.values())
    .filter(f => f.followerId === userId).length;

  res.json({ following, totalCount, page: parseInt(page), limit: parseInt(limit) });
});

// Get mutual friends (FR36)
app.get('/api/users/:id/mutual-friends', authenticateToken, (req, res) => {
  const targetUserId = req.params.id;
  
  // Get current user's following
  const myFollowing = new Set(
    Array.from(DB.followRelations.values())
      .filter(f => f.followerId === req.user.id)
      .map(f => f.followingId)
  );

  // Get target user's following
  const theirFollowing = new Set(
    Array.from(DB.followRelations.values())
      .filter(f => f.followerId === targetUserId)
      .map(f => f.followingId)
  );

  // Find mutual (both follow each other and I follow them)
  const mutualIds = [...myFollowing].filter(id => theirFollowing.has(id));
  
  const mutualFriends = mutualIds.map(id => {
    const user = DB.users.get(id);
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      program: user.privacySettings?.showProgram !== false ? user.program : null
    };
  });

  res.json({ mutualFriends, count: mutualFriends.length });
});

// ============================
// MARKETPLACE (FR37-40)
// ============================

// Get marketplace listings
app.get('/api/marketplace', authenticateToken, (req, res) => {
  const { category, minPrice, maxPrice, condition, search, page = 1, limit = 20 } = req.query;
  
  let listings = Array.from(DB.marketplaceListings.values())
    .filter(l => l.universityId === req.user.universityId && l.status === 'active');

  // Apply filters
  if (category) {
    listings = listings.filter(l => l.category === category);
  }
  if (minPrice) {
    listings = listings.filter(l => l.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    listings = listings.filter(l => l.price <= parseFloat(maxPrice));
  }
  if (condition) {
    listings = listings.filter(l => l.condition === condition);
  }
  if (search) {
    const query = search.toLowerCase();
    listings = listings.filter(l => 
      l.title.toLowerCase().includes(query) || 
      l.description.toLowerCase().includes(query)
    );
  }

  // Sort by recency
  listings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Paginate
  const total = listings.length;
  listings = listings.slice((page - 1) * limit, page * limit);

  // Add seller info
  const listingsWithSeller = listings.map(l => {
    const seller = DB.users.get(l.sellerId);
    return {
      ...l,
      seller: {
        id: seller.id,
        firstName: seller.firstName,
        lastName: seller.lastName,
        avatarUrl: seller.avatarUrl
      }
    };
  });

  res.json({ 
    listings: listingsWithSeller, 
    total, 
    page: parseInt(page), 
    limit: parseInt(limit),
    categories: ['textbooks', 'electronics', 'furniture', 'clothing', 'other']
  });
});

// Get single listing
app.get('/api/marketplace/:id', authenticateToken, (req, res) => {
  const listing = DB.marketplaceListings.get(req.params.id);
  if (!listing || listing.universityId !== req.user.universityId) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const seller = DB.users.get(listing.sellerId);
  res.json({
    ...listing,
    seller: {
      id: seller.id,
      firstName: seller.firstName,
      lastName: seller.lastName,
      avatarUrl: seller.avatarUrl,
      memberSince: seller.createdAt
    },
    isOwner: listing.sellerId === req.user.id
  });
});

// Create listing
app.post('/api/marketplace', authenticateToken, (req, res) => {
  const { title, description, price, category, condition, pickupLocation, images } = req.body;

  if (!title || !price || !category) {
    return res.status(400).json({ error: 'Title, price, and category are required' });
  }

  const listingId = uuidv4();
  const listing = {
    id: listingId,
    universityId: req.user.universityId,
    sellerId: req.user.id,
    title,
    description: description || '',
    price: parseFloat(price),
    currency: 'CAD',
    category,
    condition: condition || 'good',
    images: images || [],
    status: 'active',
    pickupLocation: pickupLocation || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  DB.marketplaceListings.set(listingId, listing);
  createAuditLog(req.user.id, 'create', 'listing', listingId, { title });

  res.status(201).json({ message: 'Listing created', listing });
});

// Update listing
app.patch('/api/marketplace/:id', authenticateToken, (req, res) => {
  const listing = DB.marketplaceListings.get(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (listing.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Not authorized to update this listing' });
  }

  const allowedFields = ['title', 'description', 'price', 'category', 'condition', 
                         'pickupLocation', 'images', 'status'];
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  }
  listing.updatedAt = new Date().toISOString();

  res.json({ message: 'Listing updated', listing });
});

// Delete listing
app.delete('/api/marketplace/:id', authenticateToken, (req, res) => {
  const listing = DB.marketplaceListings.get(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (listing.sellerId !== req.user.id && req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Not authorized to delete this listing' });
  }

  DB.marketplaceListings.delete(req.params.id);
  createAuditLog(req.user.id, 'delete', 'listing', req.params.id, { title: listing.title });

  res.json({ message: 'Listing deleted' });
});

// Message seller about listing
app.post('/api/marketplace/:id/message', authenticateToken, (req, res) => {
  const listing = DB.marketplaceListings.get(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const messageId = uuidv4();
  const marketplaceMessage = {
    id: messageId,
    listingId: listing.id,
    senderId: req.user.id,
    receiverId: listing.sellerId,
    message,
    isRead: false,
    createdAt: new Date().toISOString()
  };

  DB.marketplaceMessages.set(messageId, marketplaceMessage);

  // Notify seller
  createNotification(
    listing.sellerId,
    'MARKETPLACE_MESSAGE',
    '💬 New Marketplace Message',
    `${req.user.firstName} is interested in your listing: ${listing.title}`,
    { listingId: listing.id, messageId }
  );

  res.status(201).json({ message: 'Message sent to seller', messageId });
});

// Get messages for a listing (seller only)
app.get('/api/marketplace/:id/messages', authenticateToken, (req, res) => {
  const listing = DB.marketplaceListings.get(req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }

  if (listing.sellerId !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to view these messages' });
  }

  const messages = Array.from(DB.marketplaceMessages.values())
    .filter(m => m.listingId === listing.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(m => {
      const sender = DB.users.get(m.senderId);
      return {
        ...m,
        sender: {
          id: sender.id,
          firstName: sender.firstName,
          lastName: sender.lastName,
          avatarUrl: sender.avatarUrl
        }
      };
    });

  res.json(messages);
});

// ============================
// RECOMMENDATIONS (FR41-43)
// ============================

// Get recommended events feed
app.get('/api/recommendations/events', authenticateToken, (req, res) => {
  const { limit = 10 } = req.query;
  
  const events = Array.from(DB.events.values())
    .filter(e => 
      e.universityId === req.user.universityId && 
      e.status === 'PUBLISHED' &&
      new Date(e.startTime) > new Date() // Future events only
    );

  // Compute scores for each event
  const scoredEvents = events.map(event => {
    const { score, factors } = computeRecommendationScore(req.user, event, 'event');
    return { event, score, factors };
  });

  // Sort by score descending
  scoredEvents.sort((a, b) => b.score - a.score);

  // Return top N
  const recommendations = scoredEvents.slice(0, limit).map(({ event, score, factors }) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    startTime: event.startTime,
    endTime: event.endTime,
    location: event.location,
    category: event.category,
    attendeeCount: event.rsvpIds?.length || event.defaultAttendeeCount || 0,
    recommendationScore: Math.round(score * 100),
    matchReasons: Object.entries(factors)
      .filter(([_, v]) => v > 0.05)
      .map(([k, _]) => k)
  }));

  res.json({ recommendations, count: recommendations.length });
});

// Get recommended groups
app.get('/api/recommendations/groups', authenticateToken, (req, res) => {
  const { limit = 10 } = req.query;
  
  // Get groups user hasn't joined
  const userMemberships = new Set(
    Array.from(DB.memberships.values())
      .filter(m => m.userId === req.user.id)
      .map(m => m.groupId)
  );

  const groups = Array.from(DB.groups.values())
    .filter(g => 
      g.universityId === req.user.universityId &&
      !userMemberships.has(g.id)
    );

  // Compute scores
  const scoredGroups = groups.map(group => {
    const { score, factors } = computeRecommendationScore(req.user, group, 'group');
    return { group, score, factors };
  });

  scoredGroups.sort((a, b) => b.score - a.score);

  const recommendations = scoredGroups.slice(0, limit).map(({ group, score }) => ({
    id: group.id,
    name: group.name,
    description: group.description,
    category: group.category,
    memberCount: group.membershipIds?.length || group.defaultMemberCount || 0,
    recommendationScore: Math.round(score * 100)
  }));

  res.json({ recommendations, count: recommendations.length });
});

// Get personalized feed (mixed content)
app.get('/api/feed', authenticateToken, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  
  // Get all content types
  const events = Array.from(DB.events.values())
    .filter(e => e.universityId === req.user.universityId && e.status === 'PUBLISHED')
    .map(e => ({ ...e, contentType: 'event' }));

  const announcements = Array.from(DB.announcements.values())
    .filter(a => a.universityId === req.user.universityId)
    .map(a => ({ ...a, contentType: 'announcement' }));

  // Combine and score
  const allContent = [...events, ...announcements];
  
  const scoredContent = allContent.map(item => {
    const { score } = computeRecommendationScore(req.user, item, item.contentType);
    return { item, score };
  });

  // Sort by score with some recency weight
  scoredContent.sort((a, b) => {
    const recencyA = 1 / (1 + (Date.now() - new Date(a.item.createdAt).getTime()) / (24 * 60 * 60 * 1000));
    const recencyB = 1 / (1 + (Date.now() - new Date(b.item.createdAt).getTime()) / (24 * 60 * 60 * 1000));
    return (b.score + recencyB * 0.3) - (a.score + recencyA * 0.3);
  });

  // Paginate
  const paginatedContent = scoredContent
    .slice((page - 1) * limit, page * limit)
    .map(({ item, score }) => ({
      ...item,
      recommendationScore: Math.round(score * 100)
    }));

  res.json({ 
    feed: paginatedContent, 
    page: parseInt(page), 
    limit: parseInt(limit),
    hasMore: scoredContent.length > page * limit
  });
});

// Track interaction (for improving recommendations)
app.post('/api/interactions', authenticateToken, (req, res) => {
  const { contentType, contentId, interactionType } = req.body;
  
  if (!contentType || !contentId || !interactionType) {
    return res.status(400).json({ error: 'contentType, contentId, and interactionType required' });
  }

  const validInteractions = ['view', 'click', 'rsvp', 'like', 'share', 'bookmark'];
  if (!validInteractions.includes(interactionType)) {
    return res.status(400).json({ error: 'Invalid interaction type' });
  }

  const interactionId = uuidv4();
  DB.postInteractions.set(interactionId, {
    id: interactionId,
    userId: req.user.id,
    contentType,
    contentId,
    interactionType,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({ message: 'Interaction recorded' });
});

// ============================
// LLM CHATBOT (FR44-47)
// ============================

// Create or get chat conversation
app.post('/api/chatbot/conversations', authenticateToken, (req, res) => {
  const conversationId = uuidv4();
  
  DB.chatbotConversations.set(conversationId, {
    id: conversationId,
    userId: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageCount: 0
  });

  res.status(201).json({ conversationId });
});

// Send message to chatbot
app.post('/api/chatbot/conversations/:id/messages', authenticateToken, (req, res) => {
  const conversation = DB.chatbotConversations.get(req.params.id);
  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Save user message
  const userMessageId = uuidv4();
  DB.chatbotMessages.set(userMessageId, {
    id: userMessageId,
    conversationId: conversation.id,
    role: 'user',
    content: message,
    timestamp: new Date().toISOString()
  });

  // Generate bot response (simulated - in production would call LLM API)
  const botResponse = generateChatbotResponse(message, req.user);
  
  const botMessageId = uuidv4();
  DB.chatbotMessages.set(botMessageId, {
    id: botMessageId,
    conversationId: conversation.id,
    role: 'assistant',
    content: botResponse.text,
    suggestions: botResponse.suggestions,
    relatedContent: botResponse.relatedContent,
    timestamp: new Date().toISOString()
  });

  // Update conversation
  conversation.messageCount += 2;
  conversation.updatedAt = new Date().toISOString();

  res.json({
    userMessage: { id: userMessageId, content: message },
    botResponse: {
      id: botMessageId,
      content: botResponse.text,
      suggestions: botResponse.suggestions,
      relatedContent: botResponse.relatedContent
    }
  });
});

// Get conversation history
app.get('/api/chatbot/conversations/:id/messages', authenticateToken, (req, res) => {
  const conversation = DB.chatbotConversations.get(req.params.id);
  if (!conversation || conversation.userId !== req.user.id) {
    return res.status(404).json({ error: 'Conversation not found' });
  }

  const messages = Array.from(DB.chatbotMessages.values())
    .filter(m => m.conversationId === conversation.id)
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  res.json({ messages, conversationId: conversation.id });
});

// Simulated chatbot response generator
const generateChatbotResponse = (userMessage, user) => {
  const lowerMessage = userMessage.toLowerCase();
  let response = { text: '', suggestions: [], relatedContent: [] };

  // Event queries
  if (lowerMessage.includes('event') || lowerMessage.includes('happening') || lowerMessage.includes('going on')) {
    const upcomingEvents = Array.from(DB.events.values())
      .filter(e => e.universityId === user.universityId && e.status === 'PUBLISHED' && new Date(e.startTime) > new Date())
      .slice(0, 3);
    
    response.text = `Here are some upcoming events at your university:\n\n`;
    upcomingEvents.forEach(e => {
      response.text += `📅 **${e.title}**\n   ${new Date(e.startTime).toLocaleDateString()} at ${e.location}\n\n`;
    });
    response.suggestions = ['Tell me more about the first event', 'Show me sports events', 'How do I RSVP?'];
    response.relatedContent = upcomingEvents.map(e => ({ type: 'event', id: e.id, title: e.title }));
  }
  // Club/group queries
  else if (lowerMessage.includes('club') || lowerMessage.includes('group') || lowerMessage.includes('join')) {
    const groups = Array.from(DB.groups.values())
      .filter(g => g.universityId === user.universityId)
      .slice(0, 3);
    
    response.text = `Here are some popular groups you might be interested in:\n\n`;
    groups.forEach(g => {
      response.text += `👥 **${g.name}**\n   ${g.description.substring(0, 80)}...\n\n`;
    });
    response.suggestions = ['How do I join a club?', 'Show me academic clubs', 'Create a new group'];
    response.relatedContent = groups.map(g => ({ type: 'group', id: g.id, title: g.name }));
  }
  // Marketplace queries
  else if (lowerMessage.includes('buy') || lowerMessage.includes('sell') || lowerMessage.includes('textbook') || lowerMessage.includes('marketplace')) {
    const listings = Array.from(DB.marketplaceListings.values())
      .filter(l => l.universityId === user.universityId && l.status === 'active')
      .slice(0, 3);
    
    response.text = `Here's what's available in the marketplace:\n\n`;
    listings.forEach(l => {
      response.text += `🏷️ **${l.title}** - $${l.price}\n   ${l.condition} condition\n\n`;
    });
    response.suggestions = ['How do I post a listing?', 'Show me textbooks', 'Safety tips for buying'];
    response.relatedContent = listings.map(l => ({ type: 'listing', id: l.id, title: l.title }));
  }
  // Help/general queries
  else if (lowerMessage.includes('help') || lowerMessage.includes('how') || lowerMessage.includes('what')) {
    response.text = `I'm your campus assistant! I can help you with:\n\n`;
    response.text += `📅 **Events** - Find upcoming events, RSVP, create events\n`;
    response.text += `👥 **Groups & Clubs** - Discover and join clubs\n`;
    response.text += `📢 **Announcements** - Stay updated on campus news\n`;
    response.text += `🏷️ **Marketplace** - Buy/sell textbooks and items\n`;
    response.text += `👤 **Profile** - Update your interests and connect with others\n\n`;
    response.text += `What would you like to know more about?`;
    response.suggestions = ['Show me upcoming events', 'How do I join a club?', 'What\'s in the marketplace?'];
  }
  // Default response
  else {
    response.text = `Thanks for your message! I'm here to help you navigate campus life.\n\n`;
    response.text += `You can ask me about:\n- Upcoming events and activities\n- Clubs and groups to join\n- Marketplace listings\n- Campus announcements\n\n`;
    response.text += `What would you like to explore?`;
    response.suggestions = ['What events are happening?', 'Show me clubs', 'Browse marketplace'];
  }

  return response;
};

// ============================
// ADMIN ANALYTICS (FR24-27)
// ============================

// Get platform analytics (Admin only)
app.get('/api/admin/analytics', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const universityId = req.user.universityId;
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

  // User stats
  const users = Array.from(DB.users.values()).filter(u => u.universityId === universityId);
  const newUsersWeek = users.filter(u => new Date(u.createdAt) > weekAgo).length;
  const newUsersMonth = users.filter(u => new Date(u.createdAt) > monthAgo).length;

  // Event stats
  const events = Array.from(DB.events.values()).filter(e => e.universityId === universityId);
  const activeEvents = events.filter(e => e.status === 'PUBLISHED' && new Date(e.startTime) > now).length;
  const pendingEvents = events.filter(e => !e.isApproved).length;
  const totalRSVPs = events.reduce((sum, e) => sum + (e.rsvpIds?.length || 0), 0);

  // Group stats
  const groups = Array.from(DB.groups.values()).filter(g => g.universityId === universityId);
  const totalMemberships = Array.from(DB.memberships.values())
    .filter(m => groups.some(g => g.id === m.groupId)).length;

  // Marketplace stats
  const listings = Array.from(DB.marketplaceListings.values()).filter(l => l.universityId === universityId);
  const activeListings = listings.filter(l => l.status === 'active').length;

  // Engagement stats
  const interactions = Array.from(DB.postInteractions.values())
    .filter(i => new Date(i.timestamp) > weekAgo);
  const weeklyInteractions = interactions.length;

  res.json({
    users: {
      total: users.length,
      newThisWeek: newUsersWeek,
      newThisMonth: newUsersMonth,
      byRole: {
        students: users.filter(u => u.role === 'STUDENT').length,
        staff: users.filter(u => u.role === 'STAFF').length,
        admins: users.filter(u => u.role === 'ADMIN').length
      }
    },
    events: {
      total: events.length,
      active: activeEvents,
      pending: pendingEvents,
      totalRSVPs
    },
    groups: {
      total: groups.length,
      totalMemberships
    },
    marketplace: {
      totalListings: listings.length,
      activeListings
    },
    engagement: {
      weeklyInteractions,
      avgInteractionsPerUser: users.length > 0 ? (weeklyInteractions / users.length).toFixed(2) : 0
    }
  });
});

// Get audit logs (Admin only)
app.get('/api/admin/audit-logs', authenticateToken, (req, res) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { action, resourceType, page = 1, limit = 50 } = req.query;

  let logs = Array.from(DB.auditLogs.values())
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (action) {
    logs = logs.filter(l => l.action === action);
  }
  if (resourceType) {
    logs = logs.filter(l => l.resourceType === resourceType);
  }

  const total = logs.length;
  logs = logs.slice((page - 1) * limit, page * limit);

  // Add user info
  const logsWithUser = logs.map(log => {
    const user = DB.users.get(log.userId);
    return {
      ...log,
      user: user ? { firstName: user.firstName, lastName: user.lastName, email: user.email } : null
    };
  });

  res.json({ logs: logsWithUser, total, page: parseInt(page), limit: parseInt(limit) });
});

// ============================
// USER PREFERENCES (FR32-33)
// ============================

// Get user preferences
app.get('/api/preferences', authenticateToken, (req, res) => {
  const prefs = DB.userPreferences.get(req.user.id) || {
    userId: req.user.id,
    notifications: {
      eventReminders: true,
      newAnnouncements: true,
      groupUpdates: true,
      newFollowers: true,
      marketplaceMessages: true,
      recommendationDigest: 'weekly'
    },
    feed: {
      showRecommended: true,
      prioritizeFollowing: true
    }
  };
  res.json(prefs);
});

// Update user preferences
app.patch('/api/preferences', authenticateToken, (req, res) => {
  let prefs = DB.userPreferences.get(req.user.id);
  
  if (!prefs) {
    prefs = {
      userId: req.user.id,
      notifications: {},
      feed: {}
    };
  }

  if (req.body.notifications) {
    prefs.notifications = { ...prefs.notifications, ...req.body.notifications };
  }
  if (req.body.feed) {
    prefs.feed = { ...prefs.feed, ...req.body.feed };
  }
  prefs.updatedAt = new Date().toISOString();

  DB.userPreferences.set(req.user.id, prefs);
  res.json({ message: 'Preferences updated', preferences: prefs });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend for any non-API route in production (SPA fallback)
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
}

// Initialize data
initializeData();

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n🎓 ToCampus API v2.0 (SRS v3.0) running on port ${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 Data Summary:`);
    console.log(`   Universities: ${DB.universities.size}`);
    console.log(`   Users: ${DB.users.size}`);
    console.log(`   Events: ${DB.events.size}`);
    console.log(`   Groups: ${DB.groups.size}`);
    console.log(`   Marketplace Listings: ${DB.marketplaceListings.size}`);
    console.log(`   Follow Relations: ${DB.followRelations.size}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🌐 API: http://localhost:${PORT}`);
    console.log(`📱 Frontend: http://localhost:3000\n`);
  });
}

// Export for testing
module.exports = { app, DB };
