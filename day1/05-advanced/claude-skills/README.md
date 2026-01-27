# Claude Code 스킬과 에이전트 구조

## 개요

Claude Code의 스킬(Skills)과 에이전트(Agents) 시스템을 깊이 이해하고 커스터마이징하는 방법을 다룹니다.
이 구조는 AI 코딩 도구의 표준이 되어가고 있어 깊이 이해해두면 유용합니다.

---

## 학습 목표

- 스킬의 구조와 작성법을 이해한다
- 에이전트 시스템의 아키텍처를 파악한다
- 복잡한 워크플로우를 스킬로 구현할 수 있다
- MCP와 스킬을 연계할 수 있다

---

## 1. 스킬 시스템 심화

### 스킬 디렉토리 구조

```
.claude/
├── settings.json          # 프로젝트 설정
└── skills/
    └── my-skill/
        ├── skill.md       # 스킬 정의 (필수)
        ├── tools/         # 커스텀 도구 스크립트
        │   ├── analyze.sh
        │   └── generate.py
        ├── templates/     # 템플릿 파일
        │   └── component.tsx.template
        └── examples/      # 예시 입출력
            └── sample.json
```

### skill.md 상세 구조

```markdown
# Skill Name

## Description
스킬의 목적과 기능을 설명합니다.

## When to Use
- 이 스킬을 사용해야 하는 상황
- 트리거 조건이나 키워드

## Prerequisites
- 필요한 도구나 환경
- 의존성 목록

## Instructions
1. 단계별 지시사항
2. 세부 동작 규칙
3. 주의사항

## Input Format
예상 입력 형식과 예시

## Output Format
출력 형식과 예시

## Examples
### Example 1: [제목]
**입력**: ...
**출력**: ...

## Constraints
- 금지 사항
- 제한 조건
```

---

## 2. 실전 스킬 예제

### 예제 1: TDD 스킬

`.claude/skills/tdd/skill.md`:

```markdown
# TDD (Test-Driven Development) Skill

## Description
테스트 주도 개발 워크플로우를 강제합니다.
코드 작성 전 반드시 테스트를 먼저 작성합니다.

## When to Use
- 새로운 기능 구현 요청 시
- "TDD로" 또는 "테스트 먼저"라는 키워드 사용 시

## Instructions
1. **Red**: 실패하는 테스트 먼저 작성
   - 요구사항을 테스트 케이스로 변환
   - 테스트 실행하여 실패 확인

2. **Green**: 테스트를 통과하는 최소한의 코드 작성
   - 복잡한 구현 금지
   - 테스트 통과만 목표

3. **Refactor**: 코드 개선
   - 중복 제거
   - 명명 개선
   - 테스트가 여전히 통과하는지 확인

## Output Format
각 단계를 명시적으로 보여줌:

### 🔴 Red Phase
[테스트 코드]

### 🟢 Green Phase
[구현 코드]

### 🔵 Refactor Phase
[개선된 코드]

## Constraints
- 테스트 없이 구현 코드 작성 금지
- 한 번에 여러 기능 구현 금지
```

### 예제 2: 코드 리뷰 스킬

`.claude/skills/review/skill.md`:

```markdown
# Code Review Skill

## Description
변경된 코드에 대해 체계적인 리뷰를 수행합니다.

## When to Use
- /review 명령 사용 시
- PR 리뷰 요청 시
- "코드 리뷰" 키워드 사용 시

## Instructions
1. 변경된 파일 목록 확인
2. 각 파일에 대해 다음 관점으로 검토:
   - 보안 취약점
   - 성능 이슈
   - 코드 스타일 및 가독성
   - 테스트 커버리지
   - 에러 핸들링

3. 심각도 분류:
   - 🔴 Critical: 반드시 수정 필요
   - 🟡 Warning: 권장 수정
   - 🟢 Suggestion: 선택적 개선

## Output Format
## 리뷰 요약
- 검토 파일 수: N개
- Critical: N개 | Warning: N개 | Suggestion: N개

## 상세 리뷰

### [파일명]
#### 🔴 Critical
- [라인번호] 이슈 설명

#### 🟡 Warning
- [라인번호] 이슈 설명

## 전체 평가
[종합 의견]
```

