import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../App.css';

function MenuDetailsScreen() {
  const navigate = useNavigate();
  const { dinnerType } = useParams();
  
  // ============================================
  // 상태 관리
  // ============================================
  const [quantity, setQuantity] = useState(1);
  const [style, setStyle] = useState('grand');
  const [discountRate, setDiscountRate] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================
  // 컴포넌트 로드 시 고객 정보 & 할인율 로드
  // ============================================
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
      
      // 할인율 계산 (Backend에서 받으면 좋음)
      // 임시로 localStorage에서 주문 수 조회
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.customerId === user.id);
      
      const tier = calculateTier(userOrders.length);
      setDiscountRate(tier.discountRate);
    }
  }, []);

  // ============================================
  // 할인율 계산 (로컬)
  // ============================================
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

  // ============================================
  // 메뉴 데이터
  // ============================================
  const dinnerDetails = {
    'valentine': {
      name: 'Valentine Dinner',
      icon: '💕',
      basePrice: 79.99,
      description: 'Romantic candlelit dinner for two',
      servings: '2 people',
      items: [
        '🍷 Wine',
        '🥩 Steak',
        '💕 Heart-shaped decorated plate',
        '🧻 Napkin'
      ],
      priceByStyle: {
        simple: 79.99,
        grand: 99.99,
        deluxe: 129.99
      }
    },
    'french': {
      name: 'French Dinner',
      icon: '🇫🇷',
      basePrice: 69.99,
      description: 'Classic French cuisine',
      servings: 'Per person',
      items: [
        '☕ Coffee',
        '🍷 Wine',
        '🥗 Salad',
        '🥩 Steak'
      ],
      priceByStyle: {
        simple: 69.99,
        grand: 89.99,
        deluxe: 119.99
      }
    },
    'english': {
      name: 'English Dinner',
      icon: '🇬🇧',
      basePrice: 59.99,
      description: 'Traditional English feast',
      servings: 'Per person',
      items: [
        '🍳 Scrambled Egg',
        '🥓 Bacon',
        '🍞 Bread',
        '🥩 Steak'
      ],
      priceByStyle: {
        simple: 59.99,
        grand: 79.99,
        deluxe: 109.99
      }
    },
    'champagne': {
      name: 'Champagne Feast',
      icon: '🥂',
      basePrice: 149.99,
      description: 'Luxury celebration dinner',
      servings: '2 people (fixed)',
      items: [
        '🍾 Champagne (1 bottle)',
        '🥖 Baguette (4 pieces)',
        '☕ Coffee (1 pot)',
        '🍷 Wine',
        '🥩 Steak'
      ],
      priceByStyle: {
        simple: null,
        grand: 169.99,
        deluxe: 199.99
      },
      fixedQuantity: 2
    }
  };

  const dinner = dinnerDetails[dinnerType] || dinnerDetails['valentine'];

  const styleDescriptions = {
    simple: {
      title: 'Simple',
      details: ['Plastic plate & cup', 'Paper napkin', 'Plastic tray', 'Plastic glass for wine']
    },
    grand: {
      title: 'Grand',
      details: ['Ceramic plate & cup', 'White cotton napkin', 'Wooden tray', 'Plastic glass for wine']
    },
    deluxe: {
      title: 'Deluxe',
      details: ['Small vase with flowers', 'Ceramic plate & cup', 'Linen napkin', 'Wooden tray', 'Glass for wine']
    }
  };

  // ============================================
  // 스타일 및 가격 계산
  // ============================================
  const availableStyles = dinnerType === 'champagne' 
    ? ['grand', 'deluxe'] 
    : ['simple', 'grand', 'deluxe'];

  let currentPrice = dinner.priceByStyle[style];
  if (currentPrice === null) {
    const newStyle = availableStyles[0];
    setStyle(newStyle);
    currentPrice = dinner.priceByStyle[newStyle];
  }

  const isChampaigneFeast = dinnerType === 'champagne';
  const displayQuantity = isChampaigneFeast ? 1 : quantity;
  
  const discountedPrice = (currentPrice * (1 - discountRate / 100)).toFixed(2);
  const discountAmount = (currentPrice - discountedPrice).toFixed(2);
  const totalPrice = (discountedPrice * displayQuantity).toFixed(2);

  // ============================================
  // API: 주문 생성 (Add as is 버튼)
  // ============================================
  const handleAddAsIs = async () => {
    if (!currentUser) {
      alert('Please login first');
      navigate('/customer-login');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 주문 데이터 구성
      const newOrder = {
        customerId: currentUser.id,
        customerName: currentUser.name,
        dinnerType: dinnerType,
        dinnerName: dinner.name,
        servingStyle: style,
        basePrice: parseFloat(currentPrice),
        discountRate: discountRate,
        discountAmount: parseFloat(discountAmount),
        addOnsPrice: 0,
        totalPrice: parseFloat(totalPrice),
        quantity: displayQuantity,
        orderTime: new Date().toISOString(),
        deliveryTime: '30-45 mins',
        deliveryAddress: currentUser.address,
        status: 'pending'
      };

      // ✅ Backend API로 주문 전송
      const response = await axios.post(
        'http://localhost:8080/api/orders',
        newOrder
      );

      // 성공 응답
      const orderId = response.data.id || response.data;
      
      alert(
        `Order confirmed! Total: $${totalPrice}${
          discountRate > 0 ? ` (${discountRate}% discount applied)` : ''
        }`
      );

      // 주문 상세 페이지로 이동
      navigate(`/order-details/${orderId}`);

    } catch (err) {
      console.error('Order creation failed:', err);
      setError('주문 생성 실패: ' + (err.response?.data?.message || err.message));
      alert('주문 실패: ' + (err.response?.data?.message || '다시 시도해주세요'));
    } finally {
      setLoading(false);
    }
  };

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

        {/* 에러 메시지 */}
        {error && (
          <div style={{
            backgroundColor: '#FF6B6B',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '15px',
            color: '#FFFFFF',
            fontSize: '12px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* 메뉴 아이콘 */}
        <div style={{
          fontSize: '80px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          {dinner.icon}
        </div>

        {/* 메뉴 제목 */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          {dinner.name}
        </h1>

        {/* 설명 */}
        <p style={{
          fontSize: '14px',
          color: '#b0b0b0',
          textAlign: 'center',
          marginBottom: '10px'
        }}>
          {dinner.description}
        </p>

        {/* 인원 정보 */}
        <p style={{
          fontSize: '12px',
          color: '#FFC107',
          textAlign: 'center',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          👥 {dinner.servings}
        </p>

        {/* 할인 정보 */}
        {discountRate > 0 && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '10px',
            padding: '12px',
            marginBottom: '15px',
            borderLeft: '4px solid #4CAF50',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold', marginBottom: '5px' }}>
              🎁 Loyalty Discount Applied
            </p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFC107' }}>
              {discountRate}% OFF
            </p>
          </div>
        )}

        {/* 포함 항목들 */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          What's Included:
        </h2>

        {dinner.items.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span style={{ fontSize: '18px' }}>✓</span>
            <span style={{ color: '#b0b0b0', fontSize: '14px' }}>{item}</span>
          </div>
        ))}

        {/* 서빙 스타일 선택 */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginTop: '30px',
          marginBottom: '15px'
        }}>
          Serving Style:
        </h2>

        {availableStyles.map((styleOption) => (
          <div
            key={styleOption}
            onClick={() => setStyle(styleOption)}
            style={{
              backgroundColor: style === styleOption ? '#FFC107' : '#2a2a2a',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '10px',
              cursor: 'pointer',
              transition: '0.3s',
              borderLeft: style === styleOption ? '4px solid #000000' : '4px solid transparent'
            }}
          >
            <p style={{
              color: style === styleOption ? '#000000' : '#FFFFFF',
              fontWeight: 'bold',
              marginBottom: '8px',
              fontSize: '16px'
            }}>
              {styleDescriptions[styleOption].title}
            </p>
            <p style={{
              color: style === styleOption ? '#000000' : '#b0b0b0',
              fontSize: '12px',
              lineHeight: '1.6'
            }}>
              {styleDescriptions[styleOption].details.join(' • ')}
            </p>
            <p style={{
              color: style === styleOption ? '#000000' : '#FFC107',
              fontWeight: 'bold',
              marginTop: '8px',
              fontSize: '14px'
            }}>
              ${dinner.priceByStyle[styleOption]}
            </p>
          </div>
        ))}

        {/* 수량 선택 (Champagne 제외) */}
        {!isChampaigneFeast && (
          <>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginTop: '30px',
              marginBottom: '15px'
            }}>
              Quantity:
            </h2>

            <div style={{
              display: 'flex',
              gap: '15px',
              marginBottom: '30px'
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#2a2a2a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFC107',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                −
              </button>

              <div style={{
                flex: 1,
                backgroundColor: '#2a2a2a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#FFFFFF',
                fontWeight: 'bold'
              }}>
                {quantity}
              </div>

              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#2a2a2a',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#FFC107',
                  fontSize: '20px',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
            </div>
          </>
        )}

        {isChampaigneFeast && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '10px',
            padding: '15px',
            marginTop: '30px',
            marginBottom: '30px',
            borderLeft: '4px solid #FFC107'
          }}>
            <p style={{ color: '#FFC107', fontWeight: 'bold', marginBottom: '5px' }}>
              ℹ️ Fixed Quantity
            </p>
            <p style={{ color: '#b0b0b0', fontSize: '12px' }}>
              This dinner is for 2 people only. Cannot be combined with other orders.
            </p>
          </div>
        )}

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
            Total Price:
          </p>
          <p style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#FFC107'
          }}>
            ${totalPrice}
          </p>
          
          {!isChampaigneFeast && (
            <p style={{
              fontSize: '12px',
              color: '#b0b0b0',
              marginTop: '10px'
            }}>
              {displayQuantity} × ${discountedPrice}
            </p>
          )}

          {discountRate > 0 && (
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid #3a3a3a'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '5px',
                fontSize: '12px'
              }}>
                <span style={{ color: '#b0b0b0' }}>Original: ${(currentPrice * displayQuantity).toFixed(2)}</span>
                <span style={{ color: '#4CAF50' }}>-${(discountAmount * displayQuantity).toFixed(2)}</span>
              </div>
              <p style={{
                fontSize: '11px',
                color: '#4CAF50',
                fontWeight: 'bold'
              }}>
                ✓ {discountRate}% Loyalty discount applied
              </p>
            </div>
          )}
        </div>

        {/* 버튼들 */}
        <button
          onClick={() => navigate(`/customize-order/${dinnerType}`)}
          className="btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Customize & Continue
        </button>

        <button
          onClick={handleAddAsIs}
          disabled={loading}
          className="btn-secondary"
          style={{ 
            marginBottom: '15px',
            opacity: loading ? 0.5 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? '⏳ Processing...' : 'Add as is'}
        </button>

        <button
          onClick={() => navigate('/customer-home')}
          disabled={loading}
          className="btn-secondary"
          style={{
            opacity: loading ? 0.5 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MenuDetailsScreen;