// Jest Setup File for Backend Tests
import { config } from 'dotenv';

// Load environment variables from .env.test file
config({ path: '.env.test' });

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'postgresql://test:test@localhost:5432/test_db';
process.env.SUPABASE_URL = process.env.TEST_SUPABASE_URL || 'http://localhost:5432';
process.env.SUPABASE_ANON_KEY = process.env.TEST_SUPABASE_ANON_KEY || 'test-key';

// Mock console methods to reduce noise in tests
const originalConsole = global.console;

beforeAll(() => {
  global.console = {
    ...originalConsole,
    log: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
});

afterAll(() => {
  global.console = originalConsole;
});

// Global test timeout
jest.setTimeout(30000);