### 예제 3: 컴포넌트 생성 스킬

`.claude/skills/component/skill.md`:

```markdown
# React Component Generator Skill

## Description
일관된 구조의 React 컴포넌트를 생성합니다.

## When to Use
- "컴포넌트 만들어줘" 요청 시
- /component 명령 사용 시

## Prerequisites
- React 프로젝트
- TypeScript 사용 권장

## Instructions
1. 컴포넌트 이름과 목적 확인
2. 다음 파일들을 생성:
   - ComponentName.tsx (메인 컴포넌트)
   - ComponentName.test.tsx (테스트)
   - ComponentName.stories.tsx (Storybook, 선택)
   - index.ts (export)

3. 컴포넌트 구조:
   - Props 인터페이스 정의
   - 기본 스타일 적용
   - 접근성 고려

## Output Format
src/components/[ComponentName]/
├── [ComponentName].tsx
├── [ComponentName].test.tsx
└── index.ts
```

---

## 3. 에이전트 아키텍처

### 기본 에이전트 종류

| 에이전트 | 역할 | 도구 |
|---------|------|------|
| `Explore` | 코드베이스 탐색 | Glob, Grep, Read |
| `Plan` | 구현 계획 수립 | Read, Grep, Glob |
| `Bash` | 명령어 실행 | Bash |
| `general-purpose` | 범용 작업 | 전체 도구 |

### 에이전트 선택 로직

```
사용자 요청 분석
       │
       ▼
┌──────────────────────┐
│ 요청 유형 판단       │
└──────────────────────┘
       │
       ├─── "분석/탐색/검색" ──► Explore 에이전트
       │
       ├─── "계획/설계"  ──────► Plan 에이전트
       │
       ├─── "명령 실행" ───────► Bash 에이전트
       │
       └─── 기타 ──────────────► general-purpose
```

### 커스텀 에이전트 정의

`.claude/settings.json`:

```json
{
  "agents": {
    "test-runner": {
      "description": "테스트 실행 및 결과 분석 전문가",
      "tools": ["Bash", "Read", "Grep"],
      "instructions": "pytest 또는 jest로 테스트를 실행하고 실패 원인을 분석합니다.",
      "triggers": ["테스트 실행", "test run", "/test"]
    },

    "doc-generator": {
      "description": "API 문서 자동 생성",
      "tools": ["Read", "Write", "Glob"],
      "instructions": "소스 코드를 분석하여 마크다운 문서를 생성합니다.",
      "triggers": ["문서 생성", "generate docs", "/docs"]
    },

    "security-scanner": {
      "description": "보안 취약점 스캐너",
      "tools": ["Read", "Grep", "Bash"],
      "instructions": "OWASP Top 10 기준으로 코드를 검사합니다.",
      "triggers": ["보안 검사", "security scan", "/security"]
    }
  }
}
```

---

## 4. 복잡한 워크플로우 구현

### 워크플로우 1: 풀스택 기능 추가

`.claude/skills/fullstack-feature/skill.md`:

```markdown
# Fullstack Feature Skill

## Description
백엔드 API부터 프론트엔드 UI까지 전체 기능을 구현합니다.

## Instructions
### Phase 1: 설계
1. 요구사항 분석
2. API 스펙 정의 (OpenAPI)
3. 데이터 모델 설계

### Phase 2: 백엔드
1. 데이터베이스 마이그레이션
2. API 엔드포인트 구현
3. 유닛 테스트 작성

### Phase 3: 프론트엔드
1. API 클라이언트 생성
2. 컴포넌트 구현
3. 상태 관리 연결
4. E2E 테스트 작성

### Phase 4: 통합
1. 전체 테스트 실행
2. 문서 업데이트
3. PR 준비

## Checkpoints
각 Phase 완료 시 사용자 확인 요청
```

### 워크플로우 2: 리팩토링 가이드

