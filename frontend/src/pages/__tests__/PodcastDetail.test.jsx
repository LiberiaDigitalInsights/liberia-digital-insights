import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils';
import PodcastDetail from '../PodcastDetail';

function renderEpisode(id = 1) {
  window.history.pushState({}, '', `/podcast/${id}`);
  return renderWithProviders(<PodcastDetail />);
}

describe('PodcastDetail', () => {
  it('renders external links and embeds when links exist', async () => {
    renderEpisode(1);
    // External link texts
    expect(await screen.findByText(/watch on youtube/i)).toBeInTheDocument();
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
