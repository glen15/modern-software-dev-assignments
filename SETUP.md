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

### Ollama (로컬 LLM)

```bash
# Mac
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# ollama.com에서 다운로드
```

#### 모델 다운로드

```bash
# Ollama 서버 시작 (백그라운드)
ollama serve &

# 필요한 모델 다운로드
ollama pull llama3.1:8b
ollama pull mistral-nemo:12b

# 모델 확인
ollama list
```

### Python 패키지

```bash
# 가상 환경 생성 (권장)
python3 -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows

# 패키지 설치
pip install ollama python-dotenv
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
pip install ollama python-dotenv
pip install semgrep pytest pytest-cov
pip install fastapi uvicorn sqlalchemy

# Ollama 모델 (Ollama가 설치되어 있어야 함)
ollama pull llama3.1:8b
ollama pull mistral-nemo:12b

echo "설치 완료!"
```

### 설치 확인

```bash
# Python
python3 --version

# 패키지
pip list | grep -E "ollama|semgrep|pytest|fastapi"

# Ollama
ollama list

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

### Ollama 연결 오류

```bash
# Ollama 서버 상태 확인
curl http://localhost:11434/api/tags

# 서버가 실행 중이 아니면
ollama serve
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
- [ ] Ollama 설치 및 모델 다운로드 완료
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
