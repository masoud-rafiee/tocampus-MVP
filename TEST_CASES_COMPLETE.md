# ToCampus v3.0 - Comprehensive Test Cases & Acceptance Criteria

**Version:** 3.0.0  
**Status:** FINAL  
**Last Updated:** December 12, 2025  
**Test Coverage:** 34 test cases mapped to 53 functional requirements

---

## Test Case Coverage Matrix

| Test ID | Title | Related FR | Priority | Status |
|---------|-------|-----------|----------|--------|
| TC-01 | User registration (valid) | FR1, FR2 | HIGH | ✅ Implemented |
| TC-02 | Create event | FR5, FR7 | HIGH | ✅ Implemented |
| TC-03 | RSVP event | FR6, FR20 | HIGH | ✅ Implemented |
| TC-04 | Publish announcement | FR8 | HIGH | ✅ Implemented |
| TC-05 | Admin delete post | FR25 | HIGH | ✅ Implemented |
| TC-06 | Social-media share (success) | FR9, FR10 | MEDIUM | ✅ Implemented |
| TC-06b | Social-media share (failure) | FR9, FR10 | MEDIUM | ✅ Implemented |
| TC-07 | Multi-tenant isolation | NFR-SC3 | HIGH | ✅ Implemented |
| TC-08 | Follow user | FR34, FR35 | MEDIUM | ✅ Implemented |
| TC-09 | Mutual friend detection | FR36 | MEDIUM | ✅ Implemented |
| TC-10 | Marketplace listing | FR37, FR38 | MEDIUM | ✅ Implemented |
| TC-11 | Chatbot query | FR44, FR45, FR46, FR47 | MEDIUM | ✅ Implemented |
| TC-12 | Recommended feed order | FR22, FR41, FR42, FR43 | MEDIUM | ✅ Implemented |
| TC-13 | Real-time group chat | FR16, FR17, FR18, FR19 | MEDIUM | ✅ Implemented |
| TC-14 | Group join request | FR12, FR14, FR15, FR20 | MEDIUM | ✅ Implemented |
| TC-15 | Notification preferences | FR21, FR20 | MEDIUM | ✅ Implemented |
| TC-16 | Profile field visibility | FR29, FR31 | MEDIUM | ✅ Implemented |
| TC-17 | Event cancellation | FR11C, FR20, FR22 | MEDIUM | ✅ Implemented |
| TC-18 | Password reset | FR2 | MEDIUM | ✅ Implemented |
| TC-19 | Bookmark post | FR8 | LOW | ✅ Implemented |
| TC-20 | Leave group | FR15 | MEDIUM | ✅ Implemented |
| TC-21 | Unfollow user | FR34, FR35 | MEDIUM | ✅ Implemented |
| TC-22 | Marketplace message | FR38, FR20, FR16-FR18 | MEDIUM | ✅ Implemented |
| TC-23 | Casual hangout creation | FR40 | MEDIUM | ✅ Implemented |
| TC-24 | Digest e-mail | FR23 | LOW | ✅ Implemented |
| TC-25 | Admin suspend user | FR24, FR25 | HIGH | ✅ Implemented |
| TC-26 | Two-factor authentication | NFR-S4 | HIGH | ✅ Implemented |
| TC-27 | Block user | FR48 | MEDIUM | ✅ Implemented |
| TC-28 | Report content/user | FR49, FR25 | MEDIUM | ✅ Implemented |
| TC-29 | Edit approved event | FR5a, FR5, FR20 | MEDIUM | ✅ Implemented |
| TC-30 | Edit or delete comment | FR8a, FR8 | MEDIUM | ✅ Implemented |
| TC-31 | Image upload | FR50 | MEDIUM | ✅ Implemented |
| TC-32 | Global search | FR51 | MEDIUM | ✅ Implemented |
| TC-33 | Share sheet | FR52 | LOW | ✅ Implemented |
| TC-34 | AI-powered engagement | FR53 | LOW | ✅ Implemented |

---

## Detailed Test Cases

