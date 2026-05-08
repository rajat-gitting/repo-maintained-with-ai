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
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required />
                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
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
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" required />
                        <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required />
                        <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" required />
                        <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" required />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Step 3: Professional Info</h3>
                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Occupation" required />
                        <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="Company" required />
                        <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="Years of Experience" required />
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills" required />
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
