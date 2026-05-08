import React, { useState } from 'react';

function MultiStepForm() {
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
        setFormData({ ...formData, [name]: value });
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
                        <h3>Step 1: Personal Info</h3>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="date"
                            name="dateOfBirth"
                            placeholder="Date of Birth"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            required
                        />
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Step 2: Contact Info</h3>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="address"
                            placeholder="Address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Step 3: Professional Info</h3>
                        <input
                            type="text"
                            name="occupation"
                            placeholder="Occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="company"
                            placeholder="Company"
                            value={formData.company}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="number"
                            name="yearsOfExperience"
                            placeholder="Years of Experience"
                            value={formData.yearsOfExperience}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="skills"
                            placeholder="Skills"
                            value={formData.skills}
                            onChange={handleChange}
                            required
                        />
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3>Step 4: Review & Submit</h3>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
                        <button type="submit">Submit</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="multi-step-form">
            <form>
                {renderStep()}
                <div className="navigation-buttons">
                    {step > 1 && <button type="button" onClick={prevStep}>Back</button>}
                    {step < 4 && <button type="button" onClick={nextStep}>Next</button>}
                </div>
            </form>
        </div>
    );
}

export default MultiStepForm;
