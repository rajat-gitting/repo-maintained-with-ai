import React, { useState } from 'react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const token = await response.text();
            localStorage.setItem('jwtToken', token);
            setError('');
            alert('Login successful.');
        } else {
            const errorMessage = await response.text();
            setError(errorMessage);
        }
    };

    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <p className="error">{error}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
