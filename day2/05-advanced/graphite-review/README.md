# Graphite를 활용한 스택형 코드 리뷰

## 개요

Graphite는 스택형(Stacked) PR 워크플로우를 지원하는 도구입니다.
큰 변경을 작은 PR들로 쪼개어 리뷰하기 쉽게 만들고, AI 코드 리뷰 기능으로 리뷰 품질을 높입니다.

---

## 학습 목표

- 스택형 PR의 개념과 장점을 이해한다
- Graphite CLI를 사용하여 PR 스택을 관리할 수 있다
- Graphite의 AI 리뷰 기능을 활용할 수 있다

---

## 1. 스택형 PR이란?

### 전통적인 PR vs 스택형 PR

**전통적인 방식 (한 번에 큰 PR)**:
```
main ─────────────────────────────────────────►
       │
       └──── feature/big-change (500줄 변경)
             - 모델 변경
             - API 추가
             - 프론트엔드 UI
             - 테스트 추가
```

문제점:
- 리뷰어가 500줄을 한 번에 봐야 함
- 리뷰 시간이 오래 걸림
- 컨텍스트 파악이 어려움

**스택형 PR (작은 PR들의 스택)**:
```
main ────────────────────────────────────────►
       │
       ├── pr/models (50줄)
       │   └── pr/api (80줄)
       │       └── pr/frontend (120줄)
       │           └── pr/tests (100줄)
```

장점:
- 각 PR이 작고 집중됨
- 리뷰가 빠르고 정확함
- 병렬 작업 가능

---

## 2. Graphite 설치 및 설정

### 설치

```bash
# npm
npm install -g @withgraphite/graphite-cli

# Homebrew
brew install withgraphite/tap/graphite
```

### 초기 설정

```bash
# 인증
gt auth

# 저장소 초기화
cd your-repo
gt repo init

# trunk 브랜치 설정 (보통 main)
gt repo init --trunk main
```

### 기본 설정 확인

```bash
gt repo info
# trunk: main
# remote: origin
```

---

## 3. 기본 워크플로우

### 새 스택 시작

```bash
# 1. trunk에서 시작
gt checkout main
gt sync

# 2. 첫 번째 브랜치 생성
gt create models
# 코드 변경...
git add .
gt commit -m "feat: 사용자 모델 추가"
```

### 스택에 브랜치 추가

```bash
# 3. 두 번째 브랜치 (models 위에)
gt create api
# 코드 변경...
git add .
gt commit -m "feat: 사용자 API 엔드포인트 추가"

# 4. 세 번째 브랜치 (api 위에)
gt create frontend
# 코드 변경...
git add .
gt commit -m "feat: 사용자 목록 UI 추가"
```

### 스택 확인

```bash
gt stack
# ○ main
# │
# ◉ models ─── PR #123
# │
# ◉ api ─── PR #124
# │
# ◉ frontend ─── PR #125 (현재)
```

### PR 제출

```bash
# 스택 전체를 PR로 제출
gt submit --stack

# 현재 브랜치만 제출
gt submit
```

---

## 4. 스택 관리

### 브랜치 간 이동

```bash
# 아래 브랜치로
gt down  # api로 이동

# 위 브랜치로
gt up    # frontend로 이동

# 특정 브랜치로
gt checkout models
```

### 변경사항 전파 (Restack)

중간 브랜치를 수정하면 위의 브랜치들도 업데이트 필요:

```bash
# models 브랜치에서 수정
gt checkout models
# 코드 수정...
git add .
gt commit --amend  # 또는 gt commit -m "fix: ..."

# 위의 모든 브랜치에 변경 전파
gt restack
```

### 스택 동기화

```bash
# trunk와 동기화
gt sync

# 리모트와 동기화
gt sync --pull
```

### 머지된 브랜치 정리

```bash
# 머지된 브랜치 자동 삭제
gt cleanup
```

---

## 5. 리뷰 워크플로우

### PR 상태 확인

```bash
# 스택의 모든 PR 상태
gt stack

# 상세 정보
gt pr info
```

### 리뷰 의견 확인

```bash
# PR 코멘트 보기
gt pr comments

# 웹에서 열기
gt pr view
```

### 리뷰 반영

```bash
# 현재 브랜치에서 수정
# 코드 변경...
git add .
gt commit -m "fix: 리뷰 반영 - null 체크 추가"

# 또는 기존 커밋에 추가
gt commit --amend

# 변경사항 푸시
gt submit
```

---

## 6. Graphite AI 리뷰

### AI 리뷰 활성화

Graphite 대시보드에서 설정:
1. Repository Settings 접근
2. "AI Code Review" 활성화
3. 리뷰 규칙 설정

