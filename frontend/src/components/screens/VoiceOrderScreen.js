import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../App.css';

function VoiceOrderScreen() {
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const handleStartListening = () => {
    setIsListening(true);
    // 실제 음성 인식 API는 나중에 추가
    setTranscript('Order a Valentine dinner for 7 p.m.');
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        {/* 헤더 */}
        <button
          onClick={() => navigate('/customer-home')}
          style={{
            background: 'none',
            border: 'none',
            color: '#b0b0b0',
            fontSize: '20px',
            cursor: 'pointer',
            marginBottom: '30px'
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
          Voice Order
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#b0b0b0',
          textAlign: 'center',
          marginBottom: '40px'
        }}>
          Speak naturally to order your dinner
        </p>

        {/* 마이크 버튼 */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={isListening ? handleStopListening : handleStartListening}
            style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: isListening ? '#FF6B6B' : '#FFC107',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '50px',
              margin: '0 auto',
              transition: '0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {isListening ? '⏹️' : '🎤'}
          </button>
          <p style={{
            marginTop: '15px',
            fontSize: '14px',
            color: '#b0b0b0'
          }}>
            {isListening ? 'Listening...' : 'Click to start'}
          </p>
        </div>

        {/* 인식된 텍스트 */}
        {transcript && (
          <div style={{
            backgroundColor: '#2a2a2a',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            borderLeft: '4px solid #FFC107'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#b0b0b0',
              marginBottom: '10px'
            }}>
              Recognized text:
            </p>
            <p style={{
              fontSize: '16px',
              color: '#FFFFFF',
              fontWeight: 'bold'
            }}>
              "{transcript}"
            </p>
          </div>
        )}

        {/* 예제 */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '15px',
          padding: '20px',
          marginBottom: '30px'
        }}>
          <p style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#FFFFFF',
            marginBottom: '15px'
          }}>
            Try saying:
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0
          }}>
            {[
              '💕 "Order a Valentine dinner for 7 p.m."',
              '🇫🇷 "I want a French dinner"',
              '🥂 "Champagne feast for two"',
              '🇬🇧 "English dinner, simple style"'
            ].map((example, index) => (
              <li
                key={index}
                style={{
                  fontSize: '13px',
                  color: '#b0b0b0',
                  marginBottom: '8px',
                  paddingLeft: '15px'
                }}
              >
                {example}
              </li>
            ))}
          </ul>
        </div>

        {/* 버튼들 */}
        {transcript && (
          <button
            onClick={() => navigate('/menu-details/custom')}
            className="btn-primary"
            style={{ marginBottom: '15px' }}
          >
            Continue to Order
          </button>
        )}

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

export default VoiceOrderScreen;