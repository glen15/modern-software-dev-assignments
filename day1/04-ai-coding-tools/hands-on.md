# AI 코딩 도구 실습

## 개요

이 세션에서는 실제 개발에 사용되는 AI 코딩 도구를 직접 사용해봅니다.

---

## 학습 목표

- AI IDE (Kiro 또는 Jules)의 주요 기능을 사용할 수 있다
- Claude Code의 스킬과 에이전트 구조를 이해한다
- MCP를 활용하여 Claude Code를 확장할 수 있다

---

## 1. AI IDE 소개

### 옵션 A: AWS Kiro

Kiro는 AWS에서 개발한 AI 기반 IDE입니다.

#### 특징

- **Spec 기반 개발**: 요구사항 → 설계 → 구현 자동화
- **에이전트 지원**: 자율적인 코드 생성 및 수정
- **AWS 통합**: AWS 서비스와 원활한 연동

#### 설치

```bash
# AWS 계정 필요
# https://kiro.dev 에서 다운로드
```

#### 주요 기능

```
1. Spec 모드
   - 요구사항을 자연어로 작성
   - AI가 설계 문서 자동 생성
   - 설계 기반 코드 구현

2. Vibe 모드
   - 자유로운 대화형 코딩
   - 실시간 코드 제안
   - 컨텍스트 인식 자동완성

3. Agent 모드
   - 복잡한 작업 자율 수행
   - 멀티 파일 수정
   - 테스트 자동 실행
```

---

### 옵션 B: Google Antigravity

Antigravity는 Google에서 개발한 AI 코딩 에이전트입니다.

#### 특징

- **자연어 기반 개발**: 자연어로 앱 전체를 구축
- **실시간 미리보기**: 변경사항을 즉시 확인
- **Gemini 기반**: Google의 최신 AI 모델 활용
- **빠른 프로토타이핑**: 아이디어를 즉시 앱으로 변환

#### 사용 방법

```
1. Antigravity 웹사이트 접속
2. 자연어로 원하는 앱 설명
3. AI가 실시간으로 코드 생성 및 미리보기
4. 반복적으로 수정 및 개선
```

#### 주요 기능

```
1. 풀스택 앱 생성
   - 프론트엔드 + 백엔드 동시 생성
   - 데이터베이스 스키마 자동 설계
   - API 엔드포인트 구현

2. 반복적 개선
   - 대화형 수정 및 개선
   - 실시간 피드백 반영
   - 즉시 배포 가능

3. 코드 내보내기
   - 생성된 코드 다운로드
   - GitHub 연동
   - 로컬 개발 환경으로 이동
```

---

### 옵션 C: Replit Agent

Replit Agent는 Replit의 AI 코딩 어시스턴트입니다.

#### 특징

- **브라우저 기반 개발**: 설치 없이 브라우저에서 즉시 시작
- **실시간 협업**: 팀원과 동시 편집 및 개발
- **자동 환경 설정**: 언어/프레임워크 자동 감지 및 설정
- **즉시 배포**: 한 번의 클릭으로 앱 배포

#### 사용 방법

```
1. Replit 웹사이트 접속
2. "Create Repl" 또는 AI Agent 시작
3. 자연어로 프로젝트 설명
4. 실시간으로 코드 생성 및 실행
5. 바로 URL로 공유 가능
```

#### 주요 기능

```
1. 대화형 개발
   - "사용자 로그인 추가해줘"
   - "버그 수정해줘"
   - "테스트 작성해줘"

2. 멀티랭귀지 지원
   - Python, JavaScript, Go, Rust 등
   - 프레임워크 자동 설치
   - 패키지 관리 자동화

3. 즉시 실행 및 공유
   - 코드 작성하며 바로 실행
   - 웹 앱 즉시 배포
   - 공유 링크 생성
```

---

### 옵션 D: Lovable (구 GPT Engineer)

Lovable은 자연어로 풀스택 앱을 만드는 플랫폼입니다.

#### 특징

- **노코드/로우코드**: 비개발자도 앱 제작 가능
- **풀스택 자동 생성**: React + Node.js + DB 전체 스택
- **버전 관리**: 변경사항 추적 및 롤백
- **협업 중심**: 팀원과 실시간 협업

#### 사용 방법

