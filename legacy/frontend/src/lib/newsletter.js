import { backendApi } from '../services/backendApi';

export async function subscribeNewsletter(payload) {
  try {
    const response = await backendApi.newsletters.subscribe(payload);
    return response;
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    throw error;
  }
}
