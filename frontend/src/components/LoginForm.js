import React, { useState } from 'react';
import axios from 'axios';

function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/login', { email, password });
            const token = response.data;
            if (token && token.startsWith('eyJ')) { // Basic JWT structure check
                localStorage.setItem('token', token);
                alert('Login successful!');
            } else {
                throw new Error('Invalid token structure');
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
}

export default LoginForm;
