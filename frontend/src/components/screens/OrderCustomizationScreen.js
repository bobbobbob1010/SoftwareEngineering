import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function OrderCustomizationScreen() {
  const navigate = useNavigate();
  const { dinnerType } = useParams();
  
  // ==========================================
  // [변경 1] 데이터 상태 관리 (빈 배열로 시작)
  // ==========================================
  const [items, setItems] = useState([]);
  const [availableAddons, setAvailableAddons] = useState([]);
  const [addedItems, setAddedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 디너 기본 정보 (이름, 아이콘은 DB에 없으므로 프론트 유지)
  const dinnerInfo = {
    'valentine': { name: 'Valentine Dinner', icon: '💕', basePrice: 99.99 },
    'french': { name: 'French Dinner', icon: '🇫🇷', basePrice: 89.99 },
    'english': { name: 'English Dinner', icon: '🇬🇧', basePrice: 79.99 },
    'champagne': { name: 'Champagne Feast', icon: '🥂', basePrice: 169.99 }
  };
  const dinner = dinnerInfo[dinnerType] || dinnerInfo['valentine'];
  const basePrice = dinner.basePrice;

  // ==========================================
  // [변경 2] 백엔드에서 메뉴 데이터 가져오기
  // ==========================================
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);

        // A. 기본 구성품 조회 (dinnerType에 맞는 것만)
        const baseRes = await axios.get(`http://localhost:8080/api/menu-items`, {
          params: { type: dinnerType, isBaseItem: true }
        });
        
        // 데이터 매핑: 백엔드(unitPrice) -> 프론트(addPrice)
        const mappedBaseItems = baseRes.data.map(item => ({
          ...item,
          quantity: 1,      // 기본 수량
          included: true,
          addPrice: item.unitPrice
        }));
        setItems(mappedBaseItems);

        // B. 추가 메뉴(Add-on) 조회
        const addonRes = await axios.get(`http://localhost:8080/api/menu-items`, {
            params: { isBaseItem: false }
        });
        
        const mappedAddons = addonRes.data.map(item => ({
            ...item,
            price: item.unitPrice 
        }));
        setAvailableAddons(mappedAddons);

      } catch (error) {
        console.error("Failed to fetch menu", error);
        alert("메뉴 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, [dinnerType]);


  // ==========================================
  // [유지] UI 조작 로직 (수량 변경, 추가/삭제)
  // ==========================================
  const handleQuantityChange = (id, newQuantity) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity, included: newQuantity > 0 };
      }
      return item;
    }));
  };

  const handleAddItem = (availableItem) => {
    const existingAddedItem = addedItems.find(item => item.id === availableItem.id);
    if (existingAddedItem) {
      setAddedItems(addedItems.map(item =>
        item.id === availableItem.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setAddedItems([...addedItems, { ...availableItem, quantity: 1, isAddon: true }]);
    }
  };

  const handleRemoveAddedItem = (id) => {
    setAddedItems(addedItems.filter(item => item.id !== id));
  };

  // ==========================================
  // [유지] 가격 계산 (화면 표시용)
  // ==========================================
  const getAddedItemsList = () => {
    const extraBasicItems = [];
    items.forEach(item => {
      if (item.included) {
        const baseQuantity = 1;
        const extraQuantity = item.quantity - baseQuantity;
        if (extraQuantity > 0) {
          extraBasicItems.push({
            id: `extra-${item.id}`,
            name: item.name,
            quantity: extraQuantity,
            price: item.addPrice,
            totalPrice: item.addPrice * extraQuantity,
            isExtraBasic: true
          });
        }
      }
    });
    return [...extraBasicItems, ...addedItems];
  };

  const calculateAddOnPrice = () => {
    let addOnTotal = 0;
    items.forEach(item => {
      if (item.included) {
        const extraQuantity = Math.max(0, item.quantity - 1);
        addOnTotal += item.addPrice * extraQuantity;
      }
    });
    addedItems.forEach(item => {
      addOnTotal += item.price * item.quantity;
    });
    return addOnTotal;
  };

  const addOnPrice = calculateAddOnPrice();
  const totalPrice = (basePrice + addOnPrice).toFixed(2);
  const addedItemsList = getAddedItemsList();
  const hasCustomizations = items.some(item => item.quantity !== 1) || addedItems.length > 0;

  // ==========================================
  // [변경 3] 주문 확정 (백엔드로 전송)
  // ==========================================
  const handleConfirmOrder = async () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      alert('Please login first');
      navigate('/customer-login');
      return;
    }

    // DTO 구성
    const orderPayload = {
        customerId: currentUser.id,
        dinnerType: dinnerType,
        deliveryAddress: currentUser.address,
        items: [
            ...items.filter(i => i.quantity > 0).map(i => ({ menuItemId: i.id, quantity: i.quantity })),
            ...addedItems.map(i => ({ menuItemId: i.id, quantity: i.quantity }))
        ]
    };

    try {
        const response = await axios.post('http://localhost:8080/api/orders', orderPayload);
        if (response.status === 200 || response.status === 201) {
            alert(`Order confirmed! Order ID: ${response.data}`);
            navigate(`/order-details/${response.data}`); // 백엔드가 준 ID로 이동
        }
    } catch (error) {
        console.error("Order failed", error);
        alert("주문 처리에 실패했습니다.");
    }
  };

  if (loading) return <div style={{color:'white', padding:'20px'}}>Loading...</div>;

  return (
    <div style={{ backgroundColor: '#1a1a1a', minHeight: '100vh', padding: '20px', overflow: 'auto' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* 헤더 및 기본 정보 */}
        <button onClick={() => navigate(`/menu-details/${dinnerType}`)} style={{ background: 'none', border: 'none', color: '#b0b0b0', fontSize: '20px', cursor: 'pointer', marginBottom: '20px' }}>← Back</button>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '10px', textAlign: 'center' }}>{dinner.icon} {dinner.name}</h1>
        <p style={{ fontSize: '14px', color: '#b0b0b0', textAlign: 'center', marginBottom: '30px' }}>Customize your order</p>

        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '15px', marginBottom: '20px', borderLeft: '4px solid #FFC107' }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>Base Price (fixed):</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFC107' }}>${basePrice}</p>
        </div>

        {/* 📋 기본 구성품 */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginBottom: '15px' }}>📋 Included Items:</h2>
        {items.map((item) => {
          const isExtra = item.quantity > 1;
          return (
            <div key={item.id} style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: item.quantity === 0 ? 0.5 : 1 }}>
              <div style={{ flex: 1 }}>
                <span style={{ color: item.quantity === 0 ? '#888' : '#FFF', textDecoration: item.quantity === 0 ? 'line-through' : 'none' }}>{item.name}</span>
                <p style={{ fontSize: '11px', color: '#b0b0b0' }}>Included: 1 {isExtra && ` (+${item.quantity - 1} extra)`}</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))} style={{ width: '30px', height: '30px', backgroundColor: '#FF6B6B', border: 'none', borderRadius: '5px', color:'white' }}>−</button>
                <span style={{ width: '30px', textAlign: 'center', color: '#FFF' }}>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)} style={{ width: '30px', height: '30px',backgroundColor: '#4CAF50', border: 'none', borderRadius: '5px', color:'white' }}>+</button>
              </div>
            </div>
          );
        })}

        {/* ➕ 추가 메뉴 */}
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginTop: '30px', marginBottom: '15px' }}>➕ Add Extra Items:</h2>
        {availableAddons.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ color: '#FFF', fontWeight: 'bold' }}>{item.name}</p>
              <p style={{ fontSize: '11px', color: '#b0b0b0' }}>{item.category}</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <p style={{ fontSize: '12px', color: '#FFC107', fontWeight: 'bold' }}>${item.price}</p>
              <button onClick={() => handleAddItem(item)} style={{ backgroundColor: '#FFC107', border: 'none', borderRadius: '6px', padding: '5px 10px', fontWeight: 'bold' }}>+ Add</button>
            </div>
          </div>
        ))}

        {/* 🛒 사용자가 추가한 목록 */}
        {addedItemsList.length > 0 && (
          <>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF', marginTop: '30px', marginBottom: '15px' }}>🛒 Extra Items:</h2>
            {addedItemsList.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #FFC107' }}>
                <div>
                  <p style={{ color: '#FFF', fontWeight: 'bold' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: '#b0b0b0' }}>× {item.quantity} = ${item.isExtraBasic ? item.totalPrice.toFixed(2) : (item.price * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => item.isExtraBasic ? handleQuantityChange(parseInt(item.id.split('-')[1]), 1) : handleRemoveAddedItem(item.id)} style={{ backgroundColor: '#FF6B6B', border: 'none', borderRadius: '6px', padding: '5px 10px', color: 'white' }}>Remove</button>
              </div>
            ))}
          </>
        )}

        {/* 하단 요약 및 버튼 */}
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '15px', padding: '20px', marginTop: '30px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: '#b0b0b0' }}>Base Price:</span><span style={{ color: '#FFF' }}>${basePrice}</span></div>
          {addOnPrice > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}><span style={{ color: '#b0b0b0' }}>Extra Items:</span><span style={{ color: '#FFC107' }}>+${addOnPrice.toFixed(2)}</span></div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '20px', fontWeight: 'bold' }}><span style={{ color: '#b0b0b0' }}>Total:</span><span style={{ color: '#FFC107' }}>${totalPrice}</span></div>
        </div>

        <button onClick={handleConfirmOrder} style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#FFC107', border: 'none', fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', cursor:'pointer' }}>Confirm Order</button>
        <button onClick={() => navigate('/customer-home')} style={{ width: '100%', padding: '15px', borderRadius: '10px', backgroundColor: '#444', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor:'pointer' }}>Cancel</button>
      
      </div>
    </div>
  );
}

export default OrderCustomizationScreen;