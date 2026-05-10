import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ProfileEdit from './ProfileEdit';
import * as toastUtils from '../utils/toast';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../utils/toast', () => ({
  showSuccessToast: jest.fn(),
  showErrorToast: jest.fn()
}));

global.fetch = jest.fn();
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

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

const renderProfileEdit = () => {
  return render(
    <BrowserRouter>
      <ProfileEdit />
    </BrowserRouter>
  );
};

const createMockFile = (name = 'test.jpg', type = 'image/jpeg', size = 1024) => {
  const file = new File(['test'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

describe('ProfileEdit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('loading state', () => {
    it('displays loading spinner while fetching profile', () => {
      global.fetch.mockImplementation(() => new Promise(() => {}));
      renderProfileEdit();
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
      renderProfileEdit();
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

    it('displays form with pre-filled data', async () => {
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Software engineer')).toBeInTheDocument();
        expect(screen.getByDisplayValue('San Francisco')).toBeInTheDocument();
        expect(screen.getByDisplayValue('USA')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1990-01-15')).toBeInTheDocument();
      });
    });

    it('displays Save Changes and Cancel buttons', async () => {
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Save Changes' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
      });
    });
  });

  describe('form validation', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockProfileData
      });
    });

    it('shows error when firstName is empty on submit', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/);
      await user.clear(firstNameInput);

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });
    });

    it('shows error when lastName is empty on submit', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      });

      const lastNameInput = screen.getByLabelText(/Last Name/);
      await user.clear(lastNameInput);

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
    });

    it('shows errors for both firstName and lastName when both are empty', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/);
      const lastNameInput = screen.getByLabelText(/Last Name/);
      await user.clear(firstNameInput);
      await user.clear(lastNameInput);

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
        expect(screen.getByText('Last name is required')).toBeInTheDocument();
      });
    });

    it('clears field error when user starts typing', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/);
      await user.clear(firstNameInput);

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });

      await user.type(firstNameInput, 'J');

      await waitFor(() => {
        expect(screen.queryByText('First name is required')).not.toBeInTheDocument();
      });
    });

    it('does not submit form when validation fails', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const firstNameInput = screen.getByLabelText(/First Name/);
      await user.clear(firstNameInput);

      global.fetch.mockClear();

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('First name is required')).toBeInTheDocument();
      });

      const putCalls = global.fetch.mock.calls.filter(call => call[1]?.method === 'PUT');
      expect(putCalls.length).toBe(0);
    });
  });

  describe('successful save', () => {
    beforeEach(() => {
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'PUT') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ success: true })
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });
    });

    it('shows loading state on Save button while saving', async () => {
      const user = userEvent.setup();
      let resolveSave;
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'PUT') {
          return new Promise((resolve) => {
            resolveSave = resolve;
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });

      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Saving...')).toBeInTheDocument();
        expect(saveButton).toBeDisabled();
      });

      resolveSave({
        ok: true,
        json: async () => ({ success: true })
      });
    });

    it('disables Cancel button while saving', async () => {
      const user = userEvent.setup();
      let resolveSave;
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'PUT') {
          return new Promise((resolve) => {
            resolveSave = resolve;
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });

      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        expect(cancelButton).toBeDisabled();
      });

      resolveSave({
        ok: true,
        json: async () => ({ success: true })
      });
    });

    it('sends PUT request with form data', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const phoneInput = screen.getByLabelText(/Phone/);
      await user.clear(phoneInput);
      await user.type(phoneInput, '+9876543210');

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        const putCalls = global.fetch.mock.calls.filter(call => call[1]?.method === 'PUT');
        expect(putCalls.length).toBe(1);
        const [url, options] = putCalls[0];
        expect(url).toBe('/api/profile');
        expect(options.method).toBe('PUT');
        expect(options.headers['Content-Type']).toBe('application/json');
        expect(options.credentials).toBe('include');
        const body = JSON.parse(options.body);
        expect(body.phone).toBe('+9876543210');
      });
    });

    it('shows success toast after save', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(toastUtils.showSuccessToast).toHaveBeenCalledWith('Profile saved successfully');
      });
    });

    it('redirects to /profile after successful save', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/profile');
      });
    });
  });

  describe('save error handling', () => {
    beforeEach(() => {
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'PUT') {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: async () => ({ message: 'Server error' })
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });
    });

    it('displays inline error message when save fails', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });
    });

    it('shows error toast when save fails', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(toastUtils.showErrorToast).toHaveBeenCalledWith('Failed to save profile');
      });
    });

    it('does not redirect when save fails', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      mockNavigate.mockClear();

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Server error')).toBeInTheDocument();
      });

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles network error gracefully', async () => {
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'PUT') {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.reject(new Error('Unexpected request'));
      });

      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const saveButton = screen.getByRole('button', { name: 'Save Changes' });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });
  });

  describe('avatar upload', () => {
    beforeEach(() => {
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'POST' && url === '/api/profile/avatar') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ avatarFilename: 'new-avatar.jpg' })
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });
    });

    it('validates file type and shows error for invalid type', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.pdf', 'application/pdf', 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('Avatar must be a JPEG, PNG, or WebP image')).toBeInTheDocument();
      });
    });

    it('validates file size and shows error for oversized file', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.jpg', 'image/jpeg', 3 * 1024 * 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      await user.upload(input, file);

      await waitFor(() => {
        expect(screen.getByText('Avatar file size must not exceed 2MB')).toBeInTheDocument();
      });
    });

    it('validates image dimensions and shows error for oversized dimensions', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.jpg', 'image/jpeg', 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      const mockImage = {
        width: 2000,
        height: 2000,
        onload: null,
        onerror: null
      };

      global.Image = jest.fn(() => mockImage);

      const uploadPromise = user.upload(input, file);

      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      await uploadPromise;

      await waitFor(() => {
        expect(screen.getByText('Avatar dimensions must not exceed 1024×1024 pixels')).toBeInTheDocument();
      });
    });

    it('uploads valid avatar file successfully', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.jpg', 'image/jpeg', 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      const mockImage = {
        width: 800,
        height: 800,
        onload: null,
        onerror: null
      };

      global.Image = jest.fn(() => mockImage);

      const uploadPromise = user.upload(input, file);

      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      await uploadPromise;

      await waitFor(() => {
        const postCalls = global.fetch.mock.calls.filter(call => call[1]?.method === 'POST');
        expect(postCalls.length).toBeGreaterThan(0);
      });
    });

    it('shows loading state while uploading avatar', async () => {
      const user = userEvent.setup();
      let resolveUpload;
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'POST' && url === '/api/profile/avatar') {
          return new Promise((resolve) => {
            resolveUpload = resolve;
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });

      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.jpg', 'image/jpeg', 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      const mockImage = {
        width: 800,
        height: 800,
        onload: null,
        onerror: null
      };

      global.Image = jest.fn(() => mockImage);

      const uploadPromise = user.upload(input, file);

      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      await uploadPromise;

      await waitFor(() => {
        expect(screen.getByText('Uploading...')).toBeInTheDocument();
      });

      resolveUpload({
        ok: true,
        json: async () => ({ avatarFilename: 'new-avatar.jpg' })
      });
    });

    it('shows success toast after avatar upload', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.jpg', 'image/jpeg', 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      const mockImage = {
        width: 800,
        height: 800,
        onload: null,
        onerror: null
      };

      global.Image = jest.fn(() => mockImage);

      const uploadPromise = user.upload(input, file);

      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      await uploadPromise;

      await waitFor(() => {
        expect(toastUtils.showSuccessToast).toHaveBeenCalledWith('Avatar uploaded successfully');
      });
    });

    it('handles avatar upload error', async () => {
      global.fetch.mockImplementation((url, options) => {
        if (options?.method === 'GET') {
          return Promise.resolve({
            ok: true,
            json: async () => mockProfileData
          });
        }
        if (options?.method === 'POST' && url === '/api/profile/avatar') {
          return Promise.resolve({
            ok: false,
            status: 500
          });
        }
        return Promise.reject(new Error('Unexpected request'));
      });

      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const file = createMockFile('test.jpg', 'image/jpeg', 1024);
      const input = screen.getByLabelText('Change Avatar', { selector: 'input' });

      const mockImage = {
        width: 800,
        height: 800,
        onload: null,
        onerror: null
      };

      global.Image = jest.fn(() => mockImage);

      const uploadPromise = user.upload(input, file);

      setTimeout(() => {
        if (mockImage.onload) {
          mockImage.onload();
        }
      }, 0);

      await uploadPromise;

      await waitFor(() => {
        expect(screen.getByText('Failed to upload avatar. Please try again.')).toBeInTheDocument();
      });
    });
  });

  describe('cancel button', () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockProfileData
      });
    });

    it('navigates to /profile when Cancel is clicked', async () => {
      const user = userEvent.setup();
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith('/profile');
    });
  });

  describe('error handling on load', () => {
    it('displays error message when fetch fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      renderProfileEdit();
      await waitFor(() => {
        expect(screen.getByText('Failed to load profile. Please try again.')).toBeInTheDocument();
      });
    });

    it('shows error toast when fetch fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      renderProfileEdit();
      await waitFor(() => {
        expect(toastUtils.showErrorToast).toHaveBeenCalledWith('Failed to load profile');
      });
    });
  });
});