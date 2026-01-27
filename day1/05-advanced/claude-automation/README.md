# Claude Code 자동화 및 CI/CD 통합

## 개요

Claude Code를 스크립트와 CI/CD 파이프라인에서 자동화하여 활용하는 방법을 다룹니다.
비대화형(Headless) 모드, 파이프라인 통합, 자동 코드 리뷰 등 실무에서 유용한 패턴을 소개합니다.

---

## 학습 목표

- Claude Code의 비대화형 모드를 사용할 수 있다
- 쉘 스크립트로 Claude Code 작업을 자동화할 수 있다
- GitHub Actions에 Claude Code를 통합할 수 있다

---

## 1. 비대화형 모드 기본

### -p (--print) 플래그

단일 프롬프트를 실행하고 결과만 출력합니다:

```bash
# 기본 사용
claude -p "package.json의 의존성 목록 출력해줘"

# 파일과 함께
claude -p "이 파일을 분석해줘" < main.py

# 파이프와 함께
cat error.log | claude -p "이 에러의 원인을 분석해줘"
```

### --output-format 옵션

출력 형식을 지정합니다:

```bash
# 텍스트만 출력 (기본)
claude -p "버그 찾아줘" --output-format text

# JSON 형식
claude -p "코드 분석해줘" --output-format json

# 스트리밍 JSON
claude -p "긴 분석 해줘" --output-format stream-json
```

### JSON 출력 예시

```bash
claude -p "이 코드의 함수 목록 추출해줘" --output-format json
```

출력:
```json
{
  "result": "함수 목록:\n1. calculate_total()\n2. validate_input()\n3. process_data()",
  "cost_usd": 0.0023,
  "duration_ms": 1245,
  "session_id": "abc123"
}
```

---

## 2. 자동화 스크립트 예제

### 예제 1: 일일 코드 리뷰 요약

```bash
#!/bin/bash
# daily-review.sh - 오늘 변경된 파일 자동 리뷰

set -e

# 오늘 변경된 파일 목록
CHANGED_FILES=$(git diff --name-only HEAD~1 -- '*.py' '*.ts' '*.js')

if [ -z "$CHANGED_FILES" ]; then
    echo "변경된 파일이 없습니다."
    exit 0
fi

# 각 파일 리뷰
for file in $CHANGED_FILES; do
    echo "=== $file 리뷰 ==="
    cat "$file" | claude -p "이 코드를 리뷰해줘. 버그, 보안 이슈, 개선점 위주로."
    echo ""
done
```

### 예제 2: 커밋 메시지 자동 생성

```bash
#!/bin/bash
# auto-commit.sh - AI가 커밋 메시지 생성

set -e

# staged 변경사항 확인
DIFF=$(git diff --cached)

if [ -z "$DIFF" ]; then
    echo "커밋할 변경사항이 없습니다."
    exit 1
fi

# 커밋 메시지 생성
MESSAGE=$(echo "$DIFF" | claude -p "이 git diff를 보고 한글 커밋 메시지를 작성해줘.
형식: <type>: <설명>
type은 feat/fix/refactor/docs/test 중 하나.
간결하게 한 줄로.")

echo "생성된 커밋 메시지: $MESSAGE"
read -p "이 메시지로 커밋할까요? (y/n) " confirm

if [ "$confirm" = "y" ]; then
    git commit -m "$MESSAGE"
fi
```

### 예제 3: 테스트 실패 분석

```bash
#!/bin/bash
# analyze-test-failure.sh - 테스트 실패 원인 분석

set -e

# 테스트 실행 및 결과 캡처
TEST_OUTPUT=$(pytest --tb=short 2>&1) || true

# 실패가 있는지 확인
if echo "$TEST_OUTPUT" | grep -q "FAILED"; then
    echo "테스트 실패 분석 중..."

    ANALYSIS=$(echo "$TEST_OUTPUT" | claude -p "이 pytest 결과를 분석해줘.
    1. 어떤 테스트가 실패했는지
    2. 실패 원인이 뭔지
    3. 어떻게 수정하면 되는지
    간결하게 정리해줘.")

    echo "$ANALYSIS"

    # Slack 알림 (선택사항)
    # curl -X POST -H 'Content-type: application/json' \
    #   --data "{\"text\":\"$ANALYSIS\"}" \
    #   "$SLACK_WEBHOOK_URL"
else
    echo "모든 테스트 통과!"
fi
```

