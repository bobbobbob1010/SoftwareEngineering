import { useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

// 서버에서 오는 데이터의 모양(타입)을 정의
interface OrderData {
  menu: string;
  quantity: number;
  modifications: string[];
}

interface OrderResponse {
  status: string;
  text: string;
  data: OrderData;
}

function App() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("대기 중...");
  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  
  // 녹음 관련 도구들 (타입 정의)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 1. 녹음 시작
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = sendAudioToServer;

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setStatus("녹음 중... 말씀하세요! 🎤");
      setOrderResult(null); 
    } catch (err) {
      console.error("마이크 권한 오류:", err);
      alert("마이크 사용 권한을 허용해주세요!");
    }
  };

  // 2. 녹음 종료
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setStatus("분석 중... 잠시만 기다려주세요 ⏳");
  };

  // 3. 서버로 전송
  const sendAudioToServer = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
    audioChunksRef.current = []; // 초기화

    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_order.wav');

    try {
      // 파이썬 서버 주소 (포트 5000)
      const response = await axios.post<OrderResponse>('http://localhost:5000/order', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("서버 응답:", response.data);
      setOrderResult(response.data); 
      setStatus("주문 분석 완료! ✅");
    } catch (error) {
      console.error("에러 발생:", error);
      setStatus("서버 연결 실패 ❌ (파이썬 서버 켜져 있나요?)");
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>🍽️ 미스터 대박 AI 주문 (Demo)</h1>
      
      <div style={{ margin: '30px' }}>
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            padding: '20px 40px',
            fontSize: '24px',
            borderRadius: '50px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: isRecording ? '#ff4757' : '#2ed573',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
          }}
        >
          {isRecording ? "⏹️ 녹음 끝내기" : "🎙️ 주문 말하기"}
        </button>
      </div>

      <p style={{ fontSize: '18px', color: '#555' }}>{status}</p>

      {/* 분석 결과 표시 */}
      {orderResult && (
        <div style={{ 
          marginTop: '30px', 
          border: '2px solid #ddd', 
          borderRadius: '15px', 
          padding: '20px',
          display: 'inline-block',
          textAlign: 'left',
          backgroundColor: '#f9f9f9',
          maxWidth: '500px',
          color: '#333'
        }}>
          <h3>🧾 주문서 (AI 분석 결과)</h3>
          <p><strong>🗣️ 인식된 문장:</strong> {orderResult.text}</p>
          <hr />
          <p><strong>🍽️ 메뉴:</strong> {orderResult.data.menu}</p>
          <p><strong>🔢 수량:</strong> {orderResult.data.quantity}개</p>
          <p><strong>✍️ 변경사항:</strong> 
            {orderResult.data.modifications && orderResult.data.modifications.length > 0 
              ? orderResult.data.modifications.join(', ') 
              : " 없음"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;