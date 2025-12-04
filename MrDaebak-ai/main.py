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
JAVA_BACKEND_URL = "http://localhost:8080/api/orders"
# 설치된 모델명 확인 필수 (qwen3:14b 또는 qwen2.5:14b 등)
TARGET_MODEL = "qwen3:14b" 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Whisper 모델 로드
print("▶ Whisper 모델 로딩 중...")
stt_model = whisper.load_model("base")
print("▶ Whisper 모델 로딩 완료!")

# ★ 세션별 '주문 상태(JSON)'만 저장하는 딕셔너리 (대화 내용 저장 X)
session_states = {} 

def get_initial_state(customer_id):
    return {
        "customerId": customer_id,
        "dinnerType": None,
        "servingStyle": None,
        "items": [],
        "step": "ASK_DINNER" # 현재 진행 단계
    }

# ★ 시스템 프롬프트 (여기가 오류의 원인이었던 부분, 따옴표 주의!)
def get_system_prompt(current_state_json):
    # f-string 안에서 JSON 예시의 중괄호는 {{ }} 로 두 번 감싸야 에러가 안 납니다.
    return f"""
    You are a professional waiter AI at 'Mr. Daebak'.
    
    [CURRENT ORDER STATE]
    {json.dumps(current_state_json, ensure_ascii=False)}

    [GOAL]
    Analyze the [USER INPUT] and update the [CURRENT ORDER STATE].
    Then provide a polite Korean response.

    [IMPORTANT: DATA CONSISTENCY]
    When updating the JSON state, you MUST use the following **ENGLISH CODES** internally, even if the user speaks Korean.
    
    1. Dinner Types (Store as String):
       - "발렌타인" -> "valentine"
       - "프렌치" -> "french"
       - "잉글리쉬" -> "english"
       - "샴페인" -> "champagne"
    
    2. Serving Styles (Store as String):
       - "심플" -> "simple"
       - "그랜드" -> "grand"
       - "디럭스" -> "deluxe"

    [LOGIC STEPS]
    1. If 'dinnerType' is null -> Ask "디너 종류는 무엇으로 하시겠습니까?" (Options: 발렌타인, 프렌치, 잉글리쉬, 샴페인 축제)
    2. If 'servingStyle' is null -> Ask "서빙 스타일은 어떻게 해드릴까요?" (Options: 심플, 그랜드, 디럭스)
    3. If both set -> Confirm current order and ask for menu changes (add/remove).
    4. If user wants changes -> Update 'items' list (Use IDs: Wine=101, Steak=102, etc).
    5. If confirmed -> Set "is_finished": true.

    [OUTPUT JSON FORMAT]
    Strictly output ONLY this JSON format. No <think> tags.
    {{
        "response": "User friendly Korean response",
        "updated_state": {{
            "customerId": {current_state_json['customerId']},
            "dinnerType": "...",
            "servingStyle": "...",
            "items": [ ... ],
        }},
        "is_finished": false
    }}
    """ 

# JSON 추출 함수 (Qwen3의 <think> 태그 제거용)
def extract_json_from_text(text):
    try:
        # <think> 태그 및 마크다운 제거
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        text = text.replace("```json", "").replace("```", "")
        
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        return None
    except:
        return None

@app.post("/chat")
async def chat_process(
    file: UploadFile = File(...), 
    session_id: str = Form(...),
    customer_id: int = Form(1)
):
    temp_filename = f"temp_{uuid.uuid4()}.wav"
    
    try:
        # 1. 음성 저장
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
        # 2. STT 변환
        stt_result = stt_model.transcribe(temp_filename, language="ko")
        user_text = stt_result['text']
        print(f"\n🗣️ 사용자({session_id}): {user_text}")

        # 3. 현재 주문 상태 가져오기 (없으면 초기화)
        if session_id not in session_states:
            session_states[session_id] = get_initial_state(customer_id)
        
        current_state = session_states[session_id]

        # 4. LLM 호출 (History 없이 '상태'와 '현재 말'만 보냄)
        full_prompt = f"{get_system_prompt(current_state)}\n\n[USER INPUT]\n{user_text}\n\n[INSTRUCTION]\nRespond in JSON only."
        
        print(f"🤖 AI({TARGET_MODEL}) 처리 중...") 
        
        try:
            # Qwen에게 요청
            response = requests.post('http://localhost:11434/api/generate', json={
                "model": TARGET_MODEL,
                "prompt": full_prompt,
                "stream": False,
                "keep_alive": -1,  # ★ 추가: 모델을 메모리에서 내리지 말고 계속 유지 (속도 향상)
                "options": {
                    "temperature": 0.1, # 매우 정확하게
                    "num_predict": 1024
                }
            })
            
            if response.status_code != 200:
                raise Exception(f"Ollama Error: {response.text}")

            raw_response = response.json()['response']
            
            # 5. 결과 파싱 및 상태 업데이트
            ai_json = extract_json_from_text(raw_response)

            if ai_json is None:
                ai_text = "죄송합니다. 다시 말씀해 주세요."
                is_finished = False
            else:
                ai_text = ai_json.get("response", "응답 없음")
                is_finished = ai_json.get("is_finished", False)
                
                # ★ 상태 업데이트 (가장 중요)
                if "updated_state" in ai_json:
                    session_states[session_id] = ai_json["updated_state"]
                    # 디버깅용 출력
                    print(f"📝 갱신된 상태: {session_states[session_id]}")

            print(f"🤖 AI 답변: {ai_text}")

            # 6. 완료 시 백엔드 전송
            backend_msg = "Not Finished"

            final_receipt_data = None
            if is_finished:
                final_order = session_states[session_id]
                print(f"📦 주문 확정! 전송 데이터: {final_order}")
                
                try:
                    res = requests.post(JAVA_BACKEND_URL, json=final_order)
                    if res.status_code == 200:
                        backend_msg = "Success"
                        print("✅ 백엔드 전송 성공")
                        # 주문 완료 후 상태 초기화 (다음 주문을 위해)
                        del session_states[session_id]
                    else:
                        backend_msg = f"Fail({res.status_code})"
                        print(f"❌ 백엔드 실패: {res.status_code}")
                except Exception as e:
                    backend_msg = "Conn Error"
                    print(f"❌ 연결 오류: {e}")
            if "updated_state" not in ai_json or ai_json["updated_state"] is None:
                    ai_json["updated_state"] = final_receipt_data

            return {
                "status": "success",
                
                "ai_response": ai_json,
                "backend_status": backend_msg
            }

        except Exception as e:
            print(f"❌ LLM 처리 중 오류: {e}")
            return {"status": "error", "message": "AI 처리 실패"}

    except Exception as e:
        print(f"❌ 시스템 오류: {e}")
        return {"status": "error", "message": str(e)}
    
    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)