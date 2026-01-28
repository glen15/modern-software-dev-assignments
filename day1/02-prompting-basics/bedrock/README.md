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
```

또는 AWS CLI가 설정되어 있다면 `.env` 없이도 동작합니다.

## 실행 방법

```bash
source .venv/bin/activate
python app_gradio.py
# http://127.0.0.1:7860 에서 실행
```

## 프롬프팅 기법

### 1. K-shot Prompting
예시를 보여주고 패턴을 학습하게 하는 기법

- 시스템 프롬프트에 예시를 추가하면 출력 형식을 지정할 수 있습니다
- 예시의 형식을 따라 AI가 일관된 구조로 응답합니다

### 2. Chain of Thought
단계별로 추론하도록 유도하는 기법

- "Let's think step by step" 또는 "단계별로 생각해보세요" 추가
- 복잡한 문제를 단계별로 풀도록 유도합니다

### 3. Self-Consistency
여러 번 실행 후 결과를 종합하는 기법

- 높은 temperature로 다양한 관점의 답변 생성
- 여러 분석 결과를 종합하여 신뢰도 높은 결론 도출
