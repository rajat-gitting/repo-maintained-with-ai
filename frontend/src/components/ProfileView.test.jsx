import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProfileView from './ProfileView';
import * as toastUtils from '../utils/toast';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../utils/toast', () => ({
  showErrorToast: jest.fn()
}));

global.fetch = jest.fn();

const mockProfileData = {
  username: 'johndoe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  bio: 'Software engineer',
  city: 'San Francisco',
  country: 'USA',
  dateOfBirth: '1990-01-15',
  avatarFilename: 'avatar123.jpg'
};

const mockProfileDataMinimal = {
  username: 'janedoe',
  email: 'jane@example.com',
  firstName: 'Jane',
  lastName: 'Doe',
  phone: null,
  bio: null,
  city: null,
  country: null,
  dateOfBirth: null,
  avatarFilename: null
};

const renderProfileView = () => {
  return render(
    <BrowserRouter>
      <ProfileView />
    </BrowserRouter>
  );
};

describe('ProfileView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('loading state', () => {
    it('displays loading spinner while fetching profile', () => {
      global.fetch.mockImplementation(() => new Promise(() => {}));
      renderProfileView();
      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });
  });

  describe('successful profile fetch', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockProfileData
      });
    });

    it('fetches profile data on mount', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
      });
    });

    it('displays profile header with title and Edit button', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
      });
    });

    it('displays username correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('johndoe')).toBeInTheDocument();
      });
    });

    it('displays email correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('john@example.com')).toBeInTheDocument();
      });
    });

    it('displays first name correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument();
      });
    });

    it('displays last name correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('Doe')).toBeInTheDocument();
      });
    });

    it('displays phone correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('+1234567890')).toBeInTheDocument();
      });
    });

    it('displays bio correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('Software engineer')).toBeInTheDocument();
      });
    });

    it('displays city correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('San Francisco')).toBeInTheDocument();
      });
    });

    it('displays country correctly', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('USA')).toBeInTheDocument();
      });
    });

    it('displays formatted date of birth', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('January 15, 1990')).toBeInTheDocument();
      });
    });

    it('displays avatar with correct src', async () => {
      renderProfileView();
      await waitFor(() => {
        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', '/api/avatars/avatar123.jpg');
      });
    });

    it('navigates to /profile/edit when Edit Profile button is clicked', async () => {
      const user = userEvent.setup();
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument();
      });
      const editButton = screen.getByRole('button', { name: 'Edit Profile' });
      await user.click(editButton);
      expect(mockNavigate).toHaveBeenCalledWith('/profile/edit');
    });
  });

  describe('empty optional fields', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockProfileDataMinimal
      });
    });

    it('displays em dash for null phone', async () => {
      renderProfileView();
      await waitFor(() => {
        const phoneFields = screen.getAllByText('—');
        expect(phoneFields.length).toBeGreaterThan(0);
      });
    });

    it('displays em dash for null bio', async () => {
      renderProfileView();
      await waitFor(() => {
        const bioFields = screen.getAllByText('—');
        expect(bioFields.length).toBeGreaterThan(0);
      });
    });

    it('displays em dash for null city', async () => {
      renderProfileView();
      await waitFor(() => {
        const cityFields = screen.getAllByText('—');
        expect(cityFields.length).toBeGreaterThan(0);
      });
    });

    it('displays em dash for null country', async () => {
      renderProfileView();
      await waitFor(() => {
        const countryFields = screen.getAllByText('—');
        expect(countryFields.length).toBeGreaterThan(0);
      });
    });

    it('displays em dash for null dateOfBirth', async () => {
      renderProfileView();
      await waitFor(() => {
        const dateFields = screen.getAllByText('—');
        expect(dateFields.length).toBeGreaterThan(0);
      });
    });

    it('displays em dash for empty string phone', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileDataMinimal, phone: '' })
      });
      renderProfileView();
      await waitFor(() => {
        const emDashFields = screen.getAllByText('—');
        expect(emDashFields.length).toBeGreaterThan(0);
      });
    });

    it('displays em dash for undefined phone', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileDataMinimal, phone: undefined })
      });
      renderProfileView();
      await waitFor(() => {
        const emDashFields = screen.getAllByText('—');
        expect(emDashFields.length).toBeGreaterThan(0);
      });
    });

    it('displays avatar fallback when avatarFilename is null', async () => {
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('JD')).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('displays error message when fetch fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('Failed to load profile. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows error toast when fetch fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      renderProfileView();
      await waitFor(() => {
        expect(toastUtils.showErrorToast).toHaveBeenCalledWith('Failed to load profile');
      });
    });

    it('displays error message when response is not ok', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500
      });
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText('Failed to load profile. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows error toast when response is not ok', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500
      });
      renderProfileView();
      await waitFor(() => {
        expect(toastUtils.showErrorToast).toHaveBeenCalledWith('Failed to load profile');
      });
    });
  });

  describe('card styling', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockProfileData
      });
    });

    it('renders cards with profile-view-card class', async () => {
      const { container } = renderProfileView();
      await waitFor(() => {
        const cards = container.querySelectorAll('.profile-view-card');
        expect(cards.length).toBeGreaterThan(0);
      });
    });

    it('renders avatar section with card styling', async () => {
      const { container } = renderProfileView();
      await waitFor(() => {
        const avatarSection = container.querySelector('.profile-view-avatar-section');
        expect(avatarSection).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('handles invalid date format gracefully', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileData, dateOfBirth: 'invalid-date' })
      });
      renderProfileView();
      await waitFor(() => {
        const emDashFields = screen.getAllByText('—');
        expect(emDashFields.length).toBeGreaterThan(0);
      });
    });

    it('handles missing firstName gracefully', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileData, firstName: null })
      });
      renderProfileView();
      await waitFor(() => {
        const emDashFields = screen.getAllByText('—');
        expect(emDashFields.length).toBeGreaterThan(0);
      });
    });

    it('handles missing lastName gracefully', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileData, lastName: null })
      });
      renderProfileView();
      await waitFor(() => {
        const emDashFields = screen.getAllByText('—');
        expect(emDashFields.length).toBeGreaterThan(0);
      });
    });

    it('handles very long bio text', async () => {
      const longBio = 'A'.repeat(1000);
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileData, bio: longBio })
      });
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText(longBio)).toBeInTheDocument();
      });
    });

    it('handles bio with line breaks', async () => {
      const bioWithLineBreaks = 'Line 1\nLine 2\nLine 3';
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ ...mockProfileData, bio: bioWithLineBreaks })
      });
      renderProfileView();
      await waitFor(() => {
        expect(screen.getByText(bioWithLineBreaks)).toBeInTheDocument();
      });
    });
  });
});