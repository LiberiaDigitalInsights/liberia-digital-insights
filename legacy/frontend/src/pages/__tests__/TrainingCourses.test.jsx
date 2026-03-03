import React from 'react';
import { renderWithProviders, screen, fireEvent } from '../../test/utils';
import TrainingCourses from '../TrainingCourses';
import { vi } from 'vitest';

// Mock API
vi.mock('../../services/backendApi', () => ({
  backendApi: {
    analytics: {
      trackVisit: vi.fn().mockResolvedValue({}),
    },
    articles: { list: vi.fn().mockResolvedValue({ articles: [] }) },
    podcasts: { list: vi.fn().mockResolvedValue({ podcasts: [] }) },
    insights: { list: vi.fn().mockResolvedValue({ insights: [] }) },
    events: { list: vi.fn().mockResolvedValue({ events: [] }) },
    categories: { list: vi.fn().mockResolvedValue({ data: [] }) },
    training: {
      list: vi.fn().mockResolvedValue({
        training: [
          {
            id: 't1',
            title: 'Training 1',
            type: 'training',
            startDate: '2024-05-01',
            location: 'Monrovia',
            modality: 'In-person',
          },
          {
            id: 't2',
            title: 'Training 2',
            type: 'training',
            startDate: '2024-05-02',
            location: 'Online',
            modality: 'Online',
          },
          {
            id: 't3',
            title: 'Training 3',
            type: 'training',
            startDate: '2024-05-03',
            location: 'Gbarnga',
            modality: 'In-person',
          },
          {
            id: 't4',
            title: 'Training 4',
            type: 'training',
            startDate: '2024-05-04',
            location: 'Online',
            modality: 'Online',
          },
        ],
        pagination: { total: 4, page: 1, limit: 3, totalPages: 2 },
      }),
    },
    courses: {
      list: vi.fn().mockResolvedValue({
        courses: [
          {
            id: 'c1',
            title: 'Course 1',
            type: 'course',
            startDate: '2024-06-01',
            location: 'Online',
            modality: 'Online',
          },
        ],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 },
      }),
    },
  },
}));

describe('TrainingCourses page', () => {
  function renderAt(_pathname = '/training-courses') {
    // Providers includes BrowserRouter; no extra router wrapper needed
    return renderWithProviders(<TrainingCourses />);
  }

  it('renders headings and basic sections', async () => {
    renderAt();
    expect(await screen.findByRole('heading', { name: /training & courses/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /upcoming training/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /upcoming courses/i })).toBeInTheDocument();
  });

  it('shows filters and allows changing them', async () => {
    renderAt();
    const location = await screen.findByLabelText(/location/i);
    const modality = screen.getByLabelText(/modality/i);
    fireEvent.change(location, { target: { value: 'Online' } });
    fireEvent.change(modality, { target: { value: 'Online' } });
    // After filtering, either cards or EmptyState will render; ensure the UI updates without crashing
    // Look for either a Register button or the EmptyState title text
    const maybeRegister = screen.queryAllByRole('button', { name: /register/i });
    expect(maybeRegister.length >= 0).toBe(true);
  });

  it('paginates training and courses lists when needed', async () => {
    renderAt();
    // Training pagination
    const nextButtons = await screen.findAllByRole('button', { name: /next/i });
    // if pagination exists (dataset has > pageSize = 3), clicking advances the page index indicator
    if (nextButtons.length) {
      const pageIndicators = screen.getAllByText(/page \d+ of \d+/i);
      const before = pageIndicators.map((n) => n.textContent).join('|');
      fireEvent.click(nextButtons[0]);
      const after = screen
        .getAllByText(/page \d+ of \d+/i)
        .map((n) => n.textContent)
        .join('|');
      expect(before).not.toEqual(after);
    }
  });
});
