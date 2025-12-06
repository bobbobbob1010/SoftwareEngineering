import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { data } from 'autoprefixer';

function OrderDetailsScreen() {
  const navigate = useNavigate();
  const { orderId } = useParams();

  // const orderData = {
  //   '1': {
  //     id: '#ORD001',
  //     dinner: 'Valentine Dinner',
  //     date: 'November 15, 2025',
  //     time: '19:00',
  //     status: 'Delivered',
  //     totalPrice: 89.99,
  //     items: [
  //       { name: 'Appetizer', price: 15, qty: 1 },
  //       { name: 'Soup Course', price: 10, qty: 1 },
  //       { name: 'Main Course', price: 40, qty: 1 },
  //       { name: 'Dessert', price: 15, qty: 1 },
  //       { name: 'Champagne', price: 9.99, qty: 1 }
  //     ],
  //     deliveryAddress: '123 Main St, New York, NY',
  //     deliveryTime: '7:00 PM - 7:30 PM',
  //     driverName: 'John Doe',
  //     driverPhone: '+1-555-0123'
  //   },
  //   '2': {
  //     id: '#ORD002',
  //     dinner: 'French Dinner',
  //     date: 'November 10, 2025',
  //     time: '20:00',
  //     status: 'Delivered',
  //     totalPrice: 75.99,
  //     items: [
  //       { name: 'Foie Gras', price: 20, qty: 1 },
  //       { name: 'French Onion Soup', price: 12, qty: 1 },
  //       { name: 'Beef Bourguignon', price: 35, qty: 1 },
  //       { name: 'Crème Brûlée', price: 8.99, qty: 1 }
  //     ],
  //     deliveryAddress: '456 Park Ave, New York, NY',
  //     deliveryTime: '8:00 PM - 8:30 PM',
  //     driverName: 'Jane Smith',
  //     driverPhone: '+1-555-0124'
  //   }
  // };

  //const order = orderData[orderId] || orderData['1'];

  // 백엔드용 상태관리
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
        setOrder(response.data);
        //console.log('Fetched order details:', response.data);
        //console.log(order.driverName)
      } catch (error) {
        console.error('Error fetching order details:', error);
        alert('Failed to load order details. Please try again later.');
        navigate('/customer-home');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, navigate]);

  if (loading) return <div style={{ color: 'white', padding: '20px' }}>Loading details...</div>;
  if (!order) return <div style={{ color: 'white', padding: '20px' }}>Order not found</div>;


  const getStatusColor = (status) => {
    const normalizedStatus = status?.toLowerCase();
    console.log(normalizedStatus);
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

  // 백엔드 날짜 포맷팅 (예: "2025-11-27 19:00:00")
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // dinnerType 코드를 받아서 예쁜 이름으로 바꿔주는 함수
  const getDinnerName = (type) => {
    const names = {
      'valentine': 'Valentine Dinner 💕',
      'french': 'French Dinner 🇫🇷',
      'english': 'English Dinner 🇬🇧',
      'champagne': 'Champagne Feast 🥂'
    };
    // 목록에 없으면(예: 오타) 그냥 원래 type을 보여주거나 기본값 설정
    return names[type] || 'Delicious Dinner 🍽️';
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

        {/* 주문 번호 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '5px'
        }}>
          {getDinnerName(order.dinnerName)}
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#b0b0b0',
          marginBottom: '20px'
        }}>
          Order {order.id}
        </p>

        {/* 상태 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: getStatusColor(order.status),
            borderRadius: '8px',
            padding: '8px 16px',
            display: 'inline-block',
            marginBottom: '10px'
          }}>
            <span style={{
              color: order.status === 'Delivered' ? '#FFFFFF' : '#000000',
              fontWeight: 'bold'
            }}>
              {getStatusText(order.status)}
            </span>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#b0b0b0',
            marginTop: '10px'
          }}>
            {order.actualDeliveryTime ? `${new Date(order.actualDeliveryTime).toLocaleDateString()} at ${new Date(order.actualDeliveryTime).toLocaleTimeString()}` : ''}{/*date(배달시간)이 있을 경우에만 표시 */}
          </p>
        </div>

        {/* 주문 항목들 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          Order Items:
        </h2>

        {order.items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <p style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {item.name}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#b0b0b0'
              }}>
                Qty: {item.qty}
              </p>
            </div>
            <p style={{
              color: '#FFC107',
              fontWeight: 'bold'
            }}>
              ${(item.price * item.qty).toFixed(2)}
            </p>
          </div>
        ))}

        {/* 배송 정보 */}
        <h2 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginTop: '30px',
          marginBottom: '15px'
        }}>
          Delivery Information:
        </h2>

        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: '12px',
            color: '#b0b0b0',
            marginBottom: '5px'
          }}>
            Address
          </p>
          <p style={{
            color: '#FFFFFF',
            marginBottom: '15px',
            fontWeight: 'bold'
          }}>
            {order.deliveryAddress}
          </p>

          {(order.readyTime) && (
            <>
              <p style={{
                fontSize: '12px',
                color: '#b0b0b0',
                marginBottom: '5px'
              }}>
                Ready At
              </p>
              <p style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {new Date(order.readyTime).toLocaleTimeString()}
              </p>

            </>
          )}

          {(order.actualDeliveryTime) && (
            <>
              <p style={{
                fontSize: '12px',
                color: '#b0b0b0',
                marginBottom: '5px'
              }}>
                Delivered At
              </p>
              <p style={{
                color: '#FFFFFF',
                fontWeight: 'bold',
                marginBottom: '15px'
              }}>
                {new Date(order.actualDeliveryTime).toLocaleTimeString()}
              </p>
            </>
          )}
        </div>

        {/* 총 가격 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#b0b0b0',
            marginBottom: '10px'
          }}>
            Total Amount:
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#FFC107'
          }}>
            ${order.totalPrice}
          </p>
        </div>

        {/* 버튼들 */}
        <button
          onClick={() => navigate('/customer-home')}
          className="btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Reorder
        </button>

        <button
          onClick={() => navigate('/customer-home')}
          className="btn-secondary"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default OrderDetailsScreen;