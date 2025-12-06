/*import React, { useState } from 'react';*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import axios from 'axios';

function StaffLiquorScreen() {
  const navigate = useNavigate();
  // DB에서 가져온 주류 재고
  const [liquors, setLiquors] = useState([]);

  // Wine, Champagne만 관리
  const liquorItems = ['Wine', 'Champagne'];

  useEffect(() => {
    axios.get('http://localhost:8080/api/inventories')
      .then(response => {
        const formatted = response.data.map(item => ({
          id: item.stockID,
          name: item.itemName,              // 'Wine' 또는 'Champagne'
          quantity: item.quantityAvailable,
          unit: item.unit,
          min: item.minQuantity,
          status: item.status.toLowerCase(),
          supplier: 'Next-door Liquor Shop', // 설명용 텍스트 (원하면 바꿔도 됨)
          price: item.cost
        }));

        // Wine / Champagne만 필터
        const filtered = formatted.filter(item =>
          liquorItems.includes(item.name)
        );

        setLiquors(filtered);
      })
      .catch(err => {
        console.error('Liquor 재고 불러오기 실패:', err);
      });
  }, []);

  // 수량 변경 + DB PATCH
  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 0) return;

    try {
      await axios.patch(`http://localhost:8080/api/inventories/${id}/quantity`, {
        quantity: newQuantity,
      });

      setLiquors(prev =>
        prev.map(liquor =>
          liquor.id === id ? { ...liquor, quantity: newQuantity } : liquor
        )
      );
    } catch (error) {
      console.error('주류 수량 업데이트 실패:', error);
      alert('주류 수량 변경을 저장하지 못했습니다.');
    }
  };

  const handleOrderMore = async (id) => {
    const target = liquors.find(l => l.id === id);
    if (!target) return;

    const input = window.prompt(`How many bottles of ${target.name} did you buy?`, "1");

    // 취소 누르거나 빈 값일 경우 중단
    if (input === null || input.trim() === "") return;

    const addAmount = parseInt(input, 10); //input을 10진수로 해석해서 Int형으로 반환

    // 숫자가 아니거나 0보다 작으면 경고
    if (isNaN(addAmount) || addAmount <= 0) {
      alert("Please enter a valid number.");
      return;
    }


    // handleUpdateQuantity(target.id, Math.max(0, target.quantity + addAmount));
    // -> 이제 상대적인 증가량만 서버로 보냅니다.

    try {
      await axios.post(`http://localhost:8080/api/inventories/${target.id}/add`, {
        amount: addAmount
      });

      // 성공하면 프론트엔드 상태도 "현재값 + 추가값"으로 갱신
      setLiquors(prev =>
        prev.map(liquor =>
          liquor.id === id ? { ...liquor, quantity: liquor.quantity + addAmount } : liquor
        )
      );

      alert(`Successfully Ordered ${addAmount} bottles for ${target.name}`);
    } catch (error) {
      console.error('주류 주문 실패:', error);
      alert('주문 처리에 실패했습니다.');
    }
  };

  // 통계 계산
  const champagneCount = liquors
    .filter(l => l.name === 'Champagne')
    .reduce((sum, item) => sum + item.quantity, 0);

  const wineCount = liquors
    .filter(l => l.name === 'Wine')
    .reduce((sum, item) => sum + item.quantity, 0);

  const totalValue = liquors.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  // DB에 price 없음 → 일단 totalValue = 0
  // const totalValue = 0;


  /* 하드코팅 다 삭제
    {
      id: 1,
      name: 'Champagne - Moët & Chandon',
      type: 'Champagne',
      quantity: 25,
      unit: 'bottles',
      price: 45.99,
      supplier: 'Premium Beverages Inc'
    },
    {
      id: 2,
      name: 'Wine - Bordeaux Red',
      type: 'Wine',
      quantity: 18,
      unit: 'bottles',
      price: 32.50,
      supplier: 'Fine Wine Co'
    },
    {
      id: 3,
      name: 'Champagne - Veuve Clicquot',
      type: 'Champagne',
      quantity: 12,
      unit: 'bottles',
      price: 55.00,
      supplier: 'Premium Beverages Inc'
    },
    {
      id: 4,
      name: 'Wine - Chardonnay',
      type: 'Wine',
      quantity: 22,
      unit: 'bottles',
      price: 28.75,
      supplier: 'Fine Wine Co'
    },
    {
      id: 5,
      name: 'Champagne - Cristal',
      type: 'Champagne',
      quantity: 8,
      unit: 'bottles',
      price: 95.00,
      supplier: 'Luxury Imports'
    },
    {
      id: 6,
      name: 'Wine - Pinot Noir',
      type: 'Wine',
      quantity: 15,
      unit: 'bottles',
      price: 38.50,
      supplier: 'Fine Wine Co'
    }
  ]);

  const handleOrderMore = (id) => {
    alert('Order placed for ' + liquors.find(l => l.id === id).name);
  };
  
  const totalValue = liquors.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const champagneCount = liquors.filter(l => l.type === 'Champagne').reduce((sum, item) => sum + item.quantity, 0);
  const wineCount = liquors.filter(l => l.type === 'Wine').reduce((sum, item) => sum + item.quantity, 0);
  */

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
          marginBottom: '20px'
        }}>
          Liquor Store Integration
        </h1>

        {/* 구매 및 공급 정보 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px',
          borderLeft: '4px solid #FFD700'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '8px', fontWeight: 'bold' }}>
            📍 Liquor Purchase System
          </p>
          <p style={{ fontSize: '13px', color: '#FFFFFF', marginBottom: '12px' }}>
            Staff purchases liquor from the shop next door after shift starts (3:30 PM)
          </p>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '6px' }}>
            🚚 Regular Supply Schedule:
          </p>
          <div style={{ marginLeft: '15px' }}>
            <p style={{ fontSize: '12px', color: '#FFC107', marginBottom: '3px', fontWeight: 'bold' }}>
              • Monday at 8:00 AM
            </p>
            <p style={{ fontSize: '12px', color: '#FFC107', marginBottom: '8px', fontWeight: 'bold' }}>
              • Thursday at 8:00 AM
            </p>
          </div>
          <p style={{ fontSize: '11px', color: '#b0b0b0' }}>
            Other ingredients are stored in the warehouse and supplied twice a week.
          </p>
        </div>

        {/* 통계 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '15px'
          }}>
            <div>
              <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
                🍾 Champagne Stock
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>
                {champagneCount} bottles
              </p>
            </div>
            <div>
              <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
                🍷 Wine Stock
              </p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF' }}>
                {wineCount} bottles
              </p>
            </div>
          </div>
          <div style={{
            paddingTop: '15px',
            borderTop: '1px solid #3a3a3a'
          }}>
            <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
              Total Inventory Value
            </p>
            <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFC107' }}>
              ${totalValue.toFixed(2)}
            </p>
          </div>
        </div>

        {/* 주류 목록 */}
        {liquors.map((liquor) => (
          <div
            key={liquor.id}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px'
            }}
          >
            {/* 이름과 타입 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '10px'
            }}>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '3px'
                }}>
                  {liquor.name}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#b0b0b0'
                }}>
                  {liquor.supplier}
                </p>
              </div>
              <span style={{
                backgroundColor: liquor.name === 'Champagne' ? '#FFD700' : '#8B0000',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: liquor.name === 'Champagne' ? '#000000' : '#FFFFFF'
              }}>
                {liquor.name}
              </span>
            </div>

            {/* 수량과 가격 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '15px',
              borderBottom: '1px solid #3a3a3a',
              marginBottom: '15px'
            }}>
              <div>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Stock
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                }}>
                  {liquor.quantity} {liquor.unit}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Unit Price
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFC107'
                }}>
                  ${liquor.price}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Subtotal
                </p>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFC107'
                }}>
                  ${(liquor.quantity * liquor.price).toFixed(2)}
                </p>
              </div>
            </div>

            {/* 주문 버튼 */}
            <button
              onClick={() => handleOrderMore(liquor.id)}
              style={{
                width: '100%',
                backgroundColor: '#FFC107',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                color: '#000000',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              + Order More
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffLiquorScreen;