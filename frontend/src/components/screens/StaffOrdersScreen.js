import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffOrdersScreen() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState('all');

  const orders = [
    {
      id: '#ORD001',
      customer: 'John Doe',
      dinner: 'Valentine Dinner',
      time: '19:00',
      status: 'pending',
      items: 2,
      price: 89.99
    },
    {
      id: '#ORD002',
      customer: 'Jane Smith',
      dinner: 'French Dinner',
      time: '20:00',
      status: 'in-progress',
      items: 1,
      price: 75.99
    },
    {
      id: '#ORD003',
      customer: 'Mike Johnson',
      dinner: 'Champagne Feast',
      time: '21:00',
      status: 'ready',
      items: 4,
      price: 120.99
    },
    {
      id: '#ORD004',
      customer: 'Sarah Lee',
      dinner: 'English Dinner',
      time: '19:30',
      status: 'delivered',
      items: 2,
      price: 65.99
    },
    {
      id: '#ORD005',
      customer: 'Tom Brown',
      dinner: 'Valentine Dinner',
      time: '20:30',
      status: 'pending',
      items: 3,
      price: 89.99
    }
  ];

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#FF9800';
      case 'in-progress':
        return '#2196F3';
      case 'ready':
        return '#4CAF50';
      case 'delivered':
        return '#9E9E9E';
      default:
        return '#FFC107';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'in-progress':
        return 'In Progress';
      case 'ready':
        return 'Ready';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
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
          Order Management
        </h1>

        {/* 상태 필터 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {['all', 'pending', 'in-progress', 'ready', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                backgroundColor: selectedStatus === status ? '#FFC107' : '#2a2a2a',
                color: selectedStatus === status ? '#000000' : '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                transition: '0.3s'
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>

        {/* 주문 목록 */}
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              borderLeft: `4px solid ${getStatusColor(order.status)}`
            }}
          >
            {/* 주문 ID와 상태 */}
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
                {order.id}
              </p>
              <div style={{
                backgroundColor: getStatusColor(order.status),
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: '#000000'
              }}>
                {getStatusText(order.status)}
              </div>
            </div>

            {/* 고객명과 시간 */}
            <p style={{
              fontSize: '14px',
              color: '#b0b0b0',
              marginBottom: '5px'
            }}>
              {order.customer}
            </p>

            {/* 메뉴 정보 */}
            <p style={{
              fontSize: '14px',
              color: '#FFFFFF',
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              {order.dinner}
            </p>

            {/* 가격과 시간 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '10px',
              borderTop: '1px solid #3a3a3a'
            }}>
              <span style={{ color: '#FFC107', fontWeight: 'bold' }}>
                ${order.price}
              </span>
              <span style={{ color: '#b0b0b0', fontSize: '12px' }}>
                {order.time}
              </span>
            </div>

            {/* 액션 버튼 */}
            {order.status !== 'delivered' && (
              <button
                onClick={() => alert('Order status updated!')}
                style={{
                  width: '100%',
                  marginTop: '10px',
                  backgroundColor: '#FFC107',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#000000',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Update Status
              </button>
            )}
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#b0b0b0'
          }}>
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>📭</p>
            <p>No orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffOrdersScreen;