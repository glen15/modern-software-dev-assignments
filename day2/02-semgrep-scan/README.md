# Semgrep 보안 스캔 실습

## 개요

Semgrep을 사용하여 코드의 보안 취약점을 자동으로 탐지하고 수정하는 방법을 배웁니다.

---

## 학습 목표

- Semgrep의 기본 사용법을 익힌다
- 보안 취약점을 자동으로 탐지할 수 있다
- 탐지된 취약점을 안전하게 수정할 수 있다

---

## Semgrep 소개

Semgrep은 패턴 기반의 정적 분석 도구입니다.

**특징**:
- 빠른 스캔 속도
- 다양한 언어 지원 (Python, JavaScript, Go, Java 등)
- 사용자 정의 규칙 작성 가능
- CI/CD 통합 용이

---

## 설치

```bash
# pip으로 설치
pip install semgrep

# Homebrew로 설치 (Mac)
brew install semgrep

# 설치 확인
semgrep --version
```

---

## 실습 파일 구조

```
02-semgrep-scan/
├── backend/
│   └── app/
│       ├── main.py      # CORS 취약점
│       ├── routers/
│       │   ├── notes.py
│       │   └── action_items.py
│       └── ...
├── frontend/
│   └── app.js           # XSS 취약점
├── Makefile
└── requirements.txt
```

---

## 실습 1: 기본 스캔

### 1단계: 전체 스캔

```bash
cd day2/02-semgrep-scan

# 기본 보안 규칙으로 스캔
semgrep --config auto .

# 또는 특정 규칙 세트 사용
semgrep --config p/python .
semgrep --config p/javascript .
```

### 2단계: 결과 분석

```
┌─────────────────────────────────────────────────────────────────┐
│ Findings                                                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│   backend/app/main.py                                           │
│   ❯❯❱ python.lang.security.audit.cors-misconfiguration          │
│      CORS configuration allows all origins                       │
│      22│  allow_origins=["*"],                                   │
│                                                                  │
│   frontend/app.js                                                │
│   ❯❯❱ javascript.browser.security.audit.innerHTML              │
│      Potential XSS vulnerability using innerHTML                 │
│      14│  li.innerHTML = `<strong>${n.title}</strong>`;         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 실습 2: 취약점 분석

### 취약점 1: CORS Misconfiguration

**파일**: `backend/app/main.py`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],        # 모든 출처 허용 - 위험!
    allow_credentials=True,     # 인증 정보 포함 허용
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**위험**:
- 모든 도메인에서 API 호출 가능
- 인증 정보(쿠키, 세션)가 포함된 요청 허용
- CSRF 공격에 취약

### 취약점 2: XSS (Cross-Site Scripting)

**파일**: `frontend/app.js`

```javascript
li.innerHTML = `<strong>${n.title}</strong>: ${n.content}`;
```

**위험**:
- `n.title`이나 `n.content`에 악성 스크립트 포함 가능
- 예: `<img src=x onerror=alert('XSS')>`
- 사용자 세션 탈취, 피싱 공격 가능

---

## 실습 3: 취약점 수정

### 수정 1: CORS 설정

```python
# 수정 전 (취약)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 수정 후 (안전)
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,  # 특정 출처만 허용
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],  # 필요한 메서드만
    allow_headers=["Content-Type", "Authorization"],  # 필요한 헤더만
)
```

### 수정 2: XSS 방지

```javascript
// 수정 전 (취약)
li.innerHTML = `<strong>${n.title}</strong>: ${n.content}`;

// 수정 후 (안전) - DOM API 사용
const strong = document.createElement('strong');
strong.textContent = n.title;  // textContent는 HTML 해석 안함
li.appendChild(strong);
li.appendChild(document.createTextNode(': ' + n.content));
```

---

## 실습 4: 수정 후 재스캔

```bash
# 수정 후 다시 스캔
semgrep --config auto .

# 결과: 0 findings
```

---

## 추가 실습: 사용자 정의 규칙

### 규칙 파일 생성

`my_rules.yaml`:

```yaml
rules:
  - id: hardcoded-password
    pattern: password = "..."
    message: "하드코딩된 비밀번호가 감지되었습니다"
    severity: ERROR
    languages:
      - python

  - id: debug-mode-enabled
    pattern: DEBUG = True
    message: "디버그 모드가 활성화되어 있습니다"
    severity: WARNING
    languages:
      - python

  - id: unsafe-eval
    pattern: eval($X)
    message: "eval() 사용은 보안 위험이 있습니다"
    severity: ERROR
    languages:
      - python
      - javascript
```

### 사용자 정의 규칙 실행

```bash
semgrep --config my_rules.yaml .
```

---

## 팁: CI/CD 통합

### GitHub Actions 예시

```yaml
# .github/workflows/semgrep.yml
name: Semgrep

on: [push, pull_request]

jobs:
  semgrep:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/python
            p/javascript
            p/security-audit
```

---

## 자가 점검

- [ ] Semgrep을 설치하고 실행할 수 있다
- [ ] 스캔 결과를 해석할 수 있다
- [ ] CORS 취약점의 위험성을 설명할 수 있다
- [ ] XSS 취약점을 안전하게 수정할 수 있다
- [ ] 사용자 정의 규칙을 작성할 수 있다

---

## 참고 자료

- [Semgrep 공식 문서](https://semgrep.dev/docs/)
- [Semgrep 규칙 레지스트리](https://semgrep.dev/explore)
- [OWASP Cheat Sheet](https://cheatsheetseries.owasp.org/)