### AI 리뷰 기능

**자동 리뷰 항목**:
- 버그 가능성 탐지
- 보안 취약점 경고
- 코드 스타일 제안
- 성능 이슈 식별

**PR 설명 자동 생성**:
```bash
# AI가 변경사항 분석하여 PR 설명 생성
gt submit --ai-description
```

### 리뷰 규칙 커스터마이징

`.graphite/config.yml`:
```yaml
ai_review:
  enabled: true
  rules:
    - name: "security-check"
      pattern: "password|secret|key"
      message: "민감한 정보가 하드코딩되어 있는지 확인하세요"

    - name: "test-required"
      files: "src/**/*.ts"
      require_tests: true
      message: "이 변경에 대한 테스트가 필요합니다"

    - name: "no-console"
      pattern: "console\\.log"
      severity: "warning"
      message: "프로덕션 코드에 console.log가 있습니다"
```

---

## 7. 팀 협업

### 다른 사람의 스택 위에서 작업

```bash
# 동료의 브랜치 체크아웃
gt checkout teammate/feature-base

# 그 위에 내 브랜치 생성
gt create my-addition
```

### 스택 공유

```bash
# 스택 정보 공유
gt stack --share
# URL 생성됨

# 다른 사람이 스택 가져오기
gt stack import <url>
```

### 충돌 해결

```bash
# restack 중 충돌 발생 시
gt restack
# 충돌 발생!

# 충돌 해결
# 파일 수정...
git add .
gt restack --continue
```

---

## 8. 고급 기능

### 대화형 리스택

```bash
gt restack --interactive
# 각 커밋을 선택적으로 적용
```

### 브랜치 분리/병합

```bash
# 브랜치 중간에 새 브랜치 삽입
gt create --insert new-middle

# 두 브랜치 병합
gt fold  # 현재 브랜치를 아래 브랜치에 병합
```

### 스택 시각화

```bash
# 터미널에서 시각화
gt log

# 웹 대시보드
gt web
```

### CI 연동

```yaml
# .github/workflows/graphite.yml
name: Graphite CI

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Graphite
        run: npm install -g @withgraphite/graphite-cli

      - name: Validate Stack
        run: |
          gt auth --token ${{ secrets.GRAPHITE_TOKEN }}
          gt stack validate
```

---

## 9. 모범 사례

### PR 크기 가이드라인

| 변경 크기 | 권장 PR 수 | 각 PR 크기 |
|----------|-----------|-----------|
| ~100줄 | 1개 | 그대로 |
| 100-300줄 | 2-3개 | 50-100줄 |
| 300-500줄 | 3-5개 | 60-100줄 |
| 500줄+ | 5개+ | 80-120줄 |

### 좋은 스택 구조

```
✅ 좋은 예:
pr/1-add-user-model      # 데이터 레이어
pr/2-add-user-service    # 비즈니스 로직
pr/3-add-user-api        # API 레이어
pr/4-add-user-tests      # 테스트

❌ 나쁜 예:
pr/1-half-of-feature     # 의미 없는 분리
pr/2-other-half          # 각 PR이 독립적으로 이해 불가
```

### 커밋 메시지 컨벤션

```bash
# 스택 내 일관된 prefix 사용
gt commit -m "feat(user): 모델 정의"
gt commit -m "feat(user): API 엔드포인트"
gt commit -m "feat(user): 프론트엔드 UI"
gt commit -m "test(user): 통합 테스트"
```

---

## 10. 실습 과제

### 과제 1: 기본 스택 만들기

간단한 기능을 3개의 스택형 PR로 분리:
1. 데이터 모델 추가
2. API 엔드포인트 추가
3. 테스트 추가

### 과제 2: 중간 변경 전파

스택의 중간 브랜치를 수정하고 restack으로 위 브랜치들에 전파

### 과제 3: AI 리뷰 활용

Graphite AI 리뷰를 활성화하고:
- 자동 생성된 리뷰 확인
- 커스텀 규칙 추가
- 리뷰 의견 반영

---

## 자가 점검

- [ ] 스택형 PR의 장점을 설명할 수 있다
- [ ] gt create, gt submit, gt restack 명령어를 사용할 수 있다
- [ ] 스택의 중간을 수정하고 변경을 전파할 수 있다
- [ ] Graphite AI 리뷰를 활성화하고 활용할 수 있다

---

## 참고 자료

- [Graphite 공식 문서](https://docs.graphite.dev/)
- [Graphite CLI 레퍼런스](https://docs.graphite.dev/cli)
- [스택형 PR 모범 사례](https://graphite.dev/blog/stacked-prs)
- [Graphite AI 리뷰](https://graphite.dev/features/ai)
