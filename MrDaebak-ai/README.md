# 🛠️ AI Server Setup Guide
이 문서는 AI 서버 실행을 위한 환경 설정 및 필수 설치 요소들을 안내합니다.

## 1. Python 라이브러리 설치
가장 먼저 프로젝트에 필요한 파이썬 라이브러리를 설치해야 합니다. 터미널에서 아래 명령어를 실행하세요.

```bash
pip install -r MrDaebak-ai/requirements.txt
```


## 2. FFmpeg 설치 및 환경변수 설정
비디오/오디오 처리를 위해 FFmpeg가 필요합니다.
1. **설치:** [FFmpeg 다운로드 페이지](https://www.ffmpeg.org/download.html)에 접속하여 운영체제에 맞는 FFmpeg를 다운로드하여 설치합니다.
3. **환경변수:** 설치된 폴더 내의 `bin` 폴더 경로를 시스템 환경변수(PATH)에 반드시 등록해야 합니다.


## 3. Ollama 설치
로컬 LLM 구동을 위한 Ollama를 설치합니다.
* **다운로드:** [Ollama 공식 홈페이지](https://ollama.com)에 접속하여 설치 파일을 다운로드합니다.
* **참고:** 설치가 완료되면 자동으로 서비스가 실행되므로, 별도의 환경변수 설정이나 시작 작업은 필요하지 않습니다.

이후 터미널에서 아래 명령어를 실행해 llama3 모델을 다운로드합니다.
```bash
ollama pull llama3
```

## 4. 서버 실행
MrDaebak-ai 폴더 내에서 main.py를 실행합니다.


<br>
<br>