---

## 3. GitHub Actions 통합

### 기본 PR 리뷰 워크플로우

```yaml
# .github/workflows/ai-review.yml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Get changed files
        id: changed
        run: |
          FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD -- '*.py' '*.ts' '*.js' | tr '\n' ' ')
          echo "files=$FILES" >> $GITHUB_OUTPUT

      - name: Run AI Review
        if: steps.changed.outputs.files != ''
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          for file in ${{ steps.changed.outputs.files }}; do
            echo "## $file 리뷰" >> review.md
            cat "$file" | claude -p "코드 리뷰해줘. 보안/성능/가독성 체크. 마크다운 형식으로." >> review.md
            echo "" >> review.md
          done

      - name: Post review comment
        if: steps.changed.outputs.files != ''
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const review = fs.readFileSync('review.md', 'utf8');
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: review
            });
```

### 보안 스캔 + AI 분석 워크플로우

```yaml
# .github/workflows/security-analysis.yml
name: Security Analysis

on:
  push:
    branches: [main, develop]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Semgrep
        id: semgrep
        run: |
          pip install semgrep
          semgrep scan --config auto --json > semgrep-results.json || true

      - name: AI Analysis
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          if [ -s semgrep-results.json ]; then
            cat semgrep-results.json | claude -p "이 Semgrep 결과를 분석해줘.
            1. 발견된 취약점 요약
            2. 심각도별 분류
            3. 각각의 수정 방법
            마크다운 형식으로 정리해줘." > security-report.md
          else
            echo "보안 이슈 없음" > security-report.md
          fi

      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: security-report
          path: security-report.md
```

### 자동 문서화 워크플로우

```yaml
# .github/workflows/auto-docs.yml
name: Auto Documentation

on:
  push:
    branches: [main]
    paths:
      - 'src/**/*.py'
      - 'src/**/*.ts'

jobs:
  docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate API docs
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          mkdir -p docs/api

          for file in src/**/*.py; do
            basename=$(basename "$file" .py)
            cat "$file" | claude -p "이 Python 모듈의 API 문서를 마크다운으로 작성해줘.
            - 모듈 설명
            - 각 함수/클래스의 용도
            - 파라미터와 반환값
            - 사용 예시" > "docs/api/${basename}.md"
          done

      - name: Commit docs
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add docs/
          git diff --staged --quiet || git commit -m "docs: API 문서 자동 업데이트"
          git push
```

---

## 4. 고급 자동화 패턴

### 패턴 1: 배치 처리

```bash
#!/bin/bash
# batch-analyze.sh - 여러 파일 배치 분석

set -e

INPUT_DIR="$1"
OUTPUT_DIR="$2"

mkdir -p "$OUTPUT_DIR"

# 병렬 처리 (최대 4개)
find "$INPUT_DIR" -name "*.py" | \
  xargs -P 4 -I {} bash -c '
    file="{}"
    basename=$(basename "$file" .py)
    cat "$file" | claude -p "코드 품질 분석해줘" > "'"$OUTPUT_DIR"'/${basename}-analysis.md"
    echo "완료: $file"
  '
```

### 패턴 2: 조건부 실행

```bash
#!/bin/bash
# smart-review.sh - 변경 크기에 따른 조건부 리뷰

LINES_CHANGED=$(git diff --shortstat HEAD~1 | awk '{print $4 + $6}')

if [ "$LINES_CHANGED" -lt 10 ]; then
    echo "변경이 작아서 리뷰 생략"
    exit 0
elif [ "$LINES_CHANGED" -lt 100 ]; then
    echo "간단한 리뷰 실행"
    git diff HEAD~1 | claude -p "간단히 변경사항 요약해줘"
else
    echo "상세 리뷰 실행"
    git diff HEAD~1 | claude -p "상세 코드 리뷰해줘.
    - 아키텍처 영향
    - 테스트 필요 여부
    - 보안 고려사항"
fi
```

### 패턴 3: 결과 파싱 및 후처리

