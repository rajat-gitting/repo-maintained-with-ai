import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(() => {
        const savedData = localStorage.getItem('formData');
        return savedData ? JSON.parse(savedData) : {
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            phone: '',
            address: '',
            city: '',
            country: '',
            occupation: '',
            company: '',
            yearsOfExperience: '',
            skills: ''
        };
    });

    useEffect(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateStep = () => {
        switch (step) {
            case 1:
                return formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender;
            case 2:
                return formData.phone && formData.address && formData.city && formData.country;
            case 3:
                return formData.occupation && formData.company && formData.yearsOfExperience && formData.skills;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        } else {
            alert('Please fill in all required fields.');
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/form/submit', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert('Form submitted successfully!');
            localStorage.removeItem('formData');
        } catch (error) {
            alert('Form submission failed!');
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                    <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" required />
                    <button onClick={nextStep}>Next</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                    <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                    <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
                    <button onClick={prevStep}>Back</button>
                    <button onClick={nextStep}>Next</button>
                </div>
            )}
            {step === 3 && (
                <div>
                    <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" required />
                    <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" required />
                    <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="Years of Experience" required />
                    <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" required />
                    <button onClick={prevStep}>Back</button>
                    <button onClick={nextStep}>Next</button>
                </div>
            )}
            {step === 4 && (
                <div>
                    <h3>Review & Submit</h3>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                    <button onClick={prevStep}>Back</button>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}
        </div>
    );
}

export default MultiStepForm;
