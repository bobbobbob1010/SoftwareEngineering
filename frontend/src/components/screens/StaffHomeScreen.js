import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffHomeScreen() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: '📦',
      title: 'Order Management',
      description: 'View and process orders',
      path: '/staff-orders'
    },
    {
      icon: '📊',
      title: 'Inventory Management',
      description: 'Check stock levels',
      path: '/staff-inventory'
    },
    {
      icon: '🗺️',
      title: 'Delivery Tracking',
      description: 'Track active deliveries',
      path: '/staff-delivery'
    },
    {
      icon: '👥',
      title: 'Staff Management',
      description: 'Manage kitchen & delivery staff',
      path: '/staff-team'
    },
    {
      icon: '📈',
      title: 'Analytics & Reports',
      description: 'View sales and performance',
      path: '/staff-analytics'
    },
    {
      icon: '🍷',
      title: 'Liquor Store Integration',
      description: 'Manage wine & champagne',
      path: '/staff-liquor'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          marginTop: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '5px'
            }}>
              Staff Dashboard 👨‍💼
            </h1>
            <p style={{
              fontSize: '14px',
              color: '#b0b0b0'
            }}>
              Restaurant Management
            </p>
          </div>
          <div style={{ fontSize: '32px' }}>🏢</div>
        </div>

        {/* 통계 섹션 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px'
        }}>
          {/* Pending Orders */}
          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📦</div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFC107',
              marginBottom: '5px'
            }}>
              5
            </div>
            <div style={{
              fontSize: '12px',
              color: '#b0b0b0'
            }}>
              Pending Orders
            </div>
          </div>

          {/* In Progress */}
          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🚚</div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFC107',
              marginBottom: '5px'
            }}>
              3
            </div>
            <div style={{
              fontSize: '12px',
              color: '#b0b0b0'
            }}>
              In Progress
            </div>
          </div>

          {/* Completed */}
          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
            <div style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFC107',
              marginBottom: '5px'
            }}>
              24
            </div>
            <div style={{
              fontSize: '12px',
              color: '#b0b0b0'
            }}>
              Completed
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          Quick Actions
        </h2>

        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => navigate(action.path)}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
          >
            <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
              <div style={{ fontSize: '40px' }}>{action.icon}</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '5px'
                }}>
                  {action.title}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#b0b0b0'
                }}>
                  {action.description}
                </p>
              </div>
            </div>
            <div style={{
              fontSize: '20px',
              color: '#FFC107'
            }}>
              →
            </div>
          </div>
        ))}

        {/* Logout 버튼 */}
        <button
          onClick={() => {
            localStorage.removeItem('userRole');
            navigate('/');
          }}
          className="btn-secondary"
          style={{
            marginTop: '40px',
            marginBottom: '20px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default StaffHomeScreen;