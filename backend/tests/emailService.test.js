// Email Service Tests
import emailService from '../src/services/emailService.js';
import nodemailer from 'nodemailer';

// Mock nodemailer
jest.mock('nodemailer');

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('sendWelcomeEmail', () => {
    it('should send welcome email successfully', async () => {
      const mockSubscriber = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        unsubscribe_token: 'token123'
      };

      const mockSendMail = jest.fn().mockResolvedValue(true);
      nodemailer.createTransporter.mockReturnValue({
        sendMail: mockSendMail
      });

      const result = await emailService.sendWelcomeEmail(mockSubscriber);

      expect(result).toBe(true);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: expect.any(String),
        to: 'test@example.com',
        subject: 'Welcome to Liberia Digital Insights Newsletter!',
        html: expect.stringContaining('Test User')
      });
    });

    it('should handle email sending failure', async () => {
      const mockSubscriber = {
        id: '123',
        name: 'Test User',
        email: 'test@example.com',
        unsubscribe_token: 'token123'
      };

      const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP Error'));
      nodemailer.createTransporter.mockReturnValue({
        sendMail: mockSendMail
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await emailService.sendWelcomeEmail(mockSubscriber);

      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith('Failed to send welcome email:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('sendNewsletter', () => {
    it('should send newsletter to active subscribers', async () => {
      const mockNewsletter = {
        subject: 'Test Newsletter',
        content: '<p>Test content</p>',
        cover_image_url: 'https://example.com/image.jpg'
      };

      const mockSubscribers = [
        { email: 'user1@example.com', status: 'active', unsubscribe_token: 'token1' },
        { email: 'user2@example.com', status: 'active', unsubscribe_token: 'token2' },
        { email: 'user3@example.com', status: 'unsubscribed', unsubscribe_token: 'token3' }
      ];

      const mockSendMail = jest.fn().mockResolvedValue(true);
      nodemailer.createTransporter.mockReturnValue({
        sendMail: mockSendMail
      });

      const results = await emailService.sendNewsletter(mockNewsletter, mockSubscribers);

      expect(results).toHaveLength(2); // Only active subscribers
      expect(mockSendMail).toHaveBeenCalledTimes(2);
      expect(results[0].status).toBe('sent');
      expect(results[1].status).toBe('sent');
    });

    it('should handle failures for individual subscribers', async () => {
      const mockNewsletter = {
        subject: 'Test Newsletter',
        content: '<p>Test content</p>'
      };

      const mockSubscribers = [
        { email: 'user1@example.com', status: 'active', unsubscribe_token: 'token1' },
        { email: 'user2@example.com', status: 'active', unsubscribe_token: 'token2' }
      ];

      const mockSendMail = jest.fn()
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('SMTP Error'));
      
      nodemailer.createTransporter.mockReturnValue({
        sendMail: mockSendMail
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const results = await emailService.sendNewsletter(mockNewsletter, mockSubscribers);

      expect(results).toHaveLength(2);
      expect(results[0].status).toBe('sent');
      expect(results[1].status).toBe('failed');
      expect(results[1].error).toBe('SMTP Error');

      consoleSpy.mockRestore();
    });
  });

  describe('generateWelcomeTemplate', () => {
    it('should generate welcome email template with subscriber data', () => {
      const mockSubscriber = {
        name: 'John Doe',
        email: 'john@example.com',
        unsubscribe_token: 'abc123'
      };

      process.env.FRONTEND_URL = 'http://localhost:3000';

      const template = emailService.generateWelcomeTemplate(mockSubscriber);

      expect(template).toContain('John Doe');
      expect(template).toContain('Welcome to Liberia Digital Insights');
      expect(template).toContain('http://localhost:3000/unsubscribe?token=abc123');
      expect(template).toContain('Liberia Digital Insights');
    });

    it('should use default frontend URL when not set', () => {
      const mockSubscriber = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        unsubscribe_token: 'xyz789'
      };

      delete process.env.FRONTEND_URL;

      const template = emailService.generateWelcomeTemplate(mockSubscriber);

      expect(template).toContain('http://localhost:5173/unsubscribe?token=xyz789');
    });
  });

  describe('generateNewsletterTemplate', () => {
    it('should generate newsletter email template', () => {
      const mockNewsletter = {
        subject: 'Weekly Tech Digest',
        content: '<p>Latest tech news...</p>',
        cover_image_url: 'https://example.com/cover.jpg'
      };

      const mockSubscriber = {
        name: 'John Doe',
        email: 'john@example.com',
        unsubscribe_token: 'abc123'
      };

      process.env.FRONTEND_URL = 'http://localhost:3000';

      const template = emailService.generateNewsletterTemplate(mockNewsletter, mockSubscriber);

      expect(template).toContain('Weekly Tech Digest');
      expect(template).toContain('<p>Latest tech news...</p>');
      expect(template).toContain('https://example.com/cover.jpg');
      expect(template).toContain('http://localhost:3000/unsubscribe?token=abc123');
    });

    it('should handle newsletter without cover image', () => {
      const mockNewsletter = {
        subject: 'Simple Newsletter',
        content: '<p>No image content</p>'
      };

      const mockSubscriber = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        unsubscribe_token: 'xyz789'
      };

      const template = emailService.generateNewsletterTemplate(mockNewsletter, mockSubscriber);

      expect(template).toContain('Simple Newsletter');
      expect(template).toContain('<p>No image content</p>');
      expect(template).not.toContain('<img');
    });
  });
});
