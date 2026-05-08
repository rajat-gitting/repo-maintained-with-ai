import React, { useState } from 'react';

const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
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
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const nextStep = () => {
        if (validateStep()) {
            setStep(step + 1);
        }
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const validateStep = () => {
        // Add validation logic for each step
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

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2>Step 1: Personal Info</h2>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="Date of Birth" />
                        <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="Gender" />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Step 2: Contact Info</h2>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" />
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" />
                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
                        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Step 3: Professional Info</h2>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" />
                        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
                        <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="Years of Experience" />
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" />
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2>Step 4: Review & Submit</h2>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
                        <button type="button" onClick={handleSubmit}>Submit</button>
                    </div>
                );
            default:
                return null;
        }
    };

    const handleSubmit = () => {
        // Submit logic here
        console.log('Form submitted:', formData);
    };

    return (
        <div>
            {renderStep()}
            <div>
                {step > 1 && <button type="button" onClick={prevStep}>Back</button>}
                {step < 4 && <button type="button" onClick={nextStep}>Next</button>}
            </div>
        </div>
    );
};

export default MultiStepForm;
