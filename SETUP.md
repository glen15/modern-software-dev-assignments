# 환경 설정 가이드

## 개요

워크샵 참여를 위한 개발 환경 설정 가이드입니다.
워크샵 시작 전에 모든 설정을 완료해주세요.

---

## 필수 설치

### 1. Python 3.11+

```bash
# 버전 확인
python3 --version
# Python 3.11.x 이상이어야 함

# Mac (Homebrew)
brew install python@3.11

# Windows
# python.org에서 다운로드

# Ubuntu
sudo apt update
sudo apt install python3.11 python3.11-venv
```

### 2. Node.js 18+ (선택)

```bash
# 버전 확인
node --version

# Mac (Homebrew)
brew install node

# Windows
# nodejs.org에서 다운로드
```

### 3. Git

```bash
# 버전 확인
git --version

# Mac (Homebrew)
brew install git

# Windows
# git-scm.com에서 다운로드
```

---

## Day 1 준비

### AI 모델 설정 (Gemini 또는 Bedrock 중 선택)

#### 옵션 A: Google Gemini API

1. [Google AI Studio](https://aistudio.google.com/)에서 API 키 발급
2. 환경 변수 설정:

```bash
export GEMINI_API_KEY="your-api-key-here"
# 또는 .env 파일에 추가
echo "GEMINI_API_KEY=your-api-key-here" >> .env
```

#### 옵션 B: Amazon Bedrock (Nova 모델)

1. AWS 계정 및 Bedrock 접근 권한 필요
2. AWS CLI 설정:

```bash
aws configure
# AWS Access Key ID, Secret Access Key, Region 입력
```

3. 환경 변수 설정 (선택):

```bash
export AWS_REGION="us-east-1"
export BEDROCK_MODEL_ID="amazon.nova-lite-v1:0"
```

### Python 패키지

```bash
# 가상 환경 생성 (권장)
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows

# 패키지 설치
pip install python-dotenv google-generativeai boto3
```

### 코드 에디터

다음 중 하나를 설치하세요:

- **Cursor** (권장): [cursor.sh](https://cursor.sh)
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com)

---

## Day 2 준비

### Semgrep

```bash
# pip으로 설치
pip install semgrep

# 또는 Homebrew (Mac)
brew install semgrep

# 설치 확인
semgrep --version
```

### pytest

```bash
pip install pytest pytest-cov
```

### FastAPI (스타터앱용)

```bash
pip install fastapi uvicorn sqlalchemy
```

---

## Day 3 준비

Day 1, 2 설정이 완료되면 추가 설정 불필요

---

## 전체 설치 스크립트

아래 스크립트로 한 번에 설치할 수 있습니다:

### Mac/Linux

```bash
#!/bin/bash

# Python 가상 환경
python3 -m venv venv
source venv/bin/activate

# Python 패키지
pip install --upgrade pip
pip install python-dotenv google-generativeai boto3
pip install semgrep pytest pytest-cov
pip install fastapi uvicorn sqlalchemy

echo "설치 완료!"
echo "GEMINI_API_KEY 또는 AWS 자격증명을 설정하세요."
```

### 설치 확인

```bash
# Python
python3 --version

# 패키지
pip list | grep -E "google-generativeai|boto3|semgrep|pytest|fastapi"

# AWS (Bedrock 사용 시)
aws sts get-caller-identity

# Git
git --version
```

---

## 트러블슈팅

### "command not found: python3"

Python 경로를 확인하세요:

```bash
# Python 위치 확인
which python3

# 없다면 설치
brew install python@3.11  # Mac
```

### "ModuleNotFoundError"

가상 환경이 활성화되어 있는지 확인:

```bash
# 가상 환경 활성화
source venv/bin/activate

# 패키지 재설치
pip install -r requirements.txt
```

### Gemini API 오류

```bash
# API 키 확인
echo $GEMINI_API_KEY

# 테스트 호출
python3 -c "
import google.generativeai as genai
import os
genai.configure(api_key=os.environ['GEMINI_API_KEY'])
model = genai.GenerativeModel('gemini-1.5-flash')
print(model.generate_content('Hello').text)
"
```

### Bedrock 연결 오류

```bash
# AWS 자격증명 확인
aws sts get-caller-identity

# Bedrock 모델 접근 확인
aws bedrock list-foundation-models --query "modelSummaries[?contains(modelId, 'nova')]"
```

### Semgrep 실행 오류

```bash
# 최신 버전으로 업데이트
pip install --upgrade semgrep

# 캐시 정리
semgrep --clear-cache
```

---

## 권장 VS Code 확장

- Python (Microsoft)
- Pylance
- GitLens
- Semgrep

---

## 확인 체크리스트

워크샵 시작 전 아래 항목을 모두 확인하세요:

- [ ] Python 3.11+ 설치됨
- [ ] Git 설치됨
- [ ] AI API 설정 완료 (아래 중 택1)
  - [ ] Gemini API 키 설정됨
  - [ ] AWS 자격증명 및 Bedrock 접근 권한
- [ ] 필요한 Python 패키지 설치됨
- [ ] 코드 에디터 (Cursor 또는 VS Code) 설치됨
- [ ] Semgrep 설치됨
- [ ] 인터넷 연결 확인

---

## 지원

환경 설정에 문제가 있으면:
1. 이 문서의 트러블슈팅 섹션 확인
2. 워크샵 Slack/Discord 채널에 질문
3. 워크샵 당일 조기 도착하여 지원 요청
