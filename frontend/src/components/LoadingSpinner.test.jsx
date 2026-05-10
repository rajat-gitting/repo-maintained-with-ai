import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('rendering', () => {
    it('renders spinner with default props', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });

    it('renders spinner with small size', () => {
      const { container } = render(<LoadingSpinner size="small" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--small');
      expect(spinner).toHaveStyle({ width: '16px', height: '16px' });
    });

    it('renders spinner with medium size', () => {
      const { container } = render(<LoadingSpinner size="medium" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--medium');
      expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('renders spinner with large size', () => {
      const { container } = render(<LoadingSpinner size="large" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--large');
      expect(spinner).toHaveStyle({ width: '32px', height: '32px' });
    });

    it('applies default medium size when size prop is omitted', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('renders spinner with primary color', () => {
      const { container } = render(<LoadingSpinner color="primary" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--primary');
    });

    it('renders spinner with white color', () => {
      const { container } = render(<LoadingSpinner color="white" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--white');
    });

    it('renders spinner with neutral color', () => {
      const { container } = render(<LoadingSpinner color="neutral" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--neutral');
    });

    it('applies default primary color when color prop is omitted', () => {
      const { container } = render(<LoadingSpinner />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--primary');
    });
  });

  describe('SVG structure', () => {
    it('renders SVG element', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('loading-spinner-svg');
    });

    it('renders circle element inside SVG', () => {
      const { container } = render(<LoadingSpinner />);
      const circle = container.querySelector('circle');
      expect(circle).toBeInTheDocument();
      expect(circle).toHaveClass('loading-spinner-circle');
    });

    it('sets correct SVG viewBox', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 50 50');
    });

    it('sets correct circle attributes', () => {
      const { container } = render(<LoadingSpinner />);
      const circle = container.querySelector('circle');
      expect(circle).toHaveAttribute('cx', '25');
      expect(circle).toHaveAttribute('cy', '25');
      expect(circle).toHaveAttribute('r', '20');
      expect(circle).toHaveAttribute('fill', 'none');
      expect(circle).toHaveAttribute('strokeWidth', '5');
    });
  });

  describe('accessibility', () => {
    it('includes role="status" for screen readers', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toBeInTheDocument();
    });

    it('includes aria-label for screen readers', () => {
      render(<LoadingSpinner />);
      const spinner = screen.getByRole('status');
      expect(spinner).toHaveAttribute('aria-label', 'Loading');
    });
  });

  describe('edge cases', () => {
    it('handles invalid size prop by defaulting to medium', () => {
      const { container } = render(<LoadingSpinner size="invalid" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('handles undefined size prop by defaulting to medium', () => {
      const { container } = render(<LoadingSpinner size={undefined} />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    });

    it('handles null size prop by defaulting to medium', () => {
      const { container } = render(<LoadingSpinner size={null} />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveStyle({ width: '24px', height: '24px' });
    });
  });

  describe('combination of props', () => {
    it('renders small white spinner', () => {
      const { container } = render(<LoadingSpinner size="small" color="white" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--small');
      expect(spinner).toHaveClass('loading-spinner--white');
      expect(spinner).toHaveStyle({ width: '16px', height: '16px' });
    });

    it('renders large neutral spinner', () => {
      const { container } = render(<LoadingSpinner size="large" color="neutral" />);
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner--large');
      expect(spinner).toHaveClass('loading-spinner--neutral');
      expect(spinner).toHaveStyle({ width: '32px', height: '32px' });
    });
  });
});
