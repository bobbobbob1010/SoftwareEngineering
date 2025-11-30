import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function ProfileScreen() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customerTier, setCustomerTier] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
      setEditData(user);

      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.customerId === user.id);
      setOrders(userOrders);

      const tier = calculateTier(userOrders.length);
      setCustomerTier(tier);
    }
  }, []);

  const calculateTier = (orderCount) => {
    if (orderCount >= 20) {
      return { name: 'Platinum', discountRate: 20, icon: '💎' };
    } else if (orderCount >= 15) {
      return { name: 'Gold', discountRate: 15, icon: '🥇' };
    } else if (orderCount >= 10) {
      return { name: 'Silver', discountRate: 10, icon: '🥈' };
    } else if (orderCount >= 5) {
      return { name: 'Bronze', discountRate: 5, icon: '🥉' };
    } else {
      return { name: 'Regular', discountRate: 0, icon: '👤' };
    }
  };

  const handleSaveProfile = () => {
    // 고객 정보 업데이트
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const updatedCustomers = customers.map(c =>
      c.id === currentUser.id ? { ...c, ...editData } : c
    );
    localStorage.setItem('customers', JSON.stringify(updatedCustomers));
    localStorage.setItem('currentUser', JSON.stringify({ ...currentUser, ...editData }));
    
    setCurrentUser({ ...currentUser, ...editData });
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
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
          onClick={() => navigate('/customer-home')}
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
          My Profile
        </h1>

        {/* 고객 등급 카드 */}
        {customerTier && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
            borderLeft: 
              customerTier.name === 'Platinum' ? '4px solid #E5E4E2' :
              customerTier.name === 'Gold' ? '4px solid #FFD700' :
              customerTier.name === 'Silver' ? '4px solid #C0C0C0' :
              customerTier.name === 'Bronze' ? '4px solid #CD7F32' :
              '4px solid #FFC107'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '10px' }}>
              {customerTier.icon}
            </p>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
              Current Tier
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '10px' }}>
              {customerTier.name}
            </p>
            {customerTier.discountRate > 0 && (
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFC107' }}>
                {customerTier.discountRate}% Discount
              </p>
            )}
          </div>
        )}

        {/* 통계 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
              Total Orders
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
              {orders.length}
            </p>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
              Member Since
            </p>
            <p style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFFFFF' }}>
              {currentUser && new Date(currentUser.registeredAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* 개인정보 섹션 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          Personal Information
        </h2>

        {!isEditing ? (
          // 보기 모드
          <>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Full Name
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.name}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Email
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.email}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Phone Number
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.phoneNumber}
                </p>
              </div>

              <div>
                <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Address
                </p>
                <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {currentUser?.address}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="btn-primary"
              style={{ marginBottom: '15px' }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          // 수정 모드
          <>
            <div style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={editData.name || ''}
                onChange={handleInputChange}
                className="input-field"
                style={{ marginBottom: '15px' }}
              />

              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email || ''}
                onChange={handleInputChange}
                className="input-field"
                style={{ marginBottom: '15px' }}
              />

              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={editData.phone || ''}
                onChange={handleInputChange}
                className="input-field"
                style={{ marginBottom: '15px' }}
              />

              <label style={{ fontSize: '11px', color: '#b0b0b0', display: 'block', marginBottom: '3px' }}>
                Address
              </label>
              <input
                type="text"
                name="address"
                value={editData.address || ''}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>

            <button
              onClick={handleSaveProfile}
              className="btn-primary"
              style={{ marginBottom: '15px' }}
            >
              Save Changes
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileScreen;