// @ts-ignore
import VoiceOrderScreen from '../../../frontend/src/components/screens/VoiceOrderScreen.js';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        {/* path="/" 는 앱이 켜지자마자 보여줄 첫 화면을 의미합니다.
          여기에 VoiceOrderScreen을 넣으면 버튼 없이 바로 뜹니다.
        */}
        <Route path="/" element={<VoiceOrderScreen />} />
        
        {/* 혹시 몰라 남겨둔 주소들 */}
        <Route path="/voice-order" element={<VoiceOrderScreen />} />
      </Routes>
    </Router>
  );
}

export default App;