```
1. Lovable 웹사이트 접속
2. "새 프로젝트" 생성
3. 원하는 앱을 자연어로 설명
   예: "사용자가 할 일을 추가/삭제/완료 처리할 수 있는 TODO 앱"
4. AI가 전체 앱 생성
5. 대화를 통해 반복적으로 개선
```

#### 주요 기능

```
1. Vibe 기반 개발
   - "이런 느낌으로 만들어줘" 식의 추상적 지시 가능
   - UI/UX 자동 디자인
   - 반응형 레이아웃 자동 적용

2. 데이터베이스 통합
   - 스키마 자동 생성
   - CRUD 작업 자동 구현
   - 데이터 관계 자동 관리

3. 즉시 배포
   - 생성과 동시에 배포 가능
   - 커스텀 도메인 연결
   - 지속적 배포 지원
```

---

## 2. Claude Code

### 소개

Claude Code는 터미널에서 실행되는 AI 코딩 에이전트입니다.
파일을 읽고, 수정하고, 명령어를 실행할 수 있으며, **스킬**과 **에이전트** 구조로 확장 가능합니다.

### 설치

```bash
# npm으로 설치
npm install -g @anthropic-ai/claude-code

# 또는 Homebrew (Mac)
brew install claude-code
```

### 기본 사용법

```bash
# 프로젝트 디렉토리에서 실행
cd your-project
claude

# 또는 특정 작업과 함께 실행
claude "이 프로젝트 구조 설명해줘"
```

### 슬래시 명령어

| 명령어 | 설명 |
|--------|------|
| `/help` | 도움말 표시 |
| `/clear` | 대화 기록 초기화 |
| `/compact` | 컨텍스트 압축 |
| `/cost` | 현재 세션 비용 확인 |
| `/mcp` | MCP 서버 상태 확인 |

---

## 3. Claude Code 스킬 (Skills)

### 스킬이란?

스킬은 Claude Code의 동작을 커스터마이징하는 재사용 가능한 지침입니다.
`.claude/skills/` 폴더에 정의합니다.

### 스킬 구조

```
.claude/
└── skills/
    └── my-skill/
        ├── skill.md      # 스킬 정의 (필수)
        ├── tools/        # 도구 스크립트 (선택)
        └── examples/     # 예시 파일 (선택)
```

### skill.md 작성법

```markdown
# My Custom Skill

## Description
이 스킬은 [목적]을 위해 사용됩니다.

## When to Use
- [사용 상황 1]
- [사용 상황 2]

## Instructions
1. [지시사항 1]
2. [지시사항 2]

## Examples
- 입력: "..."
- 출력: "..."
```

### 실습: 코드 리뷰 스킬 만들기

```bash
mkdir -p .claude/skills/code-review
```

`.claude/skills/code-review/skill.md`:

```markdown
# Code Review Skill

## Description
코드 변경사항을 리뷰하고 피드백을 제공합니다.

## When to Use
- 사용자가 코드 리뷰를 요청할 때
- PR 생성 전 코드 점검이 필요할 때

## Instructions
1. 변경된 파일을 모두 확인합니다
2. 다음 관점에서 리뷰합니다:
   - 버그 가능성
   - 보안 취약점
   - 코드 가독성
   - 테스트 누락
3. 각 이슈에 대해 구체적인 개선 방안을 제시합니다
4. 심각도를 표시합니다: 🔴 Critical, 🟡 Warning, 🟢 Suggestion

## Output Format
## 리뷰 결과

### 🔴 Critical Issues
- [파일:라인] 이슈 설명

### 🟡 Warnings
- [파일:라인] 이슈 설명

### 🟢 Suggestions
- [파일:라인] 개선 제안
```

### 스킬 사용

```bash
claude
> /code-review  # 스킬 호출
```

---

## 4. Claude Code 에이전트 (Agents)

### 에이전트란?

에이전트는 특정 작업을 자율적으로 수행하는 서브 프로세스입니다.
복잡한 작업을 분업하여 처리할 수 있습니다.

### 기본 에이전트 유형

| 에이전트 | 용도 |
|---------|------|
| `Explore` | 코드베이스 탐색, 파일 검색 |
| `Plan` | 구현 계획 수립 |
| `Bash` | 명령어 실행 |
| `general-purpose` | 범용 작업 |

### 에이전트 사용 예시

