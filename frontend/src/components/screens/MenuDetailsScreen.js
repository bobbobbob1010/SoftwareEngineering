import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css';

function MenuDetailsScreen() {
  const navigate = useNavigate();
  const { dinnerType } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [style, setStyle] = useState('grand');
  const [discountRate, setDiscountRate] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 현재 로그인한 고객 정보 가져오기
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);

      // 이 고객의 주문 정보 가져오기
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.customerId === user.id);

      // 할인율 계산
      const tier = calculateTier(userOrders.length);
      setDiscountRate(tier.discountRate);
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

  // Champagne Feast는 Simple 스타일 불가
  const availableStyles = dinnerType === 'champagne' 
    ? ['grand', 'deluxe'] 
    : ['simple', 'grand', 'deluxe'];

  // 현재 스타일 가격 (불가능하면 첫 가능한 스타일로 변경)
  let currentPrice = dinner.priceByStyle[style];
  if (currentPrice === null) {
    const newStyle = availableStyles[0];
    setStyle(newStyle);
    currentPrice = dinner.priceByStyle[newStyle];
  }

  const isChampaigneFeast = dinnerType === 'champagne';
  const displayQuantity = isChampaigneFeast ? 1 : quantity;
  
  // 할인 적용
  const discountedPrice = (currentPrice * (1 - discountRate / 100)).toFixed(2);
  const discountAmount = (currentPrice - discountedPrice).toFixed(2);
  const totalPrice = (discountedPrice * displayQuantity).toFixed(2);

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
          onClick={() => {
            // 현재 로그인한 고객 가져오기
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            
            if (!currentUser) {
              alert('Please login first');
              navigate('/customer-login');
              return;
            }

            // 주문 객체 생성
            const newOrder = {
              id: Date.now().toString(),
              customerId: currentUser.id,
              dinnerName: dinner.name,
              dinnerType: dinnerType,
              servingStyle: style,
              basePrice: currentPrice,
              discountRate: discountRate,
              discountAmount: discountAmount,
              addOnsPrice: 0,
              totalPrice: totalPrice,
              orderTime: new Date().toISOString(),
              deliveryTime: '30-45 mins',
              deliveryAddress: currentUser.address,
              status: 'Confirmed'
            };

            // 기존 주문들 가져오기
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            
            // 새 주문 추가
            orders.push(newOrder);
            
            // localStorage에 저장
            localStorage.setItem('orders', JSON.stringify(orders));

            // 고객 정보 업데이트 - totalOrders 1 증가
            const customers = JSON.parse(localStorage.getItem('customers') || '[]');
            const updatedCustomers = customers.map(c => {
              if (c.id === currentUser.id) {
                return {
                  ...c,
                  totalOrders: (c.totalOrders || 0) + 1
                };
              }
              return c;
            });
            localStorage.setItem('customers', JSON.stringify(updatedCustomers));

            // 성공 메시지
            alert(`Order confirmed! Total: $${totalPrice}${discountRate > 0 ? ` (${discountRate}% discount applied)` : ''}`);
            
            // 주문 상세 페이지로 이동
            navigate(`/order-details/${newOrder.id}`);
          }}
          className="btn-secondary"
          style={{ marginBottom: '15px' }}
        >
          Add as is
        </button>

        <button
          onClick={() => navigate('/customer-home')}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MenuDetailsScreen;