# Day 2 입문자 과제

## 개요

오늘 배운 보안 스캔, 코드 리뷰, 테스트 작성을 실습합니다.

**예상 소요 시간**: 30-45분
**난이도**: ★☆☆ (입문)

---

## 과제: 취약점 수정 및 테스트

### 목표

주어진 취약한 코드를 수정하고 테스트를 작성합니다.

---

## Part 1: 취약점 찾기

### 대상 코드

```python
# vulnerable.py
def greet_user(name):
    return f"<h1>안녕하세요, {name}님!</h1>"

def search_user(user_input):
    query = f"SELECT * FROM users WHERE name = '{user_input}'"
    return query

def read_file(filename):
    with open(f"data/{filename}") as f:
        return f.read()
```

### 과제

위 코드에서 보안 취약점을 찾아 아래 표를 채우세요:

| 함수 | 취약점 유형 | 위험 설명 |
|------|------------|----------|
| greet_user | | |
| search_user | | |
| read_file | | |

### 힌트

- XSS (Cross-Site Scripting)
- SQL Injection
- Path Traversal

---

## Part 2: 취약점 수정

### 과제

각 함수를 안전하게 수정하세요.

### greet_user 수정

```python
# 수정 전
def greet_user(name):
    return f"<h1>안녕하세요, {name}님!</h1>"

# 수정 후 (여기에 작성)
def greet_user(name):
    # HTML 이스케이프 적용
    pass
```

### search_user 수정

```python
# 수정 전
def search_user(user_input):
    query = f"SELECT * FROM users WHERE name = '{user_input}'"
    return query

# 수정 후 (여기에 작성)
def search_user(user_input):
    # 파라미터화된 쿼리 사용
    pass
```

### read_file 수정

```python
# 수정 전
def read_file(filename):
    with open(f"data/{filename}") as f:
        return f.read()

# 수정 후 (여기에 작성)
def read_file(filename):
    # 경로 검증 추가
    pass
```

---

## Part 3: 테스트 작성

### 과제

수정한 함수에 대한 테스트를 작성하세요.

### 테스트 템플릿

```python
# test_secure.py
import pytest

def test_greet_user_escapes_html():
    """HTML 특수문자가 이스케이프되는지 확인"""
    # name에 <script> 태그를 넣어도 안전한지 테스트
    pass

def test_search_user_prevents_injection():
    """SQL 인젝션이 방지되는지 확인"""
    # user_input에 ' OR 1=1 -- 를 넣어도 안전한지 테스트
    pass

def test_read_file_prevents_traversal():
    """경로 탐색이 방지되는지 확인"""
    # filename에 ../../../etc/passwd를 넣으면 예외 발생하는지 테스트
    pass
```

### 요구사항

- 각 함수에 대해 최소 2개의 테스트
- 정상 케이스 1개 + 공격 시도 케이스 1개

---

## Part 4: Semgrep 검증

### 과제

수정한 코드를 Semgrep으로 스캔하세요.

```bash
# 스캔 실행
semgrep --config auto vulnerable.py

# 기대 결과: 0 findings
```

---

## 제출물

1. `secure.py` - 수정된 코드
2. `test_secure.py` - 테스트 코드
3. 스캔 결과 스크린샷

---

## 힌트: 수정 방법

### HTML 이스케이프

```python
from html import escape

def greet_user(name):
    safe_name = escape(name)
    return f"<h1>안녕하세요, {safe_name}님!</h1>"
```

### 파라미터화된 쿼리

```python
def search_user(user_input):
    # 실제로는 DB 라이브러리 사용
    # 여기서는 튜플로 쿼리와 파라미터 반환
    query = "SELECT * FROM users WHERE name = ?"
    params = (user_input,)
    return query, params
```

### 경로 검증

```python
from pathlib import Path

def read_file(filename):
    base_dir = Path("data").resolve()
    file_path = (base_dir / filename).resolve()

    # 기본 디렉토리 벗어나는지 확인
    if not str(file_path).startswith(str(base_dir)):
        raise ValueError("잘못된 파일 경로")

    with open(file_path) as f:
        return f.read()
```

---

## 평가 기준

| 항목 | 배점 |
|------|------|
| 취약점 식별 | 20% |
| 취약점 수정 | 40% |
| 테스트 작성 | 30% |
| Semgrep 검증 | 10% |

---

## 도움이 필요하면

- 강사에게 질문하세요
- 체크리스트(day2/03-code-review/review-checklist.md)를 참고하세요
- AI에게 "이 코드의 보안 문제점을 알려줘"라고 물어보세요