`.claude/skills/refactor/skill.md`:

```markdown
# Safe Refactoring Skill

## Description
안전하게 코드를 리팩토링합니다.

## Instructions
### 1. 분석
- 현재 테스트 커버리지 확인
- 영향 범위 파악
- 의존성 그래프 분석

### 2. 준비
- 누락된 테스트 추가
- 리팩토링 전 스냅샷 저장

### 3. 리팩토링
- 작은 단위로 변경
- 각 변경 후 테스트 실행
- 실패 시 즉시 롤백

### 4. 검증
- 전체 테스트 실행
- 성능 비교
- 변경 내역 문서화

## Safety Rules
- 테스트 없이 리팩토링 금지
- 한 번에 하나의 리팩토링만 수행
- 모든 변경은 되돌릴 수 있어야 함
```

---

## 5. MCP와 스킬 연계

### MCP 도구를 활용하는 스킬

`.claude/skills/db-query/skill.md`:

```markdown
# Database Query Skill

## Description
MCP postgres 서버를 통해 데이터베이스를 조회합니다.

## Prerequisites
- MCP postgres 서버 연결 필요
- 읽기 권한 확인

## Instructions
1. 요청을 SQL 쿼리로 변환
2. MCP 도구로 쿼리 실행
3. 결과를 사람이 읽기 쉽게 포맷

## Safety Rules
- SELECT 쿼리만 허용
- UPDATE, DELETE, DROP 금지
- 민감한 컬럼 마스킹 (password, token 등)
```

### GitHub 연동 스킬

`.claude/skills/github-workflow/skill.md`:

```markdown
# GitHub Workflow Skill

## Description
MCP github 서버를 통해 GitHub 작업을 자동화합니다.

## When to Use
- 이슈 생성/관리
- PR 생성
- 브랜치 관리

## Instructions
1. 작업 유형 판단
2. MCP github 도구 호출
3. 결과 확인 및 후속 안내

## Available Actions
- 이슈 생성: mcp__github__create_issue
- PR 생성: mcp__github__create_pull_request
- 코드 검색: mcp__github__search_code
```

---

## 6. 스킬 디버깅 및 테스트

### 스킬 테스트 방법

```bash
# Claude Code에서 스킬 확인
claude
> /help  # 등록된 스킬 목록 확인

# 특정 스킬 테스트
> /review  # review 스킬 실행 테스트
> /component Button  # component 스킬 테스트
```

### 스킬 로깅

skill.md에 디버깅 섹션 추가:

```markdown
## Debug Mode
개발 중일 때 각 단계의 중간 결과를 출력합니다:

[DEBUG] 입력 분석: ...
[DEBUG] 단계 1 완료: ...
[DEBUG] 최종 출력: ...
```

---

## 7. 실습 과제

### 과제 1: 커스텀 스킬 만들기

나만의 개발 워크플로우를 스킬로 정의:
- skill.md 작성
- 예시 입출력 정의
- 실제 테스트

### 과제 2: 에이전트 조합 워크플로우

여러 에이전트를 순차적으로 호출하는 복잡한 작업 설계:
1. Explore로 코드 분석
2. Plan으로 변경 계획
3. 구현 및 테스트

### 과제 3: MCP 연계 스킬

MCP 서버와 연동하는 스킬 작성:
- 데이터베이스 조회
- 외부 API 호출
- 결과 가공 및 출력

---

## 자가 점검

- [ ] skill.md의 각 섹션의 역할을 설명할 수 있다
- [ ] 에이전트 선택 로직을 이해한다
- [ ] 커스텀 에이전트를 정의할 수 있다
- [ ] 복잡한 워크플로우를 스킬로 구현할 수 있다
- [ ] MCP와 스킬을 연계할 수 있다

---

## 참고 자료

- [Claude Code Skills 문서](https://docs.anthropic.com/claude-code/skills)
- [Claude Code Agents 가이드](https://docs.anthropic.com/claude-code/agents)
- [MCP 표준 스펙](https://modelcontextprotocol.io/)
