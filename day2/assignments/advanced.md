# Day 2 심화 과제

## 개요

실제 프로젝트 수준의 보안 감사와 테스트를 수행합니다.

**예상 소요 시간**: 45-60분
**난이도**: ★★★ (심화)

---

## 과제: 종합 보안 감사 및 개선

### 목표

`day2/02-semgrep-scan` 프로젝트의 전체 보안 감사를 수행하고, 발견된 문제를 수정하며, 테스트로 검증합니다.

---

## Part 1: 종합 보안 스캔 (15분)

### 1단계: 다중 규칙 세트 스캔

```bash
cd day2/02-semgrep-scan

# OWASP Top 10 규칙
semgrep --config p/owasp-top-ten .

# Python 보안 규칙
semgrep --config p/python .

# JavaScript 보안 규칙
semgrep --config p/javascript .

# 결과를 JSON으로 저장
semgrep --config auto --json -o audit_report.json .
```

### 2단계: 결과 분석

발견된 모든 취약점을 아래 표에 정리하세요:

| # | 파일 | 라인 | 규칙 ID | 심각도 | 상태 |
|---|------|------|---------|--------|------|
| 1 | | | | | 미수정 |
| 2 | | | | | 미수정 |
| 3 | | | | | 미수정 |

### 3단계: 우선순위 결정

심각도와 악용 가능성을 기준으로 수정 우선순위를 결정하세요.

---

## Part 2: 취약점 수정 (20분)

### 수정해야 할 항목

1. **CORS 설정** (`backend/app/main.py`)
2. **XSS 취약점** (`frontend/app.js`)
3. **추가로 발견된 취약점**

### 수정 가이드

각 수정에 대해 다음을 기록하세요:

```markdown
### 취약점 #1: [취약점 이름]

**파일**: 경로:라인
**심각도**: HIGH/MEDIUM/LOW

**수정 전**:
```python
# 취약한 코드
```

**수정 후**:
```python
# 수정된 코드
```

**수정 이유**:
왜 이렇게 수정했는지 설명
```

---

## Part 3: 테스트 작성 (15분)

### 요구사항

1. 보안 수정 사항에 대한 테스트
2. API 엔드포인트 테스트
3. 최소 80% 커버리지

### 테스트 구조

```
tests/
├── test_security.py      # 보안 관련 테스트
├── test_notes_api.py     # Notes API 테스트
└── test_actions_api.py   # Action Items API 테스트
```

### test_security.py 예시

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestCORSSecurity:
    """CORS 보안 테스트"""

    def test_cors_rejects_unknown_origin(self):
        """허용되지 않은 출처는 거부되어야 함"""
        response = client.options(
            "/notes/",
            headers={"Origin": "https://evil.com"}
        )
        # CORS 헤더가 없거나 허용되지 않아야 함
        assert "Access-Control-Allow-Origin" not in response.headers or \
               response.headers.get("Access-Control-Allow-Origin") != "https://evil.com"

    def test_cors_allows_configured_origin(self):
        """설정된 출처는 허용되어야 함"""
        # 환경 변수로 설정된 출처 테스트
        pass

class TestXSS:
    """XSS 방지 테스트"""

    def test_note_title_is_escaped(self):
        """노트 제목의 HTML이 이스케이프되어야 함"""
        malicious_title = "<script>alert('XSS')</script>"
        response = client.post(
            "/notes/",
            json={"title": malicious_title, "content": "test"}
        )
        assert response.status_code == 200
        # 저장된 데이터 확인
        data = response.json()
        # 스크립트 태그가 그대로 저장되지 않아야 함
        # (프론트엔드에서 textContent 사용 확인)
```

### test_notes_api.py 예시

```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

class TestNotesAPI:
    """Notes API 테스트"""

    def test_create_note(self):
        """노트 생성 테스트"""
        response = client.post(
            "/notes/",
            json={"title": "테스트", "content": "내용"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "테스트"
        assert "id" in data

    def test_get_notes(self):
        """노트 목록 조회 테스트"""
        response = client.get("/notes/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_search_notes(self):
        """노트 검색 테스트"""
        # 먼저 노트 생성
        client.post("/notes/", json={"title": "검색테스트", "content": "내용"})

        # 검색
        response = client.get("/notes/?q=검색")
        assert response.status_code == 200
        results = response.json()
        assert any("검색" in note["title"] for note in results)

    def test_create_note_with_empty_title_fails(self):
        """빈 제목은 실패해야 함"""
        response = client.post(
            "/notes/",
            json={"title": "", "content": "내용"}
        )
        # 구현에 따라 400 또는 422
        assert response.status_code in [400, 422]
```

---

## Part 4: 커버리지 확인 (5분)

```bash
# 테스트 실행 및 커버리지 측정
pytest tests/ --cov=backend/app --cov-report=html

# 커버리지 리포트 확인
open htmlcov/index.html
```

### 목표 커버리지

- 전체: 80% 이상
- 보안 관련 코드: 100%

---

## Part 5: 보안 감사 보고서 작성 (5분)

### 보고서 템플릿

```markdown
# 보안 감사 보고서

## 1. 개요
- 감사 대상: day2/02-semgrep-scan
- 감사 일시: YYYY-MM-DD
- 감사자: 이름

## 2. 발견된 취약점 요약

| 심각도 | 개수 |
|--------|------|
| HIGH   |      |
| MEDIUM |      |
| LOW    |      |

## 3. 상세 내용

### 3.1 [취약점 이름] (HIGH)
- **위치**: 파일:라인
- **설명**: 취약점 설명
- **영향**: 악용 시 영향
- **수정**: 수정 방법

### 3.2 ...

## 4. 수정 현황

| 취약점 | 상태 | 검증 |
|--------|------|------|
| CORS   | 수정완료 | 테스트 통과 |
| XSS    | 수정완료 | 테스트 통과 |

## 5. 권장 사항
- 추가 개선 사항
- 모니터링 필요 항목

## 6. 결론
감사 결과 요약
```

---

## 제출물

1. `audit_report.json` - Semgrep 스캔 결과
2. `SECURITY_AUDIT.md` - 보안 감사 보고서
3. 수정된 소스 코드
4. `tests/` - 테스트 코드
5. 커버리지 리포트 스크린샷

---

## 보너스 도전

- [ ] **사용자 정의 규칙**: 프로젝트 특화 Semgrep 규칙 작성
- [ ] **CI 통합**: GitHub Actions에 Semgrep 추가
- [ ] **추가 취약점 수정**: Semgrep이 놓친 문제 수동 발견

---

## 평가 기준

| 항목 | 배점 |
|------|------|
| 취약점 발견 | 20% |
| 취약점 수정 | 30% |
| 테스트 작성 | 25% |
| 보고서 품질 | 15% |
| 커버리지 | 10% |

---

## 참고 자료

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Semgrep Rule Writing](https://semgrep.dev/docs/writing-rules/overview/)
- [FastAPI Testing](https://fastapi.tiangolo.com/tutorial/testing/)
