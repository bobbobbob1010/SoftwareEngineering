import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function StaffOrdersScreen() {
  const navigate = useNavigate();

  // ============================================
  // 상태 관리
  // ============================================
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // ============================================
  // 컴포넌트 로드 시 주문 조회 (자동 새로고침)
  // ============================================
  useEffect(() => {
    // 초기 로드
    fetchOrders();

    // ⏰ 5초마다 자동으로 새 주문 확인
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  // ============================================
  // API: 주문 목록 조회
  // ============================================
  const fetchOrders = async () => {
    try {
      setError(null);
      setLoading(true);

      // ✅ Backend에서 모든 주문 조회
      const response = await axios.get(
        'http://localhost:8080/api/staff-orders'
      );

      // 받은 주문 데이터 저장
      const fetchedOrders = Array.isArray(response.data)
        ? response.data
        : response.data.orders || [];

      setOrders(fetchedOrders);
      setLoading(false);

    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError('주문을 불러올 수 없습니다');
      setLoading(false);

      // 개발용: 에러 시 더미 데이터 표시
      setOrders([]);
    }
  };

  // ============================================
  // API: 주문 상태 업데이트
  // ============================================
  const updateOrderStatus = async (orderId, newStatus) => {
    const currentStaff = JSON.parse(localStorage.getItem('currentUser'));
    const staffId = currentStaff.id;
    const staffRole = currentStaff.userType;

    try {
      setUpdatingId(orderId);
      setError(null);

      // ✅ Backend에 상태 업데이트 요청
      await axios.patch(
        `http://localhost:8080/api/staff-orders/${orderId}/status`,
        {
          status: newStatus,
          staffId: staffId,
          staffRole: staffRole
        }
      );

      // 업데이트 성공 후 주문 목록 다시 조회
      fetchOrders();
      alert('주문 상태가 업데이트되었습니다');

    } catch (err) {
      console.error('Failed to update order status:', err);
      setError('상태 업데이트 실패: ' + (err.response?.data?.message || err.message));
      alert('상태 업데이트 실패');
    } finally {
      setUpdatingId(null);
    }
  };

  // ============================================
  // 상태별 필터링
  // ============================================
  const filteredOrders = selectedStatus === 'all'
    ? orders
    : orders.filter(order => {
      const status = order.status?.toLowerCase() || order.orderStatus?.toLowerCase();
      return status === selectedStatus;
    });

  // ============================================
  // 상태별 색상
  // ============================================
  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'delivered':
        return '#4CAF50';
      case 'In Progress':
      case 'in-progress':
      case 'inprogress':
        return '#FFC107';
      case 'ready':
        return '#2196F3';
      case 'pending':
        return '#FF9800';
      case 'cancelled':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  // ============================================
  // 상태 텍스트
  // ============================================
  const getStatusText = (status) => {
    const normalizedStatus = status?.toLowerCase();
    const statusMap = {
      'pending': 'Pending',
      'in-progress': 'In Progress',
      'inprogress': 'In Progress',
      'ready': 'Ready',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled'
    };
    return statusMap[normalizedStatus] || status;
  };

  // ============================================
  // 다음 상태 반환
  // ============================================
  const getNextStatus = (currentStatus) => {
    const normalizedStatus = currentStatus?.toLowerCase();
    const statusFlow = {
      'pending': 'in-progress',
      'in-progress': 'ready',
      'inprogress': 'ready',
      'ready': 'delivered'
    };
    return statusFlow[normalizedStatus] || 'delivered';
  };

  // ============================================
  // 주문 통계
  // ============================================
  const pendingCount = orders.filter(o =>
    o.status?.toLowerCase() === 'pending' ||
    o.orderStatus?.toLowerCase() === 'pending'
  ).length;

  const inProgressCount = orders.filter(o =>
    o.status?.toLowerCase() === 'in-progress' ||
    o.status?.toLowerCase() === 'inprogress' ||
    o.orderStatus?.toLowerCase() === 'in-progress'
  ).length;

  const completedCount = orders.filter(o =>
    o.status?.toLowerCase() === 'delivered' ||
    o.orderStatus?.toLowerCase() === 'delivered'
  ).length;

  // ============================================
  // UI 렌더링
  // ============================================
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

        {/* 제목 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '10px'
        }}>
          Order Management
        </h1>

        {/* 주문 수 & 새로고침 버튼 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <p style={{ color: '#b0b0b0', fontSize: '14px' }}>
            📦 Total: {orders.length} orders
          </p>
          <button
            onClick={fetchOrders}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFC107',
              fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: loading ? 0.5 : 1
            }}
          >
            🔄 Refresh
          </button>
        </div>

        {/* 통계 */}
        {!loading && (
          <div style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{
              flex: 1,
              backgroundColor: '#2a2a2a',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
              borderLeft: '3px solid #FF9800'
            }}>
              <p style={{ fontSize: '12px', color: '#b0b0b0' }}>Pending</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FF9800' }}>
                {pendingCount}
              </p>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: '#2a2a2a',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
              borderLeft: '3px solid #2196F3'
            }}>
              <p style={{ fontSize: '12px', color: '#b0b0b0' }}>In Progress</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2196F3' }}>
                {inProgressCount}
              </p>
            </div>
            <div style={{
              flex: 1,
              backgroundColor: '#2a2a2a',
              borderRadius: '10px',
              padding: '10px',
              textAlign: 'center',
              borderLeft: '3px solid #4CAF50'
            }}>
              <p style={{ fontSize: '12px', color: '#b0b0b0' }}>Completed</p>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
                {completedCount}
              </p>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {error && (
          <div style={{
            backgroundColor: '#FF6B6B',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '20px',
            color: '#FFFFFF',
            fontSize: '12px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* 로딩 중 */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#b0b0b0'
          }}>
            <p>⏳ Loading orders...</p>
          </div>
        )}

        {/* 상태 필터 버튼 */}
        {!loading && (
          <>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '20px',
              overflowX: 'auto',
              paddingBottom: '10px'
            }}>
              {['all', 'pending', 'inprogress', 'ready', 'delivered'].map((status) => (
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
                  {status === 'in-progress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* 주문 목록 */}
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '15px',
                    padding: '20px',
                    marginBottom: '15px',
                    borderLeft: `4px solid ${getStatusColor(order.status || order.orderStatus)}`
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
                      Order #{order.id}
                    </p>
                    <div style={{
                      backgroundColor: getStatusColor(order.status || order.orderStatus),
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: (order.status?.toLowerCase() === 'pending' ||
                        order.status?.toLowerCase() === 'in-progress' ||
                        order.status?.toLowerCase() === 'inprogress'
                      )
                        ? '#000000'
                        : '#FFFFFF'
                    }}>
                      {getStatusText(order.status || order.orderStatus)}
                    </div>
                  </div>

                  {/* 고객 정보 */}
                  <p style={{
                    fontSize: '14px',
                    color: '#b0b0b0',
                    marginBottom: '5px'
                  }}>
                    👤 {order.customerName || 'Unknown'}
                  </p>

                  {/* 메뉴 정보 (간략) */}
                  <p style={{
                    fontSize: '14px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginBottom: '10px'
                  }}>
                    🍽️ {order.dinnerName || order.dinnerType || 'Dinner'}
                  </p>

                  {/* 상세 메뉴 토글 버튼 */}
                  <button
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#e0e0e0',
                      fontSize: '12px',
                      padding: '8px 0',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      width: '100%',
                      fontWeight: '500',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
                  >
                    {expandedOrderId === order.id ? 'Hide Details ▲' : 'View Details ▼'}
                  </button>

                  {/* 상세 메뉴 목록 (펼쳐졌을 때만 표시) */}
                  {expandedOrderId === order.id && order.items && (
                    <div style={{
                      backgroundColor: '#1f1f1f',
                      padding: '10px',
                      borderRadius: '8px',
                      marginBottom: '15px'
                    }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                          fontSize: '13px',
                          color: '#e0e0e0',
                          borderBottom: idx !== order.items.length - 1 ? '1px solid #333' : 'none',
                          paddingBottom: idx !== order.items.length - 1 ? '5px' : '0'
                        }}>
                          <span>{item.name} (x{item.qty || item.quantity})</span>
                          {/* <span>${item.price}</span>  */}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 배송 주소 */}
                  <p style={{
                    fontSize: '12px',
                    color: '#b0b0b0',
                    marginBottom: '10px'
                  }}>
                    📍 {order.deliveryAddress || 'TBD'}
                  </p>

                  {/* 담당 주방 직원 정보 */}
                  {(order.kitchenStaffId || order.kitchenStaffName) && (
                    <p style={{ fontSize: '12px', color: '#b0b0b0' }}>
                      👨‍🍳 Kitchen Staff: {order.kitchenStaffName ? `${order.kitchenStaffName} (ID: ${order.kitchenStaffId})` : `ID: ${order.kitchenStaffId}`}
                    </p>
                  )}
                  {order.readyTime && (
                    <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
                      🕒 Ready Time: {new Date(order.readyTime).toLocaleTimeString()}
                    </p>
                  )}

                  {/* 담당 배달 직원 정보 */}
                  {(order.deliveryStaffId || order.deliveryStaffName) && (
                    <p style={{ fontSize: '12px', color: '#b0b0b0', borderTop: '1px solid #3a3a3a' }}>
                      👨 Delivery Staff: {order.deliveryStaffName ? `${order.deliveryStaffName} (ID: ${order.deliveryStaffId})` : `ID: ${order.deliveryStaffId}`}
                    </p>
                  )}
                  {order.deliveryTime && (
                    <p style={{ fontSize: '12px', color: '#b0b0b0' }}>
                      🕒 Delivery Time: {new Date(order.deliveryTime).toLocaleTimeString()}
                    </p>
                  )}

                  {/* 가격과 시간 */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '10px',
                    borderTop: '1px solid #3a3a3a',
                    marginBottom: '15px',
                    marginTop: '5px'
                  }}>
                    <span style={{ color: '#FFC107', fontWeight: 'bold' }}>
                      ${parseFloat(order.totalPrice || 0).toFixed(2)}
                    </span>
                    <span style={{ color: '#b0b0b0', fontSize: '12px' }}>
                      ⏰ {order.orderTime
                        ? new Date(order.orderTime).toLocaleTimeString()
                        : 'TBD'}
                    </span>
                  </div>

                  {/* 상태 업데이트 버튼 */}
                  {(order.status?.toLowerCase() !== 'delivered' &&
                    order.orderStatus?.toLowerCase() !== 'delivered') ? (
                    <button
                      onClick={() => {
                        const currentStatus = order.status?.toLowerCase() || order.orderStatus?.toLowerCase();
                        updateOrderStatus(order.id, getNextStatus(currentStatus));
                      }}
                      disabled={updatingId === order.id}
                      style={{
                        width: '100%',
                        backgroundColor: '#FFC107',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px',
                        color: '#000000',
                        fontWeight: 'bold',
                        cursor: updatingId === order.id ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        opacity: updatingId === order.id ? 0.5 : 1,
                        transition: '0.3s'
                      }}
                      onMouseEnter={(e) => {
                        if (updatingId !== order.id) {
                          e.currentTarget.style.backgroundColor = '#FFD54F';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (updatingId !== order.id) {
                          e.currentTarget.style.backgroundColor = '#FFC107';
                        }
                      }}
                    >
                      {updatingId === order.id
                        ? '⏳ Processing...'
                        : `✅ Mark as ${getStatusText(getNextStatus(order.status || order.orderStatus))}`
                      }
                    </button>
                  ) : (
                    <div style={{
                      backgroundColor: '#1a4d2e',
                      borderRadius: '8px',
                      padding: '10px',
                      textAlign: 'center',
                      color: '#4CAF50',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      ✅ Delivered
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                color: '#b0b0b0'
              }}>
                <p style={{ fontSize: '24px', marginBottom: '10px' }}>📭</p>
                <p>No orders in this status</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default StaffOrdersScreen;