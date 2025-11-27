import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffAnalyticsScreen() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Total Orders', value: '456', change: '+12%', icon: '📦' },
    { label: 'Total Revenue', value: '$45,234', change: '+8.2%', icon: '💰' },
    { label: 'Avg Rating', value: '4.8/5', change: '+0.2', icon: '⭐' },
    { label: 'Completion Rate', value: '98.5%', change: '+2.1%', icon: '✓' }
  ];

  const topDinners = [
    { name: 'Valentine Dinner', orders: 120, revenue: '$10,680' },
    { name: 'Champagne Feast', orders: 95, revenue: '$11,490' },
    { name: 'French Dinner', orders: 87, revenue: '$6,603' },
    { name: 'English Dinner', orders: 76, revenue: '$5,009' }
  ];

  const monthlySales = [
    { month: 'Jan', sales: 2500 },
    { month: 'Feb', sales: 3200 },
    { month: 'Mar', sales: 4100 },
    { month: 'Apr', sales: 3800 },
    { month: 'May', sales: 5200 },
    { month: 'Jun', sales: 5900 }
  ];

  const maxSales = Math.max(...monthlySales.map(m => m.sales));

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/staff-home')}
          style={{
            background: 'none',
            border: 'none',
            color: '#b0b0b0',
            fontSize: '20px',
            cursor: 'pointer',
            marginBottom: '20px'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '30px'
        }}>
          Analytics & Reports
        </h1>

        {/* 주요 통계 */}
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div>
                <p style={{
                  fontSize: '14px',
                  color: '#b0b0b0',
                  marginBottom: '5px'
                }}>
                  {stat.label}
                </p>
                <p style={{
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                }}>
                  {stat.value}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '32px', marginBottom: '5px' }}>
                  {stat.icon}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#4CAF50',
                  fontWeight: 'bold'
                }}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* 월별 매출 차트 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginTop: '30px',
          marginBottom: '15px'
        }}>
          Monthly Sales
        </h2>

        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          {monthlySales.map((item, index) => (
            <div key={index} style={{ marginBottom: '15px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px'
              }}>
                <span style={{ color: '#FFFFFF', fontSize: '12px' }}>
                  {item.month}
                </span>
                <span style={{ color: '#FFC107', fontSize: '12px', fontWeight: 'bold' }}>
                  ${item.sales}
                </span>
              </div>
              <div style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '4px',
                height: '8px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    backgroundColor: '#FFC107',
                    height: '100%',
                    width: `${(item.sales / maxSales) * 100}%`,
                    transition: 'width 0.3s'
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* 인기 메뉴 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          Top Dinners
        </h2>

        {topDinners.map((dinner, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px'
            }}>
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#FFFFFF'
              }}>
                {index + 1}. {dinner.name}
              </p>
              <span style={{
                backgroundColor: '#FFC107',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: 'bold',
                color: '#000000'
              }}>
                #{dinner.orders}
              </span>
            </div>
            <p style={{
              fontSize: '14px',
              color: '#FFC107',
              fontWeight: 'bold'
            }}>
              Revenue: {dinner.revenue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffAnalyticsScreen;