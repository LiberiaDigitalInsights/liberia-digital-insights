import React from 'react';
import { render, screen } from '@testing-library/react';
import ContentRenderer from '../ContentRenderer';

describe('ContentRenderer', () => {
  it('renders sanitized HTML', () => {
    const html = "<p>Hi <strong>there</strong><script>alert('x')</script></p>";
    render(<ContentRenderer html={html} />);
    const el = screen.getByText(/hi/i);
    expect(el).toBeInTheDocument();
    // script should be removed
    expect(document.body.innerHTML).not.toMatch(/<script/i);
  });

  it('renders default message when empty', () => {
    render(<ContentRenderer html="" />);
    expect(screen.getByText(/no content\./i)).toBeInTheDocument();
  });
});
