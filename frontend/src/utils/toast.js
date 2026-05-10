import toast from 'react-hot-toast';

export const showSuccessToast = (message) => {
  return toast.success(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500'
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#10B981'
    }
  });
};

export const showErrorToast = (message) => {
  return toast.error(message, {
    duration: 5000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500'
    },
    iconTheme: {
      primary: '#FFFFFF',
      secondary: '#EF4444'
    }
  });
};

export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#FFFFFF',
      padding: '16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '500'
    }
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};