import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../Tabs';

describe('Tabs', () => {
  it('switches visible content when clicking tabs', async () => {
    const user = userEvent.setup();
    function Wrapper() {
      const [value, setValue] = React.useState('a');
      const tabs = [
        { value: 'a', label: 'Tab A', content: <div data-testid="panel-a">Panel A</div> },
        { value: 'b', label: 'Tab B', content: <div data-testid="panel-b">Panel B</div> },
      ];
      return <Tabs tabs={tabs} value={value} onChange={setValue} />;
    }

    render(<Wrapper />);

    expect(screen.getByTestId('panel-a')).toBeVisible();
    expect(screen.getByTestId('panel-b')).not.toBeVisible();

    await user.click(screen.getByRole('button', { name: /tab b/i }));

    expect(screen.getByTestId('panel-a')).not.toBeVisible();
    expect(screen.getByTestId('panel-b')).toBeVisible();
  });
});
