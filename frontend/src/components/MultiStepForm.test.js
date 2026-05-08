import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MultiStepForm from './MultiStepForm';

it('renders step 1 by default', () => {
    const { getByPlaceholderText } = render(<MultiStepForm />);
    expect(getByPlaceholderText('First Name')).toBeInTheDocument();
});

it('navigates to step 2 on valid step 1 input', () => {
    const { getByPlaceholderText, getByText } = render(<MultiStepForm />);
    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByPlaceholderText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(getByText('Select Gender'), { target: { value: 'male' } });
    fireEvent.click(getByText('Next'));
    expect(getByPlaceholderText('Phone')).toBeInTheDocument();
});

it('preserves data when navigating back', () => {
    const { getByPlaceholderText, getByText } = render(<MultiStepForm />);
    fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
    fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
    fireEvent.change(getByPlaceholderText('Date of Birth'), { target: { value: '1990-01-01' } });
    fireEvent.change(getByText('Select Gender'), { target: { value: 'male' } });
    fireEvent.click(getByText('Next'));
    fireEvent.click(getByText('Back'));
    expect(getByPlaceholderText('First Name').value).toBe('John');
});
