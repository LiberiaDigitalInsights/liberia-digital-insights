// Email service for newsletter system
import nodemailer from "nodemailer";

// Configure email transporter (use environment variables in production)
let transporter;

console.log("Checking SMTP configuration...");
console.log("SMTP_USER:", process.env.SMTP_USER ? "SET" : "NOT SET");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "SET" : "NOT SET");

// Only create transporter if SMTP credentials are provided
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log("Creating real SMTP transporter...");
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.log("SMTP credentials not found, using mock transporter...");
  // Create a mock transporter for development/testing
  transporter = {
    sendMail: async (options) => {
      console.log("📧 Email would be sent:", {
        to: options.to,
        subject: options.subject,
        from: options.from,
      });
      return { messageId: "mock-" + Date.now() };
    },
  };
}

class EmailService {
  async sendWelcomeEmail(subscriber) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@liberiadigitalinsights.com",
      to: subscriber.email,
      subject: "Welcome to Liberia Digital Insights Newsletter!",
      html: this.generateWelcomeTemplate(subscriber),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${subscriber.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      // Don't throw the error, just log it and return false
      // This prevents the subscription from failing if email sending fails
      return false;
    }
  }

  async sendNewsletter(newsletter, subscribers) {
    const results = [];

    for (const subscriber of subscribers) {
      if (subscriber.status !== "active") continue;

      const mailOptions = {
        from: process.env.FROM_EMAIL || "noreply@liberiadigitalinsights.com",
        to: subscriber.email,
        subject: newsletter.subject,
        html: this.generateNewsletterTemplate(newsletter, subscriber),
      };

      try {
        await transporter.sendMail(mailOptions);
        results.push({ email: subscriber.email, status: "sent" });
      } catch (error) {
        console.error(
          `Failed to send newsletter to ${subscriber.email}:`,
          error,
        );
        results.push({
          email: subscriber.email,
          status: "failed",
          error: error.message,
        });
      }
    }

    return results;
  }

  async sendTalentSubmissionNotification(talent) {
    // Notify admin about new talent submission
    const adminEmail =
      process.env.ADMIN_EMAIL || process.env.SMTP_USER || "admin@example.com";

    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@liberiadigitalinsights.com",
      to: adminEmail,
      subject: `New Talent Submission: ${talent.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 0; background-color: #f4f4f5; }
            .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb; }
            .header { background: #882627; color: #ffffff; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .field { margin-bottom: 15px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
            .label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; display: block; }
            .value { font-size: 15px; color: #111827; font-weight: 500; display: block; margin-top: 2px; }
            .button { display: inline-block; padding: 12px 24px; background: #882627; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0; font-size: 18px;">New Talent Submission</h2>
            </div>
            <div class="content">
              <p>A new talent profile has been submitted and is awaiting review.</p>
              
              <div class="field">
                <span class="label">Name</span>
                <span class="value">${talent.name}</span>
              </div>
              <div class="field">
                <span class="label">Role</span>
                <span class="value">${talent.role}</span>
              </div>
              <div class="field">
                <span class="label">Category</span>
                <span class="value">${talent.category}</span>
              </div>
              <div class="field">
                <span class="label">Status</span>
                <span class="value">${talent.status}</span>
              </div>
              <div class="field" style="border:none;">
                <span class="label">Bio Snippet</span>
                <span class="value">${talent.bio.substring(0, 150)}${talent.bio.length > 150 ? "..." : ""}</span>
              </div>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/admin/talent" class="button">Review Submission</a>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Talent submission notification sent to ${adminEmail}`);
      return true;
    } catch (error) {
      console.error("Failed to send talent notification:", error);
      return false;
    }
  }

  generateWelcomeTemplate(subscriber) {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/unsubscribe?token=${subscriber.unsubscribe_token}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Liberia Digital Insights</title>
        <style>
          body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f5;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f4f5;
            padding: 40px 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .header { 
            background-color: #882627; 
            color: #ffffff; 
            padding: 40px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: -0.025em;
            font-weight: 800;
          }
          .content { 
            padding: 40px; 
          }
          .welcome-text {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 24px;
          }
          .bullet-list {
            margin: 24px 0;
            padding: 0;
            list-style: none;
          }
          .bullet-item {
            margin-bottom: 12px;
            padding-left: 24px;
            position: relative;
          }
          .bullet-item::before {
            content: "•";
            color: #882627;
            font-weight: bold;
            position: absolute;
            left: 0;
          }
          .button-container {
            text-align: center;
            margin: 32px 0;
          }
          .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background-color: #882627; 
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px;
          }
          .footer { 
            padding: 24px 40px; 
            text-align: center; 
            font-size: 13px; 
            color: #6b7280; 
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .footer a {
            color: #882627;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>LIBERIA DIGITAL INSIGHTS</h1>
            </div>
            <div class="content">
              <div class="welcome-text">Thanks for joining us!</div>
              <p>Hi ${subscriber.name},</p>
              <p>Thank you for subscribing to the Liberia Digital Insights newsletter! We're excited to have you join our community of tech enthusiasts and professionals.</p>
              
              <p><strong>What to expect in your inbox:</strong></p>
              <ul class="bullet-list">
                <li class="bullet-item">Weekly tech news and insights from Liberia's growing ecosystem</li>
                <li class="bullet-item">Exclusive interviews with industry leaders</li>
                <li class="bullet-item">Analysis of digital transformation trends</li>
                <li class="bullet-item">Upcoming tech events and training opportunities</li>
              </ul>
              
              <p>Stay tuned for our next update where we'll bring you the latest move in Liberia's tech scene.</p>
              
              <div class="button-container">
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" class="button">Explore Our Website</a>
              </div>
              
              <p style="font-size: 14px; color: #4b5563;">
                Best regards,<br>
                <strong>The Liberia Digital Insights Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>You're receiving this because you subscribed via our website.</p>
              <p>
                <a href="${unsubscribeUrl}">Unsubscribe</a> &bull; 
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateNewsletterTemplate(newsletter, subscriber) {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/unsubscribe?token=${subscriber.unsubscribe_token}`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletter.subject}</title>
        <style>
          body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f5;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f4f5;
            padding: 40px 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .header { 
            background-color: #882627; 
            color: #ffffff; 
            padding: 40px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: -0.025em;
            font-weight: 800;
          }
          .content { 
            padding: 40px; 
          }
          .newsletter-title {
            font-size: 24px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 24px;
            line-height: 1.2;
          }
          .cover-image {
            width: 100%;
            max-width: 600px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 32px;
            display: block;
          }
          .button-container {
            text-align: center;
            margin-top: 40px;
          }
          .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background-color: #882627; 
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px;
          }
          .footer { 
            padding: 24px 40px; 
            text-align: center; 
            font-size: 13px; 
            color: #6b7280; 
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .footer a {
            color: #882627;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>LIBERIA DIGITAL INSIGHTS</h1>
            </div>
            <div class="content">
              ${newsletter.cover_image_url ? `<img src="${newsletter.cover_image_url}" class="cover-image" alt="Newsletter Cover">` : ""}
              
              <h2 class="newsletter-title">${newsletter.subject}</h2>
              
              <div style="font-size: 16px; color: #374151;">${newsletter.content}</div>
              
              <div class="button-container">
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}" class="button">Read More Online</a>
              </div>
              
              <p style="margin-top: 40px; font-size: 14px; color: #4b5563;">
                Best regards,<br>
                <strong>The Liberia Digital Insights Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>You're receiving this because you subscribed to our digital insights.</p>
              <p>
                <a href="${unsubscribeUrl}">Unsubscribe</a> &bull; 
                <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/privacy">Privacy Policy</a>
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async sendInvitationEmail(user, password) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || "noreply@liberiadigitalinsights.com",
      to: user.email,
      subject: "You've been invited to Liberia Digital Insights Admin Panel",
      html: this.generateInvitationTemplate(user, password),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Invitation email sent to ${user.email}`);
      return true;
    } catch (error) {
      console.error("Failed to send invitation email:", error);
      return false;
    }
  }

  generateInvitationTemplate(user, password) {
    const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/admin`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Team Invitation - Liberia Digital Insights</title>
        <style>
          body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f5;
          }
          .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f4f4f5;
            padding: 40px 0;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .header { 
            background-color: #882627; 
            color: #ffffff; 
            padding: 40px 20px; 
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
            letter-spacing: -0.025em;
            font-weight: 800;
          }
          .content { 
            padding: 40px; 
          }
          .welcome-text {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
          }
          .role-badge {
            display: inline-block;
            padding: 4px 12px;
            background-color: #fef2f2;
            color: #882627;
            border-radius: 9999px;
            font-size: 13px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin: 8px 0;
          }
          .credentials { 
            background-color: #f9fafb; 
            padding: 24px; 
            border-radius: 8px; 
            border: 1px solid #e5e7eb;
            margin: 32px 0;
          }
          .credential-item {
            margin: 8px 0;
            font-size: 15px;
          }
          .credential-label {
            color: #6b7280;
            font-size: 13px;
            text-transform: uppercase;
            font-weight: 600;
            display: block;
            margin-bottom: 2px;
          }
          .credential-value {
            font-family: inherit;
            font-weight: 600;
            color: #111827;
          }
          .button-container {
            text-align: center;
            margin-top: 32px;
          }
          .button { 
            display: inline-block; 
            padding: 14px 28px; 
            background-color: #882627; 
            color: #ffffff !important; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px;
            transition: background-color 0.2s;
          }
          .footer { 
            padding: 24px 40px; 
            text-align: center; 
            font-size: 13px; 
            color: #6b7280; 
            background-color: #f9fafb;
            border-top: 1px solid #e5e7eb;
          }
          .social-links {
            margin-top: 16px;
          }
          .social-links a {
            color: #882627;
            text-decoration: none;
            margin: 0 8px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>LIBERIA DIGITAL INSIGHTS</h1>
            </div>
            <div class="content">
              <div class="welcome-text">Welcome to the Platform</div>
              <p>Hi ${user.first_name || "there"},</p>
              <p>You have been formally invited to join the Liberia Digital Insights team. Your account has been provisioned with the following role:</p>
              
              <div class="role-badge">${user.role}</div>
              
              <p>Use the temporary credentials below to access your administration dashboard:</p>
              
              <div class="credentials">
                <div class="credential-item">
                  <span class="credential-label">Email Address</span>
                  <span class="credential-value">${user.email}</span>
                </div>
                <div class="credential-item">
                  <span class="credential-label">Temporary Password</span>
                  <span class="credential-value">${password}</span>
                </div>
              </div>
              
              <p style="color: #ef4444; font-size: 14px; font-weight: 500;">
                Important: For security reasons, you will be required to change this password upon your first login.
              </p>
              
              <div class="button-container">
                <a href="${loginUrl}" class="button">Access Admin Dashboard</a>
              </div>
              
              <p style="margin-top: 40px; font-size: 14px; color: #4b5563;">
                If you have any trouble logging in, please contact your system administrator.
              </p>
              
              <p style="font-size: 14px; color: #4b5563;">
                Best regards,<br>
                <strong>The Liberia Digital Insights Team</strong>
              </p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Liberia Digital Insights. All rights reserved.</p>
              <div class="social-links">
                <a href="#">Website</a> &bull; <a href="#">Twitter</a> &bull; <a href="#">LinkedIn</a>
              </div>
              <p style="margin-top: 12px; font-size: 11px;">This is an automated operational email. Please do not reply directly to this message.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
