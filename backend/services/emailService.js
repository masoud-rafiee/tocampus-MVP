/**
 * Email Service - ToCampus Backend
 * 
 * Handles all email notifications for the platform
 * - Admin approval notifications
 * - Content rejection notices
 * - User account notifications
 * 
 * @version 1.0.0
 */

const nodemailer = require('nodemailer');

// Detect test/development environment
const isTestMode = process.env.NODE_ENV === 'test';
const isDevelopment = !process.env.EMAIL_USER || process.env.EMAIL_USER === 'noreply@tocampus.local';

// Email configuration (can be customized via env variables)
const emailConfig = {
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER || 'noreply@tocampus.local',
    pass: process.env.EMAIL_PASS || 'tocampus-dev-pass'
  }
};

// Create email transporter
// In test/dev mode with default creds, use test transporter
const transporter = (isTestMode || isDevelopment) 
  ? nodemailer.createTransport({ 
      host: 'localhost',
      port: 1025,
      ignoreTLS: true,
      secure: false
    })
  : nodemailer.createTransport(emailConfig);

// Email templates
const emailTemplates = {
  pendingApproval: (userName, contentType, contentTitle, adminDashboardUrl) => ({
    subject: `New ${contentType} Pending Approval - ${contentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">ToCampus Admin Approval Required</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px;">
            Hello Admin,
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            A new <strong>${contentType}</strong> has been submitted and is waiting for your review and approval.
          </p>
          <div style="background: white; border-left: 4px solid #667eea; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>${contentType} Title:</strong></p>
            <p style="margin: 8px 0 0 0; color: #667eea; font-size: 16px; font-weight: bold;">${contentTitle}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Please review the content to ensure it follows university policy and community guidelines before publication.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${adminDashboardUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
              View Approval Queue
            </a>
          </div>
          <div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #999;">
            <p style="margin: 0;">This is an automated notification from ToCampus.</p>
            <p style="margin: 5px 0 0 0;">Please do not reply to this email.</p>
          </div>
        </div>
      </div>
    `
  }),

  approvalNotification: (creatorName, contentType, contentTitle, approvalTime) => ({
    subject: `${contentType} Approved - ${contentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">✓ ${contentType} Approved!</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px;">
            Hi ${creatorName},
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Great news! Your ${contentType.toLowerCase()} has been reviewed and approved by our moderation team.
          </p>
          <div style="background: white; border-left: 4px solid #11998e; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>${contentType}:</strong></p>
            <p style="margin: 8px 0 0 0; color: #11998e; font-size: 16px; font-weight: bold;">${contentTitle}</p>
            <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Approved on ${approvalTime}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Your ${contentType.toLowerCase()} is now live and visible to the university community!
          </p>
          <div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #999;">
            <p style="margin: 0;">Thank you for using ToCampus!</p>
          </div>
        </div>
      </div>
    `
  }),

  rejectionNotification: (creatorName, contentType, contentTitle, rejectionReason) => ({
    subject: `${contentType} Needs Changes - ${contentTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; color: white; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0;">Review Required</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <p style="color: #333; font-size: 16px;">
            Hi ${creatorName},
          </p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">
            Thank you for submitting your ${contentType.toLowerCase()}. Our moderation team has reviewed it and we need you to make some adjustments before it can be published.
          </p>
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #333;"><strong>Reason for Changes:</strong></p>
            <p style="margin: 10px 0 0 0; color: #666; font-size: 14px; line-height: 1.6;">${rejectionReason}</p>
          </div>
          <p style="color: #666; font-size: 14px;">
            Please review the feedback above and update your ${contentType.toLowerCase()} accordingly. You can resubmit it for review once you've made the necessary changes.
          </p>
          <div style="border-top: 1px solid #ddd; padding-top: 20px; font-size: 12px; color: #999;">
            <p style="margin: 0;">Need help? Contact our support team.</p>
          </div>
        </div>
      </div>
    `
  })
};

/**
 * Send email to notify admin about pending content
 * @param {Array<string>} adminEmails - List of admin email addresses
 * @param {string} contentType - Type of content (Event, Announcement)
 * @param {string} contentTitle - Title of the content
 * @param {string} adminDashboardUrl - URL to admin approval queue
 */
async function sendPendingApprovalNotification(adminEmails, contentType, contentTitle, adminDashboardUrl) {
  // Skip email sending in test mode
  if (isTestMode) {
    console.log(`[TEST MODE] Skipped sending pending approval email to ${adminEmails.length} admin(s)`);
    return true;
  }

  try {
    const template = emailTemplates.pendingApproval('Admin', contentType, contentTitle, adminDashboardUrl);
    
    for (const email of adminEmails) {
      await transporter.sendMail({
        from: emailConfig.auth.user,
        to: email,
        subject: template.subject,
        html: template.html
      });
    }
    
    console.log(`✓ Pending approval email sent to ${adminEmails.length} admin(s)`);
    return true;
  } catch (error) {
    console.error('Failed to send pending approval email:', error.message);
    // Don't throw - allow app to continue even if email fails
    return false;
  }
}

/**
 * Send email to notify creator about content approval
 * @param {string} creatorEmail - Creator's email address
 * @param {string} creatorName - Creator's name
 * @param {string} contentType - Type of content (Event, Announcement)
 * @param {string} contentTitle - Title of the content
 */
async function sendApprovalNotification(creatorEmail, creatorName, contentType, contentTitle) {
  // Skip email sending in test mode
  if (isTestMode) {
    console.log(`[TEST MODE] Skipped sending approval notification to ${creatorEmail}`);
    return true;
  }

  try {
    const approvalTime = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const template = emailTemplates.approvalNotification(creatorName, contentType, contentTitle, approvalTime);
    
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: creatorEmail,
      subject: template.subject,
      html: template.html
    });
    
    console.log(`✓ Approval notification sent to ${creatorEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send approval notification:', error.message);
    return false;
  }
}

/**
 * Send email to notify creator about content rejection
 * @param {string} creatorEmail - Creator's email address
 * @param {string} creatorName - Creator's name
 * @param {string} contentType - Type of content (Event, Announcement)
 * @param {string} contentTitle - Title of the content
 * @param {string} rejectionReason - Reason for rejection
 */
async function sendRejectionNotification(creatorEmail, creatorName, contentType, contentTitle, rejectionReason) {
  // Skip email sending in test mode
  if (isTestMode) {
    console.log(`[TEST MODE] Skipped sending rejection notification to ${creatorEmail}`);
    return true;
  }

  try {
    const template = emailTemplates.rejectionNotification(creatorName, contentType, contentTitle, rejectionReason);
    
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: creatorEmail,
      subject: template.subject,
      html: template.html
    });
    
    console.log(`✓ Rejection notification sent to ${creatorEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send rejection notification:', error.message);
    return false;
  }
}

/**
 * Verify email configuration is working
 */
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('✓ Email service configured and ready');
    return true;
  } catch (error) {
    console.warn('⚠ Email service not fully configured. Check EMAIL_* environment variables.');
    console.warn('  Emails will not be sent until properly configured.');
    return false;
  }
}

module.exports = {
  sendPendingApprovalNotification,
  sendApprovalNotification,
  sendRejectionNotification,
  verifyEmailConfig
};
