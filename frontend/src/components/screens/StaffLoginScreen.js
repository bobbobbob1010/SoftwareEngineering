import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios'; //백엔드로 요청을 보내기위한 axios 임포트

//백엔드 주소
const BACKEND_URL = 'http://localhost:8080/api/auth/staff-login';

function StaffLoginScreen({ setSelectedRole }) {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  // 기존로직
  // if (email && password) {
  //   localStorage.setItem('userRole', 'staff');
  //   navigate('/dashboard');
  // } else {
  //   alert('이메일과 비밀번호를 입력하세요');
  // }


  if ((!email || !password)) {
      setError('Please enter your email and password');
      return;
    }
  // 백엔드로 요청을 보내 확인하기
  try {
    const response = await axios.post(BACKEND_URL, {
      email: email,
      password: password
    });

    console.log('Login response:', response);
    const staff = response.data; //백엔드에서 반환된 직원 정보 저장
    //현재 로그인한 직원 정보 저장
    localStorage.setItem('currentUser', JSON.stringify(staff));
    localStorage.setItem('userRole', 'staff');

    navigate('/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    setError('An error occurred during login. Please try again.');
    return;
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
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}          
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleLogin();
            }
          }}
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