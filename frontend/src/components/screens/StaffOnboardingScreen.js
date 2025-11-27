import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffOnboardingScreen() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📦',
      title: 'Order Management',
      description: 'Staff can receive and process customer orders in real time.'
    },
    {
      icon: '📈',
      title: 'Delivery Tracking',
      description: 'Shows delivery progress and estimated times.'
    },
    {
      icon: '🍽️',
      title: 'Inventory & Stock Management',
      description: 'Automatically updates ingredients and drink inventory after each order.'
    },
    {
      icon: '⭐',
      title: 'Liquor Store Integration',
      description: 'Staff can register liquor purchases and track supplies for champagne and wine.'
    },
    {
      icon: '👥',
      title: 'Staff Management',
      description: 'Manage delivery personnel and kitchen staff schedules.'
    },
    {
      icon: '📊',
      title: 'Analytics & Reports',
      description: 'View sales reports, popular dishes, and staff performance metrics.'
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
        {/* 타이틀 */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '20px',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          Mr. Daebak Dinner Service
        </h1>

        {/* 설명 */}
        <p style={{
          fontSize: '16px',
          color: '#b0b0b0',
          marginBottom: '40px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          An AI-powered dinner ordering and delivery system that allows customers to easily order luxurious themed dinners from home.
        </p>

        {/* 기능 제목 */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          Staff Features
        </h2>

        {/* 기능들 */}
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              display: 'flex',
              gap: '15px'
            }}
          >
            <div style={{ fontSize: '40px', minWidth: '50px' }}>
              {feature.icon}
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#FFFFFF',
                marginBottom: '8px'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#b0b0b0',
                lineHeight: '1.5'
              }}>
                {feature.description}
              </p>
            </div>
          </div>
        ))}

        {/* Get Started 버튼 */}
        <button
          onClick={() => navigate('/staff-home')}
          className="btn-primary"
          style={{
            marginTop: '40px',
            marginBottom: '20px',
            fontSize: '18px',
            padding: '15px'
          }}
        >
          Get Started →
        </button>
      </div>
    </div>
  );
}

export default StaffOnboardingScreen;