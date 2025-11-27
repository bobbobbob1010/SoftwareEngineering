import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function SignupScreen() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignup = () => {
    setError('');

    // 유효성 검사
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!formData.email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!formData.password) {
      setError('Please enter a password');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.address.trim()) {
      setError('Please enter your address');
      return;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return;
    }
    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    // 고객 정보 저장
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    
    // 이미 존재하는 이메일 확인
    if (customers.find(c => c.email === formData.email)) {
      setError('This email is already registered');
      return;
    }

    // 새 고객 추가
    const newCustomer = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      address: formData.address,
      phone: formData.phone,
      registeredAt: new Date().toISOString(),
      totalOrders: 0,
      totalSpent: 0,
      discountRate: 0 // 초기 할인율
    };

    customers.push(newCustomer);
    localStorage.setItem('customers', JSON.stringify(customers));

    // 회원가입 완료 후 로그인 페이지로 이동
    alert('Account created successfully! Please log in.');
    navigate('/customer-login');
  };

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
          onClick={() => navigate('/')}
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
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          Sign Up
        </h1>

        {/* 에러 메시지 */}
        {error && (
          <div style={{
            backgroundColor: '#FF6B6B',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#FFFFFF',
            fontSize: '12px'
          }}>
            {error}
          </div>
        )}

        {/* 이름 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        {/* 이메일 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        {/* 주소 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Address
        </label>
        <input
          type="text"
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        {/* 연락처 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        {/* 비밀번호 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          className="input-field"
          style={{ marginBottom: '15px' }}
        />

        {/* 비밀번호 확인 */}
        <label style={{ fontSize: '12px', color: '#b0b0b0', display: 'block', marginBottom: '5px' }}>
          Confirm Password
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="input-field"
          style={{ marginBottom: '20px' }}
        />

        {/* 약관 동의 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '2px',
                cursor: 'pointer'
              }}
            />
            <div style={{ fontSize: '12px', color: '#b0b0b0', lineHeight: '1.6' }}>
              <p style={{ marginBottom: '8px', fontWeight: 'bold', color: '#FFFFFF' }}>
                I agree to:
              </p>
              <p style={{ marginBottom: '5px' }}>
                ✓ Terms and Conditions
              </p>
              <p style={{ marginBottom: '5px' }}>
                ✓ Privacy Policy
              </p>
              <p>
                ✓ Save my information for discount eligibility
              </p>
            </div>
          </div>
        </div>

        {/* 회원가입 버튼 */}
        <button
          onClick={handleSignup}
          className="btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Sign Up
        </button>

        {/* 로그인 링크 */}
        <button
          onClick={() => navigate('/customer-login')}
          className="btn-secondary"
        >
          Already have an account? Login
        </button>
      </div>
    </div>
  );
}

export default SignupScreen;