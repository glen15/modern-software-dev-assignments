# Semgrep 실습 과제

## 환경 확인

```bash
# Semgrep 설치 확인
semgrep --version

# 실습 디렉토리로 이동
cd day2/02-semgrep-scan
```

---

## 실습 1: 보안 스캔 실행

### 목표
Semgrep으로 코드를 스캔하여 취약점을 찾습니다.

### 단계

1. 기본 보안 규칙으로 스캔:
   ```bash
   semgrep --config auto .
   ```

2. Python 전용 규칙으로 스캔:
   ```bash
   semgrep --config p/python backend/
   ```

3. JavaScript 전용 규칙으로 스캔:
   ```bash
   semgrep --config p/javascript frontend/
   ```

### 결과 기록

발견된 취약점을 아래 표에 기록하세요:

| 파일 | 라인 | 취약점 유형 | 심각도 |
|------|------|------------|--------|
| | | | |
| | | | |
| | | | |

---

## 실습 2: CORS 취약점 수정

### 목표
`backend/app/main.py`의 CORS 설정을 안전하게 수정합니다.

### 현재 코드 (취약)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 과제

1. 위 코드를 찾아서 다음과 같이 수정하세요:
   - `allow_origins`를 환경 변수에서 읽도록 변경
   - `allow_methods`를 필요한 것만 명시
   - `allow_headers`를 필요한 것만 명시

2. 파일 상단에 import 추가:
   ```python
   import os
   ```

### 수정 예시

```python
ALLOWED_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:8000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)
```

### 검증

```bash
# 수정 후 다시 스캔
semgrep --config p/python backend/

# CORS 관련 경고가 사라졌는지 확인
```

---

## 실습 3: XSS 취약점 수정

### 목표
`frontend/app.js`의 XSS 취약점을 수정합니다.

### 현재 코드 (취약)

```javascript
// loadNotes 함수 내
li.innerHTML = `<strong>${n.title}</strong>: ${n.content}`;

// loadActions 함수 내
li.textContent = `${a.description} [${a.completed ? 'done' : 'open'}]`;
```

### 과제

1. `innerHTML` 대신 DOM API를 사용하도록 수정
2. 사용자 입력은 항상 `textContent`로 처리

### 수정 예시

```javascript
// loadNotes 함수 수정
const strong = document.createElement('strong');
strong.textContent = n.title;
li.appendChild(strong);
li.appendChild(document.createTextNode(': ' + n.content));
```

### 검증

```bash
# 수정 후 스캔
semgrep --config p/javascript frontend/

# innerHTML 관련 경고가 사라졌는지 확인
```

---

## 실습 4: 사용자 정의 규칙

### 목표
프로젝트에 맞는 사용자 정의 Semgrep 규칙을 작성합니다.

### 단계

1. `my_rules.yaml` 파일 생성:

```yaml
rules:
  - id: no-print-statements
    pattern: print(...)
    message: "프로덕션 코드에 print문이 있습니다. 로깅을 사용하세요."
    severity: WARNING
    languages:
      - python

  - id: no-console-log
    pattern: console.log(...)
    message: "프로덕션 코드에 console.log가 있습니다."
    severity: WARNING
    languages:
      - javascript

  - id: sql-string-concat
    pattern: |
      $QUERY = "..." + $VAR + "..."
    message: "SQL 쿼리에 문자열 연결이 사용되었습니다. 파라미터화된 쿼리를 사용하세요."
    severity: ERROR
    languages:
      - python
```

2. 사용자 정의 규칙 실행:
   ```bash
   semgrep --config my_rules.yaml .
   ```

### 도전 과제

다음 패턴을 탐지하는 규칙을 추가로 작성해보세요:
- [ ] 하드코딩된 API 키 (`api_key = "..."`)
- [ ] `exec()` 함수 사용
- [ ] `setTimeout`에 문자열 전달

---

## 실습 5: 종합 스캔 리포트

### 목표
모든 수정을 완료하고 최종 스캔 리포트를 생성합니다.

### 단계

1. 모든 취약점 수정 완료

2. JSON 형식으로 리포트 생성:
   ```bash
   semgrep --config auto --json -o report.json .
   ```

3. 리포트 확인:
   ```bash
   cat report.json | python -m json.tool
   ```

### 기대 결과

```json
{
  "results": [],
  "errors": [],
  "version": "...",
  "stats": {
    "files": {...},
    "rules": {...}
  }
}
```

`results`가 비어있으면 모든 취약점이 수정된 것입니다.

---

## 체크리스트

- [ ] Semgrep으로 초기 스캔 완료
- [ ] 발견된 취약점 목록 작성
- [ ] CORS 취약점 수정 완료
- [ ] XSS 취약점 수정 완료
- [ ] 사용자 정의 규칙 작성
- [ ] 최종 스캔에서 0 findings 확인

---

## 트러블슈팅

### "No findings" 메시지가 나오지 않는 경우

1. 규칙 이름 확인:
   ```bash
   semgrep --config auto --verbose .
   ```

2. 특정 규칙만 실행:
   ```bash
   semgrep --config p/owasp-top-ten .
   ```

### 수정이 올바른지 확인하는 방법

1. 서버 실행해서 기능 테스트:
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. 프론트엔드 테스트:
   ```
   브라우저에서 http://localhost:8000 접속
   노트 추가 기능이 정상 작동하는지 확인
   ```

---

## 다음 세션

**코드 리뷰**로 넘어갑니다.
Semgrep이 놓친 문제를 수동 리뷰로 찾아봅니다.
