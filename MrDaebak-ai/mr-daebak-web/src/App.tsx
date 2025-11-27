import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// 타입 정의
interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface AiResponse {
  response: string;
  current_order: string;
  is_finished: boolean;
}

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: "안녕하세요, OOO 고객님, 어떤 디너를 주문하시겠습니까?" }
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("대기 중...");
  const [sessionId, setSessionId] = useState("");
  const [orderSummary, setOrderSummary] = useState("아직 주문 없음");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 컴포넌트 시작 시 세션 ID 생성
  useEffect(() => {
    setSessionId(Math.random().toString(36).substring(7));
  }, []);

  // 채팅 스크롤 자동 이동
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = sendAudioToServer;
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus("듣고 있어요... 👂");
    } catch (err) {
      alert("마이크 권한이 필요합니다.");
    }
  };

  // 녹음 종료
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setStatus("생각하는 중... 🤔");
  };

  // 서버 전송
  const sendAudioToServer = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    audioChunksRef.current = [];

    const formData = new FormData();
    formData.append('file', audioBlob, 'voice.wav');
    formData.append('session_id', sessionId); // 대화 기억용 ID

    try {
      const res = await axios.post('http://localhost:5000/chat', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const data = res.data;
      
      // 1. 내 말 표시
      setMessages(prev => [...prev, { sender: 'user', text: data.user_text }]);
      
      // 2. AI 말 표시
      const aiRes: AiResponse = data.ai_response;
      setMessages(prev => [...prev, { sender: 'ai', text: aiRes.response }]);
      
      // 3. 현재 주문 상태 업데이트
      setOrderSummary(aiRes.current_order);
      
      setStatus("대기 중...");
      
      if (aiRes.is_finished) {
        alert("주문이 완료되었습니다! 감사합니다.");
      }

    } catch (error) {
      console.error(error);
      setStatus("오류 발생 ❌");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>🍽️ 미스터 대박 AI 웨이터</h1>
        <div style={{ fontSize: '14px', color: '#666', background: '#f0f0f0', padding: '10px', borderRadius: '10px' }}>
          🛒 <strong>현재 주문 상태:</strong> {orderSummary}
        </div>
      </header>

      {/* 채팅창 영역 */}
      <div style={{ 
        height: '400px', 
        overflowY: 'auto', 
        border: '1px solid #ddd', 
        borderRadius: '15px', 
        padding: '20px',
        backgroundColor: '#fff',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
      }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            textAlign: msg.sender === 'user' ? 'right' : 'left', 
            marginBottom: '15px' 
          }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '10px 15px', 
              borderRadius: '20px', 
              background: msg.sender === 'user' ? '#007AFF' : '#E5E5EA',
              color: msg.sender === 'user' ? '#fff' : '#000',
              maxWidth: '80%',
              lineHeight: '1.5'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 컨트롤 영역 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ color: '#888', marginBottom: '10px' }}>{status}</p>
        <button 
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: isRecording ? '#ff3b30' : '#34c759',
            color: 'white',
            fontSize: '30px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            transition: 'transform 0.1s'
          }}
        >
          {isRecording ? '⏹️' : '🎙️'}
        </button>
        <p style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
          버튼을 <strong>누르고 있는 동안</strong> 말씀하세요!
        </p>
      </div>
    </div>
  );
}

export default App;