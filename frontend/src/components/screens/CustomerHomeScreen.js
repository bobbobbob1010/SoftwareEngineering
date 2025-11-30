import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function CustomerHomeScreen() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [customerTier, setCustomerTier] = useState(null);
  const [swipedOrderId, setSwipedOrderId] = useState(null);

  useEffect(() => {
    loadCustomerData();
  }, []);

  const loadCustomerData = () => {
    // customers 데이터에서 최신 고객 정보 가져오기
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    // 현재 localStorage에 저장된 정보 불러오기 추가한거
    setCurrentUser(user);

    if (user && customers.length > 0) {
      // customers 배열에서 현재 고객 찾기
      const updatedUser = customers.find(c => c.id === user.id);
      
      if (updatedUser) {
        setCurrentUser(updatedUser);

        // 이 고객의 현재 주문들 가져오기 (보여주기용)
        const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        const userOrders = allOrders
          .filter(order => order.customerId === user.id)
          .sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));

        setOrders(userOrders);

        // 고객의 totalOrders로 등급 계산
        const tier = calculateTier(updatedUser.totalOrders || 0);
        setCustomerTier(tier);
      }
    }
  };

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

  const handleDeleteOrder = (orderId) => {
    // 기존 주문들 가져오기
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    // 해당 주문 삭제
    const updatedOrders = allOrders.filter(order => order.id !== orderId);
    
    // localStorage에 저장
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    // UI 업데이트 (삭제된 주문은 보여주지 않음)
    const userOrders = updatedOrders.filter(order => order.customerId === currentUser.id).sort((a, b) => new Date(b.orderTime) - new Date(a.orderTime));
    setOrders(userOrders);

    // totalOrders는 유지 (삭제해도 줄어들지 않음)
    // customerTier도 변하지 않음
    
    setSwipedOrderId(null);
    alert('Order deleted successfully!');
  };

  const dinners = [
    {
      name: 'Valentine Dinner',
      description: 'Wine, steak, heart decoration, napkin',
      price: '$79.99 - $129.99',
      icon: '💕',
      id: 'valentine'
    },
    {
      name: 'French Dinner',
      description: 'Coffee, wine, salad, steak',
      price: '$69.99 - $119.99',
      icon: '🇫🇷',
      id: 'french'
    },
    {
      name: 'English Dinner',
      description: 'Scrambled egg, bacon, bread, steak',
      price: '$59.99 - $109.99',
      icon: '🇬🇧',
      id: 'english'
    },
    {
      name: 'Champagne Feast',
      description: 'Champagne, baguette, coffee, wine, steak (2 people)',
      price: '$169.99 - $199.99',
      icon: '🥂',
      id: 'champagne'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      overflow: 'auto'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          marginTop: '20px'
        }}>
          <div>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '5px'
            }}>
              Welcome, {currentUser?.name}! 👋
            </h1>
            <p style={{
              fontSize: '12px',
              color: '#b0b0b0'
            }}>
              What would you like to order?
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '32px',
              cursor: 'pointer'
            }}
          >
            👤
          </button>
        </div>

        {/* 고객 등급 */}
        {customerTier && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            borderLeft: 
              customerTier.name === 'Platinum' ? '4px solid #E5E4E2' :
              customerTier.name === 'Gold' ? '4px solid #FFD700' :
              customerTier.name === 'Silver' ? '4px solid #C0C0C0' :
              customerTier.name === 'Bronze' ? '4px solid #CD7F32' :
              '4px solid #FFC107'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '12px' }}>
              <span style={{ fontSize: '48px' }}>{customerTier.icon}</span>
              <div>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Your Tier
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFFFFF' }}>
                  {customerTier.name}
                </p>
              </div>
            </div>

            {customerTier.discountRate > 0 && (
              <div style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
                  {customerTier.discountRate}% OFF
                </p>
              </div>
            )}

            <p style={{ fontSize: '11px', color: '#b0b0b0', marginTop: '12px' }}>
              📊 Total Orders: {currentUser?.totalOrders || 0}
            </p>
          </div>
        )}

        {/* 할인 등급 설명 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '12px', fontWeight: 'bold' }}>
            🎁 Loyalty Tiers:
          </p>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#CD7F32' }}>🥉 Bronze</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>5+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>5% OFF</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#C0C0C0' }}>🥈 Silver</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>10+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>10% OFF</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#FFD700' }}>🥇 Gold</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>15+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>15% OFF</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#E5E4E2' }}>💎 Platinum</span>
            <span style={{ fontSize: '12px', color: '#b0b0b0' }}>20+ orders</span>
            <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>20% OFF</span>
          </div>
        </div>

        {/* 고객 정보 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '8px' }}>
            📍 Delivery Address:
          </p>
          <p style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '10px' }}>
            {currentUser?.address}
          </p>
          <p style={{ fontSize: '12px', color: '#b0b0b0' }}>
            📞 {currentUser?.phoneNumber}
          </p>
        </div>

        {/* Voice Order Card */}
        <div
          onClick={() => navigate('/voice-order')}
          style={{
            backgroundColor: '#FFC107',
            borderRadius: '15px',
            padding: '25px',
            marginBottom: '20px',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>🎤</div>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#000000',
            marginBottom: '5px'
          }}>
            Voice Order
          </h2>
          <p style={{
            fontSize: '13px',
            color: '#333333'
          }}>
            Say what you want to order
          </p>
        </div>

        {/* Popular Dinners */}
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px',
          marginTop: '20px'
        }}>
          Popular Dinners
        </h2>

        {dinners.map((dinner, index) => (
          <div
            key={index}
            onClick={() => navigate(`/menu-details/${dinner.id}`)}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#3a3a3a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'}
          >
            <div style={{ display: 'flex', gap: '15px', flex: 1 }}>
              <div style={{ fontSize: '50px' }}>{dinner.icon}</div>
              <div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '5px'
                }}>
                  {dinner.name}
                </h3>
                <p style={{
                  fontSize: '13px',
                  color: '#b0b0b0'
                }}>
                  {dinner.description}
                </p>
              </div>
            </div>
            <div style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFC107'
            }}>
              {dinner.price}
            </div>
          </div>
        ))}

        {/* Previous Orders */}
        {orders.length > 0 ? (
          <>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginBottom: '15px',
              marginTop: '30px'
            }}>
              Your Previous Orders ({orders.length})
            </h2>

            {orders.map((order) => (
              <div
                key={order.id}
                style={{
                  position: 'relative',
                  marginBottom: '15px'
                }}
              >
                {/* 배경 (삭제 버튼) */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: '#FF6B6B',
                    borderRadius: '15px',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '20px'
                  }}
                >
                  <span style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}>
                    Swipe to Delete
                  </span>
                </div>

                {/* 주문 카드 */}
                <div
                  style={{
                    backgroundColor: '#2a2a2a',
                    borderRadius: '15px',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: '0.2s',
                    transform: swipedOrderId === order.id ? 'translateX(-80px)' : 'translateX(0)',
                    position: 'relative',
                    zIndex: 10
                  }}
                  onMouseLeave={() => setSwipedOrderId(null)}
                >
                  {/* 삭제 버튼 (마우스 호버 시) */}
                  {swipedOrderId === order.id && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: '-80px',
                        backgroundColor: '#FF6B6B',
                        borderRadius: '0 15px 15px 0',
                        width: '80px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      <span style={{
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}>
                        Delete
                      </span>
                    </div>
                  )}

                  <div style={{ marginBottom: '12px' }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      marginBottom: '5px'
                    }}>
                      {order.dinnerName}
                    </h3>
                    <p style={{
                      fontSize: '12px',
                      color: '#b0b0b0',
                      marginBottom: '8px'
                    }}>
                      📅 {new Date(order.orderTime).toLocaleString()}
                    </p>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #3a3a3a',
                    marginBottom: '12px'
                  }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                        Total Price
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFC107' }}>
                        ${order.totalPrice}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '11px', color: '#b0b0b0', marginBottom: '3px' }}>
                        Delivery Time
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#FFFFFF' }}>
                        {order.deliveryTime}
                      </p>
                    </div>
                  </div>

                  <p style={{
                    fontSize: '11px',
                    color: '#b0b0b0',
                    marginBottom: '12px'
                  }}>
                    📍 {order.deliveryAddress}
                  </p>

                  <div style={{
                    display: 'flex',
                    gap: '10px'
                  }}>
                    <button
                      onClick={() => navigate(`/order-details/${order.id}`)}
                      style={{
                        flex: 1,
                        backgroundColor: '#FFC107',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        color: '#000000',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => setSwipedOrderId(swipedOrderId === order.id ? null : order.id)}
                      style={{
                        width: '40px',
                        backgroundColor: '#FF6B6B',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '40px 20px',
            textAlign: 'center',
            marginTop: '30px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '48px', marginBottom: '10px' }}>📋</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '5px' }}>
              No Orders Yet
            </p>
            <p style={{ fontSize: '12px', color: '#b0b0b0' }}>
              Start by ordering your first dinner!
            </p>
          </div>
        )}

        {/* Logout 버튼 */}
        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{
            marginTop: '40px',
            marginBottom: '20px'
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default CustomerHomeScreen;