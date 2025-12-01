// Email service for newsletter system
import nodemailer from 'nodemailer';

// Configure email transporter (use environment variables in production)
let transporter;

console.log('Checking SMTP configuration...');
console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');

// Only create transporter if SMTP credentials are provided
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  console.log('Creating real SMTP transporter...');
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
} else {
  console.log('SMTP credentials not found, using mock transporter...');
  // Create a mock transporter for development/testing
  transporter = {
    sendMail: async (options) => {
      console.log('📧 Email would be sent:', {
        to: options.to,
        subject: options.subject,
        from: options.from,
      });
      return { messageId: 'mock-' + Date.now() };
    },
  };
}

class EmailService {
  async sendWelcomeEmail(subscriber) {
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@liberiadigitalinsights.com',
      to: subscriber.email,
      subject: 'Welcome to Liberia Digital Insights Newsletter!',
      html: this.generateWelcomeTemplate(subscriber),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${subscriber.email}`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      // Don't throw the error, just log it and return false
      // This prevents the subscription from failing if email sending fails
      return false;
    }
  }

  async sendNewsletter(newsletter, subscribers) {
    const results = [];
    
    for (const subscriber of subscribers) {
      if (subscriber.status !== 'active') continue;
      
      const mailOptions = {
        from: process.env.FROM_EMAIL || 'noreply@liberiadigitalinsights.com',
        to: subscriber.email,
        subject: newsletter.subject,
        html: this.generateNewsletterTemplate(newsletter, subscriber),
      };

      try {
        await transporter.sendMail(mailOptions);
        results.push({ email: subscriber.email, status: 'sent' });
      } catch (error) {
        console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
        results.push({ email: subscriber.email, status: 'failed', error: error.message });
      }
    }

    return results;
  }

  generateWelcomeTemplate(subscriber) {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?token=${subscriber.unsubscribe_token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Liberia Digital Insights</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Liberia Digital Insights</h1>
          </div>
          <div class="content">
            <p>Hi ${subscriber.name},</p>
            <p>Thank you for subscribing to the Liberia Digital Insights newsletter! We're excited to have you join our community of tech enthusiasts and professionals.</p>
            
            <h3>What to Expect:</h3>
            <ul>
              <li>Weekly tech news and insights from Liberia's growing technology ecosystem</li>
              <li>Exclusive interviews with industry leaders</li>
              <li>Analysis of digital transformation trends</li>
              <li>Information about upcoming tech events and training opportunities</li>
            </ul>
            
            <p>Stay tuned for our next newsletter where we'll bring you the latest updates from Liberia's tech scene.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Visit Our Website</a>
            </div>
            
            <p>If you have any questions or topics you'd like us to cover, feel free to reply to this email.</p>
            
            <p>Best regards,<br>The Liberia Digital Insights Team</p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to Liberia Digital Insights newsletter.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  generateNewsletterTemplate(newsletter, subscriber) {
    const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?token=${subscriber.unsubscribe_token}`;
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${newsletter.subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9fafb; }
          .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 24px; background: #2563eb; color: white; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Liberia Digital Insights</h1>
          </div>
          <div class="content">
            ${newsletter.cover_image_url ? `<img src="${newsletter.cover_image_url}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px; margin-bottom: 20px;">` : ''}
            
            <h2>${newsletter.subject}</h2>
            
            <div>${newsletter.content}</div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Read More on Our Website</a>
            </div>
            
            <p>Best regards,<br>The Liberia Digital Insights Team</p>
          </div>
          <div class="footer">
            <p>You're receiving this email because you subscribed to Liberia Digital Insights newsletter.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/privacy">Privacy Policy</a></p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();
