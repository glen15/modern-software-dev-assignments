# Warp 터미널과 Multi-Agent 워크플로우

## 개요

Warp 터미널의 AI 기능과 Claude Code를 조합하여 더 효율적인 개발 환경을 구축합니다.
여러 AI 에이전트를 병렬로 활용하는 멀티 에이전트 워크플로우도 소개합니다.

---

## 학습 목표

- Warp 터미널의 AI 기능을 활용할 수 있다
- Warp와 Claude Code를 효과적으로 조합할 수 있다
- 멀티 에이전트 워크플로우를 설계하고 실행할 수 있다

---

## 1. Warp 터미널 소개

### Warp란?

Warp는 AI가 통합된 차세대 터미널입니다.

**주요 특징**:
- 블록 기반 출력 (명령어별 그룹화)
- AI 명령어 생성 및 설명
- 명령어 자동완성
- 워크플로우 저장/공유

### 설치

```bash
# Mac
brew install --cask warp

# 또는 공식 사이트에서 다운로드
# https://www.warp.dev/
```

---

## 2. Warp AI 기능

### AI 명령어 생성

`#` 또는 `Ctrl+Shift+Space`로 자연어로 명령어 생성:

```
# 현재 폴더에서 1주일 이상 된 .log 파일 찾아서 삭제
→ find . -name "*.log" -mtime +7 -delete

# 포트 3000 사용 중인 프로세스 종료
→ lsof -ti:3000 | xargs kill

# git에서 삭제된 브랜치 로컬에서도 정리
→ git fetch --prune && git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -d
```

### AI 설명 (Explain)

복잡한 명령어 위에서 `Ctrl+Shift+E`:

```bash
# 이 명령어가 뭘 하는지?
awk -F: '$3 >= 1000 {print $1}' /etc/passwd | while read user; do
    echo "$user: $(find /home/$user -type f 2>/dev/null | wc -l) files"
done

# Warp AI 설명:
# /etc/passwd에서 UID가 1000 이상인 사용자를 찾고
# 각 사용자의 홈 디렉토리에 있는 파일 수를 출력합니다.
```

### 워크플로우 저장

자주 쓰는 명령어 시퀀스를 저장:

```yaml
# ~/.warp/workflows/deploy.yaml
name: Deploy to Production
steps:
  - command: npm run test
    description: 테스트 실행
  - command: npm run build
    description: 빌드
  - command: git push origin main
    description: 메인 브랜치 푸시
  - command: ssh prod "cd /app && git pull && pm2 restart all"
    description: 프로덕션 배포
```

---

## 3. Warp + Claude Code 조합

### 역할 분담

```
┌─────────────────────────────────────────────────────────┐
│                    개발 워크플로우                       │
├─────────────────────────────────────────────────────────┤
│  Warp AI          │  Claude Code                        │
├───────────────────┼─────────────────────────────────────┤
│  - 명령어 생성     │  - 코드 작성/수정                   │
│  - 명령어 설명     │  - 코드 분석/리뷰                   │
│  - 시스템 작업     │  - 프로젝트 이해                    │
│  - 파이프라인      │  - 리팩토링                         │
└───────────────────┴─────────────────────────────────────┘
```

### 시나리오 1: 환경 설정 + 코드 작성

```bash
# 1. Warp AI로 프로젝트 환경 설정
# "Python FastAPI 프로젝트 초기화"
mkdir my-api && cd my-api
python -m venv venv && source venv/bin/activate
pip install fastapi uvicorn

# 2. Claude Code로 코드 작성
claude
> FastAPI로 사용자 관리 API 만들어줘
```

### 시나리오 2: 문제 해결

```bash
# 1. 에러 발생
$ npm run build
Error: Cannot find module '@types/node'

# 2. Warp AI로 빠른 해결
# "이 에러 해결하는 명령어"
→ npm install --save-dev @types/node

# 3. 복잡한 문제는 Claude Code로
claude
> 빌드는 되는데 런타임에 모듈을 못 찾아. 원인 분석해줘
```

