from fastapi import FastAPI, UploadFile, File
# ▼▼▼ 이 줄이 빠져서 에러가 났던 겁니다! ▼▼▼
from fastapi.middleware.cors import CORSMiddleware 
import whisper
import requests
import json
import os
import shutil

app = FastAPI()

# 보안 설정 (CORS 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 곳에서 접속 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Whisper 모델 로드
print("Whisper 모델 로딩 중... (잠시만 기다려주세요)")
stt_model = whisper.load_model("base")
print("Whisper 모델 로딩 완료!")

# 2. LLM(Ollama)에게 줄 시스템 프롬프트
SYSTEM_PROMPT = """
당신은 '미스터 대박' 레스토랑의 주문 분석 AI입니다.
고객의 자연어 주문을 분석하여 시스템 처리가 가능한 JSON 데이터로 변환하세요.

[학습된 메뉴 목록]
1. 발렌타인 디너: 와인, 스테이크, 냅킨 (하트 접시)
2. 프렌치 디너: 커피, 와인, 샐러드, 스테이크
3. 잉글리시 디너: 에그스크램블, 베이컨, 빵, 스테이크
4. 샴페인 축제 디너: 샴페인, 바게트, 커피, 와인, 스테이크 (최소 그랜드 스타일)

[분석 규칙]
1. 메뉴 이름, 수량, 변경사항(추가/삭제)을 정확히 추출할 것.
2. 결과는 반드시 **오직 JSON 형식**으로만 출력할 것. 설명 금지.
3. 예시: {"menu": "프렌치 디너", "quantity": 1, "modifications": ["커피 제외", "바게트 추가"]}
"""

@app.post("/order")
async def process_order(file: UploadFile = File(...)):
    # 파일 저장 경로 설정
    temp_filename = f"temp_{file.filename}"
    
    try:
        # 1. 음성 파일 저장
        with open(temp_filename, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
        # 2. Whisper로 음성 -> 텍스트 변환 (STT)
        print(f"음성 인식 시작: {file.filename}")
        stt_result = stt_model.transcribe(temp_filename, language="ko")
        user_text = stt_result['text']
        print(f"인식된 텍스트: {user_text}")

        # 3. Ollama(Llama 3)에게 분석 요청
        print("주문 의도 분석 중...")
        response = requests.post('http://localhost:11434/api/generate', json={
            "model": "llama3", 
            "prompt": f"{SYSTEM_PROMPT}\n\n[고객 주문]: {user_text}",
            "stream": False,
            "format": "json"
        })
        
        # 4. 결과 정리 및 반환
        llm_response = response.json()
        order_json = json.loads(llm_response['response'])
        
        return {
            "status": "success",
            "text": user_text,
            "data": order_json
        }

    except Exception as e:
        print(f"오류 발생: {e}")
        return {"status": "error", "message": str(e)}
    
    finally:
        # 임시 파일 삭제 (청소)
        if os.path.exists(temp_filename):
            os.remove(temp_filename)

if __name__ == "__main__":
    import uvicorn
    # 서버 실행 (5000번 포트 사용)
    uvicorn.run(app, host="0.0.0.0", port=5000)