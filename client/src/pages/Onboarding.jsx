import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
export default function Onboarding() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const [submitted, setSubmitted] = useState(false);
const navigate = useNavigate();

const API = "https://expense-tracker-ai-integrated-2.onrender.com/api";

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!monthlyIncome || !savingsGoal) return;

  try {
    const token = localStorage.getItem("token");

    const { data } = await axios.post(
      `${API}/expenses/onboarding`,
      {
        monthlyIncome: Number(monthlyIncome),
        savingsGoal: Number(savingsGoal),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("Onboarding Response:", data);

    setSubmitted(true);

    // 👉 go to dashboard with data
    navigate("/dashboard", { state: data });

  } catch (error) {
    console.log("Onboarding Error:", error.response?.data || error.message);
  }
};
  const handleReset = () => {
    setMonthlyIncome('');
    setSavingsGoal('');
    setSubmitted(false);
  };

  const income = parseFloat(monthlyIncome) || 0;
  const goal = parseFloat(savingsGoal) || 0;
  const savingsPercentage = income > 0 ? Math.round((goal / income) * 100) : 0;
  const remainingBudget = Math.max(0, income - goal);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-background-tertiary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
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
            Financial planner
          </h1>
          <p style={{
            fontSize: '14px',
            color: 'var(--color-text-secondary)',
            margin: '0'
          }}>
            Set your income and savings goals to see your budget breakdown
          </p>
        </div>

        {/* Form Card */}
        <div style={{
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '2rem',
          border: `1px solid var(--color-border-tertiary)`,
          marginBottom: '1.5rem'
        }}>
          <form onSubmit={handleSubmit}>
            {/* Monthly Income Field */}
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
                Monthly income
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '15px'
                }}>
                  ₹
                </span>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 28px',
                    border: `1px solid var(--color-border-tertiary)`,
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--color-background-primary)',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 0.2s'
                  }}
                  min="0"
                  step="0.01"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-border-secondary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border-tertiary)';
                  }}
                />
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                margin: '0.5rem 0 0 0'
              }}>
                Your total monthly earnings
              </p>
            </div>

            {/* Savings Goal Field */}
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
                Monthly savings goal
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '12px',
                  color: 'var(--color-text-secondary)',
                  fontSize: '15px'
                }}>
                  ₹
                </span>
                <input
                  type="number"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 28px',
                    border: `1px solid var(--color-border-tertiary)`,
                    borderRadius: 'var(--border-radius-md)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-sans)',
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--color-background-primary)',
                    color: 'var(--color-text-primary)',
                    transition: 'border-color 0.2s'
                  }}
                  min="0"
                  step="0.01"
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-border-secondary)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--color-border-tertiary)';
                  }}
                />
              </div>
              <p style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                margin: '0.5rem 0 0 0'
              }}>
                Amount you want to save monthly
              </p>
            </div>

            {/* Validation Error */}
            {savingsGoal && income && goal > income && (
              <div style={{
                background: 'rgba(227, 45, 45, 0.08)',
                border: '1px solid rgba(227, 45, 45, 0.2)',
                borderRadius: 'var(--border-radius-md)',
                padding: '0.75rem 1rem',
                marginBottom: '1.5rem'
              }}>
                <p style={{
                  fontSize: '13px',
                  color: 'var(--color-text-danger)',
                  margin: '0'
                }}>
                  Your savings goal exceeds your monthly income. Please adjust.
                </p>
              </div>
            )}

            {/* Buttons */}
            <div style={{
              display: 'flex',
              gap: '0.75rem'
            }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  background: '#c9954c',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '15px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#b8844a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#c9954c';
                }}
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  flex: 1,
                  padding: '0.875rem 1rem',
                  border: `1px solid var(--color-border-tertiary)`,
                  background: 'var(--color-background-primary)',
                  borderRadius: 'var(--border-radius-md)',
                  fontSize: '15px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--color-background-secondary)';
                  e.target.style.borderColor = 'var(--color-border-secondary)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'var(--color-background-primary)';
                  e.target.style.borderColor = 'var(--color-border-tertiary)';
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {submitted && monthlyIncome && savingsGoal && (
          <div style={{
            background: 'var(--color-background-secondary)',
            borderRadius: 'var(--border-radius-lg)',
            padding: '2rem',
            border: `1px solid var(--color-border-tertiary)`
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              margin: '0 0 1.5rem 0'
            }}>
              Your budget breakdown
            </h2>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'var(--color-background-primary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1rem',
                border: '1px solid var(--color-border-tertiary)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500'
                }}>
                  Savings rate
                </p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: '600',
                  color: '#c9954c',
                  margin: '0'
                }}>
                  {savingsPercentage}%
                </p>
              </div>

              <div style={{
                background: 'var(--color-background-primary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1rem',
                border: '1px solid var(--color-border-tertiary)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500'
                }}>
                  Remaining budget
                </p>
                <p style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  margin: '0'
                }}>
                  ₹{remainingBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div style={{
                background: 'var(--color-background-primary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1rem',
                border: '1px solid var(--color-border-tertiary)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500'
                }}>
                  Monthly savings
                </p>
                <p style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  margin: '0'
                }}>
                  ₹{goal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div style={{
                background: 'var(--color-background-primary)',
                borderRadius: 'var(--border-radius-md)',
                padding: '1rem',
                border: '1px solid var(--color-border-tertiary)'
              }}>
                <p style={{
                  fontSize: '12px',
                  color: 'var(--color-text-secondary)',
                  margin: '0 0 0.5rem 0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontWeight: '500'
                }}>
                  Annual savings
                </p>
                <p style={{
                  fontSize: '22px',
                  fontWeight: '600',
                  color: 'var(--color-text-primary)',
                  margin: '0'
                }}>
                  ₹{(goal * 12).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.75rem'
              }}>
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--color-text-primary)'
                }}>
                  Allocation
                </span>
                <span style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)'
                }}>
                  {Math.min(savingsPercentage, 100)}% of income
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '10px',
                background: 'var(--color-background-tertiary)',
                borderRadius: '5px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    height: '100%',
                    background: '#c9954c',
                    width: `${Math.min(savingsPercentage, 100)}%`,
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>
            </div>

            {/* Breakdown Table */}
            <div style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--color-border-tertiary)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Savings
                  </p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    margin: '0'
                  }}>
                    ₹{goal.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--color-text-secondary)',
                    margin: '0 0 0.5rem 0'
                  }}>
                    Other expenses
                  </p>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: 'var(--color-text-primary)',
                    margin: '0'
                  }}>
                    ₹{remainingBudget.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
