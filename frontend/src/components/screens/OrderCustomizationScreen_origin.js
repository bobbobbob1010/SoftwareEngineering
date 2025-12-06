import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function OrderCustomizationScreen() {
  const navigate = useNavigate();
  const { dinnerType } = useParams();
  const [style, setStyle] = useState('grand');


  const dinnerMenus = {
    'valentine': {
      name: 'Valentine Dinner',
      icon: '💕',
      basePrice: 99.99,
      items: [
        { id: 1, name: '🍷 Wine (1 glass)', quantity: 1, included: true, canRemove: true, addPrice: 12.99 },
        { id: 2, name: '🥩 Steak (1 portion)', quantity: 1, included: true, canRemove: true, addPrice: 25.99 },
        { id: 3, name: '💕 Heart decoration plate', quantity: 1, included: true, canRemove: false, addPrice: 0 },
        { id: 4, name: '🧻 Napkin', quantity: 1, included: true, canRemove: true, addPrice: 2.99 }
      ]
    },
    'french': {
      name: 'French Dinner',
      icon: '🇫🇷',
      basePrice: 89.99,
      items: [
        { id: 1, name: '☕ Coffee (1 cup)', quantity: 1, included: true, canRemove: true, addPrice: 3.99 },
        { id: 2, name: '🍷 Wine (1 glass)', quantity: 1, included: true, canRemove: true, addPrice: 12.99 },
        { id: 3, name: '🥗 Salad (1 portion)', quantity: 1, included: true, canRemove: true, addPrice: 8.99 },
        { id: 4, name: '🥩 Steak (1 portion)', quantity: 1, included: true, canRemove: true, addPrice: 25.99 }
      ]
    },
    'english': {
      name: 'English Dinner',
      icon: '🇬🇧',
      basePrice: 79.99,
      items: [
        { id: 1, name: '🍳 Scrambled Egg (1 portion)', quantity: 1, included: true, canRemove: true, addPrice: 5.99 },
        { id: 2, name: '🥓 Bacon (3 slices)', quantity: 3, included: true, canRemove: true, addPrice: 1.99 },
        { id: 3, name: '🍞 Bread (2 slices)', quantity: 2, included: true, canRemove: true, addPrice: 1.99 },
        { id: 4, name: '🥩 Steak (1 portion)', quantity: 1, included: true, canRemove: true, addPrice: 25.99 }
      ]
    },
    'champagne': {
      name: 'Champagne Feast',
      icon: '🥂',
      basePrice: 169.99,
      items: [
        { id: 1, name: '🍾 Champagne (1 bottle)', quantity: 1, included: true, canRemove: true, addPrice: 45.99 },
        { id: 2, name: '🥖 Baguette (4 pieces)', quantity: 4, included: true, canRemove: true, addPrice: 2.99 },
        { id: 3, name: '☕ Coffee (1 pot)', quantity: 1, included: true, canRemove: true, addPrice: 6.99 },
        { id: 4, name: '🍷 Wine (1 glass)', quantity: 1, included: true, canRemove: true, addPrice: 12.99 },
        { id: 5, name: '🥩 Steak (1 portion)', quantity: 1, included: true, canRemove: true, addPrice: 25.99 }
      ]
    }
  };

  const availableAddons = [
    { id: 10, name: '🍾 Extra Champagne (1 bottle)', price: 45.99, category: 'Drinks' },
    { id: 11, name: '🥖 Extra Baguette (2 pieces)', price: 5.99, category: 'Bread' },
    { id: 12, name: '☕ Extra Coffee (1 cup)', price: 3.99, category: 'Drinks' },
    { id: 13, name: '🍷 Extra Wine (1 glass)', price: 12.99, category: 'Drinks' },
    { id: 14, name: '🥩 Extra Steak (1 portion)', price: 25.99, category: 'Main' },
    { id: 15, name: '🥗 Extra Salad (1 portion)', price: 8.99, category: 'Sides' },
    { id: 16, name: '🍳 Extra Scrambled Egg', price: 5.99, category: 'Sides' },
    { id: 17, name: '🥓 Extra Bacon (3 slices)', price: 5.99, category: 'Sides' },
    { id: 18, name: '🍞 Extra Bread (2 slices)', price: 3.99, category: 'Bread' },
    { id: 19, name: '🍫 Dessert (Chocolate)', price: 12.99, category: 'Dessert' },
    { id: 20, name: '🍓 Dessert (Fruit)', price: 10.99, category: 'Dessert' }
  ];

  const dinner = dinnerMenus[dinnerType] || dinnerMenus['valentine'];
  const [items, setItems] = useState(dinner.items.map(item => ({ ...item })));
  const [addedItems, setAddedItems] = useState([]);

  // 기본 가격은 절대 변하지 않음
  const basePrice = dinner.basePrice;

  const handleQuantityChange = (id, newQuantity) => {
    setItems(items.map(item => {
      if (item.id === id) {
        if (newQuantity === 0) {
          return { ...item, quantity: 0, included: false };
        } else {
          return { ...item, quantity: newQuantity };
        }
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

  // Added Items 계산 (기본 아이템 수량 초과 + 추가 아이템)
  const getAddedItemsList = () => {
    const extraBasicItems = [];

    items.forEach(item => {
      if (item.included) {
        const baseQuantity = dinner.items.find(orig => orig.id === item.id).quantity;
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

    // Included Items 중 기본 수량을 초과한 것들의 추가 요금
    items.forEach(item => {
      if (item.included) {
        const baseQuantity = dinner.items.find(orig => orig.id === item.id).quantity;
        const extraQuantity = item.quantity - baseQuantity;
        if (extraQuantity > 0) {
          addOnTotal += item.addPrice * extraQuantity;
        }
      }
    });

    // 추가된 addon 아이템들의 가격
    addedItems.forEach(item => {
      addOnTotal += item.price * item.quantity;
    });

    return addOnTotal;
  };

  const addOnPrice = calculateAddOnPrice();
  const totalPrice = (basePrice + addOnPrice).toFixed(2);
  const addedItemsList = getAddedItemsList();

  const hasCustomizations =
    items.some(item => item.quantity === 0) ||
    items.some((item, idx) => item.quantity !== dinner.items[idx].quantity) ||
    addedItems.length > 0;

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
          onClick={() => navigate(`/menu-details/${dinnerType}`)}
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
          marginBottom: '10px',
          textAlign: 'center'
        }}>
          {dinner.icon} {dinner.name}
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#b0b0b0',
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          Customize your order
        </p>

        {/* 기본 가격 정보 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '10px',
          padding: '15px',
          marginBottom: '20px',
          borderLeft: '4px solid #FFC107'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
            Base Price (fixed):
          </p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFC107' }}>
            ${basePrice}
          </p>
          <p style={{ fontSize: '11px', color: '#b0b0b0', marginTop: '8px' }}>
            Price remains the same even if you remove items
          </p>
        </div>

        {/* 포함된 항목들 수정 */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginBottom: '15px'
        }}>
          📋 Included Items:
        </h2>

        {items.map((item) => {
          const baseQuantity = dinner.items.find(orig => orig.id === item.id).quantity;
          const isExtraQuantity = item.quantity > baseQuantity;

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: '#2a2a2a',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                opacity: item.quantity === 0 ? 0.5 : 1,
                borderLeft: item.quantity === 0 ? '4px solid #FF6B6B' : isExtraQuantity ? '4px solid #FFC107' : '4px solid transparent'
              }}
            >
              <div style={{ flex: 1 }}>
                <span style={{
                  color: item.quantity === 0 ? '#888888' : '#FFFFFF',
                  textDecoration: item.quantity === 0 ? 'line-through' : 'none'
                }}>
                  {item.name}
                </span>
                <p style={{
                  fontSize: '11px',
                  color: '#b0b0b0',
                  marginTop: '3px'
                }}>
                  Included: {baseQuantity}{isExtraQuantity && ` (+${item.quantity - baseQuantity} extra)`}
                </p>
              </div>

              <div style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => handleQuantityChange(item.id, Math.max(0, item.quantity - 1))}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#FF6B6B',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  −
                </button>

                <span style={{
                  width: '30px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  fontWeight: 'bold'
                }}>
                  {item.quantity}
                </span>

                <button
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#4CAF50',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}

        {/* 추가 항목 섹션 */}
        <h2 style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#FFFFFF',
          marginTop: '30px',
          marginBottom: '15px'
        }}>
          ➕ Add Extra Items:
        </h2>

        {availableAddons.map((availableItem) => (
          <div
            key={availableItem.id}
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
                marginBottom: '3px'
              }}>
                {availableItem.name}
              </p>
              <p style={{
                fontSize: '11px',
                color: '#b0b0b0'
              }}>
                {availableItem.category}
              </p>
            </div>

            <div style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#FFC107',
                fontWeight: 'bold',
                minWidth: '50px',
                textAlign: 'right'
              }}>
                ${availableItem.price}
              </p>
              <button
                onClick={() => handleAddItem(availableItem)}
                style={{
                  backgroundColor: '#FFC107',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  color: '#000000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                + Add
              </button>
            </div>
          </div>
        ))}

        {/* 추가된 항목들 */}
        {addedItemsList.length > 0 && (
          <>
            <h2 style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#FFFFFF',
              marginTop: '30px',
              marginBottom: '15px'
            }}>
              🛒 Extra Items:
            </h2>

            {addedItemsList.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: '#2a2a2a',
                  borderRadius: '10px',
                  padding: '15px',
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderLeft: '4px solid #FFC107'
                }}
              >
                <div>
                  <p style={{
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    marginBottom: '3px'
                  }}>
                    {item.name}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#FFC107'
                  }}>
                    {item.isExtraBasic ? '📌 Extra from included' : '➕ Additional addon'}
                  </p>
                  <p style={{
                    fontSize: '12px',
                    color: '#b0b0b0'
                  }}>
                    × {item.quantity} = ${item.isExtraBasic ? item.totalPrice.toFixed(2) : (item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (item.isExtraBasic) {
                      const itemId = item.id.split('-')[1];
                      handleQuantityChange(parseInt(itemId), dinner.items.find(orig => orig.id === parseInt(itemId)).quantity);
                    } else {
                      handleRemoveAddedItem(item.id);
                    }
                  }}
                  style={{
                    backgroundColor: '#FF6B6B',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#FFFFFF',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </>
        )}

        {/* 가격 요약 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '30px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px'
          }}>
            <span style={{ color: '#b0b0b0' }}>Base Price:</span>
            <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>${basePrice}</span>
          </div>

          {addOnPrice > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '10px',
              paddingBottom: '10px',
              borderBottom: '1px solid #3a3a3a'
            }}>
              <span style={{ color: '#b0b0b0' }}>Extra Items:</span>
              <span style={{ color: '#FFC107', fontWeight: 'bold' }}>+${addOnPrice.toFixed(2)}</span>
            </div>
          )}

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ color: '#b0b0b0', fontWeight: 'bold' }}>Total:</span>
            <span style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#FFC107'
            }}>
              ${totalPrice}
            </span>
          </div>

          {hasCustomizations && (
            <p style={{
              fontSize: '12px',
              color: '#4CAF50',
              marginTop: '10px'
            }}>
              ✓ Customizations applied
            </p>
          )}
        </div>

        {/* 버튼들 */}
        <button //주문 Confirm 버튼
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
              basePrice: basePrice,
              addOnsPrice: addOnPrice,
              totalPrice: totalPrice,
              items: items,
              addedItems: addedItems,
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
            alert(`Order confirmed! Total: $${totalPrice}`);

            // 주문 상세 페이지로 이동
            navigate(`/order-details/${newOrder.id}`);
          }}
          className="btn-primary"
          style={{ marginBottom: '15px' }}
        >
          Confirm Order
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

export default OrderCustomizationScreen;