### 시나리오 3: 데이터 파이프라인

```bash
# 1. Warp AI로 데이터 추출
# "logs 폴더에서 오늘 날짜 에러 로그만 추출"
→ grep "$(date +%Y-%m-%d)" logs/*.log | grep -i error > today-errors.txt

# 2. Claude Code로 분석
cat today-errors.txt | claude -p "이 에러 로그 분석해서 원인별로 분류해줘"
```

---

## 4. Multi-Agent 워크플로우

### 개념

여러 AI 에이전트를 동시에 활용하여 복잡한 작업을 분업 처리:

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Agent 1    │     │  Agent 2    │     │  Agent 3    │
│  (분석)     │     │  (구현)     │     │  (검증)     │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                    ┌──────▼──────┐
                    │  Orchestrator │
                    └─────────────┘
```

### 패턴 1: 병렬 분석

여러 관점에서 동시에 코드 분석:

```bash
#!/bin/bash
# parallel-review.sh

FILE=$1

# 병렬로 3가지 관점 분석
{
    claude -p "보안 관점에서 $FILE 분석해줘" > security.md &
    PID1=$!

    claude -p "성능 관점에서 $FILE 분석해줘" > performance.md &
    PID2=$!

    claude -p "가독성 관점에서 $FILE 분석해줘" > readability.md &
    PID3=$!

    wait $PID1 $PID2 $PID3
}

# 결과 통합
echo "# 종합 코드 리뷰"
echo "## 보안"
cat security.md
echo "## 성능"
cat performance.md
echo "## 가독성"
cat readability.md
```

### 패턴 2: 파이프라인 처리

단계별 순차 처리:

```bash
#!/bin/bash
# pipeline.sh - 요구사항 → 설계 → 구현 파이프라인

REQUIREMENT=$1

# 1단계: 요구사항 분석
echo "1단계: 요구사항 분석"
ANALYSIS=$(claude -p "이 요구사항을 분석하고 기술 스펙을 작성해줘: $REQUIREMENT")

