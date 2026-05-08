import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MultiStepForm from './MultiStepForm';

// Test for rendering and navigation
test('renders MultiStepForm and navigates through steps', () => {
  const { getByText, getByPlaceholderText } = render(<MultiStepForm />);

  // Step 1
  expect(getByText('Step 1: Personal Info')).toBeInTheDocument();
  fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
  fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
  fireEvent.click(getByText('Next'));

  // Step 2
  expect(getByText('Step 2: Contact Info')).toBeInTheDocument();
  fireEvent.change(getByPlaceholderText('Phone'), { target: { value: '1234567890' } });
  fireEvent.click(getByText('Next'));

  // Step 3
  expect(getByText('Step 3: Professional Info')).toBeInTheDocument();
  fireEvent.change(getByPlaceholderText('Occupation'), { target: { value: 'Engineer' } });
  fireEvent.click(getByText('Next'));

  // Step 4
  expect(getByText('Step 4: Review & Submit')).toBeInTheDocument();
  expect(getByText(/John/)).toBeInTheDocument();
  expect(getByText(/Doe/)).toBeInTheDocument();

  // Navigate back to Step 3
  fireEvent.click(getByText('Back'));
  expect(getByText('Step 3: Professional Info')).toBeInTheDocument();

  // Navigate back to Step 2
  fireEvent.click(getByText('Back'));
  expect(getByText('Step 2: Contact Info')).toBeInTheDocument();

  // Navigate back to Step 1
  fireEvent.click(getByText('Back'));
  expect(getByText('Step 1: Personal Info')).toBeInTheDocument();
});

// Test for validation
test('validates required fields before proceeding to next step', () => {
  const { getByText, getByPlaceholderText, queryByText } = render(<MultiStepForm />);

  // Step 1
  fireEvent.click(getByText('Next'));
  expect(getByText('First name is required')).toBeInTheDocument();
  expect(getByText('Last name is required')).toBeInTheDocument();

  fireEvent.change(getByPlaceholderText('First Name'), { target: { value: 'John' } });
  fireEvent.change(getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
  fireEvent.click(getByText('Next'));

  // Step 2
  expect(queryByText('First name is required')).not.toBeInTheDocument();
  expect(queryByText('Last name is required')).not.toBeInTheDocument();
});
