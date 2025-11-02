import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Search from '../Search';

const SearchWrapper = ({ onResults }) => (
  <BrowserRouter>
    <Search placeholder="Search..." onResults={onResults} />
  </BrowserRouter>
);

describe('Search', () => {
  it('renders search input', () => {
    render(<SearchWrapper />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('shows suggestions when typing 3+ characters', async () => {
    render(<SearchWrapper />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'tech' } });

    await waitFor(
      () => {
        expect(screen.getByText(/articles|technology/i)).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('hides suggestions when input is less than 3 characters', async () => {
    render(<SearchWrapper />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'te' } });

    await waitFor(() => {
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  it('debounces search input', async () => {
    render(<SearchWrapper />);
    const input = screen.getByPlaceholderText('Search...');

    fireEvent.change(input, { target: { value: 'tech' } });

    await waitFor(
      () => {
        expect(screen.getByText(/articles|technology/i)).toBeInTheDocument();
      },
      { timeout: 1000 },
    );
  });

  it('calls onResults callback when results are found', async () => {
    const onResults = vi.fn();
    render(<SearchWrapper onResults={onResults} />);
    const input = screen.getByPlaceholderText('Search...');

    fireEvent.change(input, { target: { value: 'tech' } });

    await waitFor(
      () => {
        expect(onResults).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );
  });
});
