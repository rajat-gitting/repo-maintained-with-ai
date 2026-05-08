import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MultiStepForm from './MultiStepForm';

describe('MultiStepForm Component', () => {
    test('renders step 1 and navigates through steps', () => {
        render(<MultiStepForm />);

        // Step 1
        expect(screen.getByText('Step 1: Personal Info')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Date of Birth'), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByDisplayValue('Select Gender'), { target: { value: 'male' } });
        fireEvent.click(screen.getByText('Next'));

        // Step 2
        expect(screen.getByText('Step 2: Contact Info')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Anytown' } });
        fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
        fireEvent.click(screen.getByText('Next'));

        // Step 3
        expect(screen.getByText('Step 3: Professional Info')).toBeInTheDocument();
        fireEvent.change(screen.getByPlaceholderText('Occupation'), { target: { value: 'Engineer' } });
        fireEvent.change(screen.getByPlaceholderText('Company'), { target: { value: 'Tech Corp' } });
        fireEvent.change(screen.getByPlaceholderText('Years of Experience'), { target: { value: '5' } });
        fireEvent.change(screen.getByPlaceholderText('Skills'), { target: { value: 'JavaScript, React' } });
        fireEvent.click(screen.getByText('Next'));

        // Step 4
        expect(screen.getByText('Step 4: Review & Submit')).toBeInTheDocument();
        expect(screen.getByText('John')).toBeInTheDocument();
        expect(screen.getByText('Doe')).toBeInTheDocument();
        expect(screen.getByText('1990-01-01')).toBeInTheDocument();
        expect(screen.getByText('male')).toBeInTheDocument();
        expect(screen.getByText('1234567890')).toBeInTheDocument();
        expect(screen.getByText('123 Main St')).toBeInTheDocument();
        expect(screen.getByText('Anytown')).toBeInTheDocument();
        expect(screen.getByText('USA')).toBeInTheDocument();
        expect(screen.getByText('Engineer')).toBeInTheDocument();
        expect(screen.getByText('Tech Corp')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByText('JavaScript, React')).toBeInTheDocument();
    });

    test('preserves data when navigating back', () => {
        render(<MultiStepForm />);

        // Step 1
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Date of Birth'), { target: { value: '1990-01-01' } });
        fireEvent.change(screen.getByDisplayValue('Select Gender'), { target: { value: 'male' } });
        fireEvent.click(screen.getByText('Next'));

        // Step 2
        fireEvent.change(screen.getByPlaceholderText('Phone'), { target: { value: '1234567890' } });
        fireEvent.change(screen.getByPlaceholderText('Address'), { target: { value: '123 Main St' } });
        fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'Anytown' } });
        fireEvent.change(screen.getByPlaceholderText('Country'), { target: { value: 'USA' } });
        fireEvent.click(screen.getByText('Back'));

        // Back to Step 1
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
        expect(screen.getByDisplayValue('male')).toBeInTheDocument();
    });
});
