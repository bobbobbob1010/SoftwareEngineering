import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../App.css'; // 경로가 맞는지 확인해주세요!

function VoiceOrderScreen() {
  const navigate = useNavigate();
  
  // --- 상태 관리 ---
  // 대화 기록을 저장할 배열 (초기값: AI의 첫 인사)
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '안녕하세요, OOO 고객님. 어떤 디너를 주문하시겠습니까?' }
  ]);
  
  const [isListening, setIsListening] = useState(false);
  const [status, setStatus] = useState('Click mic to start'); 
  const [sessionId, setSessionId] = useState('');
  const [orderSummary, setOrderSummary] = useState(''); // 현재 주문 요약

  // 녹음 및 스크롤 관련 Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const chatEndRef = useRef(null); // 자동 스크롤용

  // 1. 접속 시 세션 ID 생성
  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  // 2. 메시지가 추가될 때마다 스크롤을 맨 아래로 내림
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- 녹음 로직 ---
  const handleStartListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = sendAudioToServer;
      mediaRecorderRef.current.start();
      
      setIsListening(true);
      setStatus('Listening... (말씀하세요)');
    } catch (err) {
      console.error("Mic Error:", err);
      alert("마이크 사용 권한이 필요합니다.");
    }
  };

  const handleStopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setStatus('Processing... (분석 중)');
  };

  const sendAudioToServer = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    audioChunksRef.current = [];

    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.wav');
    formData.append('session_id', sessionId);

    try {
      const res = await axios.post('http://localhost:5000/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;
      const aiResponse = data.ai_response;

      // 1. 사용자 말 추가
      setMessages(prev => [...prev, { sender: 'user', text: data.user_text }]);
      
      // 2. AI 답변 추가 (약간의 텀을 두고 자연스럽게)
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'ai', text: aiResponse.response }]);
      }, 500);

      setOrderSummary(aiResponse.current_order);
      setStatus('Click mic to reply');

      if (aiResponse.is_finished) {
        alert(`주문이 완료되었습니다!\n[최종 주문]: ${aiResponse.current_order}`);
      }

    } catch (error) {
      console.error(error);
      setStatus('Error: 서버 연결 실패');
    }
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column', // 세로 정렬
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        
        {/* 헤더 (뒤로가기 & 제목) */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
          <button
            onClick={() => navigate('/customer-home')}
            style={{
              background: 'none', border: 'none', color: '#b0b0b0',
              fontSize: '20px', cursor: 'pointer', marginRight: '15px'
            }}
          >
            ←
          </button>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFFFFF', margin: 0 }}>
            Voice Order
          </h1>
        </div>

        {/* 현재 주문 상태 바 (추가됨) */}
        {orderSummary && (
          <div style={{
            backgroundColor: '#333', padding: '10px', borderRadius: '8px',
            marginBottom: '20px', color: '#FFC107', fontSize: '14px', textAlign: 'center'
          }}>
            🛒 현재 주문: {orderSummary}
          </div>
        )}

        {/* 💬 대화 내용 표시 영역 (스크롤 가능하게 변경됨) */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px',
          height: '400px',       // 높이 고정
          overflowY: 'auto',     // 내용 많으면 스크롤
          borderLeft: '4px solid #FFC107'
        }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ 
              marginBottom: '15px', 
              textAlign: msg.sender === 'user' ? 'right' : 'left' 
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: msg.sender === 'user' ? '#b0b0b0' : '#FF6B6B', 
                marginBottom: '5px' 
              }}>
                {msg.sender === 'user' ? 'YOU' : 'AI WAITER'}
              </p>
              <div style={{
                display: 'inline-block',
                padding: '10px 15px',
                borderRadius: '15px',
                backgroundColor: msg.sender === 'user' ? '#444' : '#FFC107',
                color: msg.sender === 'user' ? '#FFF' : '#000',
                fontSize: '16px',
                fontWeight: 'bold',
                maxWidth: '80%',
                lineHeight: '1.5'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {/* 자동 스크롤을 위한 투명한 바닥 */}
          <div ref={chatEndRef} />
        </div>

        {/* 🎤 마이크 버튼 (기존 디자인 유지) */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button
            // 클릭 한 번으로 시작/종료 (토글)
            onClick={isListening ? handleStopListening : handleStartListening}
            style={{
              width: '100px', height: '100px', borderRadius: '50%',
              border: 'none', backgroundColor: isListening ? '#FF6B6B' : '#FFC107',
              cursor: 'pointer', fontSize: '40px',
              boxShadow: isListening ? '0 0 15px #FF6B6B' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {isListening ? '⏹️' : '🎙️'}
          </button>
          <p style={{ marginTop: '10px', fontSize: '14px', color: '#b0b0b0' }}>
            {status}
          </p>
        </div>

        {/* 하단 버튼 */}
        <button
          onClick={() => navigate('/customer-home')}
          style={{
            width: '100%', padding: '15px', borderRadius: '10px',
            backgroundColor: '#444', color: 'white', border: 'none',
            fontWeight: 'bold', cursor: 'pointer'
          }}
        >
          Cancel / 나가기
        </button>

      </div>
    </div>
  );
}

export default VoiceOrderScreen;