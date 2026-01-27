# 스타터앱

## 개요

FastAPI + SQLite + Vanilla JS로 구성된 간단한 노트/할 일 관리 앱입니다.
이 앱을 기반으로 팀 프로젝트를 확장하세요.

---

## 빠른 시작

### 1. 의존성 설치

```bash
cd day3/02-starter-app

# 가상 환경 생성 (선택)
python -m venv venv
source venv/bin/activate  # Mac/Linux
# venv\Scripts\activate   # Windows

# 의존성 설치
pip install fastapi uvicorn sqlalchemy
```

### 2. 서버 실행

```bash
# Makefile 사용
make run

# 또는 직접 실행
uvicorn backend.app.main:app --reload
```

### 3. 접속

브라우저에서 `http://localhost:8000` 접속

---

## 프로젝트 구조

```
02-starter-app/
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py          # FastAPI 앱
│       ├── models.py        # SQLAlchemy 모델
│       ├── schemas.py       # Pydantic 스키마
│       ├── db.py           # 데이터베이스 설정
│       └── routers/
│           ├── notes.py     # 노트 API
│           └── action_items.py  # 할 일 API
├── frontend/
│   ├── index.html          # 메인 HTML
│   └── app.js              # JavaScript
└── Makefile
```

---

## API 엔드포인트

### Notes (노트)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/notes/` | 모든 노트 조회 |
| GET | `/notes/?q=검색어` | 노트 검색 |
| POST | `/notes/` | 노트 생성 |
| GET | `/notes/{id}` | 특정 노트 조회 |
| PUT | `/notes/{id}` | 노트 수정 |
| DELETE | `/notes/{id}` | 노트 삭제 |

### Action Items (할 일)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/action-items/` | 모든 할 일 조회 |
| POST | `/action-items/` | 할 일 생성 |
| PUT | `/action-items/{id}/complete` | 완료 표시 |
| PATCH | `/action-items/{id}` | 할 일 수정 |
| DELETE | `/action-items/{id}` | 할 일 삭제 |

---

## 확장 가이드

### 새 API 추가하기

1. **모델 추가** (`backend/app/models.py`):

```python
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    color = Column(String, default="#000000")
```

2. **스키마 추가** (`backend/app/schemas.py`):

```python
class CategoryCreate(BaseModel):
    name: str
    color: str = "#000000"

class Category(CategoryCreate):
    id: int

    class Config:
        from_attributes = True
```

3. **라우터 추가** (`backend/app/routers/categories.py`):

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import models, schemas
from ..db import get_db

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=list[schemas.Category])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.post("/", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category
```

4. **라우터 등록** (`backend/app/main.py`):

```python
from .routers import categories as categories_router

app.include_router(categories_router.router)
```

### 프론트엔드 수정하기

`frontend/index.html`과 `frontend/app.js` 수정

---

## 주의사항

### 보안

이 스타터앱에는 의도적으로 일부 보안 문제가 있을 수 있습니다.
Day 2에서 배운 내용을 적용하여 수정하세요.

```bash
# 보안 스캔
semgrep --config auto .
```

### 데이터베이스

- SQLite 파일: `data/app.db`
- 서버 재시작 시 데이터 유지됨
- 초기화하려면 `data/app.db` 삭제

---

## 문제 해결

### "ModuleNotFoundError" 오류

```bash
# 가상 환경 활성화 확인
source venv/bin/activate

# 의존성 재설치
pip install -r requirements.txt
```

### 포트 충돌

```bash
# 다른 포트 사용
uvicorn backend.app.main:app --reload --port 8001
```

### 데이터베이스 오류

```bash
# 데이터베이스 초기화
rm -rf data/app.db
```

---

## 팀 프로젝트 팁

1. **작게 시작**: MVP 먼저 완성
2. **자주 커밋**: 작은 단위로 자주 커밋
3. **AI 활용**: 반복 작업은 AI에게 맡기기
4. **보안 스캔**: 커밋 전 Semgrep 실행
5. **테스트**: 핵심 기능은 테스트 작성
