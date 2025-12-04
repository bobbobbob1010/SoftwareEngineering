from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import whisper
import requests
import json
import os
import shutil
from datetime import datetime
import uuid
import re

app = FastAPI()

# Java Spring Boot 서버 주소
JAVA_BACKEND_URL = "http://localhost:8080/api/orders"

# ★★★ 사용할 모델명 고정 (사용자 환경의 ollama list와 일치) ★★★
TARGET_MODEL = "qwen3:14b"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Whisper 모델 로드
print("------------------------------------------------------")
print(f"▶ Whisper 모델 로딩 중... (타겟 LLM: {TARGET_MODEL})")
stt_model = whisper.load_model("base")
print("▶ Whisper 모델 로딩 완료!")
print("------------------------------------------------------")

sessions = {}

def get_system_prompt(customer_id):
    today = datetime.now().strftime("%Y년 %m월 %d일")
    return f"""
    You are a professional waiter AI at 'Mr. Daebak Dinner Service'.
    Current Date: {today}
    Customer ID: {customer_id}

    [CRITICAL INSTRUCTION]
    1. **Output ONLY a pure JSON object.** 2. **DO NOT output any thinking process (<think> tags).**
    3. The 'response' field MUST be in natural KOREAN.

    [MENU DATA]
    - Dinner Types: "valentine", "french", "english", "champagne"
    - Serving Styles: "simple", "grand", "deluxe"
    - Items (IDs): Wine(101), Steak(102), Napkin(103), Coffee(104), Salad(105), Eggs(106), Bacon(107), Bread(108), Champagne(109)

    [LOGIC]
    - Greeting -> Ask Menu -> Ask Style -> **Ask Address** -> Confirm.
    - Set "is_finished": true ONLY when order is confirmed AND address is known.

    [OUTPUT JSON FORMAT EXAMPLE]
    {{
        "response": "주문이 완료되었습니다.",
        "is_finished": true,
        "final_order": {{ 
            "customerId": {customer_id},
            "dinnerType": "valentine",
            "servingStyle": "grand",
            "deliveryAddress": "Seoul...",
            "items": [{{ "menuItemId": 102, "quantity": 1 }}]
        }}
    }}
    """

# ★ JSON 추출 함수 (Qwen 3의 <think> 태그 및 Markdown 제거)
def extract_json_from_text(text):
    try:
        # 1. <think>...</think> 태그 제거 (가장 중요)
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        
        # 2. Markdown 코드 블럭 제거 (```json ... ```)
        text = text.replace("```json", "").replace("```", "")
        
        # 3. 중괄호 {} 사이의 내용만 추출
        start_idx = text.find('{')
        end_idx = text.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            json_str = text[start_idx : end_idx + 1]
            return json.loads(json_str)
        else:
            return None
    except Exception as e:
        print(f"⚠️ JSON 파싱 실패: {e}")
        return None

@app.post("/chat")
async def chat_process(
    file: UploadFile = File(...), 
    session_id: str = Form(...),
    customer_id: int = Form(1)
):
    temp_filename = f"temp_{uuid.uuid4()}.wav"
    
    try:
        # 1. 음성 파일 저장
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
        # 2. STT 변환
        print(f"\n[Processing] 음성 인식 중...")
        stt_result = stt_model.transcribe(temp_filename, language="ko")
        user_text = stt_result['text']
        print(f"\n🗣️  사용자({session_id}): {user_text}") 

        # 3. 대화 기록 관리
        if session_id not in sessions:
            sessions[session_id] = []
        sessions[session_id].append(f"Customer: {user_text}")
        conversation_history = "\n".join(sessions[session_id][-10:])

        # 4. LLM 호출
        full_prompt = f"{get_system_prompt(customer_id)}\n\n[Conversation History]\n{conversation_history}\n\n[Instruction]\nRespond in JSON format."
        
        print(f"🤖 AI({TARGET_MODEL})에게 요청 중...") 
        
        # ★ Ollama API 호출 (format: "json" 제거함 - Qwen3 호환성 위함)
        try:
            response = requests.post('http://localhost:11434/api/generate', json={
                "model": TARGET_MODEL,  # "qwen3:14b"
                "prompt": full_prompt,
                "stream": False,
                # "format": "json",  <-- 제거함 (Thinking 태그 섞임 방지)
                "options": {
                    "temperature": 0.1, # 정밀도 높임
                    "num_predict": 2048 # 답변 잘림 방지
                }
            })
            
            if response.status_code != 200:
                print(f"❌ Ollama 오류 코드: {response.status_code}")
                return {"status": "error", "message": f"Ollama Error: {response.text}"}

            llm_data = response.json()
            raw_response = llm_data['response']

            # ★★★ [디버깅] 터미널에서 모델의 실제 응답 확인 ★★★
            print(f"\n========== [DEBUG: {TARGET_MODEL} Raw Output] ==========")
            print(raw_response)
            print(f"==========================================================\n")

        except Exception as e:
            print(f"❌ Ollama 연결 실패: {e}")
            return {"status": "error", "message": "Ollama Server Connection Failed"}

        # 5. 결과 파싱
        ai_response_json = extract_json_from_text(raw_response)

        if ai_response_json is None:
            ai_text = "죄송합니다. AI 응답을 해석하지 못했습니다. 다시 말씀해 주세요."
            is_finished = False
        else:
            ai_text = ai_response_json.get("response", "응답 없음")
            is_finished = ai_response_json.get("is_finished", False)

        print(f"🤖 AI 답변: {ai_text}")
        
        # 6. 백엔드 처리
        backend_status_list = []
        
        if is_finished and ai_response_json and "final_order" in ai_response_json:
            order_dto = ai_response_json["final_order"]
            print(f"📦 주문 완료! 데이터: {order_dto}")

            # 로컬 파일 저장
            try:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                with open(f"order_{session_id}_{timestamp}.json", "w", encoding="utf-8") as f:
                    json.dump(order_dto, f, ensure_ascii=False, indent=4)
                backend_status_list.append("File Saved")
            except:
                backend_status_list.append("File Error")

            # 자바 백엔드 전송
            try:
                res = requests.post(JAVA_BACKEND_URL, json=order_dto)
                if res.status_code == 200:
                    print("✅ 백엔드 전송 성공!")
                    backend_status_list.append("Server Sent")
                else:
                    print(f"❌ 백엔드 전송 실패: {res.status_code}")
                    backend_status_list.append(f"Server Fail({res.status_code})")
            except Exception as e:
                print(f"❌ 백엔드 연결 오류: {e}")
                backend_status_list.append("Conn Error")

        sessions[session_id].append(f"AI: {ai_text}")

        return {
            "status": "success",
            "user_text": user_text,
            "ai_response": ai_response_json,
            "backend_status": str(backend_status_list)
        }

    except Exception as e:
        print(f"\n❌ 시스템 오류: {e}")
        return {"status": "error", "message": str(e)}
    
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    # host="0.0.0.0"은 외부 접속 허용, port=5000은 포트 번호
    print("🚀 서버를 시작합니다! (http://localhost:5000)")
    uvicorn.run(app, host="0.0.0.0", port=5000)