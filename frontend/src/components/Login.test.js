import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Login from './Login';

jest.mock('axios');

describe('Login Component', () => {
    test('renders login form', () => {
        render(<Login />);
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

    test('calls login API and stores token on success', async () => {
        axios.post.mockResolvedValue({ data: 'fake-jwt-token' });
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Log In'));
        expect(await screen.findByText('Login successful')).toBeInTheDocument();
        expect(localStorage.getItem('token')).toBe('fake-jwt-token');
    });

    test('shows error message on invalid credentials', async () => {
        axios.post.mockRejectedValue(new Error('Invalid credentials'));
        render(<Login />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByText('Log In'));
        expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
    });
});
