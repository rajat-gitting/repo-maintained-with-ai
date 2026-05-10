import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ToastProvider from './ToastProvider';
import { Toaster } from 'react-hot-toast';

jest.mock('react-hot-toast', () => ({
  Toaster: jest.fn(() => <div data-testid="toaster" />)
}));

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Toaster component', () => {
    const { getByTestId } = render(<ToastProvider />);
    expect(getByTestId('toaster')).toBeInTheDocument();
  });

  it('configures Toaster with correct position', () => {
    render(<ToastProvider />);
    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        position: 'top-right'
      }),
      expect.anything()
    );
  });

  it('configures Toaster with reverseOrder false', () => {
    render(<ToastProvider />);
    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        reverseOrder: false
      }),
      expect.anything()
    );
  });

  it('configures Toaster with correct gutter', () => {
    render(<ToastProvider />);
    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        gutter: 8
      }),
      expect.anything()
    );
  });

  it('configures Toaster with correct container style', () => {
    render(<ToastProvider />);
    expect(Toaster).toHaveBeenCalledWith(
      expect.objectContaining({
        containerStyle: {
          top: 80,
          right: 20
        }
      }),
      expect.anything()
    );
  });

  it('configures default toast options', () => {
    render(<ToastProvider />);
    const props = Toaster.mock.calls[0][0];
    expect(props.toastOptions.duration).toBe(4000);
    expect(props.toastOptions.style.borderRadius).toBe('8px');
    expect(props.toastOptions.style.fontSize).toBe('14px');
    expect(props.toastOptions.style.fontWeight).toBe('500');
    expect(props.toastOptions.style.padding).toBe('16px');
  });

  it('configures success toast options', () => {
    render(<ToastProvider />);
    const props = Toaster.mock.calls[0][0];
    expect(props.toastOptions.success.style.background).toBe('#10B981');
    expect(props.toastOptions.success.style.color).toBe('#FFFFFF');
    expect(props.toastOptions.success.iconTheme.primary).toBe('#FFFFFF');
    expect(props.toastOptions.success.iconTheme.secondary).toBe('#10B981');
  });

  it('configures error toast options', () => {
    render(<ToastProvider />);
    const props = Toaster.mock.calls[0][0];
    expect(props.toastOptions.error.style.background).toBe('#EF4444');
    expect(props.toastOptions.error.style.color).toBe('#FFFFFF');
    expect(props.toastOptions.error.iconTheme.primary).toBe('#FFFFFF');
    expect(props.toastOptions.error.iconTheme.secondary).toBe('#EF4444');
  });

  it('configures loading toast options', () => {
    render(<ToastProvider />);
    const props = Toaster.mock.calls[0][0];
    expect(props.toastOptions.loading.style.background).toBe('#3B82F6');
    expect(props.toastOptions.loading.style.color).toBe('#FFFFFF');
  });
});
