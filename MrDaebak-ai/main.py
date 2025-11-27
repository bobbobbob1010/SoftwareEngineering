from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import whisper
import requests
import json
import os
import shutil
from datetime import datetime, timedelta
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Whisper 모델 로드
print("Whisper 모델 로딩 중...")
stt_model = whisper.load_model("base")
print("Whisper 모델 로딩 완료!")

# 2. 간단한 인메모리 세션 저장소 (대화 기억용)
sessions = {}

# 3. AI 페르소나 및 메뉴얼 정의
def get_system_prompt():
    today = datetime.now().strftime("%Y년 %m월 %d일")
    return f"""
    당신은 '미스터 대박' 디너 서비스의 전문 웨이터 AI입니다.
    현재 시각은 {today}입니다. 고객과 대화하며 주문을 완료하세요.

    [메뉴 정보]
    1. [cite_start]발렌타인 디너: 와인, 스테이크, 냅킨 (하트 접시) [cite: 7]
    2. [cite_start]프렌치 디너: 커피, 와인, 샐러드, 스테이크 [cite: 8]
    3. [cite_start]잉글리시 디너: 에그스크램블, 베이컨, 빵, 스테이크 [cite: 9]
    4. [cite_start]샴페인 축제 디너: 샴페인 1병, 바게트 4개, 커피 1포트, 와인, 스테이크 (항상 2인분) [cite: 10]

    [서빙 스타일]
    - [cite_start]Simple, Grand, Deluxe [cite: 11]
    - [cite_start]주의: '샴페인 축제 디너'는 Grand 또는 Deluxe 스타일로만 주문 가능 [cite: 12]

    [대화 규칙]
    1. 고객이 추천을 원하면 기념일인지 묻고, 상황에 맞춰 메뉴를 추천하세요. (생일 등 특별한 날엔 샴페인 축제 디너 추천)
    2. '내일', '모레' 같은 날짜 표현을 들으면 현재 시각을 기준으로 정확한 날짜를 계산해서 말하세요.
    3. [cite_start]고객이 주문 내용을 변경(수량, 추가, 삭제)하면 즉시 반영하세요. [cite: 19]
    4. 모든 대화가 끝나고 주문이 확정되면 'is_finished': true 로 설정하세요.

    [출력 형식 - 중요]
    반드시 아래 JSON 형식으로만 응답하세요. 다른 말은 하지 마세요.
    {{
        "response": "고객에게 할 말 (한국어)",
        "current_order": "현재까지 파악된 주문 내역 요약 (없으면 '없음')",
        "is_finished": false
    }}
    """

@app.post("/chat")
async def chat_process(
    file: UploadFile = File(...), 
    session_id: str = Form(...)
):
    # --- 1. 음성 파일 저장 및 STT ---
    temp_filename = f"temp_{uuid.uuid4()}.wav"
    with open(temp_filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        # Whisper로 텍스트 변환
        stt_result = stt_model.transcribe(temp_filename, language="ko")
        user_text = stt_result['text']
        print(f"User({session_id}): {user_text}")

        # --- 2. 대화 기록 관리 ---
        if session_id not in sessions:
            sessions[session_id] = [] # 새로운 대화 시작
        
        # 사용자 발화 기록 추가
        sessions[session_id].append(f"Customer: {user_text}")
        
        # 최근 대화 내용 가져오기 (문맥 유지)
        conversation_history = "\n".join(sessions[session_id][-10:]) # 최근 10마디만 기억

        # --- 3. LLM (Ollama) 호출 ---
        prompt_text = f"{get_system_prompt()}\n\n[이전 대화 기록]\n{conversation_history}\n\n[System]: 위 기록을 바탕으로 JSON 형식으로 응답하세요."
        
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "llama3", 
            "prompt": prompt_text,
            "stream": False,
            "format": "json"
        })
        #엄
        
        llm_data = response.json()
        ai_response_json = json.loads(llm_data['response'])
        
        # AI 응답 기록 추가
        ai_text = ai_response_json.get("response", "오류가 발생했습니다.")
        sessions[session_id].append(f"AI: {ai_text}")

        return {
            "status": "success",
            "user_text": user_text,
            "ai_response": ai_response_json
        }

    except Exception as e:
        print(f"Error: {e}")
        return {"status": "error", "message": str(e)}
    
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)