// Newsletter API Tests
import request from 'supertest';
import { app } from '../server.js';
import { supabase } from '../src/supabaseClient.js';

// Mock email service to avoid actual email sending during tests
jest.mock('../src/services/emailService.js', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendNewsletter: jest.fn().mockResolvedValue([]),
}));

describe('Newsletter API', () => {
  let testSubscriberId;
  let testUnsubscribeToken;

  beforeAll(async () => {
    // Clean up any test data
    await supabase
      .from('newsletter_subscribers')
      .delete()
      .eq('email', 'test@example.com');
  });

  afterAll(async () => {
    // Clean up test data
    if (testSubscriberId) {
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', testSubscriberId);
    }
  });

  describe('POST /v1/newsletters/subscribe', () => {
    it('should subscribe a new user successfully', async () => {
      const subscriberData = {
        name: 'Test User',
        email: 'test@example.com',
        company: 'Test Company',
        org: 'Test Org',
        position: 'Test Position',
      };

      const response = await request(app)
        .post('/v1/newsletters/subscribe')
        .send(subscriberData)
        .expect(201);

      expect(response.body.message).toBe('Successfully subscribed to newsletter');
      expect(response.body.subscriber.name).toBe(subscriberData.name);
      expect(response.body.subscriber.email).toBe(subscriberData.email);
      expect(response.body.subscriber.status).toBe('active');
      expect(response.body.subscriber.unsubscribe_token).toBeDefined();

      testSubscriberId = response.body.subscriber.id;
      testUnsubscribeToken = response.body.subscriber.unsubscribe_token;
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/v1/newsletters/subscribe')
        .send({
          email: 'test2@example.com'
        })
        .expect(400);

      expect(response.body.error).toBe('Name and email are required');
    });

    it('should return 400 for invalid email format', async () => {
      const response = await request(app)
        .post('/v1/newsletters/subscribe')
        .send({
          name: 'Test User',
          email: 'invalid-email'
        })
        .expect(400);

      expect(response.body.error).toBe('Invalid email format');
    });

    it('should return 409 for duplicate subscription', async () => {
      const response = await request(app)
        .post('/v1/newsletters/subscribe')
        .send({
          name: 'Test User',
          email: 'test@example.com' // Same email as before
        })
        .expect(409);

      expect(response.body.error).toBe('Email already subscribed');
    });
  });

  describe('POST /v1/newsletters/unsubscribe', () => {
    it('should unsubscribe successfully with valid token', async () => {
      const response = await request(app)
        .post('/v1/newsletters/unsubscribe')
        .send({
          token: testUnsubscribeToken
        })
        .expect(200);

      expect(response.body.message).toBe('Successfully unsubscribed from newsletter');
      expect(response.body.subscriber.status).toBe('unsubscribed');
      expect(response.body.subscriber.unsubscribed_at).toBeDefined();
    });

    it('should return 400 for missing token', async () => {
      const response = await request(app)
        .post('/v1/newsletters/unsubscribe')
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Unsubscribe token is required');
    });

    it('should return 404 for invalid token', async () => {
      const response = await request(app)
        .post('/v1/newsletters/unsubscribe')
        .send({
          token: 'invalid-token'
        })
        .expect(404);

      expect(response.body.error).toBe('Invalid unsubscribe token');
    });

    it('should return 400 for already unsubscribed user', async () => {
      const response = await request(app)
        .post('/v1/newsletters/unsubscribe')
        .send({
          token: testUnsubscribeToken
        })
        .expect(400);

      expect(response.body.error).toBe('Already unsubscribed');
    });
  });

  describe('GET /v1/newsletters/subscribers', () => {
    beforeAll(async () => {
      // Create test subscribers
      await supabase.from('newsletter_subscribers').insert([
        {
          name: 'Active User',
          email: 'active@example.com',
          status: 'active',
          subscribed_at: new Date().toISOString(),
          unsubscribe_token: 'token1',
        },
        {
          name: 'Unsubscribed User',
          email: 'unsubscribed@example.com',
          status: 'unsubscribed',
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: new Date().toISOString(),
          unsubscribe_token: 'token2',
        },
      ]);
    });

    afterAll(async () => {
      // Clean up test subscribers
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('email', ['active@example.com', 'unsubscribed@example.com']);
    });

    it('should return paginated subscribers list', async () => {
      const response = await request(app)
        .get('/v1/newsletters/subscribers')
        .expect(200);

      expect(response.body.subscribers).toBeDefined();
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(50);
      expect(response.body.pagination.total).toBeGreaterThanOrEqual(0);
    });

    it('should filter subscribers by status', async () => {
      const response = await request(app)
        .get('/v1/newsletters/subscribers?status=active')
        .expect(200);

      expect(response.body.subscribers.every(s => s.status === 'active')).toBe(true);
    });

    it('should search subscribers by name and email', async () => {
      const response = await request(app)
        .get('/v1/newsletters/subscribers?search=active')
        .expect(200);

      expect(response.body.subscribers.length).toBeGreaterThan(0);
      expect(response.body.subscribers.some(s => 
        s.name.toLowerCase().includes('active') || 
        s.email.toLowerCase().includes('active')
      )).toBe(true);
    });
  });

  describe('PUT /v1/newsletters/subscribers/:id', () => {
    let testSubscriberId;

    beforeAll(async () => {
      const { data } = await supabase.from('newsletter_subscribers').insert({
        name: 'Update Test User',
        email: 'update@example.com',
        status: 'active',
        subscribed_at: new Date().toISOString(),
        unsubscribe_token: 'token3',
      }).select().single();
      testSubscriberId = data.id;
    });

    afterAll(async () => {
      if (testSubscriberId) {
        await supabase
          .from('newsletter_subscribers')
          .delete()
          .eq('id', testSubscriberId);
      }
    });

    it('should update subscriber status', async () => {
      const response = await request(app)
        .put(`/v1/newsletters/subscribers/${testSubscriberId}`)
        .send({
          status: 'unsubscribed'
        })
        .expect(200);

      expect(response.body.status).toBe('unsubscribed');
      expect(response.body.updated_at).toBeDefined();
    });

    it('should return 404 for non-existent subscriber', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const response = await request(app)
        .put(`/v1/newsletters/subscribers/${fakeId}`)
        .send({
          status: 'active'
        })
        .expect(404);

      expect(response.body.error).toBe('Subscriber not found');
    });
  });

  describe('DELETE /v1/newsletters/subscribers/:id', () => {
    let testSubscriberId;

    beforeAll(async () => {
      const { data } = await supabase.from('newsletter_subscribers').insert({
        name: 'Delete Test User',
        email: 'delete@example.com',
        status: 'active',
        subscribed_at: new Date().toISOString(),
        unsubscribe_token: 'token4',
      }).select().single();
      testSubscriberId = data.id;
    });

    it('should delete subscriber successfully', async () => {
      await request(app)
        .delete(`/v1/newsletters/subscribers/${testSubscriberId}`)
        .expect(204);

      // Verify deletion
      const { data } = await supabase
        .from('newsletter_subscribers')
        .select()
        .eq('id', testSubscriberId)
        .single();
      
      expect(data).toBeNull();
    });
  });

  describe('GET /v1/newsletters/analytics', () => {
    beforeAll(async () => {
      // Create test data for analytics
      await supabase.from('newsletter_subscribers').insert([
        {
          name: 'Analytics User 1',
          email: 'analytics1@example.com',
          status: 'active',
          subscribed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
          unsubscribe_token: 'token5',
        },
        {
          name: 'Analytics User 2',
          email: 'analytics2@example.com',
          status: 'unsubscribed',
          subscribed_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(), // 40 days ago
          unsubscribed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
          unsubscribe_token: 'token6',
        },
      ]);

      await supabase.from('newsletters').insert([
        {
          subject: 'Test Newsletter 1',
          content: 'Test content 1',
          status: 'sent',
          sent_date: new Date().toISOString(),
          subscriber_count: 100,
        },
        {
          subject: 'Test Newsletter 2',
          content: 'Test content 2',
          status: 'draft',
          subscriber_count: 0,
        },
      ]);
    });

    afterAll(async () => {
      // Clean up test data
      await supabase
        .from('newsletter_subscribers')
        .delete()
        .in('email', ['analytics1@example.com', 'analytics2@example.com']);
      
      await supabase
        .from('newsletters')
        .delete()
        .in('subject', ['Test Newsletter 1', 'Test Newsletter 2']);
    });

    it('should return comprehensive analytics data', async () => {
      const response = await request(app)
        .get('/v1/newsletters/analytics')
        .expect(200);

      expect(response.body.subscribers).toBeDefined();
      expect(response.body.newsletters).toBeDefined();
      expect(response.body.metrics).toBeDefined();

      expect(response.body.subscribers.total).toBeGreaterThanOrEqual(0);
      expect(response.body.subscribers.active).toBeGreaterThanOrEqual(0);
      expect(response.body.subscribers.unsubscribed).toBeGreaterThanOrEqual(0);
      expect(response.body.subscribers.recentSubscriptions).toBeGreaterThanOrEqual(0);
      expect(response.body.subscribers.recentUnsubscriptions).toBeGreaterThanOrEqual(0);
      expect(response.body.subscribers.growthRate).toBeDefined();

      expect(response.body.newsletters.total).toBeGreaterThanOrEqual(0);
      expect(response.body.newsletters.sent).toBeGreaterThanOrEqual(0);
      expect(response.body.newsletters.drafts).toBeGreaterThanOrEqual(0);
      expect(response.body.newsletters.scheduled).toBeGreaterThanOrEqual(0);

      expect(response.body.metrics.averageSubscribersPerNewsletter).toBeGreaterThanOrEqual(0);
      expect(response.body.metrics.unsubscribeRate).toBeDefined();
    });
  });
});
