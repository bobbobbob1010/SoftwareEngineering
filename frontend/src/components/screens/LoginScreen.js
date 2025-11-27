import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function LoginScreen() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');

    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    // localStorage에서 고객 정보 확인
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const customer = customers.find(c => c.email === email && c.password === password);

    if (customer) {
      // 로그인 성공 - 현재 로그인한 고객 정보 저장
      localStorage.setItem('currentUser', JSON.stringify(customer));
      localStorage.setItem('userRole', 'customer');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '400px', width: '100%' }}>
        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'none',
            border: 'none',
            color: '#b0b0b0',
            fontSize: '20px',
            cursor: 'pointer',
            marginBottom: '30px'
          }}
        >
          ← Back
        </button>

        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          Login
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#b0b0b0',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Welcome back! 👋
        </p>

        {/* 에러 메시지 */}
        {error && (
          <div style={{
            backgroundColor: '#FF6B6B',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            color: '#FFFFFF',
            fontSize: '12px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {/* 이메일 입력 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Email
        </label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        {/* 비밀번호 입력 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Password
        </label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          className="input-field"
          style={{ marginBottom: '30px' }}
        />

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Login
        </button>

        {/* 회원가입 링크 */}
        <button
          onClick={() => navigate('/signup')}
          className="btn-secondary"
          style={{ marginBottom: '15px' }}
        >
          Create Account
        </button>

        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
        >
          Back
        </button>

        {/* 테스트용 데모 계정 정보 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          padding: '15px',
          marginTop: '30px',
          fontSize: '11px',
          color: '#b0b0b0',
          lineHeight: '1.6'
        }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px', color: '#FFC107' }}>
            📝 Demo Account:
          </p>
          <p>Email: demo@example.com</p>
          <p>Password: 1234</p>
        </div>
      </div>
    </div>
  );
}

export default LoginScreen;