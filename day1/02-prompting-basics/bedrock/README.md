# Prompting Basics - AWS Bedrock

AWS Bedrock를 사용한 프롬프팅 기법 실습

## 설치

```bash
# 가상환경 생성 및 활성화
python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
# .venv\Scripts\activate   # Windows

# 패키지 설치
pip install -r requirements.txt
```

## AWS 설정

`.env` 파일을 생성하고 AWS 자격 증명을 설정하세요:

```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

또는 AWS CLI가 설정되어 있다면 `.env` 없이도 동작합니다.

## 실행 방법

### Web UI (권장)

**Gradio 버전:**
```bash
source .venv/bin/activate
python app_gradio.py
# http://127.0.0.1:7860 에서 실행
```

**Streamlit 버전:**
```bash
source .venv/bin/activate
streamlit run app_streamlit.py
# http://localhost:8501 에서 실행
```

### CLI 버전

```bash
source .venv/bin/activate
python k_shot_prompting.py
python chain_of_thought.py
python self_consistency_prompting.py
```

## 프롬프팅 기법

### 1. K-shot Prompting
예시를 보여주고 패턴을 학습하게 하는 기법

**문제:** 문자열 뒤집기 (`httpstatus` → `sutatsptth`)

**힌트:** 시스템 프롬프트에 예시 추가
```
예시:
- 'hello' -> 'olleh'
- 'world' -> 'dlrow'
```

### 2. Chain of Thought
단계별로 추론하도록 유도하는 기법

**문제:** `3^12345 mod 100` 계산 (정답: 43)

**힌트:** "Let's think step by step" 또는 "단계별로 생각해보세요" 추가

### 3. Self-Consistency
여러 번 실행 후 다수결로 답을 결정하는 기법

**문제:** 자전거 여행 거리 계산 (정답: 25마일)

**힌트:** 높은 temperature로 다양한 답변 생성 후 다수결
