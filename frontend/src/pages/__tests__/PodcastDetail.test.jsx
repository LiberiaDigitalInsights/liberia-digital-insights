import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../../context/ThemeContext';
import { ToastProvider } from '../../context/ToastContext';
import App from '../../App';
import { vi } from 'vitest';

// Mock API
vi.mock('../../services/backendApi', () => ({
  backendApi: {
    analytics: {
      trackVisit: vi.fn().mockResolvedValue({}),
    },
    articles: { list: vi.fn().mockResolvedValue({ articles: [] }) },
    podcasts: {
      list: vi.fn().mockResolvedValue({ podcasts: [] }),
      getBySlug: vi.fn().mockImplementation((id) => {
        if (id === '123e4567-e89b-12d3-a456-426614174003') {
          return Promise.resolve({
            podcast: {
              id: '123e4567-e89b-12d3-a456-426614174003',
              title: 'Digital Liberia Podcast',
              category_id: 'cat1',
              audio_url: '/audio.mp3',
              cover_image_url: '/cover.jpg',
              youtube_url: 'https://youtube.com/watch?v=123',
              spotify_url: 'https://spotify.com/episode/123',
              description: 'Podcast description',
              published_at: '2024-03-20',
            },
          });
        }
        return Promise.reject(new Error('Podcast not found'));
      }),
    },
    insights: { list: vi.fn().mockResolvedValue({ insights: [] }) },
    events: { list: vi.fn().mockResolvedValue({ events: [] }) },
    categories: { list: vi.fn().mockResolvedValue({ data: [] }) },
  },
}));

function renderEpisode(id) {
  return render(
    <HelmetProvider>
      <ThemeProvider>
        <ToastProvider>
          <MemoryRouter initialEntries={[`/podcast/${id}`]}>
            <App />
          </MemoryRouter>
        </ToastProvider>
      </ThemeProvider>
    </HelmetProvider>,
  );
}

describe('PodcastDetail', () => {
  it('renders external links and embeds when links exist', async () => {
    renderEpisode('123e4567-e89b-12d3-a456-426614174003');
    // External link texts
    expect(await screen.findByText(/youtube/i, {}, { timeout: 30000 })).toBeInTheDocument();
    expect(
      await screen.findByText(/watch video version/i, {}, { timeout: 30000 }),
    ).toBeInTheDocument();
    // YouTube iframe
    const ytFrame = await screen.findByTitle(/youtube embed/i);
    expect(ytFrame).toBeInTheDocument();

    // Spotify either link or iframe may exist depending on mock
    // We assert that if a spotify link exists for this episode, the iframe renders
    // (episode 1 mock includes spotify)
    const spFrame = await screen.findByTitle(/spotify embed/i);
    expect(spFrame).toBeInTheDocument();
  });
});
