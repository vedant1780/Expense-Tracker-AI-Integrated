import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) return;

  try {
    setIsSubmitting(true);

    const url = isLogin
      ? 'https://expense-tracker-ai-integrated-2.onrender.com/api/auth/login'
      : 'https://expense-tracker-ai-integrated-2.onrender.com/api/auth/register';

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
        }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    const { data } = await axios.post(url, payload);
    console.log(data);

    // ✅ Save token (VERY IMPORTANT)
    localStorage.setItem('token', data.token);

    // ✅ Navigate to dashboard
    isLogin ? navigate('/dashboard'):navigate('/onboarding');

  } catch (error) {
    console.log(error);

    // ✅ Show backend error
    setErrors({
      email: error.response?.data?.message || 'Something went wrong'
    });

  } finally {
    setIsSubmitting(false);
  }
};

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background-tertiary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '2.5rem'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            margin: '0 auto 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: '600',
            color: '#c9954c'
          }}>
            ₹
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '500',
            color: 'var(--color-text-primary)',
            margin: '0 0 0.5rem 0'
          }}>
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: '0'
          }}>
            {isLogin 
              ? 'Sign in to manage your expenses' 
              : 'Track where your money goes'}
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '2rem',
          border: `1px solid var(--color-border-tertiary)`
        }}>
          <form onSubmit={handleSubmit}>
            {/* Name Field (Registration only) */}
            {!isLogin && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1px solid ${errors.name ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)'}`,
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--color-background-primary)',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-border-secondary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.name ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)';
                  }}
                />
                {errors.name && (
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-text-danger)',
                    margin: '0.5rem 0 0 0'
                  }}>
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: `1px solid ${errors.email ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                  backgroundColor: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-border-secondary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)';
                }}
              />
              {errors.email && (
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-danger)',
                  margin: '0.5rem 0 0 0'
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: `1px solid ${errors.password ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)'}`,
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                  backgroundColor: 'var(--color-background-primary)',
                  color: 'var(--color-text-primary)',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--color-border-secondary)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)';
                }}
              />
              {errors.password && (
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-danger)',
                  margin: '0.5rem 0 0 0'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field (Registration only) */}
            {!isLogin && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Confirm password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: `1px solid ${errors.confirmPassword ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)'}`,
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--color-background-primary)',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-border-secondary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? 'var(--color-border-danger)' : 'var(--color-border-tertiary)';
                  }}
                />
                {errors.confirmPassword && (
                  <p style={{
                    fontSize: '12px',
                    color: 'var(--color-text-danger)',
                    margin: '0.5rem 0 0 0'
                  }}>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                background: '#c9954c',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--border-radius-md)',
                fontSize: '15px',
                fontWeight: '500',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isSubmitting ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting) e.target.style.background = '#b8844a';
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting) e.target.style.background = '#c9954c';
              }}
            >
              {isSubmitting ? 'Processing...' : (isLogin ? 'Sign in' : 'Create account')}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.5rem 0',
            gap: '1rem'
          }}>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'var(--color-border-tertiary)'
            }} />
            <span style={{
              fontSize: '13px',
              color: 'var(--color-text-secondary)'
            }}>
              or
            </span>
            <div style={{
              flex: 1,
              height: '1px',
              background: 'var(--color-border-tertiary)'
            }} />
          </div>

          {/* Social Buttons */}
          <div style={{
            display: 'flex',
            gap: '0.75rem'
          }}>
            <button style={{
              flex: 1,
              padding: '0.75rem',
              border: `1px solid var(--color-border-tertiary)`,
              background: 'var(--color-background-primary)',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-background-secondary)';
              e.target.style.borderColor = 'var(--color-border-secondary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-background-primary)';
              e.target.style.borderColor = 'var(--color-border-tertiary)';
            }}>
              Google
            </button>
            <button style={{
              flex: 1,
              padding: '0.75rem',
              border: `1px solid var(--color-border-tertiary)`,
              background: 'var(--color-background-primary)',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--color-background-secondary)';
              e.target.style.borderColor = 'var(--color-border-secondary)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--color-background-primary)';
              e.target.style.borderColor = 'var(--color-border-tertiary)';
            }}>
              Apple
            </button>
          </div>
        </div>

        {/* Toggle Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem'
        }}>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: '0'
          }}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <button
              onClick={toggleMode}
              style={{
                background: 'none',
                border: 'none',
                color: '#c9954c',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                marginLeft: '0.4rem',
                textDecoration: 'underline',
                fontFamily: 'var(--font-sans)'
              }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Forgot Password Link (Login only) */}
        {isLogin && (
          <div style={{
            textAlign: 'center',
            marginTop: '1rem'
          }}>
            <button
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-text-secondary)',
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontFamily: 'var(--font-sans)'
              }}>
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}