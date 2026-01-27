# Stanford CS146S: The Modern Software Developer

## 강의 개요

**강의명**: CS146S - The Modern Software Developer
**대학**: Stanford University
**학기**: Fall 2025
**웹사이트**: [themodernsoftware.dev](https://themodernsoftware.dev)

---

## 강의 목표

현대 소프트웨어 개발에서 AI 도구를 효과적으로 활용하는 방법을 배운다:
- LLM 프롬프팅 기법 이해 및 적용
- AI 코딩 도구 (Cursor, Claude Code, Warp 등) 활용
- 보안 취약점 탐지 및 수정
- AI 기반 코드 리뷰
- 다양한 기술 스택으로 앱 개발

---

## 주차별 내용

### Week 1: 프롬프팅 기법 (Prompting Techniques)

**목표**: LLM 프롬프팅의 핵심 기법을 이해하고 실습한다.

**학습 내용**:
| 기법 | 파일 | 설명 |
|------|------|------|
| K-shot Prompting | `k_shot_prompting.py` | 예시를 통한 패턴 학습 유도 |
| Chain of Thought | `chain_of_thought.py` | 단계별 추론 유도 |
| Tool Calling | `tool_calling.py` | 외부 도구 호출 |
| Self-Consistency | `self_consistency_prompting.py` | 다수결 기반 일관성 확보 |
| RAG | `rag.py` | 외부 문서 기반 답변 생성 |
| Reflexion | `reflexion.py` | 자기 반성을 통한 개선 |

**과제**:
- 각 기법에 대해 프롬프트를 설계하고 테스트 통과
- Ollama를 사용하여 로컬에서 LLM 실행 (mistral-nemo:12b, llama3.1:8b)

**평가**: 60점 (기법당 10점)

---

### Week 2: AI 코딩 도구 활용 - Cursor

**목표**: Cursor IDE를 사용하여 AI 기반 코딩을 경험한다.

**학습 내용**:
- FastAPI + SQLite 앱 확장
- Action Item Extractor 기능 구현
- LLM 기반 텍스트 추출 기능 개발

**과제**:
1. **새 기능 스캐폴딩**: `extract_action_items_llm()` 함수 구현 (Ollama 활용)
2. **유닛 테스트 작성**: 다양한 입력에 대한 테스트
3. **코드 리팩토링**: API 계약, DB 레이어, 에러 핸들링 개선
4. **에이전트 모드 활용**: LLM 추출 엔드포인트 + 프론트엔드 버튼 추가
5. **README 자동 생성**: Cursor로 코드베이스 분석 후 문서 생성

**평가**: 100점 (파트당 20점)

---

### Week 3: MCP 서버 구축 (Model Context Protocol)

**목표**: MCP 서버를 구현하여 AI와 외부 API를 연동한다.

**학습 내용**:
- MCP 핵심 개념: Tools, Resources, Prompts
- STDIO/HTTP 트랜스포트
- 에러 핸들링 및 Rate Limiting

**과제**:
- 외부 API를 래핑하는 MCP 서버 구현
- 최소 2개의 MCP Tool 노출
- 로컬(STDIO) 또는 원격(HTTP) 배포

**추천 API 예시**:
- 날씨 API
- GitHub Issues API
- Notion API
- 영화/TV 데이터베이스

**보너스**:
- 원격 HTTP 서버 배포 (+5점)
- 인증 구현 (API Key 또는 OAuth2) (+5점)

**평가**: 90점 (기능 35, 안정성 20, 개발자 경험 20, 코드 품질 15)

---

### Week 4: Claude Code 자동화

**목표**: Claude Code의 자동화 기능을 활용하여 개발 워크플로우를 개선한다.

**학습 내용**:
- Custom Slash Commands (`.claude/commands/*.md`)
- `CLAUDE.md` 가이던스 파일
- SubAgents (역할 전문화된 에이전트)
- MCP 서버 통합

**과제** (2개 이상 선택):

#### A) Custom Slash Commands
```
예시:
- /tests: 테스트 실행 + 커버리지
- /docs-sync: API 문서 자동 업데이트
- /refactor-module: 모듈 리네이밍 + 임포트 수정
```

#### B) CLAUDE.md 파일
```
예시:
- 코드 네비게이션 가이드
- 스타일 및 안전 가드레일
- 워크플로우 스니펫
```

#### C) SubAgents
```
예시:
- TestAgent + CodeAgent: TDD 워크플로우
- DocsAgent + CodeAgent: API 문서 자동화
- DBAgent + RefactorAgent: 스키마 변경 워크플로우
```

**스타터 앱 구조**:
```
backend/     # FastAPI 앱
frontend/    # 정적 UI
data/        # SQLite DB + seed
docs/        # 에이전트 워크플로우 태스크
```

---

### Week 5: Warp 에이전틱 개발 환경

**목표**: Warp 터미널을 사용하여 멀티 에이전트 워크플로우를 구현한다.

**학습 내용**:
- Warp Drive 기능 (저장된 프롬프트, 규칙, MCP 서버)
- 멀티 에이전트 워크플로우
- Git Worktree를 활용한 병렬 작업

**과제**:

#### A) Warp Drive 자동화 (필수 1개 이상)
- 테스트 러너 + 커버리지 + 재시도
- API 문서 동기화
- 리팩토링 도구
- Git MCP 서버 통합

#### B) 멀티 에이전트 워크플로우 (필수 1개 이상)
- 여러 Warp 탭에서 독립적인 에이전트 동시 실행
- `TASKS.md`의 여러 태스크 병렬 처리

---

### Week 6: Semgrep 보안 스캔

**목표**: 정적 분석 도구로 보안 취약점을 탐지하고 수정한다.

**학습 내용**:
- Semgrep 설치 및 사용법
- SAST (Static Application Security Testing)
- 비밀 정보 탐지
- 의존성 취약점 스캔 (SCA)

**스캔 대상**:
| 대상 | 경로 |
|------|------|
| 백엔드 Python (FastAPI) | `week6/backend/` |
| 프론트엔드 JavaScript | `week6/frontend/` |
| 의존성 | `week6/requirements.txt` |
| 설정/환경 변수 | `week6/` 내 파일들 |

**스캔 명령**:
```bash
semgrep ci --subdir week6
```

**과제**:
1. Semgrep으로 취약점 스캔
2. 최소 3개 취약점 수정
3. 수정 전/후 코드 비교 문서화
4. 앱 기능 및 테스트 정상 동작 확인

**수정 예시**:
- 파라미터화된 SQL 쿼리
- 안전한 API 사용
- 강력한 암호화
- DOM 출력 새니타이징
- CORS 제한
- 의존성 업그레이드

---

### Week 7: AI 코드 리뷰 (Graphite)

**목표**: AI 기반 코드 리뷰와 수동 리뷰를 비교 분석한다.

**학습 내용**:
- Graphite 플랫폼 사용
- AI 코드 리뷰 (Graphite Diamond)
- 효과적인 PR 작성법

**과제**:
1. `TASKS.md`의 태스크 구현
2. 각 태스크마다:
   - 별도 브랜치 생성
   - AI 도구로 1-shot 구현
   - 수동 라인별 리뷰
   - PR 생성 (설명, 테스트 결과, 트레이드오프)
   - Graphite Diamond AI 리뷰 생성

**Writeup 내용**:
- 4개 PR (태스크당 1개)
- 수동 리뷰 vs AI 리뷰 비교 분석
- AI 리뷰가 더 나았던/못했던 사례
- AI 리뷰에 대한 신뢰도 평가

**평가**: 100점 (태스크당 20점 + 성찰 20점)

---

### Week 8: 멀티 스택 앱 개발

**목표**: 동일한 앱을 3가지 다른 기술 스택으로 구현한다.

**요구사항**:
- 최소 1개는 **bolt.new** 사용 (AI 앱 생성 플랫폼)
- 최소 1개는 **비-JavaScript 언어** 사용 (백엔드 또는 프론트엔드)

**기술 스택 예시**:
| 스택 | 구성 |
|------|------|
| MERN | MongoDB, Express, React, Node.js |
| MEVN | MongoDB, Express, Vue.js, Node.js |
| Django + React | Python 백엔드 + React 프론트엔드 |
| Flask + Vanilla JS | Python 백엔드 + 순수 JS |
| Next.js + Node | SSR React + Node 백엔드 |
| Ruby on Rails | 풀스택 Ruby |

**최소 기능 범위**:
- CRUD 작업 (생성, 조회, 수정, 삭제)
- 영속 저장소 (DB 또는 파일)
- 기본 검증 및 에러 핸들링
- 기능적인 UI
- 로컬 실행 가이드

**과제**:
- 3개 프로젝트 폴더 (`week8/` 내)
- 각 버전별 `README.md` (설치, 실행 가이드)
- `writeup.md` (앱 컨셉, 버전별 설명)

**평가**: 100점
- 앱 컨셉 (10점)
- 3가지 스택 (10점)
- Bolt 사용 (10점)
- 비-JS 언어 사용 (10점)
- 버전당 20점 (소스 5, README 5, 기능 5, Writeup 5)

---

## 환경 설정

### 필수 도구

```bash
# 1. Anaconda 설치
# https://www.anaconda.com/download

# 2. Conda 환경 생성
conda create -n cs146s python=3.12 -y
conda activate cs146s

# 3. Poetry 설치
curl -sSL https://install.python-poetry.org | python -

# 4. 의존성 설치
poetry install --no-interaction
```

### Ollama 설치

```bash
# macOS
brew install --cask ollama
ollama serve

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# 모델 다운로드
ollama run mistral-nemo:12b
ollama run llama3.1:8b
```

### AI 도구

| 도구 | 용도 | 주차 |
|------|------|------|
| Ollama | 로컬 LLM 실행 | Week 1, 2 |
| Cursor | AI 코드 에디터 | Week 2, 7 |
| Claude Code | 터미널 AI 에이전트 | Week 4 |
| Warp | 에이전틱 터미널 | Week 5 |
| Semgrep | 정적 보안 분석 | Week 6 |
| Graphite | AI 코드 리뷰 | Week 7 |
| bolt.new | AI 앱 생성 | Week 8 |

---

## 평가 체계

| 주차 | 과제 | 배점 |
|------|------|------|
| Week 1 | 프롬프팅 기법 | 60점 |
| Week 2 | Cursor 활용 | 100점 |
| Week 3 | MCP 서버 | 90점 |
| Week 4 | Claude Code 자동화 | - |
| Week 5 | Warp 멀티에이전트 | - |
| Week 6 | Semgrep 보안 | - |
| Week 7 | Graphite 코드리뷰 | 100점 |
| Week 8 | 멀티스택 앱 | 100점 |

---

## 핵심 개념 요약

### 프롬프팅 기법

```
┌─────────────────────────────────────────────────────────┐
│  Zero-shot     예시 없이 직접 질문                        │
│  Few-shot      2-5개 예시 제공 후 질문                    │
│  CoT           단계별 추론 유도                           │
│  Self-Cons     여러 번 추론 후 다수결                     │
│  RAG           외부 문서를 컨텍스트로 제공                 │
│  Tool Calling  외부 도구 호출 명령 생성                   │
│  Reflexion     자기 출력 검토 및 개선                     │
└─────────────────────────────────────────────────────────┘
```

### AI 코딩 도구 활용 단계

```
1. 문제 정의 → 구체적인 요구사항 작성
2. AI 생성 → 코드 자동 생성
3. 검토 → 보안, 정확성, 스타일 확인
4. 테스트 → 자동화된 테스트 실행
5. 개선 → 피드백 기반 반복
```

### 보안 체크리스트

```
□ SQL 인젝션 방지 (파라미터화된 쿼리)
□ XSS 방지 (출력 이스케이프)
□ CORS 설정 제한
□ 비밀 정보 환경 변수화
□ 의존성 취약점 업데이트
□ 입력 검증
```

---

## 참고 자료

### 공식 문서
- [Ollama](https://ollama.com/)
- [Cursor](https://cursor.com/)
- [Claude Code](https://docs.anthropic.com/claude-code)
- [Warp](https://www.warp.dev/)
- [Semgrep](https://semgrep.dev/)
- [Graphite](https://graphite.dev/)
- [bolt.new](https://bolt.new/)
- [MCP Specification](https://modelcontextprotocol.io/)

### 논문
- Chain-of-Thought Prompting (2022)
- Self-Consistency (2022)
- RAG (2020)
- Reflexion (2023)
