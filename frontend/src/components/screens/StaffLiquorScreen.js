import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffLiquorScreen() {
  const navigate = useNavigate();
  const [liquors, setLiquors] = useState([
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
                backgroundColor: liquor.type === 'Champagne' ? '#FFD700' : '#8B0000',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: liquor.type === 'Champagne' ? '#000000' : '#FFFFFF'
              }}>
                {liquor.type}
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