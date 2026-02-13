import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router';
import * as authService from '../services/authService';
import { UserContext } from "../contexts/UserContext";

export default function SignInPage({ simulateSignInOut }) {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const user = await authService.signIn({ username, password });
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Sign in failed');
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        
        <button type="submit">Sign In</button>
      </form>
      
      <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
    </div>
  );
}