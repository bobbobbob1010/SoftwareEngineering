import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function MenuDetailsScreen() {
  const navigate = useNavigate();
  const { dinnerType } = useParams();
  
  // 상태 관리
  const [quantity, setQuantity] = useState(1);
  const [style, setStyle] = useState('grand');
  const [discountRate, setDiscountRate] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  
  // [변경 1] "바로 주문"을 위해 기본 구성품 아이템들의 ID가 필요함
  const [defaultItems, setDefaultItems] = useState([]); 

  useEffect(() => {
    // 1. 로그인 정보 확인 (LocalStorage 유지)
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
      setCurrentUser(user);
      // (참고: 실제로는 백엔드에서 사용자 등급/할인율을 가져와야 하지만, 
      //  아직 해당 API가 없으므로 로컬스토리지 로직을 유지하거나 0으로 둡니다.)
      //  여기서는 UI 깨짐 방지를 위해 로컬 계산 로직을 잠시 유지합니다.
      const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = allOrders.filter(order => order.customerId === user.id);
      const tier = calculateTier(userOrders.length);
      setDiscountRate(tier.discountRate);
    }

    // [변경 2] 백엔드에서 해당 디너의 "기본 구성품" ID 목록 가져오기
    const fetchDefaultItems = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/menu-items`, {
            params: { type: dinnerType, isBaseItem: true }
        });
        setDefaultItems(response.data);
      } catch (error) {
        console.error("Failed to load default items", error);
      }
    };
    fetchDefaultItems();

  }, [dinnerType]);

  const calculateTier = (orderCount) => {
    if (orderCount >= 20) return { name: 'Platinum', discountRate: 20, icon: '💎' };
    else if (orderCount >= 15) return { name: 'Gold', discountRate: 15, icon: '🥇' };
    else if (orderCount >= 10) return { name: 'Silver', discountRate: 10, icon: '🥈' };
    else if (orderCount >= 5) return { name: 'Bronze', discountRate: 5, icon: '🥉' };
    else return { name: 'Regular', discountRate: 0, icon: '👤' };
  };

  // [UI용 데이터] 아이콘, 설명, 스타일별 가격 등은 DB에 없으므로 프론트에서 관리
  const dinnerDetails = {
    'valentine': {
      name: 'Valentine Dinner',
      icon: '💕',
      basePrice: 79.99,
      description: 'Romantic candlelit dinner for two',
      servings: '2 people',
      items: ['🍷 Wine', '🥩 Steak', '💕 Heart-shaped decorated plate', '🧻 Napkin'],
      priceByStyle: { simple: 79.99, grand: 99.99, deluxe: 129.99 }
    },
    'french': {
      name: 'French Dinner',
      icon: '🇫🇷',
      basePrice: 69.99,
      description: 'Classic French cuisine',
      servings: 'Per person',
      items: ['☕ Coffee', '🍷 Wine', '🥗 Salad', '🥩 Steak'],
      priceByStyle: { simple: 69.99, grand: 89.99, deluxe: 119.99 }
    },
    'english': {
      name: 'English Dinner',
      icon: '🇬🇧',
      basePrice: 59.99,
      description: 'Traditional English feast',
      servings: 'Per person',
      items: ['🍳 Scrambled Egg', '🥓 Bacon', '🍞 Bread', '🥩 Steak'],
      priceByStyle: { simple: 59.99, grand: 79.99, deluxe: 109.99 }
    },
    'champagne': {
      name: 'Champagne Feast',
      icon: '🥂',
      basePrice: 149.99,
      description: 'Luxury celebration dinner',
      servings: '2 people (fixed)',
      items: ['🍾 Champagne (1 bottle)', '🥖 Baguette (4 pieces)', '☕ Coffee (1 pot)', '🍷 Wine', '🥩 Steak'],
      priceByStyle: { simple: null, grand: 169.99, deluxe: 199.99 },
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

  const availableStyles = dinnerType === 'champagne' ? ['grand', 'deluxe'] : ['simple', 'grand', 'deluxe'];

  let currentPrice = dinner.priceByStyle[style];
  if (currentPrice === null) {
    const newStyle = availableStyles[0];
    setStyle(newStyle);
    currentPrice = dinner.priceByStyle[newStyle];
  }

  const isChampaigneFeast = dinnerType === 'champagne';
  const displayQuantity = isChampaigneFeast ? 1 : quantity; // 샴페인 피스트는 고정 수량
  
  const discountedPrice = (currentPrice * (1 - discountRate / 100)).toFixed(2);
  const discountAmount = (currentPrice - discountedPrice).toFixed(2);
  const totalPrice = (discountedPrice * displayQuantity).toFixed(2);

  // [변경 3] "Add as is" 핸들러 (백엔드로 주문 전송)
  const handleAddAsIs = async () => {
    if (!currentUser) {
      alert('Please login first');
      navigate('/customer-login');
      return;
    }

    // 기본 아이템 데이터가 로딩되지 않았으면 방어
    if (defaultItems.length === 0) {
        alert("메뉴 정보를 불러오는 중입니다. 잠시만 기다려주세요.");
        return;
    }

    // 백엔드로 보낼 DTO 구성
    const orderPayload = {
        customerId: currentUser.id,
        dinnerType: dinnerType,
        deliveryAddress: currentUser.address,
        servingStyle: style, // 스타일 정보도 전송 (백엔드 로직 확장을 위해)
        items: defaultItems.map(item => ({
            menuItemId: item.id,
            // 기본 수량 * 사용자가 선택한 세트 수량
            // 예: 2인분 시키면 스테이크도 2개
            quantity: 1 * displayQuantity
        }))
    };

    try {
        const response = await axios.post('http://localhost:8080/api/orders', orderPayload);
        
        if (response.status === 200 || response.status === 201) {
            alert(`Order confirmed! Total: $${totalPrice} for ${dinner.name} orderId: ${response.data}`);
            navigate(`/order-details/${response.data}`); // 백엔드가 준 ID로 이동
        }
    } catch (error) {
        console.error("Order failed", error);
        alert("주문 처리에 실패했습니다.");
    }
  };

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '20px', overflow: 'auto' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <button onClick={() => navigate('/customer-home')} style={{ background: 'none', border: 'none', color: '#b0b0b0', fontSize: '20px', cursor: 'pointer', marginBottom: '20px' }}>
          ← Back
        </button>

        <div style={{ fontSize: '80px', textAlign: 'center', marginBottom: '20px' }}>{dinner.icon}</div>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '10px', textAlign: 'center' }}>{dinner.name}</h1>
        <p style={{ fontSize: '14px', color: '#b0b0b0', textAlign: 'center', marginBottom: '10px' }}>{dinner.description}</p>
        <p style={{ fontSize: '12px', color: '#FFC107', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>👥 {dinner.servings}</p>

        {discountRate > 0 && (
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '12px', marginBottom: '15px', borderLeft: '4px solid #4CAF50', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#4CAF50', fontWeight: 'bold', marginBottom: '5px' }}>🎁 Loyalty Discount Applied</p>
            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFC107' }}>{discountRate}% OFF</p>
          </div>
        )}

        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '15px' }}>What's Included:</h2>
        {dinner.items.map((item, index) => (
          <div key={index} style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '12px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '18px' }}>✓</span>
            <span style={{ color: '#b0b0b0', fontSize: '14px' }}>{item}</span>
          </div>
        ))}

        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginTop: '30px', marginBottom: '15px' }}>Serving Style:</h2>
        {availableStyles.map((styleOption) => (
          <div key={styleOption} onClick={() => setStyle(styleOption)} style={{ backgroundColor: style === styleOption ? '#FFC107' : '#2a2a2a', borderRadius: '10px', padding: '15px', marginBottom: '10px', cursor: 'pointer', transition: '0.3s', borderLeft: style === styleOption ? '4px solid #000000' : '4px solid transparent' }}>
            <p style={{ color: style === styleOption ? '#000000' : '#FFFFFF', fontWeight: 'bold', marginBottom: '8px', fontSize: '16px' }}>{styleDescriptions[styleOption].title}</p>
            <p style={{ color: style === styleOption ? '#000000' : '#b0b0b0', fontSize: '12px', lineHeight: '1.6' }}>{styleDescriptions[styleOption].details.join(' • ')}</p>
            <p style={{ color: style === styleOption ? '#000000' : '#FFC107', fontWeight: 'bold', marginTop: '8px', fontSize: '14px' }}>${dinner.priceByStyle[styleOption]}</p>
          </div>
        ))}

        {!isChampaigneFeast && (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginTop: '30px', marginBottom: '15px' }}>Quantity:</h2>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '50px', height: '50px', backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px', color: '#FFC107', fontSize: '20px', cursor: 'pointer' }}>−</button>
              <div style={{ flex: 1, backgroundColor: '#2a2a2a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', color: '#FFFFFF', fontWeight: 'bold' }}>{quantity}</div>
              <button onClick={() => setQuantity(quantity + 1)} style={{ width: '50px', height: '50px', backgroundColor: '#2a2a2a', border: 'none', borderRadius: '8px', color: '#FFC107', fontSize: '20px', cursor: 'pointer' }}>+</button>
            </div>
          </>
        )}

        {isChampaigneFeast && (
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '15px', marginTop: '30px', marginBottom: '30px', borderLeft: '4px solid #FFC107' }}>
            <p style={{ color: '#FFC107', fontWeight: 'bold', marginBottom: '5px' }}>ℹ️ Fixed Quantity</p>
            <p style={{ color: '#b0b0b0', fontSize: '12px' }}>This dinner is for 2 people only. Cannot be combined with other orders.</p>
          </div>
        )}

        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '15px', padding: '20px', marginBottom: '20px' }}>
          <p style={{ fontSize: '14px', color: '#b0b0b0', marginBottom: '10px' }}>Total Price:</p>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#FFC107' }}>${totalPrice}</p>
          {!isChampaigneFeast && <p style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '10px' }}>{displayQuantity} × ${discountedPrice}</p>}
          {discountRate > 0 && (
            <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #3a3a3a' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px' }}>
                <span style={{ color: '#b0b0b0' }}>Original: ${(currentPrice * displayQuantity).toFixed(2)}</span>
                <span style={{ color: '#4CAF50' }}>-${(discountAmount * displayQuantity).toFixed(2)}</span>
              </div>
              <p style={{ fontSize: '11px', color: '#4CAF50', fontWeight: 'bold' }}>✓ {discountRate}% Loyalty discount applied</p>
            </div>
          )}
        </div>

        <button onClick={() => navigate(`/customize-order/${dinnerType}`)} className="btn-primary" style={{ marginBottom: '15px', width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#FFC107', border: 'none', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          Customize & Continue
        </button>

        {/* [변경 4] Add as is 버튼에 핸들러 연결 */}
        <button onClick={handleAddAsIs} className="btn-secondary" style={{ marginBottom: '15px', width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#444', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          Add as is
        </button>

        <button onClick={() => navigate('/customer-home')} className="btn-secondary" style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#444', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default MenuDetailsScreen;
