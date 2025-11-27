import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// 화면들을 임포트
import LoginScreen from './components/screens/LoginScreen';
import StaffLoginScreen from './components/screens/StaffLoginScreen';
import DashboardScreen from './components/screens/DashboardScreen';
import OnboardingScreen from './components/screens/OnboardingScreen';
import StaffOnboardingScreen from './components/screens/StaffOnboardingScreen';
import CustomerHomeScreen from './components/screens/CustomerHomeScreen';
import StaffHomeScreen from './components/screens/StaffHomeScreen';
import VoiceOrderScreen from './components/screens/VoiceOrderScreen';
import MenuDetailsScreen from './components/screens/MenuDetailsScreen';
import OrderDetailsScreen from './components/screens/OrderDetailsScreen';
import StaffOrdersScreen from './components/screens/StaffOrdersScreen';
import StaffInventoryScreen from './components/screens/StaffInventoryScreen';
import StaffDeliveryScreen from './components/screens/StaffDeliveryScreen';
import StaffTeamScreen from './components/screens/StaffTeamScreen';
import StaffAnalyticsScreen from './components/screens/StaffAnalyticsScreen';
import StaffLiquorScreen from './components/screens/StaffLiquorScreen';
import OrderCustomizationScreen from './components/screens/OrderCustomizationScreen';
import SignupScreen from './components/screens/SignupScreen';
import ProfileScreen from './components/screens/ProfileScreen';
// 역할 선택 화면
function RoleSelectionScreen({ setSelectedRole }) {
  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    if (role === 'customer') {
      window.location.href = '/customer-login';
    } else if (role === 'staff') {
      window.location.href = '/staff-login';
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h1 className="title">Mr. Daebak</h1>
        <p className="subtitle">Luxury Dinner Service</p>

        <div 
          className="card"
          onClick={() => handleRoleSelect('customer')}
        >
          <div className="icon">👤</div>
          <h2>Customer</h2>
          <p>Order luxury dinners delivered to your home</p>
        </div>

        <div 
          className="card"
          onClick={() => handleRoleSelect('staff')}
        >
          <div className="icon">🏢</div>
          <h2>Staff</h2>
          <p>Manage orders and restaurant operations</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [selectedRole, setSelectedRole] = useState('');

  return (
    <Router>
      <Routes>
        {/* 홈 화면 (역할 선택) */}
        <Route path="/" element={<RoleSelectionScreen setSelectedRole={setSelectedRole} />} />

        {/* 로그인 화면들 */}
        <Route path="/customer-login" element={<LoginScreen setSelectedRole={() => setSelectedRole('customer')} />} />
        <Route path="/staff-login" element={<StaffLoginScreen setSelectedRole={() => setSelectedRole('staff')} />} />

        {/* 대시보드 */}
        <Route path="/dashboard" element={<DashboardScreen role={selectedRole} />} />
        
        {/* Onboarding 화면들 */}
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/staff-onboarding" element={<StaffOnboardingScreen />} />

        {/* Home 화면들 */}
        <Route path="/customer-home" element={<CustomerHomeScreen />} />
        <Route path="/staff-home" element={<StaffHomeScreen />} />

        {/* Customer 상세 화면들 */}
        <Route path="/voice-order" element={<VoiceOrderScreen />} />
        <Route path="/menu-details/:dinnerType" element={<MenuDetailsScreen />} />
        <Route path="/order-details/:orderId" element={<OrderDetailsScreen />} />

        {/* Staff 상세 화면들 */}
        <Route path="/staff-orders" element={<StaffOrdersScreen />} />
        <Route path="/staff-inventory" element={<StaffInventoryScreen />} />
        <Route path="/staff-delivery" element={<StaffDeliveryScreen />} />
        <Route path="/staff-team" element={<StaffTeamScreen />} />
        <Route path="/staff-analytics" element={<StaffAnalyticsScreen />} />
        <Route path="/staff-liquor" element={<StaffLiquorScreen />} />
        <Route path="/customize-order/:dinnerType" element={<OrderCustomizationScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
    </Router>
  );
}

export default App;