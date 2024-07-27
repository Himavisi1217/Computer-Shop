import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import './Login.css';

const SUPABASE_URL = 'https://pulfalwtedkoxiatwaof.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB1bGZhbHd0ZWRrb3hpYXR3YW9mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIwMDQyOTUsImV4cCI6MjAzNzU4MDI5NX0.hZzrMZhDoKyCkNGEM5DJrxZGQtcXTguxl8e_CTnu6Bw';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Fetch user from Supabase
    const { data, error } = await supabase
      .from('employees') // assuming your table is called 'users'
      .select('*')
      .eq('username', username)
      .eq('password', password) // You should ideally hash the password and compare the hashes
      .single();

    if (error) {
      setError('Invalid username or password');
      return;
    }

    // If user is found, set authentication state and navigate to the products page
    if (data) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/products');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