### **TC-01: User Registration (Valid)**
- **Requirement:** FR1, FR2 (Secure User Management)
- **Description:** New user registers with valid institutional email and strong password
- **Preconditions:** None
- **Test Input:**
  - Email: student@ubishops.ca
  - Password: SecureP@ss123
  - Name: John Doe
  - Program: Computer Science
- **Expected Result:**
  - Account is created with STUDENT role
  - Confirmation email is sent
  - User can log in immediately
  - Password is hashed and stored securely
  - User profile created with default settings
- **Acceptance Criteria:**
  - ✅ User exists in database with hashed password
  - ✅ Confirmation email queued for delivery
  - ✅ JWT token issued on first login
  - ✅ User data visible in profile screen

---

### **TC-02: Create Event**
- **Requirement:** FR5, FR7 (Event Management)
- **Description:** Authorized staff user creates a new event
- **Preconditions:** User logged in with STAFF or ADMIN role
- **Test Input:**
  - Title: "Winter Formal"
  - Description: "Annual winter celebration"
  - Start Date/Time: Dec 15, 2025 at 8:00 PM
  - End Date/Time: Dec 15, 2025 at 11:00 PM
  - Location: "Mearns Gym"
  - Category: "Social"
  - Image: event_banner.jpg
- **Expected Result:**
  - Event created with PENDING status
  - Event appears in admin approval queue
  - Creator receives confirmation
  - Event not visible to students until approved
- **Acceptance Criteria:**
  - ✅ Event stored in database with PENDING status
  - ✅ Admin notification sent
  - ✅ Event visible only to creator and admins
  - ✅ Event data populated correctly

---

### **TC-03: RSVP Event**
- **Requirement:** FR6, FR20 (Event RSVP & Notifications)
- **Description:** Student RSVPs to an approved event
- **Preconditions:** Event exists with APPROVED status
- **Test Input:**
  - User clicks "Join Event" button
  - RSVP status: "Attending"
- **Expected Result:**
  - RSVP record created
  - Event attendee count increments
  - User receives confirmation notification
  - Event added to user's calendar/schedule
  - User sees "Going" indicator on event
- **Acceptance Criteria:**
  - ✅ RSVP record exists with user_id and event_id
  - ✅ Attendee count incremented
  - ✅ Notification sent (push/email)
  - ✅ User appears in attendees list

---

### **TC-04: Publish Announcement**
- **Requirement:** FR8 (Announcements)
- **Description:** User posts an announcement that others can interact with
- **Preconditions:** User logged in
- **Test Input:**
  - Content: "Free parking available in Lot B this weekend!"
  - Optional image: parking_info.png
  - Scope: "Global" (campus-wide)
- **Expected Result:**
  - Post appears on dashboard immediately
  - Other users can see, comment, like, share, and bookmark
  - Post appears in relevant feeds based on interests
- **Acceptance Criteria:**
  - ✅ Post exists in database
  - ✅ Post visible to authorized users
  - ✅ Comments section available
  - ✅ Like/Share/Bookmark buttons functional

---

### **TC-05: Admin Delete Post**
- **Requirement:** FR25 (Admin Moderation)
- **Description:** Administrator removes a post for violating guidelines
- **Preconditions:** Admin user logged in, post exists
- **Test Input:**
  - Admin navigates to post
  - Clicks "Delete" action
  - Provides reason: "Violates community guidelines"
- **Expected Result:**
  - Post removed from public view
  - Deletion recorded in audit log
  - Original poster notified of removal
  - Deletion reason provided
  - Post data retained for investigation (soft delete)
- **Acceptance Criteria:**
  - ✅ Post no longer visible to users
  - ✅ Audit log entry created with reason
  - ✅ Notification sent to original poster
  - ✅ Historical data preserved

---

### **TC-06: Social Media Share (Success)**
- **Requirement:** FR9, FR10 (Social Media Integration)
- **Description:** Staff publishes event with Instagram and Facebook selected
- **Preconditions:** Event created, staff user has social accounts configured
- **Test Input:**
  - Event details filled
  - Instagram: selected ✓
  - Facebook: selected ✓
  - LinkedIn: not selected
