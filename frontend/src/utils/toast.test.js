import { showSuccessToast, showErrorToast, showLoadingToast, dismissToast, dismissAllToasts } from './toast';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
  dismiss: jest.fn()
}));

describe('toast utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('showSuccessToast', () => {
    it('calls toast.success with correct message', () => {
      const message = 'Profile saved successfully';
      showSuccessToast(message);
      expect(toast.success).toHaveBeenCalledWith(message, expect.any(Object));
    });

    it('configures success toast with correct options', () => {
      const message = 'Success';
      showSuccessToast(message);
      const options = toast.success.mock.calls[0][1];
      expect(options.duration).toBe(4000);
      expect(options.position).toBe('top-right');
      expect(options.style.background).toBe('#10B981');
      expect(options.style.color).toBe('#FFFFFF');
    });

    it('returns the toast ID', () => {
      toast.success.mockReturnValue('toast-123');
      const result = showSuccessToast('Success');
      expect(result).toBe('toast-123');
    });
  });

  describe('showErrorToast', () => {
    it('calls toast.error with correct message', () => {
      const message = 'Failed to save profile';
      showErrorToast(message);
      expect(toast.error).toHaveBeenCalledWith(message, expect.any(Object));
    });

    it('configures error toast with correct options', () => {
      const message = 'Error';
      showErrorToast(message);
      const options = toast.error.mock.calls[0][1];
      expect(options.duration).toBe(5000);
      expect(options.position).toBe('top-right');
      expect(options.style.background).toBe('#EF4444');
      expect(options.style.color).toBe('#FFFFFF');
    });

    it('returns the toast ID', () => {
      toast.error.mockReturnValue('toast-456');
      const result = showErrorToast('Error');
      expect(result).toBe('toast-456');
    });
  });

  describe('showLoadingToast', () => {
    it('calls toast.loading with correct message', () => {
      const message = 'Saving profile...';
      showLoadingToast(message);
      expect(toast.loading).toHaveBeenCalledWith(message, expect.any(Object));
    });

    it('configures loading toast with correct options', () => {
      const message = 'Loading';
      showLoadingToast(message);
      const options = toast.loading.mock.calls[0][1];
      expect(options.position).toBe('top-right');
      expect(options.style.background).toBe('#3B82F6');
      expect(options.style.color).toBe('#FFFFFF');
    });

    it('returns the toast ID', () => {
      toast.loading.mockReturnValue('toast-789');
      const result = showLoadingToast('Loading');
      expect(result).toBe('toast-789');
    });
  });

  describe('dismissToast', () => {
    it('calls toast.dismiss with specific toast ID', () => {
      const toastId = 'toast-123';
      dismissToast(toastId);
      expect(toast.dismiss).toHaveBeenCalledWith(toastId);
    });
  });

  describe('dismissAllToasts', () => {
    it('calls toast.dismiss without arguments', () => {
      dismissAllToasts();
      expect(toast.dismiss).toHaveBeenCalledWith();
    });
  });

  describe('edge cases', () => {
    it('handles empty message for success toast', () => {
      showSuccessToast('');
      expect(toast.success).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('handles empty message for error toast', () => {
      showErrorToast('');
      expect(toast.error).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('handles empty message for loading toast', () => {
      showLoadingToast('');
      expect(toast.loading).toHaveBeenCalledWith('', expect.any(Object));
    });

    it('handles very long message for success toast', () => {
      const longMessage = 'A'.repeat(500);
      showSuccessToast(longMessage);
      expect(toast.success).toHaveBeenCalledWith(longMessage, expect.any(Object));
    });

    it('handles undefined toast ID in dismissToast', () => {
      dismissToast(undefined);
      expect(toast.dismiss).toHaveBeenCalledWith(undefined);
    });

    it('handles null toast ID in dismissToast', () => {
      dismissToast(null);
      expect(toast.dismiss).toHaveBeenCalledWith(null);
    });
  });
});
