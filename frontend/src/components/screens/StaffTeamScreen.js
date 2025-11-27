import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function StaffTeamScreen() {
  const navigate = useNavigate();
  const [team] = useState([
    // Kitchen Chefs
    {
      id: 1,
      name: 'John Doe',
      role: 'Kitchen Chef',
      type: 'kitchen',
      status: 'working',
      phone: '+1-555-0001',
      email: 'john@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 2,
      name: 'Mike Brown',
      role: 'Kitchen Chef',
      type: 'kitchen',
      status: 'working',
      phone: '+1-555-0003',
      email: 'mike@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 3,
      name: 'Alex Garcia',
      role: 'Kitchen Chef',
      type: 'kitchen',
      status: 'working',
      phone: '+1-555-0011',
      email: 'alex@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 4,
      name: 'Chris Lee',
      role: 'Kitchen Chef',
      type: 'kitchen',
      status: 'working',
      phone: '+1-555-0012',
      email: 'chris@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 5,
      name: 'Tom Martinez',
      role: 'Kitchen Chef',
      type: 'kitchen',
      status: 'working',
      phone: '+1-555-0013',
      email: 'tom@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    // Delivery Drivers
    {
      id: 6,
      name: 'Jane Wilson',
      role: 'Delivery Driver',
      type: 'delivery',
      status: 'on-route',
      phone: '+1-555-0002',
      email: 'jane@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 7,
      name: 'Sarah Davis',
      role: 'Delivery Driver',
      type: 'delivery',
      status: 'available',
      phone: '+1-555-0004',
      email: 'sarah@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 8,
      name: 'Emily White',
      role: 'Delivery Driver',
      type: 'delivery',
      status: 'on-route',
      phone: '+1-555-0014',
      email: 'emily@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 9,
      name: 'David Kim',
      role: 'Delivery Driver',
      type: 'delivery',
      status: 'available',
      phone: '+1-555-0015',
      email: 'david@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    },
    {
      id: 10,
      name: 'Jessica Taylor',
      role: 'Delivery Driver',
      type: 'delivery',
      status: 'available',
      phone: '+1-555-0016',
      email: 'jessica@mrdinner.com',
      shiftStart: '15:30',
      shiftEnd: '22:00'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'working':
        return '#4CAF50';
      case 'on-route':
        return '#2196F3';
      case 'available':
        return '#FFC107';
      case 'off-duty':
        return '#9E9E9E';
      default:
        return '#b0b0b0';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'working':
        return '✓ Cooking';
      case 'on-route':
        return '🚗 On Route';
      case 'available':
        return '✓ Available';
      case 'off-duty':
        return 'Off Duty';
      default:
        return status;
    }
  };

  const getRoleIcon = (type) => {
    return type === 'kitchen' ? '👨‍🍳' : '🚗';
  };

  const kitchenStaff = team.filter(s => s.type === 'kitchen');
  const deliveryStaff = team.filter(s => s.type === 'delivery');

  const StaffSection = ({ title, icon, staff }) => (
    <>
      <h2 style={{
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: '30px',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '24px' }}>{icon}</span>
        {title} ({staff.length})
      </h2>

      {staff.map((member) => (
        <div
          key={member.id}
          style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '15px',
            borderLeft: `4px solid ${getStatusColor(member.status)}`
          }}
        >
          {/* 이름과 상태 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '32px' }}>{getRoleIcon(member.type)}</span>
              <div>
                <p style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '3px'
                }}>
                  {member.name}
                </p>
                <p style={{
                  fontSize: '12px',
                  color: '#b0b0b0'
                }}>
                  {member.role}
                </p>
              </div>
            </div>
            <div style={{
              backgroundColor: getStatusColor(member.status),
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: member.status === 'available' ? '#000000' : '#FFFFFF',
              whiteSpace: 'nowrap'
            }}>
              {getStatusText(member.status)}
            </div>
          </div>

          {/* 근무 시간 */}
          <p style={{
            fontSize: '12px',
            color: '#FFC107',
            marginBottom: '8px',
            fontWeight: 'bold'
          }}>
            ⏰ Shift: {member.shiftStart} - {member.shiftEnd}
          </p>

          {/* 연락처 정보 */}
          <div style={{
            paddingTop: '10px',
            borderTop: '1px solid #3a3a3a',
            fontSize: '12px',
            color: '#b0b0b0'
          }}>
            <p style={{ marginBottom: '5px' }}>📞 {member.phone}</p>
            <p>📧 {member.email}</p>
          </div>

          {/* 액션 버튼 */}
          <div style={{
            display: 'flex',
            gap: '10px',
            marginTop: '15px'
          }}>
            <button
              onClick={() => window.open(`tel:${member.phone}`)}
              style={{
                flex: 1,
                backgroundColor: '#2196F3',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: '#FFFFFF',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Call
            </button>
            <button
              onClick={() => alert('Schedule updated for ' + member.name)}
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
              Edit Shift
            </button>
          </div>
        </div>
      ))}
    </>
  );

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
          marginBottom: '10px'
        }}>
          Staff Management
        </h1>

        {/* 근무 정보 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '15px',
          marginBottom: '20px',
          borderLeft: '4px solid #FFC107'
        }}>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginBottom: '5px' }}>
            📋 Operating Hours
          </p>
          <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
            3:30 PM - 10:00 PM
          </p>
          <p style={{ fontSize: '12px', color: '#b0b0b0', marginTop: '8px' }}>
            All staff: {team.length} people
          </p>
        </div>

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
              👨‍🍳 Kitchen
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
              {kitchenStaff.length}
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
              🚗 Delivery
            </p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFC107' }}>
              {deliveryStaff.length}
            </p>
          </div>
        </div>

        {/* 직원 섹션 */}
        <StaffSection 
          title="Kitchen Team" 
          icon="👨‍🍳"
          staff={kitchenStaff}
        />

        <StaffSection 
          title="Delivery Team" 
          icon="🚗"
          staff={deliveryStaff}
        />
      </div>
    </div>
  );
}

export default StaffTeamScreen;