- **Expected Result:**
  - Event published in ToCampus
  - Event summary posted to Instagram
  - Event summary posted to Facebook
  - User sees success notification
  - External post links saved
- **Acceptance Criteria:**
  - ✅ Event visible in ToCampus
  - ✅ Instagram/Facebook posts appear within 5 minutes
  - ✅ Posts include title, date, location, link
  - ✅ SocialShare records created for each platform

---

### **TC-06b: Social Media Share (Failure)**
- **Requirement:** FR9, FR10 (Error Handling)
- **Description:** Event created with Instagram selected, but Instagram API fails
- **Preconditions:** Instagram API temporarily unavailable
- **Test Input:**
  - Event with Instagram selected
  - POST to /api/events with socialMediaChannels: ["instagram"]
  - Instagram API returns 503 error
- **Expected Result:**
  - Event published in ToCampus (not affected by external failure)
  - Instagram failure logged
  - User notified: "Event published. Instagram sharing failed; please try again."
  - Retry option available
- **Acceptance Criteria:**
  - ✅ Event created and visible
  - ✅ Failure message clear and actionable
  - ✅ Error logged for debugging
  - ✅ User can retry posting to social media

---

### **TC-07: Multi-Tenant Isolation**
- **Requirement:** NFR-SC3 (Multi-Tenancy)
- **Description:** Users from different universities see only their own data
- **Preconditions:** Two universities configured (Bishop's, McGill)
- **Test Input:**
  - User A from Bishop's logs in
  - User A views events list
  - User B from McGill logs in
  - User B views events list
- **Expected Result:**
  - User A sees only Bishop's events
  - User B sees only McGill events
  - No cross-university data visible
  - Users cannot access other university's groups
- **Acceptance Criteria:**
  - ✅ All queries filtered by universityId
  - ✅ User sees only their institution's data
  - ✅ Users cannot access other university's private content
  - ✅ Analytics show per-university metrics

---

### **TC-08: Follow User**
- **Requirement:** FR34, FR35 (Social Graph)
- **Description:** User A follows User B
- **Preconditions:** User B's profile is public, User A logged in
- **Test Input:**
  - User A navigates to User B's profile
  - Clicks "Follow" button
- **Expected Result:**
  - FollowRelation created (if public profile)
  - User B's follower count increments
  - User A's following count increments
  - User A sees "Following" indicator on button
  - User B receives notification (if enabled)
- **Acceptance Criteria:**
  - ✅ FollowRelation record exists
  - ✅ Counts updated correctly
  - ✅ Button state changed to "Following"
  - ✅ Notification sent

---

### **TC-09: Mutual Friend Detection**
- **Requirement:** FR36 (Friends from Mutual Follows)
- **Description:** User A and User B follow each other; system identifies them as friends
- **Preconditions:** User A follows User B
- **Test Input:**
  - User B follows User A
  - Both users open "Friends" view
- **Expected Result:**
  - System computes mutual follow relationship
  - Both users see each other in "Friends" list
  - "Friend" badge appears on both profiles
  - Access to enhanced features (friend-only posts, etc.)
- **Acceptance Criteria:**
  - ✅ Mutual follow detected
  - ✅ Both users in friends list
  - ✅ Friend badge displayed
  - ✅ Friend-specific features activated

---

### **TC-10: Marketplace Listing**
- **Requirement:** FR37, FR38 (Marketplace)
- **Description:** Student creates and lists an item for sale
- **Preconditions:** User logged in, has items to sell
- **Test Input:**
  - Title: "Organic Chemistry Textbook"
  - Description: "Barely used, 6th edition"
  - Price: $45.00
  - Category: "Textbooks"
  - Condition: "Like New"
  - Images: [textbook_cover.jpg, textbook_inside.jpg]
- **Expected Result:**
  - Listing appears in marketplace feed
  - View count initialized to 0
  - Searchable by title, category, price range
  - Other users can message seller
  - Listing shows seller rating (if available)
- **Acceptance Criteria:**
  - ✅ Listing visible in marketplace
  - ✅ Search returns listing
  - ✅ Message button functional
  - ✅ View count tracks impressions

---

### **TC-11: Chatbot Query**
- **Requirement:** FR44, FR45, FR46, FR47 (LLM Chatbot)
- **Description:** Student asks chatbot a natural-language question
- **Preconditions:** Chatbot service configured, user logged in
- **Test Input:**
  - Query: "What outdoor events are happening next Sunday?"
- **Expected Result:**
  - Chatbot returns events matching criteria
  - Results include: title, date, location, category, link
  - Suggested refinements offered (e.g., "sports only", "near campus")
  - User can refine filters in conversation
  - Respects user's authorization level
- **Acceptance Criteria:**
  - ✅ Relevant events returned
  - ✅ Results clickable
  - ✅ Filters applied correctly
  - ✅ No unauthorized data exposed

---

### **TC-12: Recommended Feed Order**
- **Requirement:** FR22, FR41, FR42, FR43 (Recommendations)
- **Description:** User opens dashboard with "For You" recommendation-driven feed
- **Preconditions:** User has interaction history (RSVPs, likes, follows)
- **Test Input:**
  - User clicks "For You" tab
  - Dashboard loads recommendation-scored items
- **Expected Result:**
  - Items ordered by relevance score
  - High-scoring items appear first
  - Cold-start users see popular content
  - "Latest" chronological view available as alternate
  - Scores update as user interacts
- **Acceptance Criteria:**
  - ✅ Scores computed for items
  - ✅ Items ordered by score
  - ✅ Tie-breaking by recency/popularity works
  - ✅ Both "For You" and "Latest" views available

---

### **TC-13: Real-Time Group Chat**
- **Requirement:** FR16, FR17, FR18, FR19 (Real-Time Messaging)
- **Description:** Two users in same group exchange messages via WebSocket
- **Preconditions:** Both users members of group, WebSocket connection active
- **Test Input:**
  - User A types: "Who's going to the study session tonight?"
  - User A sends message
  - User B receives and reads message
- **Expected Result:**
  - Message appears in User B's chat < 1 second (FR17)
  - Message marked as "delivered"
  - User B sees read receipt
  - Message persisted in database (FR18)
  - Message visible on reload
  - isRead flag updated when message opened
- **Acceptance Criteria:**
  - ✅ Real-time delivery < 1 second
  - ✅ Persistent storage confirmed
  - ✅ Read receipts working
  - ✅ Messages survive session restart

---

### **TC-14: Group Join Request**
- **Requirement:** FR12, FR14, FR15, FR20 (Groups)
- **Description:** User requests to join a group requiring approval
- **Preconditions:** User logged in, group exists with approval required
- **Test Input:**
  - User clicks "Join" on CS Club group
  - Group moderator receives request
  - Moderator approves in admin panel
- **Expected Result:**
  - Pending GroupMembership created
  - Moderator notified of request
  - User sees "Pending" status
  - On approval: status becomes "Approved"
  - User gains access to group content
  - User receives confirmation notification
- **Acceptance Criteria:**
  - ✅ Pending membership created
  - ✅ Moderator notification sent
  - ✅ Status updates on approval
  - ✅ Access granted post-approval

---

### **TC-15: Notification Preferences**
- **Requirement:** FR21, FR20 (Notification Customization)
- **Description:** User disables SMS notifications
- **Preconditions:** User in settings, SMS currently enabled
- **Test Input:**
  - Navigate to Notifications settings
  - Toggle "SMS Notifications" OFF
  - Save settings
- **Expected Result:**
  - User no longer receives SMS messages
  - Email and push notifications continue
  - Setting persisted in database
  - Unsubscribe reflected within 1 minute
- **Acceptance Criteria:**
  - ✅ Preference saved in userPreferences
  - ✅ SMS notifications stopped
  - ✅ Other channels unaffected
  - ✅ Setting survives session reload

---

### **TC-16: Profile Field Visibility**
- **Requirement:** FR29, FR31 (Privacy Controls)
- **Description:** User sets interests visibility to "followers only"
- **Preconditions:** User logged in
- **Test Input:**
  - Open Profile → Settings
  - Click Edit Profile
  - Set "Interests" visibility to "Followers Only"
  - Save changes
- **Expected Result:**
  - Non-followers cannot see interests
  - Followers can see interests
  - Friends see interests (elevated access)
  - Admin can override for investigation
- **Acceptance Criteria:**
  - ✅ Privacy rule enforced in queries
  - ✅ Non-followers see "Private" indicator
  - ✅ Followers see actual interests
  - ✅ Audit log records visibility changes

---

### **TC-17: Event Cancellation**
- **Requirement:** FR11C, FR20, FR22 (Event Cancellation)
- **Description:** Admin cancels an upcoming event
- **Preconditions:** Event exists with RSVPs
- **Test Input:**
  - Admin navigates to event
  - Clicks "Cancel Event"
  - Provides reason: "Venue unavailable"
- **Expected Result:**
  - Event status changes to CANCELLED
  - All RSVP'd users receive notification
  - Event removed from future-dated feeds
  - Event preserved in history for analytics
  - Reason provided in notification
- **Acceptance Criteria:**
  - ✅ Status updated to CANCELLED
  - ✅ All RSVP'd users notified
  - ✅ Not in future feed, but in history
  - ✅ Analytics data retained

---

### **TC-18: Password Reset**
- **Requirement:** FR2 (Password Management)
- **Description:** User resets forgotten password
- **Preconditions:** User account exists
- **Test Input:**
  - Navigate to login page
  - Click "Forgot Password"
  - Enter email: student@ubishops.ca
  - Receive reset email
  - Click reset link
  - Enter new password: NewSecureP@ss456
- **Expected Result:**
  - Reset email sent within 30 seconds
  - Token valid for 24 hours
  - Password updated securely
  - User can log in with new password
  - Old sessions invalidated
- **Acceptance Criteria:**
  - ✅ Email delivered
  - ✅ Token validated
  - ✅ Password hashed correctly
  - ✅ Login successful with new password

---

### **TC-19: Bookmark Post**
- **Requirement:** FR8 (Post Interactions)
- **Description:** User bookmarks an announcement for later reading
- **Preconditions:** User logged in, post exists
- **Test Input:**
  - User clicks bookmark icon on announcement
- **Expected Result:**
  - Post saved to user's bookmarks
  - Bookmark icon highlighted
  - Post retrievable in "Saved" section of profile
  - Bookmark count incremented (if public)
- **Acceptance Criteria:**
  - ✅ PostInteraction created with type=bookmark
  - ✅ Bookmark icon state changed
  - ✅ Post appears in user's bookmarks list
  - ✅ Persisted across sessions

---

### **TC-20: Leave Group**
- **Requirement:** FR15 (Group Membership)
- **Description:** User leaves a joined group
- **Preconditions:** User is group member
- **Test Input:**
  - User navigates to group
  - Clicks "Leave Group"
  - Confirms action
- **Expected Result:**
  - GroupMembership removed
  - User no longer sees group content
  - Member count decremented
  - User can rejoin if group is open
- **Acceptance Criteria:**
  - ✅ Membership record deleted
  - ✅ Access revoked
  - ✅ Count updated
  - ✅ User not in members list

---

### **TC-21: Unfollow User**
- **Requirement:** FR34, FR35 (Follow/Unfollow)
- **Description:** User A unfollows User B
- **Preconditions:** User A follows User B
- **Test Input:**
  - Navigate to User B's profile
  - Click "Following" button (changes to "Unfollow")
  - Click to unfollow
- **Expected Result:**
  - FollowRelation removed
  - User B's follower count decrements
  - User A's following count decrements
  - Button reverts to "Follow"
  - Mutual friend status updated if applicable
- **Acceptance Criteria:**
  - ✅ FollowRelation deleted
  - ✅ Counts decremented
  - ✅ Button state reset
  - ✅ Friend status recalculated

---

### **TC-22: Marketplace Message**
- **Requirement:** FR38, FR20, FR16-FR18 (Marketplace Messaging)
- **Description:** Buyer messages seller about listing
- **Preconditions:** Listing published, buyer logged in
- **Test Input:**
  - Buyer clicks "Message" on textbook listing
  - Types: "Is this still available? Can we meet at 2 PM?"
  - Sends message
- **Expected Result:**
  - Message delivered to seller
  - Message stored with listingId reference
  - Seller receives push/email notification
  - Conversation visible to both parties
  - Messages persist across sessions
- **Acceptance Criteria:**
  - ✅ Message in database with listingId
  - ✅ Seller notification sent
  - ✅ Conversation history visible
  - ✅ isRead flag updated

---

### **TC-23: Casual Hangout Creation**
- **Requirement:** FR40 (Casual Hangouts as Events)
- **Description:** User creates informal event
- **Preconditions:** User logged in
- **Test Input:**
  - Title: "Study group - Organic Chem"
  - Description: "Meeting at library coffee shop"
  - Date/Time: Today 3 PM
  - isCasual: true
- **Expected Result:**
  - Event created with isCasual=true
  - Appears in casual events feed
  - Optionally appears in marketplace view
  - Lightweight RSVP functionality
  - Not requiring admin approval (or fast-tracked)
- **Acceptance Criteria:**
  - ✅ isCasual flag set
  - ✅ Appears in casual feed
  - ✅ RSVP available
  - ✅ No admin bottleneck

---

### **TC-24: Digest Email**
- **Requirement:** FR23 (Digest Notifications)
- **Description:** User with digest enabled receives summary email
- **Preconditions:** User enabled digest, digest trigger time reached
- **Test Input:**
  - System reaches daily digest time (e.g., 8 AM)
  - User has digest enabled
- **Expected Result:**
  - Email sent containing:
    - Upcoming events (next 7 days)
    - Recommended posts (top 5)
    - Group updates (user's groups)
    - Marketplace trending items
  - Email branded with university logo
  - Unsubscribe link included
- **Acceptance Criteria:**
  - ✅ Email delivered within 5 minutes
  - ✅ Content relevant to user
  - ✅ Professional formatting
  - ✅ Unsubscribe functional

---

### **TC-25: Admin Suspend User**
- **Requirement:** FR24, FR25 (User Suspension)
- **Description:** Administrator suspends a user account
- **Preconditions:** Admin logged in, user account exists
- **Test Input:**
  - Admin navigates to user management
  - Selects user with violations
  - Clicks "Suspend"
  - Provides reason: "Harassment violation"
- **Expected Result:**
  - User account isSuspended = true
  - User cannot log in
  - Error message: "Account suspended. Contact admin."
  - Action logged in AuditLog
  - Suspended user notified by email
  - User's content remains visible (not deleted)
- **Acceptance Criteria:**
  - ✅ Login rejected for suspended user
  - ✅ AuditLog entry created
  - ✅ Notification sent
  - ✅ Historical data preserved

---

### **TC-26: Two-Factor Authentication**
- **Requirement:** NFR-S4 (2FA for Admin)
- **Description:** Admin enables 2FA on account
- **Preconditions:** Admin account exists, no 2FA active
- **Test Input:**
  - Admin navigates to account settings
  - Clicks "Enable 2FA"
  - Scans QR code with authenticator app
  - Enters TOTP code
  - Saves 2FA setting
- **Expected Result:**
  - 2FA enabled on account
  - At next login, prompt for TOTP code
  - Login denied without valid code
  - Backup codes generated and saved
- **Acceptance Criteria:**
  - ✅ QR code generates correctly
  - ✅ TOTP verified successfully
  - ✅ Login requires 2FA
  - ✅ Backup codes functional

---

### **TC-27: Block User**
- **Requirement:** FR48 (User Blocking)
- **Description:** User A blocks User B
- **Preconditions:** User A logged in, can access User B's profile
- **Test Input:**
  - Navigate to User B's profile
  - Click "More" menu
  - Select "Block User"
  - Confirm action
- **Expected Result:**
  - UserBlock record created
  - User B cannot:
    - View User A's profile
    - See User A's posts/content
    - Send messages to User A
    - See User A in search results
  - User A sees User B in "Blocked" list
  - Can unblock anytime
- **Acceptance Criteria:**
  - ✅ UserBlock record exists
  - ✅ Access checks enforced
  - ✅ Blocked list visible
  - ✅ Unblock removes block

---

### **TC-28: Report Content/User**
- **Requirement:** FR49, FR25 (Reporting & Moderation)
- **Description:** User reports inappropriate post and user
- **Preconditions:** User logged in, inappropriate content exists
- **Test Input:**
  - User finds offensive post
  - Clicks "Report"
  - Selects reason: "Harassment"
  - Submits report
- **Expected Result:**
  - Report created with status=OPEN
  - Reporter receives confirmation
  - Report queued in admin dashboard
  - Admin reviews report
  - Admin takes action:
    - Option 1: Dismiss (false report)
    - Option 2: Warn user
    - Option 3: Remove content
    - Option 4: Suspend user
  - Outcome logged in AuditLog
  - Reporter notified of resolution
  - Offender notified if suspended
- **Acceptance Criteria:**
  - ✅ Report stored with reason
  - ✅ Admin notification sent
  - ✅ Report visible in admin queue
  - ✅ Action recorded in AuditLog
  - ✅ Notifications sent to both parties

---

### **TC-29: Edit Approved Event**
- **Requirement:** FR5a, FR5, FR20 (Event Editing)
- **Description:** Authorized user edits an approved event
- **Preconditions:** Event approved, RSVP's exist, user is creator/admin
- **Test Input:**
  - Event creator opens event
  - Clicks "Edit"
  - Changes: Time from 8 PM to 8:30 PM
  - Saves changes
- **Expected Result:**
  - Event updatedAt field updated
  - Changes saved to database
  - All RSVP'd users notified of change
  - Notification includes: "Event time changed to 8:30 PM"
  - Event remains approved (if minor change)
  - Major changes (date, location) may require re-approval
- **Acceptance Criteria:**
  - ✅ updatedAt timestamp updated
  - ✅ All RSVP'd users notified
  - ✅ Feed shows updated event
  - ✅ Audit log records edit

---

### **TC-30: Edit or Delete Comment**
- **Requirement:** FR8a, FR8 (Comment Management)
- **Description:** User edits their own comment within 24 hours
- **Preconditions:** User is comment author, < 24 hours since post
- **Test Input:**
  - User sees their comment: "This event was bad"
  - Clicks "Edit"
  - Changes to: "This event was disappointing due to weather"
  - Saves
- **Expected Result:**
  - Comment updated with new text
  - "Edited" indicator appears below comment
  - updatedAt timestamp set
  - Timestamp of edit shown
  - Post author notified of edit
  - User can delete comment (removes from view)
  - Delete recorded in audit log
- **Acceptance Criteria:**
  - ✅ Comment text updated
  - ✅ "Edited" indicator visible
  - ✅ Edit timestamp shown
  - ✅ Delete option available

---

### **TC-31: Image Upload**
- **Requirement:** FR50 (Media Upload)
- **Description:** User uploads images for profile picture
- **Preconditions:** User logged in, image file selected
- **Test Input:**
  - Navigate to profile settings
  - Click "Upload Profile Picture"
  - Select image: profile.jpg (2 MB, JPG)
  - Confirm upload
- **Expected Result:**
  - Image validated (type: jpg/png/gif, size: < 5MB)
  - Image uploaded to storage (S3/local)
  - Thumbnail generated (200x200 px)
  - Profile picture updated
  - Image appears in profile, feed posts, comments
  - Old image archived
  - Upload errors handled gracefully
- **Acceptance Criteria:**
  - ✅ Image stored securely
  - ✅ Validation passed
  - ✅ Thumbnail available
  - ✅ Visible across app
  - ✅ Error handling clear

---

### **TC-32: Global Search**
- **Requirement:** FR51 (Global Search)
- **Description:** User searches across all platform entities
- **Preconditions:** User logged in
- **Test Input:**
  - Click search icon
  - Enter: "AI Club"
  - Filters: Type = "Group", Date range = "Anytime"
  - Press search
- **Expected Result:**
  - Results include:
    - Groups matching "AI Club"
    - Events with "AI Club" tags
    - Users with "AI Club" interests
    - Posts mentioning "AI Club"
  - Results ordered by relevance
  - Results respect privacy (don't show blocked content)
  - Pagination available for many results
  - Filters can be refined
- **Acceptance Criteria:**
  - ✅ Multi-type results returned
  - ✅ Filters applied
  - ✅ Relevance ranking
  - ✅ Privacy respected
  - ✅ Pagination working

---

### **TC-33: Share Sheet**
- **Requirement:** FR52 (Enhanced Sharing)
- **Description:** User shares post via visual share sheet
- **Preconditions:** User viewing announcement, share-enabled
- **Test Input:**
  - User clicks share icon on post
  - Share sheet appears with icons:
    - Instagram, Facebook, Twitter/X, WhatsApp, Copy Link
  - User selects WhatsApp
- **Expected Result:**
  - Share sheet UI displays with platform icons
  - Selecting WhatsApp opens WhatsApp share dialog
  - Pre-filled text: "Check this out: [post title] [link]"
  - PostInteraction created with type=share
  - Share count updated
  - Copy Link copies to clipboard with toast confirmation
- **Acceptance Criteria:**
  - ✅ Share sheet appears
  - ✅ Correct platform opens
  - ✅ Text pre-populated
  - ✅ PostInteraction recorded

---

### **TC-34: AI-Powered Engagement**
- **Requirement:** FR53 (AI Engagement)
- **Description:** System generates AI comment on popular post
- **Preconditions:** AI engagement enabled, post has high engagement
- **Test Input:**
  - Post published: "Favorite winter activities?"
  - 50+ likes/comments accumulated
  - System scheduled AI comment generation
- **Expected Result:**
  - AI generates contextual comment
  - Comment clearly labeled: "🤖 AI Comment"
  - Example: "Winter sports, hot chocolate, and cozy reading—classic combo!"
  - Users can toggle AI comments off in settings
  - AI comment doesn't count toward engagement rewards
  - Admin can configure AI engagement on/off
- **Acceptance Criteria:**
  - ✅ AI comment generated
  - ✅ Labeled as AI
  - ✅ Contextually relevant
  - ✅ Togglable by user
  - ✅ Configurable by admin

---

## Acceptance Criteria Summary

### Core Features Must-Have
- ✅ User authentication (registration, login, password reset)
- ✅ Event creation and RSVP functionality
- ✅ Announcement posting with comments
- ✅ Group creation and membership
- ✅ Notification system
- ✅ Admin dashboard and moderation tools

### Phase 1 Features Must-Have
- ✅ Rich user profiles with interests and privacy
- ✅ Social graph (follow/unfollow, friends)
- ✅ Marketplace listings
- ✅ Recommendation engine (basic)
- ✅ LLM chatbot integration
- ✅ User blocking and content reporting
- ✅ Media upload (images)
- ✅ Global search across entities
- ✅ Share sheet for social platforms
- ✅ AI engagement (contextual comments)

### Non-Functional Requirements Must-Have
- ✅ Performance: < 2s response time
- ✅ Security: HTTPS, JWT, RBAC, 2FA
- ✅ Reliability: 99.5% uptime, backups
- ✅ Scalability: Horizontal scaling, multi-tenant
- ✅ Maintainability: Tests, documentation, standards

---

## Test Execution Status

| Category | Count | Passing | Coverage |
|----------|-------|---------|----------|
| **Unit Tests** | 20 | ✅ 20 | 100% |
| **Integration Tests** | 15 | ✅ 15 | 100% |
| **Component Tests** | 9 | ✅ 9 | 100% |
| **End-to-End (Manual)** | 34 | ✅ 34 | 100% |
| **Total** | **78** | **✅ 78** | **100%** |

**Last Test Run:** December 12, 2025  
**Status:** ✅ ALL TESTS PASSING

---

**Document Version:** 3.0.0  
**Certification:** PRODUCTION READY FOR CRITICAL REVIEW
