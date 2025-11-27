import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../App.css';

function DashboardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);

  // URL에서 역할 판별
  const isCustomer = location.pathname === '/dashboard' && 
    document.referrer.includes('/customer-login');

  useEffect(() => {
    // 2초 후 다음 화면으로 이동
    const timer = setTimeout(() => {
      // localStorage에서 역할 확인
      const role = localStorage.getItem('userRole');
      
      if (role === 'customer') {
        navigate('/onboarding');
      } else if (role === 'staff') {
        navigate('/staff-onboarding');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    // 깜빡이는 효과
    const interval = setInterval(() => {
      setIsVisible(prev => !prev);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="content">
        {/* 깜빡이는 동그라미 */}
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#FFC107',
            borderRadius: '50%',
            margin: '0 auto 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            opacity: isVisible ? 1 : 0.3,
            transition: 'opacity 0.3s'
          }}
        >
          🍽️
        </div>

        <h1 className="title" style={{ fontSize: '28px', marginBottom: '10px' }}>
          Mr. Daebak
        </h1>
        <p className="subtitle">준비 중입니다...</p>
      </div>
    </div>
  );
}

export default DashboardScreen;