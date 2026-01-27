# 테스트 작성 가이드 (pytest)

## 개요

pytest를 사용하여 Python 코드의 단위 테스트를 작성하는 방법을 배웁니다.

---

## 학습 목표

- pytest의 기본 사용법을 익힌다
- 효과적인 단위 테스트를 작성할 수 있다
- 테스트 커버리지를 측정할 수 있다
- AI를 활용하여 테스트를 생성할 수 있다

---

## 1. pytest 기초

### 설치

```bash
pip install pytest pytest-cov
```

### 기본 구조

```python
# test_calculator.py

def test_addition():
    """덧셈 테스트"""
    assert 1 + 1 == 2

def test_subtraction():
    """뺄셈 테스트"""
    assert 5 - 3 == 2
```

### 테스트 실행

```bash
# 모든 테스트 실행
pytest

# 특정 파일 실행
pytest test_calculator.py

# 특정 함수 실행
pytest test_calculator.py::test_addition

# 상세 출력
pytest -v

# 실패 시 바로 중단
pytest -x
```

---

## 2. 테스트 작성 패턴

### AAA 패턴 (Arrange-Act-Assert)

```python
def test_user_creation():
    # Arrange (준비)
    name = "홍길동"
    email = "hong@example.com"

    # Act (실행)
    user = create_user(name, email)

    # Assert (검증)
    assert user.name == name
    assert user.email == email
```

### 예외 테스트

```python
import pytest

def test_division_by_zero():
    """0으로 나누면 예외 발생"""
    with pytest.raises(ZeroDivisionError):
        result = 10 / 0

def test_invalid_email():
    """잘못된 이메일 형식이면 ValueError 발생"""
    with pytest.raises(ValueError) as exc_info:
        validate_email("invalid-email")
    assert "유효하지 않은 이메일" in str(exc_info.value)
```

### 파라미터화된 테스트

```python
import pytest

@pytest.mark.parametrize("input,expected", [
    (1, 1),
    (2, 4),
    (3, 9),
    (4, 16),
])
def test_square(input, expected):
    """제곱 함수 테스트"""
    assert square(input) == expected

@pytest.mark.parametrize("email,is_valid", [
    ("user@example.com", True),
    ("invalid", False),
    ("user@", False),
    ("@domain.com", False),
])
def test_email_validation(email, is_valid):
    """이메일 검증 테스트"""
    assert validate_email(email) == is_valid
```

---

## 3. Fixture 사용

### 기본 Fixture

```python
import pytest

@pytest.fixture
def sample_user():
    """테스트용 사용자 객체"""
    return User(name="테스트", email="test@example.com")

def test_user_name(sample_user):
    assert sample_user.name == "테스트"

def test_user_email(sample_user):
    assert sample_user.email == "test@example.com"
```

### Fixture 범위

```python
@pytest.fixture(scope="function")  # 각 테스트마다 (기본값)
@pytest.fixture(scope="class")     # 클래스당 한 번
@pytest.fixture(scope="module")    # 모듈당 한 번
@pytest.fixture(scope="session")   # 세션당 한 번
```

### 데이터베이스 Fixture 예시

```python
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db_session():
    """테스트용 데이터베이스 세션"""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()

    yield session  # 테스트에 세션 제공

    session.close()  # 테스트 후 정리
    Base.metadata.drop_all(engine)

def test_create_user(db_session):
    user = User(name="테스트")
    db_session.add(user)
    db_session.commit()

    result = db_session.query(User).first()
    assert result.name == "테스트"
```

---

## 4. API 테스트 (FastAPI)

### TestClient 사용

```python
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200

def test_create_note():
    response = client.post(
        "/notes/",
        json={"title": "테스트", "content": "내용"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "테스트"

def test_get_notes():
    response = client.get("/notes/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
```

### 인증이 필요한 API

```python
@pytest.fixture
def auth_headers():
    """인증 헤더"""
    response = client.post(
        "/auth/login",
        json={"email": "test@example.com", "password": "test123"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_protected_endpoint(auth_headers):
    response = client.get("/protected", headers=auth_headers)
    assert response.status_code == 200
```

---

## 5. 테스트 커버리지

### 커버리지 측정

```bash
# 커버리지 리포트 생성
pytest --cov=app tests/

# HTML 리포트 생성
pytest --cov=app --cov-report=html tests/

# 커버리지 미달 시 실패
pytest --cov=app --cov-fail-under=80 tests/
```

### 커버리지 리포트 예시

```
---------- coverage: platform darwin, python 3.11 -----------
Name                      Stmts   Miss  Cover
---------------------------------------------
app/__init__.py               0      0   100%
app/main.py                  45     10    78%
app/models.py                30      5    83%
app/routers/notes.py         25      3    88%
---------------------------------------------
TOTAL                       100     18    82%
```

---

## 6. AI를 활용한 테스트 생성

### 프롬프트 예시

```
다음 함수에 대한 pytest 테스트를 작성해줘:

```python
def calculate_discount(price: float, discount_percent: float) -> float:
    if discount_percent < 0 or discount_percent > 100:
        raise ValueError("할인율은 0-100 사이여야 합니다")
    return price * (1 - discount_percent / 100)
```

테스트 케이스:
1. 정상 케이스 (여러 할인율)
2. 경계값 (0%, 100%)
3. 예외 케이스 (음수, 100 초과)
```

### AI 생성 테스트 검토 포인트

- [ ] 모든 분기가 테스트되는가?
- [ ] 경계값이 테스트되는가?
- [ ] 예외 케이스가 테스트되는가?
- [ ] 테스트 이름이 명확한가?
- [ ] 불필요한 테스트가 없는가?

---

## 7. 좋은 테스트의 특징

### FIRST 원칙

| 원칙 | 설명 |
|------|------|
| **F**ast | 빠르게 실행되어야 함 |
| **I**ndependent | 테스트 간 독립적 |
| **R**epeatable | 동일한 결과 반복 |
| **S**elf-validating | 자동으로 성공/실패 판단 |
| **T**imely | 코드와 함께 작성 |

### 테스트 명명 규칙

```python
# 좋은 예: 테스트 대상_조건_기대결과
def test_calculate_discount_with_50_percent_returns_half_price():
    assert calculate_discount(100, 50) == 50

def test_calculate_discount_with_negative_percent_raises_error():
    with pytest.raises(ValueError):
        calculate_discount(100, -10)

# 나쁜 예
def test_1():
    ...

def test_function():
    ...
```

---

## 8. 실습

### 실습 코드

다음 함수에 대한 테스트를 작성하세요:

```python
# utils.py
def validate_password(password: str) -> bool:
    """
    비밀번호 유효성 검사
    - 최소 8자
    - 대문자 포함
    - 소문자 포함
    - 숫자 포함
    """
    if len(password) < 8:
        return False
    if not any(c.isupper() for c in password):
        return False
    if not any(c.islower() for c in password):
        return False
    if not any(c.isdigit() for c in password):
        return False
    return True
```

### 요구사항

1. 최소 5개의 테스트 케이스 작성
2. 경계값 테스트 포함
3. 파라미터화된 테스트 사용

---

## 자가 점검

- [ ] pytest 기본 사용법을 알고 있다
- [ ] AAA 패턴으로 테스트를 작성할 수 있다
- [ ] Fixture를 사용할 수 있다
- [ ] 예외 테스트를 작성할 수 있다
- [ ] 커버리지를 측정할 수 있다
- [ ] AI를 활용하여 테스트를 생성할 수 있다

---

## 참고 자료

- [pytest 공식 문서](https://docs.pytest.org/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
- [pytest-cov](https://pytest-cov.readthedocs.io/)
