import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./components/ProfileView', () => {
  return function MockProfileView() {
    return <div data-testid="profile-view">Profile View</div>;
  };
});

jest.mock('./components/ProfileEdit', () => {
  return function MockProfileEdit() {
    return <div data-testid="profile-edit">Profile Edit</div>;
  };
});

jest.mock('./components/ToastProvider', () => {
  return function MockToastProvider() {
    return <div data-testid="toast-provider" />;
  };
});

const renderApp = (initialRoute = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  );
};

describe('App', () => {
  describe('routing', () => {
    it('renders ProfileView component at /profile route', async () => {
      renderApp('/profile');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });

    it('renders ProfileEdit component at /profile/edit route', async () => {
      renderApp('/profile/edit');
      await waitFor(() => {
        expect(screen.getByTestId('profile-edit')).toBeInTheDocument();
      });
    });

    it('redirects to /profile for unknown routes', async () => {
      renderApp('/unknown-route');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });

    it('redirects to /profile for root route', async () => {
      renderApp('/');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });
  });

  describe('ToastProvider', () => {
    it('renders ToastProvider component', () => {
      renderApp('/profile');
      expect(screen.getByTestId('toast-provider')).toBeInTheDocument();
    });
  });

  describe('navigation between routes', () => {
    it('allows navigation from /profile to /profile/edit', async () => {
      const { rerender } = renderApp('/profile');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });

      rerender(
        <MemoryRouter initialEntries={['/profile/edit']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-edit')).toBeInTheDocument();
      });
    });

    it('allows navigation from /profile/edit to /profile', async () => {
      const { rerender } = renderApp('/profile/edit');
      await waitFor(() => {
        expect(screen.getByTestId('profile-edit')).toBeInTheDocument();
      });

      rerender(
        <MemoryRouter initialEntries={['/profile']}>
          <App />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });
  });

  describe('edge cases', () => {
    it('handles route with trailing slash', async () => {
      renderApp('/profile/');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });

    it('handles route with query parameters', async () => {
      renderApp('/profile?tab=settings');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });

    it('handles deeply nested unknown route', async () => {
      renderApp('/some/deeply/nested/unknown/route');
      await waitFor(() => {
        expect(screen.getByTestId('profile-view')).toBeInTheDocument();
      });
    });
  });
});
