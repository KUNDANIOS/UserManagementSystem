import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle, ChevronRight, User } from 'lucide-react';
import './Auth.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++;
    if (pass.length >= 10) strength++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
    if (/\d/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;
    return strength;
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    setError('');
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return '#ef4444';
    if (passwordStrength <= 3) return '#f59e0b';
    if (passwordStrength <= 4) return '#06b6d4';
    return '#10b981';
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-card signup-card">
        <div className="auth-header">
          <div className="brand-logo">
            <div className="logo-circle">
              <Shield size={28} />
            </div>
            <h1>Authra</h1>
          </div>
          <h2>Create Account</h2>
          <p>Join us today and start your journey</p>
        </div>
        
        {error && (
          <div className="alert alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-group">
            <label>
              <User size={16} />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
              placeholder="John Doe"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Mail size={16} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} />
              Password
            </label>
            <div className="input-with-icon">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Create a strong password"
                disabled={loading}
              />
              <button
                type="button"
                className="icon-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className="strength-fill" 
                    style={{ 
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getStrengthColor()
                    }}
                  ></div>
                </div>
                <span className="strength-label" style={{ color: getStrengthColor() }}>
                  {getStrengthLabel()}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              <Lock size={16} />
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
              placeholder="Confirm your password"
              disabled={loading}
            />
          </div>

          <div className="terms-checkbox">
            <label>
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating Account...
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="btn btn-secondary">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Sign up with Google
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login" className="link-primary">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;