# 2단계: 설계
echo "2단계: 설계"
DESIGN=$(echo "$ANALYSIS" | claude -p "이 기술 스펙을 바탕으로 시스템 설계해줘.
- 파일 구조
- 주요 함수/클래스
- 데이터 흐름")

# 3단계: 구현
echo "3단계: 구현"
echo "$DESIGN" | claude -p "이 설계를 바탕으로 코드 구현해줘"
```

### 패턴 3: 검증 루프

생성 → 검증 → 수정 반복:

```bash
#!/bin/bash
# verify-loop.sh - 코드 생성 후 자동 검증

TASK=$1
MAX_ITERATIONS=3

for i in $(seq 1 $MAX_ITERATIONS); do
    echo "=== 반복 $i ==="

    # 코드 생성
    if [ $i -eq 1 ]; then
        CODE=$(claude -p "$TASK")
    else
        CODE=$(echo "$FEEDBACK" | claude -p "이 피드백을 반영해서 코드 수정해줘:
이전 코드:
$CODE")
    fi

    # 코드 저장
    echo "$CODE" > generated.py

    # 검증 (다른 Claude 세션으로)
    FEEDBACK=$(cat generated.py | claude -p "이 코드를 검증해줘.
    - 문법 오류
    - 로직 오류
    - 엣지 케이스 누락
    문제가 없으면 'PASS'라고만 답해줘.")

    if echo "$FEEDBACK" | grep -q "PASS"; then
        echo "검증 통과!"
        break
    fi

    echo "피드백: $FEEDBACK"
done
```

### 패턴 4: 전문가 패널

여러 "전문가" 관점에서 의견 수렴:

```bash
#!/bin/bash
# expert-panel.sh

QUESTION=$1

# 각 전문가 의견 수집
SENIOR=$(claude -p "시니어 개발자 관점에서 답해줘: $QUESTION")
SECURITY=$(claude -p "보안 전문가 관점에서 답해줘: $QUESTION")
DEVOPS=$(claude -p "DevOps 엔지니어 관점에서 답해줘: $QUESTION")

# 의견 종합
cat << EOF | claude -p "이 세 전문가의 의견을 종합해서 최선의 결론을 내려줘:

시니어 개발자: $SENIOR

보안 전문가: $SECURITY

DevOps 엔지니어: $DEVOPS
"
EOF
```

---

## 5. 실전 워크플로우 예제

### 예제 1: 버그 수정 워크플로우

```bash
#!/bin/bash
# bug-fix-workflow.sh

BUG_DESCRIPTION=$1

echo "1. 버그 분석"
ANALYSIS=$(claude -p "이 버그를 분석하고 원인을 추정해줘: $BUG_DESCRIPTION")

echo "2. 관련 코드 검색"
# Warp AI로 검색 명령어 생성 가능
grep -r "관련키워드" src/ > related_code.txt

echo "3. 수정 제안"
FIXES=$(cat related_code.txt | claude -p "이 코드들 중에서 버그와 관련된 부분을 찾고 수정 방법을 제안해줘.
버그 분석:
$ANALYSIS")

echo "4. 테스트 케이스 생성"
TEST=$(echo "$FIXES" | claude -p "이 수정사항을 검증할 테스트 케이스를 작성해줘")

echo "=== 결과 ==="
echo "분석: $ANALYSIS"
echo "수정: $FIXES"
echo "테스트: $TEST"
```

### 예제 2: 문서 자동화 워크플로우

```bash
#!/bin/bash
# doc-workflow.sh

# 1. API 문서 생성 (병렬)
for file in src/api/*.py; do
    (cat "$file" | claude -p "API 문서 생성해줘" > "docs/$(basename $file .py).md") &
done
wait

# 2. README 업데이트
claude -p "docs/ 폴더의 API 문서들을 읽고 README.md의 API 섹션을 업데이트해줘"

# 3. 변경 로그 생성
git log --oneline -10 | claude -p "이 커밋 내역을 바탕으로 CHANGELOG.md 업데이트해줘"
```

---

## 6. 팁과 모범 사례

### Warp 팁

```bash
# 블록 복사: 명령어 + 출력 함께 복사
Cmd + Shift + C

# 명령어만 복사
Cmd + C (명령어 라인에서)

# 블록 북마크
Cmd + D

# 검색
Cmd + F (현재 탭)
Cmd + Shift + F (모든 탭)
```

### Multi-Agent 팁

1. **명확한 역할 분담**: 각 에이전트의 책임을 명확히
2. **컨텍스트 전달**: 이전 에이전트의 출력을 다음에 전달
3. **실패 처리**: 한 에이전트 실패 시 재시도 또는 대체 경로
4. **비용 관리**: 병렬 실행 시 비용 급증 주의

---

## 7. 실습 과제

### 과제 1: Warp 워크플로우 만들기

자주 쓰는 개발 명령어 시퀀스를 Warp 워크플로우로 저장:
- Git 브랜치 정리
- 개발 서버 시작
- 테스트 및 린트 실행

### 과제 2: 병렬 코드 리뷰 스크립트

3가지 관점(보안, 성능, 유지보수성)에서 동시에 코드를 분석하고
결과를 하나의 리포트로 통합하는 스크립트 작성

### 과제 3: 자동 리팩토링 파이프라인

1. 코드 분석 → 2. 리팩토링 제안 → 3. 적용 → 4. 테스트
단계를 자동화하는 파이프라인 구축

---

## 자가 점검

- [ ] Warp AI로 자연어로 명령어를 생성할 수 있다
- [ ] Warp와 Claude Code의 역할을 구분하여 사용할 수 있다
- [ ] 병렬 처리로 여러 분석을 동시에 실행할 수 있다
- [ ] 파이프라인 패턴으로 단계별 처리를 구현할 수 있다

---

## 참고 자료

- [Warp 공식 문서](https://docs.warp.dev/)
- [Warp 워크플로우 가이드](https://docs.warp.dev/features/workflows)
- [Claude Code 문서](https://docs.anthropic.com/claude-code)