```bash
claude
> 이 프로젝트의 인증 시스템 구조를 분석해줘
# → Explore 에이전트가 자동 실행

> 사용자 프로필 기능을 추가하는 계획을 세워줘
# → Plan 에이전트가 자동 실행
```

### 커스텀 에이전트 정의

`.claude/settings.json`:

```json
{
  "agents": {
    "test-runner": {
      "description": "테스트 실행 전문가",
      "tools": ["Bash", "Read"],
      "instructions": "pytest로 테스트를 실행하고 결과를 분석합니다"
    },
    "doc-writer": {
      "description": "문서 작성 전문가",
      "tools": ["Read", "Write", "Glob"],
      "instructions": "코드를 분석하여 문서를 작성합니다"
    }
  }
}
```

---

## 5. MCP (Model Context Protocol)

### MCP란?

MCP는 AI 모델이 외부 도구와 데이터에 접근하는 표준 프로토콜입니다.

```
┌─────────────┐     MCP      ┌─────────────┐
│ Claude Code │ ◄──────────► │ MCP Server  │
└─────────────┘              └─────────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
                 [DB]         [API]         [파일시스템]
```

### MCP 서버 설정

`.mcp.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-filesystem", "/path/to/allowed"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 인기 MCP 서버

| 서버 | 기능 |
|------|------|
| `mcp-server-filesystem` | 파일 시스템 접근 |
| `mcp-server-github` | GitHub API 연동 |
| `mcp-server-postgres` | PostgreSQL 쿼리 |
| `mcp-server-brave-search` | 웹 검색 |
| `mcp-server-memory` | 세션 간 메모리 |

### 실습: GitHub MCP 연동

1. GitHub 토큰 설정:
   ```bash
   export GITHUB_TOKEN="your-token"
   ```

2. `.mcp.json` 생성:
   ```json
   {
     "mcpServers": {
       "github": {
         "command": "npx",
         "args": ["-y", "@anthropic-ai/mcp-server-github"],
         "env": {
           "GITHUB_TOKEN": "${GITHUB_TOKEN}"
         }
       }
     }
   }
   ```

3. 사용:
   ```bash
   claude
   > 이 저장소의 최근 이슈 목록을 보여줘
   > #42 이슈를 해결하는 코드를 작성해줘
   ```

---

## 6. 효과적인 AI 활용 팁

### 좋은 프롬프트 작성법

#### 구체적으로 요청하기

```
❌ "로그인 만들어줘"
✅ "FastAPI로 JWT 기반 로그인 API 만들어줘.
    - POST /auth/login 엔드포인트
    - 이메일과 비밀번호로 인증
    - 성공 시 JWT 토큰 반환"
```

#### 맥락 제공하기

```
❌ "버그 고쳐줘"
✅ "users 테이블에서 데이터를 조회할 때
    'column not found' 에러가 발생해.
    models.py와 database.py 파일을 확인하고
    컬럼명 불일치 문제를 해결해줘."
```

### AI 출력 검토하기

- [ ] 코드가 실제로 동작하는가?
- [ ] 보안 취약점은 없는가?
- [ ] 에러 핸들링이 적절한가?
- [ ] 기존 코드 스타일과 일관성 있는가?

---

## 7. 실습 과제

### 과제 1: 스킬 만들기

나만의 Claude Code 스킬을 만드세요:
- `.claude/skills/` 폴더에 스킬 정의
- 실제 작업에 활용해보기

### 과제 2: MCP 서버 연동

filesystem MCP 서버를 연동하고 테스트하세요:
- `.mcp.json` 설정
- 파일 목록 조회 테스트
- 파일 내용 읽기 테스트

### 과제 3: 에이전트 활용

복잡한 작업을 에이전트로 분업 처리해보세요:
- Explore로 코드베이스 분석
- Plan으로 구현 계획 수립
- 실제 구현 진행

---

## 자가 점검

- [ ] AI IDE (Kiro/Jules)의 특징을 설명할 수 있다
- [ ] Claude Code 스킬을 정의하고 사용할 수 있다
- [ ] 에이전트의 역할과 사용법을 이해한다
- [ ] MCP 서버를 설정하고 연동할 수 있다
- [ ] AI에게 효과적인 프롬프트를 작성할 수 있다

---

## 다음 단계

**개인 실습 과제**로 넘어갑니다.
오늘 배운 내용을 종합하여 실제 프로젝트를 완성합니다.
