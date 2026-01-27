# Semgrep 치트시트

## 기본 명령어

### 설치

```bash
pip install semgrep
# 또는
brew install semgrep
```

### 기본 스캔

```bash
# 자동 규칙으로 스캔
semgrep --config auto .

# 특정 디렉토리만
semgrep --config auto src/

# 특정 파일만
semgrep --config auto app.py
```

---

## 규칙 세트

### 언어별 규칙

```bash
# Python
semgrep --config p/python .

# JavaScript/TypeScript
semgrep --config p/javascript .
semgrep --config p/typescript .

# Go
semgrep --config p/golang .

# Java
semgrep --config p/java .
```

### 보안 규칙

```bash
# OWASP Top 10
semgrep --config p/owasp-top-ten .

# 보안 감사
semgrep --config p/security-audit .

# 비밀 정보 탐지
semgrep --config p/secrets .
```

### 다중 규칙

```bash
semgrep --config p/python --config p/security-audit .
```

---

## 출력 옵션

### 형식

```bash
# 기본 (텍스트)
semgrep --config auto .

# JSON
semgrep --config auto --json .

# SARIF (GitHub Actions 연동)
semgrep --config auto --sarif .

# JSON 파일로 저장
semgrep --config auto --json -o results.json .
```

### 상세 출력

```bash
# 상세 모드
semgrep --config auto --verbose .

# 디버그 모드
semgrep --config auto --debug .

# 조용한 모드 (에러만)
semgrep --config auto --quiet .
```

---

## 필터링

### 심각도 필터

```bash
# ERROR만
semgrep --config auto --severity ERROR .

# WARNING 이상
semgrep --config auto --severity WARNING --severity ERROR .
```

### 파일 제외

```bash
# 특정 경로 제외
semgrep --config auto --exclude tests/ .

# 여러 경로 제외
semgrep --config auto --exclude tests/ --exclude docs/ .

# 패턴으로 제외
semgrep --config auto --exclude "*.test.py" .
```

### 파일 포함

```bash
# 특정 확장자만
semgrep --config auto --include "*.py" .
```

---

## 사용자 정의 규칙

### 규칙 파일 구조

```yaml
# my_rules.yaml
rules:
  - id: my-rule-id
    pattern: print(...)
    message: "print문 사용 금지"
    severity: WARNING
    languages:
      - python
```

### 실행

```bash
semgrep --config my_rules.yaml .
```

### 패턴 문법

```yaml
# 함수 호출
pattern: print(...)

# 변수 캡처
pattern: $VAR = "..."

# 메타변수
pattern: $FUNC($ARG)

# 문자열 연결
pattern: $X + $Y

# 특정 값
pattern: DEBUG = True
```

### 고급 패턴

```yaml
# pattern-either (OR)
rules:
  - id: dangerous-functions
    pattern-either:
      - pattern: eval(...)
      - pattern: exec(...)
    message: "위험한 함수 사용"
    severity: ERROR
    languages: [python]

# pattern-inside (컨텍스트)
rules:
  - id: sql-in-route
    pattern: cursor.execute($QUERY)
    pattern-inside: |
      @app.route(...)
      def $FUNC(...):
        ...
    message: "라우트에서 직접 SQL 실행"
    severity: WARNING
    languages: [python]

# pattern-not (제외)
rules:
  - id: hardcoded-password
    pattern: password = "..."
    pattern-not: password = ""
    message: "하드코딩된 비밀번호"
    severity: ERROR
    languages: [python]
```

---

## CI/CD 통합

### GitHub Actions

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
            p/security-audit
```

### Pre-commit Hook

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/returntocorp/semgrep
    rev: v1.0.0
    hooks:
      - id: semgrep
        args: ['--config', 'auto', '--error']
```

---

## 흔한 취약점 탐지

### SQL 인젝션

```yaml
rules:
  - id: sql-injection
    pattern-either:
      - pattern: cursor.execute(f"...")
      - pattern: cursor.execute("..." + $VAR + "...")
    message: "SQL 인젝션 취약점"
    severity: ERROR
    languages: [python]
```

### XSS

```yaml
rules:
  - id: xss-innerHTML
    pattern: $EL.innerHTML = $X
    message: "XSS 취약점 (innerHTML)"
    severity: ERROR
    languages: [javascript]
```

### 하드코딩된 비밀

```yaml
rules:
  - id: hardcoded-secret
    pattern-either:
      - pattern: api_key = "..."
      - pattern: password = "..."
      - pattern: secret = "..."
    message: "하드코딩된 비밀 정보"
    severity: ERROR
    languages: [python]
```

---

## 빠른 참조

| 명령 | 설명 |
|------|------|
| `semgrep --config auto .` | 자동 스캔 |
| `semgrep --config p/python .` | Python 규칙 |
| `semgrep --config p/owasp-top-ten .` | OWASP Top 10 |
| `semgrep --json -o report.json .` | JSON 출력 |
| `semgrep --exclude tests/ .` | 디렉토리 제외 |
| `semgrep --severity ERROR .` | 심각도 필터 |

---

## 자주 사용하는 규칙 ID

| 규칙 ID | 설명 |
|---------|------|
| `python.lang.security.audit.exec-used` | exec() 사용 |
| `python.lang.security.audit.eval-used` | eval() 사용 |
| `python.flask.security.injection.sql-injection` | SQL 인젝션 |
| `javascript.browser.security.audit.innerHTML` | innerHTML XSS |
| `generic.secrets.security.detected-generic-api-key` | API 키 노출 |

---

## 문제 해결

### "No findings"인데 취약점이 있는 경우

```bash
# 규칙 확인
semgrep --config auto --verbose .

# 다른 규칙 세트 시도
semgrep --config p/security-audit .
```

### 너무 많은 경고

```bash
# .semgrepignore 파일 생성
echo "tests/" > .semgrepignore
echo "*.test.py" >> .semgrepignore
```

### 규칙 테스트

```bash
# 단일 규칙 테스트
semgrep --config my_rule.yaml test_file.py --verbose
```