```bash
#!/bin/bash
# extract-todos.sh - AI 분석 결과에서 TODO 추출

ANALYSIS=$(cat src/*.py | claude -p "각 파일에서 개선할 점을 찾아줘.
JSON 배열 형식으로: [{\"file\": \"파일명\", \"issue\": \"이슈\", \"priority\": \"high/medium/low\"}]" \
  --output-format json)

# jq로 파싱
echo "$ANALYSIS" | jq -r '.result' | jq -c '.[]' | while read item; do
    FILE=$(echo "$item" | jq -r '.file')
    ISSUE=$(echo "$item" | jq -r '.issue')
    PRIORITY=$(echo "$item" | jq -r '.priority')

    if [ "$PRIORITY" = "high" ]; then
        echo "[HIGH] $FILE: $ISSUE"
        # GitHub 이슈 생성
        # gh issue create --title "$ISSUE" --body "파일: $FILE" --label "priority:high"
    fi
done
```

---

## 5. 보안 고려사항

### API 키 관리

```bash
# 환경 변수로 관리 (권장)
export ANTHROPIC_API_KEY="sk-ant-..."

# .env 파일 사용 시
# .gitignore에 반드시 추가
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env
echo ".env" >> .gitignore

# GitHub Secrets 사용 (CI/CD)
# Settings > Secrets > Actions에서 설정
```

### 입력 검증

```bash
#!/bin/bash
# 사용자 입력을 Claude에 전달할 때 주의

USER_INPUT="$1"

# 위험한 문자 필터링
SAFE_INPUT=$(echo "$USER_INPUT" | tr -d '`$(){}')

# 길이 제한
if [ ${#SAFE_INPUT} -gt 10000 ]; then
    echo "입력이 너무 깁니다"
    exit 1
fi

claude -p "$SAFE_INPUT"
```

### 비용 관리

```bash
#!/bin/bash
# 일일 비용 제한

DAILY_LIMIT=10.00  # USD
COST_FILE="/tmp/claude-daily-cost"

# 오늘 날짜 확인
TODAY=$(date +%Y-%m-%d)
if [ -f "$COST_FILE" ]; then
    STORED_DATE=$(head -1 "$COST_FILE")
    if [ "$STORED_DATE" != "$TODAY" ]; then
        echo "$TODAY" > "$COST_FILE"
        echo "0" >> "$COST_FILE"
    fi
else
    echo "$TODAY" > "$COST_FILE"
    echo "0" >> "$COST_FILE"
fi

CURRENT_COST=$(tail -1 "$COST_FILE")

if (( $(echo "$CURRENT_COST >= $DAILY_LIMIT" | bc -l) )); then
    echo "일일 비용 한도 초과"
    exit 1
fi

# Claude 실행 및 비용 기록
RESULT=$(claude -p "$1" --output-format json)
NEW_COST=$(echo "$RESULT" | jq -r '.cost_usd')
TOTAL=$(echo "$CURRENT_COST + $NEW_COST" | bc)

sed -i '' "2s/.*/$TOTAL/" "$COST_FILE"
echo "$RESULT" | jq -r '.result'
```

---

## 6. 실습 과제

### 과제 1: 커밋 훅 자동화

pre-commit 훅을 만들어 커밋 전 자동 코드 리뷰:
- 변경된 파일만 리뷰
- 심각한 이슈 발견 시 커밋 차단
- 경고는 표시만 하고 진행 허용

### 과제 2: PR 템플릿 자동 생성

PR 생성 시 자동으로 설명 작성:
- 변경사항 요약
- 영향 범위 분석
- 테스트 체크리스트 제안

### 과제 3: 일일 리포트 생성

매일 자동으로 개발 리포트 생성:
- 오늘의 커밋 요약
- 코드 품질 지표
- 개선 제안 사항

---

## 자가 점검

- [ ] Claude Code를 비대화형 모드로 실행할 수 있다
- [ ] 쉘 스크립트로 Claude Code를 자동화할 수 있다
- [ ] GitHub Actions에 Claude Code를 통합할 수 있다
- [ ] API 키와 비용을 안전하게 관리할 수 있다

---

## 참고 자료

- [Claude Code CLI 문서](https://docs.anthropic.com/claude-code/cli)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Shell Scripting Best Practices](https://google.github.io/styleguide/shellguide.html)
