import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import { useEffect } from 'react';
import axios from 'axios';

function StaffInventoryScreen() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState([]);

  //추가: 4가지 메뉴의 기본 재료들만 정의 (liquor는 나중에 따로 관리)
  const baseItems = ['Steak', 'Coffee', 'Salad', 'Scrambled Egg', 'Bacon', 'Bread', 'Heart Decoration', 'Napkin', 'Baguette (4)'];

  useEffect(() => {
    axios.get('http://localhost:8080/api/inventories')
      .then(response => {
        //임시 테스트용 치워도 됨
        //console.log('백엔드 응답:', response.data);

        // 백엔드 데이터를 프론트엔드 변수명으로 변환 (Mapping)
        const formattedData = response.data.map(item => ({
          id: item.stockID,           // 백엔드 stockID -> 프론트 id
          name: item.itemName,        // 백엔드 itemName -> 프론트 name
          quantity: item.quantityAvailable, // 백엔드 quantityAvailable -> 프론트 quantity
          unit: item.unit,
          min: item.minQuantity,      // 백엔드 minQuantity -> 프론트 min
          status: item.status.toLowerCase() // 대문자(Good) -> 소문자(good)
        }));
        
        // baseItems에 있는 것들만
        const filteredData = formattedData.filter(item => baseItems.includes(item.name));
        //임시 테스트용 치워도 됨
        //console.log('필터 전:', formattedData);   
        //console.log('필터 후:', filteredData);    

        // 변환된 데이터로 상태 업데이트
        setInventory(filteredData);
      })
      .catch(error => {
        console.error("재고 불러오기 실패:", error);
      });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return '#4CAF50';
      case 'low':
        return '#FF9800';
      case 'critical':
        return '#FF6B6B';
      default:
        return '#9E9E9E';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'good':
        return '✓ Good';
      case 'low':
        return '⚠ Low';
      case 'critical':
        return '🚨 Critical';
      default:
        return status;
    }
  };

  // ==========================================
  // 수량 변경 및 DB 업데이트 로직
  // ==========================================
  const handleUpdateQuantity = async (id, newQuantity) => {
    // 1. 음수 방지 (0보다 작아질 수 없음)
    if (newQuantity < 0) return;

    try {
      // 2. 백엔드에 PATCH 요청 보내기 (DB 업데이트)
      // Controller가 받는 형태: { "quantity": 50 }
      await axios.patch(`http://localhost:8080/api/inventories/${id}/quantity`, {
        quantity: newQuantity
      });

      // 3. 요청이 성공하면 프론트엔드 화면(State)도 업데이트
      setInventory(prevInventory =>
        prevInventory.map(item => {
          if (item.id === id) {
            // 수량이 바뀌었으니 상태(Good/Low/Critical)도 프론트에서 미리 계산해서 보여줌
            let newStatus = 'good';
            if (newQuantity <= 0) newStatus = 'critical';
            else if (newQuantity <= item.min) newStatus = 'low';

            return { ...item, quantity: newQuantity, status: newStatus };
          }
          return item;
        })
      );

    } catch (error) {
      console.error("수량 업데이트 실패:", error);
      alert("수량 변경을 저장하지 못했습니다.");
    }
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
          marginBottom: '30px'
        }}>
          Inventory Management
        </h1>

        {/* 통계 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#b0b0b0', marginBottom: '5px' }}>
              Total Items
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
              {inventory.length}
            </p>
          </div>

          <div style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '15px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#b0b0b0', marginBottom: '5px' }}>
              Low Stock
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
              {inventory.filter(item => item.status !== 'good').length}
            </p>
          </div>
        </div>

        {/* 재고 목록 */}
        {inventory.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '15px',
              padding: '20px',
              marginBottom: '15px'
            }}
          >
            {/* 상품명과 상태 */}
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
                {item.name}
              </p>
              <div style={{
                backgroundColor: getStatusColor(item.status),
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 'bold',
                color: item.status === 'good' ? '#FFFFFF' : '#000000'
              }}>
                {getStatusText(item.status)}
              </div>
            </div>

            {/* 현재 수량과 최소 수량 */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '15px',
              paddingBottom: '15px',
              borderBottom: '1px solid #3a3a3a'
            }}>
              <div>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Current
                </p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#FFFFFF'
                }}>
                  {item.quantity} {item.unit}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '3px' }}>
                  Minimum
                </p>
                <p style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#b0b0b0'
                }}>
                  {item.min} {item.unit}
                </p>
              </div>
            </div>

            {/* 수량 조정 버튼 */}
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                onClick={() => handleUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                style={{
                  flex: 1,
                  backgroundColor: '#FF6B6B',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                − Used
              </button>
              <button
                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                style={{
                  flex: 1,
                  backgroundColor: '#4CAF50',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                + Restocked
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffInventoryScreen;