import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Avatar from './Avatar';

describe('Avatar', () => {
  describe('with avatar image', () => {
    it('renders image when src is provided', () => {
      render(<Avatar src="https://example.com/avatar.jpg" name="John Doe" />);
      const img = screen.getByRole('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
      expect(img).toHaveAttribute('alt', 'John Doe');
    });

    it('applies correct size to container when src is provided', () => {
      const { container } = render(
        <Avatar src="https://example.com/avatar.jpg" name="John Doe" size={80} />
      );
      const avatarDiv = container.querySelector('.avatar');
      expect(avatarDiv).toHaveStyle({ width: '80px', height: '80px' });
    });
  });

  describe('without avatar image (fallback)', () => {
    it('renders initials for two-word name', () => {
      render(<Avatar name="John Doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('renders initials for single-word name', () => {
      render(<Avatar name="Madonna" />);
      expect(screen.getByText('M')).toBeInTheDocument();
    });

    it('renders initials for three-word name using first and last', () => {
      render(<Avatar name="John Paul Jones" />);
      expect(screen.getByText('JJ')).toBeInTheDocument();
    });

    it('renders question mark for empty name', () => {
      render(<Avatar name="" />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders question mark for whitespace-only name', () => {
      render(<Avatar name="   " />);
      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('handles name with extra whitespace', () => {
      render(<Avatar name="  John   Doe  " />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('converts initials to uppercase', () => {
      render(<Avatar name="john doe" />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('applies default size of 120px', () => {
      const { container } = render(<Avatar name="John Doe" />);
      const avatarDiv = container.querySelector('.avatar-fallback');
      expect(avatarDiv).toHaveStyle({ width: '120px', height: '120px' });
    });

    it('applies custom size', () => {
      const { container } = render(<Avatar name="John Doe" size={60} />);
      const avatarDiv = container.querySelector('.avatar-fallback');
      expect(avatarDiv).toHaveStyle({ width: '60px', height: '60px' });
    });

    it('scales font size proportionally to avatar size', () => {
      const { container } = render(<Avatar name="John Doe" size={100} />);
      const avatarDiv = container.querySelector('.avatar-fallback');
      expect(avatarDiv).toHaveStyle({ fontSize: '40px' });
    });

    it('applies hash-based background color', () => {
      const { container } = render(<Avatar name="John Doe" />);
      const avatarDiv = container.querySelector('.avatar-fallback');
      const bgColor = avatarDiv.style.backgroundColor;
      expect(bgColor).toMatch(/^#[0-9A-F]{6}$/i);
    });

    it('applies consistent color for same name', () => {
      const { container: container1 } = render(<Avatar name="John Doe" />);
      const { container: container2 } = render(<Avatar name="John Doe" />);
      const color1 = container1.querySelector('.avatar-fallback').style.backgroundColor;
      const color2 = container2.querySelector('.avatar-fallback').style.backgroundColor;
      expect(color1).toBe(color2);
    });

    it('applies different colors for different names', () => {
      const { container: container1 } = render(<Avatar name="John Doe" />);
      const { container: container2 } = render(<Avatar name="Jane Smith" />);
      const color1 = container1.querySelector('.avatar-fallback').style.backgroundColor;
      const color2 = container2.querySelector('.avatar-fallback').style.backgroundColor;
      expect(color1).not.toBe(color2);
    });

    it('includes aria-label for accessibility', () => {
      const { container } = render(<Avatar name="John Doe" />);
      const avatarDiv = container.querySelector('.avatar-fallback');
      expect(avatarDiv).toHaveAttribute('aria-label', 'Avatar for John Doe');
    });

    it('handles very long names without overflow', () => {
      const longName = 'A'.repeat(100) + ' ' + 'B'.repeat(100);
      render(<Avatar name={longName} />);
      expect(screen.getByText('AB')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles name with special characters', () => {
      render(<Avatar name="José María" />);
      expect(screen.getByText('JM')).toBeInTheDocument();
    });

    it('handles name with numbers', () => {
      render(<Avatar name="User123 Test456" />);
      expect(screen.getByText('UT')).toBeInTheDocument();
    });

    it('handles single character name', () => {
      render(<Avatar name="X" />);
      expect(screen.getByText('X')).toBeInTheDocument();
    });
  });
});
