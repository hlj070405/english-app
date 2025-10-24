import { useState } from 'react';
import { motion } from 'framer-motion';
import './AuthPage.css';

function AuthPage({ onLoginSuccess }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isLoginMode) {
      // --- 登录逻辑 ---
      try {
        const response = await fetch('/api/users/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password }),
        });

        if (!response.ok) {
          throw new Error('Invalid username or password');
        }

        const user = await response.json();
        localStorage.setItem('user', JSON.stringify(user));
        onLoginSuccess(user);
      } catch (err) {
        setError(err.message);
      }
    } else {
      // --- 注册逻辑 ---
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/users/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          }),
        });

        if (!response.ok) {
          throw new Error('Registration failed. Username or email may already exist.');
        }

        // 注册成功后自动登录
        const registeredUser = await response.json();
        localStorage.setItem('user', JSON.stringify(registeredUser));
        onLoginSuccess(registeredUser);
      } catch (err) {
        setError(err.message);
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-toggle">
          <button 
            className={isLoginMode ? 'active' : ''}
            onClick={() => setIsLoginMode(true)}
          >
            登录
          </button>
          <button 
            className={!isLoginMode ? 'active' : ''}
            onClick={() => setIsLoginMode(false)}
          >
            注册
          </button>
        </div>

        <h2 className="auth-title">{isLoginMode ? 'Welcome Back' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input 
              type="text" 
              name="username" 
              placeholder="Username" 
              required 
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>

          {!isLoginMode && (
            <div className="input-group">
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                required 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
          )}

          <div className="input-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              required 
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          {!isLoginMode && (
            <div className="input-group">
              <input 
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm Password" 
                required 
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
          )}

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AuthPage;
