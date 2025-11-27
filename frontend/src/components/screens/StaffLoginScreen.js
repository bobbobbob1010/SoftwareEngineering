import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffLoginScreen({ setSelectedRole }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
  if (email && password) {
    localStorage.setItem('userRole', 'staff');
    navigate('/dashboard');
  } else {
    alert('이메일과 비밀번호를 입력하세요');
  }
};

  return (
    <div className="container">
      <div className="content" style={{ maxWidth: '400px' }}>
        <h1 className="title" style={{ fontSize: '28px', marginBottom: '40px' }}>
          Staff Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          style={{ marginBottom: '30px' }}
        />

        <button
          onClick={handleLogin}
          className="btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Login
        </button>

        <button
          onClick={() => navigate('/')}
          className="btn-secondary"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default StaffLoginScreen;