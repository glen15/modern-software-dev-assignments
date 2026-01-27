# 보안 기초: OWASP Top 10

## 왜 보안이 중요한가?

---

## 1. 실제 보안 사고 사례

### Equifax 데이터 유출 (2017)

- **피해**: 1억 4,700만 명 개인정보 유출
- **원인**: Apache Struts 취약점 미패치
- **비용**: 약 14억 달러

### Log4Shell (2021)

- **영향**: 전 세계 수백만 서버
- **원인**: Log4j 원격 코드 실행 취약점
- **교훈**: 의존성 관리의 중요성

### SolarWinds 해킹 (2020)

- **피해**: 미국 정부기관 포함 수천 개 조직
- **원인**: 빌드 시스템 침투, 악성 코드 배포
- **교훈**: 공급망 보안의 중요성

---

## 2. OWASP Top 10 (2021)

웹 애플리케이션의 가장 심각한 10가지 보안 위험

```
A01: 접근 통제 취약점 (Broken Access Control)
A02: 암호화 실패 (Cryptographic Failures)
A03: 인젝션 (Injection)
A04: 불안전한 설계 (Insecure Design)
A05: 보안 설정 오류 (Security Misconfiguration)
A06: 취약하고 오래된 구성 요소 (Vulnerable Components)
A07: 식별 및 인증 실패 (Authentication Failures)
A08: 소프트웨어 무결성 실패 (Software Integrity Failures)
A09: 보안 로깅 및 모니터링 실패 (Logging Failures)
A10: 서버 측 요청 위조 (SSRF)
```

---

## 3. 주요 취약점 상세

### A01: 접근 통제 취약점

**문제**: 권한 없는 사용자가 자원에 접근

```python
# 취약한 코드
@app.get("/users/{user_id}")
def get_user(user_id: int):
    return db.get_user(user_id)  # 누구나 모든 사용자 정보 조회 가능

# 안전한 코드
@app.get("/users/{user_id}")
def get_user(user_id: int, current_user: User = Depends(get_current_user)):
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(403, "Forbidden")
    return db.get_user(user_id)
```

### A03: 인젝션

**문제**: 사용자 입력이 코드/쿼리에 그대로 삽입

```python
# SQL 인젝션 (취약)
query = f"SELECT * FROM users WHERE name = '{user_input}'"
# 입력: ' OR '1'='1  →  모든 사용자 조회됨

# 안전한 코드 (파라미터화된 쿼리)
query = "SELECT * FROM users WHERE name = :name"
result = db.execute(query, {"name": user_input})
```

```javascript
// XSS (취약)
element.innerHTML = userInput;
// 입력: <script>alert('XSS')</script>

// 안전한 코드
element.textContent = userInput;
```

### A05: 보안 설정 오류

```python
# 취약: 과도하게 허용된 CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용 - 위험!
    allow_credentials=True,
)

# 안전: 특정 출처만 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://myapp.com"],
    allow_credentials=True,
)
```

---

## 4. 프론트엔드 보안 취약점

### XSS (Cross-Site Scripting)

사용자 입력이 HTML/JavaScript로 실행되는 취약점

**유형**:
- Stored XSS: 서버에 저장된 악성 스크립트
- Reflected XSS: URL 파라미터에 포함된 스크립트
- DOM XSS: 클라이언트 측 JavaScript에서 발생

```javascript
// 취약한 코드
li.innerHTML = `<strong>${note.title}</strong>: ${note.content}`;
// title이 "<img src=x onerror=alert('XSS')>" 라면?

// 안전한 코드
const strong = document.createElement('strong');
strong.textContent = note.title;
li.appendChild(strong);
li.appendChild(document.createTextNode(': ' + note.content));
```

### CSRF (Cross-Site Request Forgery)

사용자가 의도하지 않은 요청을 보내게 하는 공격

```html
<!-- 악성 사이트에 숨겨진 폼 -->
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="1000000" />
</form>
<script>document.forms[0].submit()</script>
```

**방어**:
- CSRF 토큰 사용
- SameSite 쿠키 속성
- Origin 헤더 검증

---

## 5. 백엔드 보안 취약점

### 경로 탐색 (Path Traversal)

```python
# 취약한 코드
@app.get("/files/{filename}")
def get_file(filename: str):
    return FileResponse(f"uploads/{filename}")
# 입력: ../../../etc/passwd → 서버 파일 유출

# 안전한 코드
@app.get("/files/{filename}")
def get_file(filename: str):
    safe_path = Path("uploads") / Path(filename).name
    if not safe_path.is_relative_to(Path("uploads")):
        raise HTTPException(400, "Invalid filename")
    return FileResponse(safe_path)
```

### 명령어 인젝션

```python
# 취약한 코드
import os
os.system(f"convert {user_filename} output.pdf")
# 입력: "; rm -rf /" → 서버 파일 삭제

# 안전한 코드
import subprocess
subprocess.run(["convert", user_filename, "output.pdf"], check=True)
```

---

## 6. 보안 원칙

### 심층 방어 (Defense in Depth)

여러 계층의 보안을 적용

```
┌─────────────────────────────────┐
│ 방화벽 / WAF                     │
├─────────────────────────────────┤
│ 인증 / 인가                      │
├─────────────────────────────────┤
│ 입력 검증                        │
├─────────────────────────────────┤
│ 파라미터화된 쿼리                 │
├─────────────────────────────────┤
│ 암호화 (전송 중 / 저장 시)        │
└─────────────────────────────────┘
```

### 최소 권한 원칙

- 필요한 최소한의 권한만 부여
- 기본값은 "거부"
- 정기적인 권한 검토

### 안전한 기본값

```python
# 안전한 기본값 예시
DEBUG = os.getenv("DEBUG", "false").lower() == "true"  # 기본: 비활성화
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "").split(",")  # 기본: 없음
```

---

## 7. 보안 도구 소개

### 정적 분석 도구 (SAST)

- **Semgrep**: 패턴 기반 코드 분석 (오늘 실습)
- **Bandit**: Python 보안 분석
- **ESLint Security Plugin**: JavaScript 보안 분석

### 동적 분석 도구 (DAST)

- **OWASP ZAP**: 웹 취약점 스캐너
- **Burp Suite**: 웹 보안 테스트 도구

### 의존성 검사

- **Dependabot**: GitHub 의존성 업데이트
- **Snyk**: 의존성 취약점 검사
- **pip-audit**: Python 의존성 검사

---

## 8. 개발자가 지켜야 할 보안 수칙

### 코드 작성 시

- [ ] 사용자 입력은 항상 검증/이스케이프
- [ ] 파라미터화된 쿼리 사용
- [ ] 비밀번호는 해시하여 저장 (bcrypt, argon2)
- [ ] 민감 정보는 환경 변수로 관리

### 설정 시

- [ ] 디버그 모드는 프로덕션에서 비활성화
- [ ] HTTPS 필수 적용
- [ ] CORS는 필요한 출처만 허용
- [ ] 보안 헤더 설정 (CSP, X-Frame-Options 등)

### 운영 시

- [ ] 의존성 정기 업데이트
- [ ] 보안 로그 모니터링
- [ ] 정기적인 보안 점검

---

## 다음 세션

**Semgrep 보안 스캔**으로 넘어갑니다.

실제로 취약한 코드를 스캔하고 수정하는 실습을 진행합니다.
