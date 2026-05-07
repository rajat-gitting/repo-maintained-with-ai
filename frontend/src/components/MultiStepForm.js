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
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/form/submit', formData);
            alert('Form submitted successfully!');
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
