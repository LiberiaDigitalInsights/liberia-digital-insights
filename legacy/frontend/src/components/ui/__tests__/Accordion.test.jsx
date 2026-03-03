import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Accordion from '../Accordion';

describe('Accordion', () => {
  it('toggles sections and updates aria-expanded', async () => {
    const user = userEvent.setup();
    const items = [
      { title: 'One', content: <div>First</div> },
      { title: 'Two', content: <div>Second</div> },
    ];
    render(<Accordion items={items} />);

    const btn1 = screen.getByRole('button', { name: /one/i });
    expect(btn1).toHaveAttribute('aria-expanded', 'false');

    await user.click(btn1);
    expect(btn1).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/first/i)).toBeInTheDocument();

    const btn2 = screen.getByRole('button', { name: /two/i });
    await user.click(btn2);
    expect(btn1).toHaveAttribute('aria-expanded', 'false');
    expect(btn2).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/second/i)).toBeInTheDocument();
  });
});
