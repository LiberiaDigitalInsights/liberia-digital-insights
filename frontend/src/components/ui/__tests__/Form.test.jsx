import { render, screen } from '@testing-library/react';
import React from 'react';
import { Field, Label, HelperText, ErrorText } from '../Form';

describe('Form Components', () => {
  describe('Field', () => {
    it('renders children', () => {
      render(
        <Field>
          <input data-testid="child" />
        </Field>,
      );
      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<Field className="custom-field" />);
      expect(container.firstChild).toHaveClass('custom-field');
    });
  });

  describe('Label', () => {
    it('renders label text', () => {
      render(<Label>Name</Label>);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('associates with input via htmlFor', () => {
      render(
        <>
          <Label htmlFor="test-input">Name</Label>
          <input id="test-input" />
        </>,
      );
      const label = screen.getByText('Name');
      expect(label).toHaveAttribute('for', 'test-input');
    });
  });

  describe('HelperText', () => {
    it('renders helper text', () => {
      render(<HelperText>This is helpful</HelperText>);
      expect(screen.getByText('This is helpful')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<HelperText className="custom-help" />);
      expect(container.firstChild).toHaveClass('custom-help');
    });
  });

  describe('ErrorText', () => {
    it('renders error text', () => {
      render(<ErrorText>This is an error</ErrorText>);
      expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('applies error styling', () => {
      const { container } = render(<ErrorText>Error message</ErrorText>);
      expect(container.firstChild).toHaveClass('text-red-500');
    });
  });
});
