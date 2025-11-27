import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffDeliveryScreen() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([
    {
      id: '#DEL001',
      driver: 'John Doe',
      order: '#ORD001',
      customer: 'Alice Smith',
      address: '123 Main St, New York',
      phone: '+1-555-0101',
      status: 'in-route',
      progress: 65,
      estimatedTime: '15 mins'
    },
    {
      id: '#DEL002',
      driver: 'Jane Wilson',
      order: '#ORD002',
      customer: 'Bob Johnson',
      address: '456 Park Ave, New York',
      phone: '+1-555-0102',
      status: 'picked-up',
      progress: 40,
      estimatedTime: '25 mins'
    },
    {
      id: '#DEL003',
      driver: 'Mike Brown',
      order: '#ORD003',
      customer: 'Carol Lee',
      address: '789 5th Ave, New York',
      phone: '+1-555-0103',
      status: 'preparing',
      progress: 20,
      estimatedTime: '35 mins'
    },
    {
      id: '#DEL004',
      driver: 'Sarah Davis',
      order: '#ORD004',
      customer: 'David Miller',
      address: '321 Broadway, New York',
      phone: '+1-555-0104',
      status: 'delivered',
      progress: 100,
      estimatedTime: 'Completed'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing':
        return '#FF9800';
      case 'picked-up':
        return '#2196F3';
      case 'in-route':
        return '#4CAF50';
      case 'delivered':
        return '#9E9E9E';
      default:
        return '#FFC107';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'preparing':
        return '⏳';
      case 'picked-up':
        return '📦';
      case 'in-route':
        return '🚗';
      case 'delivered':
        return '✓';
      default:
        return '●';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'preparing':
        return 'Preparing';
      case 'picked-up':
        return 'Picked Up';
      case 'in-route':
        return 'In Route';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const handleUpdateStatus = (id, newStatus) => {
    setDeliveries(deliveries.map(delivery =>
      delivery.id === id ? { ...delivery, status: newStatus } : delivery
    ));
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
          Delivery Tracking
        </h1>

        {/* 배달 목록 */}
        {deliveries.map((delivery) => (
          <div
            key={delivery.id}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px'
            }}
          >
            {/* 배달 ID와 상태 */}
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
                {delivery.id}
              </p>
              <div style={{
                backgroundColor: getStatusColor(delivery.status),
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: delivery.status === 'delivering' ? '#000000' : '#FFFFFF'
              }}>
                {getStatusIcon(delivery.status)} {getStatusText(delivery.status)}
              </div>
            </div>

            {/* 운전자 정보 */}
            <p style={{
              fontSize: '14px',
              color: '#b0b0b0',
              marginBottom: '5px'
            }}>
              Driver: {delivery.driver}
            </p>

            {/* 고객 정보 */}
            <p style={{
              fontSize: '14px',
              color: '#FFFFFF',
              fontWeight: 'bold',
              marginBottom: '5px'
            }}>
              {delivery.customer}
            </p>

            {/* 주소 */}
            <p style={{
              fontSize: '12px',
              color: '#b0b0b0',
              marginBottom: '10px'
            }}>
              📍 {delivery.address}
            </p>

            {/* 진행 상태 바 */}
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              height: '8px',
              marginBottom: '10px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  backgroundColor: getStatusColor(delivery.status),
                  height: '100%',
                  width: `${delivery.progress}%`,
                  transition: 'width 0.3s'
                }}
              />
            </div>

            {/* 예상 시간 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: '10px',
              borderTop: '1px solid #3a3a3a',
              marginBottom: '15px'
            }}>
              <span style={{ color: '#b0b0b0', fontSize: '12px' }}>
                {delivery.estimatedTime}
              </span>
              <span style={{ color: '#FFC107', fontSize: '12px' }}>
                {delivery.progress}%
              </span>
            </div>

            {/* 액션 버튼 */}
            {delivery.status !== 'delivered' && (
              <div style={{
                display: 'flex',
                gap: '10px'
              }}>
                <button
                  onClick={() => window.open(`tel:${delivery.phone}`)}
                  style={{
                    flex: 1,
                    backgroundColor: '#2196F3',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  📞 Call
                </button>
                <button
                  onClick={() => handleUpdateStatus(delivery.id, 'delivered')}
                  style={{
                    flex: 1,
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  ✓ Complete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffDeliveryScreen;