import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import Signup from './Signup';

jest.mock('axios');

describe('Signup Component', () => {
    test('renders signup form', () => {
        render(<Signup />);
        expect(screen.getByText('Signup')).toBeInTheDocument();
    });

    test('shows error message when passwords do not match', () => {
        render(<Signup />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password321' } });
        fireEvent.click(screen.getByText('Sign Up'));
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    test('calls signup API and shows success message', async () => {
        axios.post.mockResolvedValue({ data: 'User registered successfully' });
        render(<Signup />);
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Sign Up'));
        expect(await screen.findByText('User registered successfully')).toBeInTheDocument();
    });
});
