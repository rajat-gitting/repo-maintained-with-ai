import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 80,
        right: 20
      }}
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px'
        },
        success: {
          style: {
            background: '#10B981',
            color: '#FFFFFF'
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#10B981'
          }
        },
        error: {
          style: {
            background: '#EF4444',
            color: '#FFFFFF'
          },
          iconTheme: {
            primary: '#FFFFFF',
            secondary: '#EF4444'
          }
        },
        loading: {
          style: {
            background: '#3B82F6',
            color: '#FFFFFF'
          }
        }
      }}
    />
  );
};

export default ToastProvider;