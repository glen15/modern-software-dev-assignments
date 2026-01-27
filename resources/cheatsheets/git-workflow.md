# Git 워크플로우 치트시트

## 기본 명령어

### 저장소 설정

```bash
# 새 저장소 초기화
git init

# 저장소 복제
git clone <url>

# 원격 저장소 추가
git remote add origin <url>
```

### 상태 확인

```bash
# 상태 확인
git status

# 변경 내용 확인
git diff

# 스테이징된 변경 확인
git diff --staged

# 커밋 히스토리
git log --oneline
```

---

## 기본 워크플로우

### 1. 변경사항 저장

```bash
# 특정 파일 스테이징
git add <파일명>

# 모든 변경사항 스테이징
git add .

# 커밋
git commit -m "feat: 새 기능 추가"

# 스테이징 + 커밋 (추적 중인 파일만)
git commit -am "fix: 버그 수정"
```

### 2. 원격 저장소 동기화

```bash
# 변경사항 가져오기
git fetch

# 가져오기 + 병합
git pull

# 변경사항 푸시
git push

# 새 브랜치 푸시
git push -u origin <브랜치명>
```

---

## 브랜치 관리

### 브랜치 생성/전환

```bash
# 브랜치 목록
git branch

# 새 브랜치 생성
git branch <브랜치명>

# 브랜치 전환
git checkout <브랜치명>

# 생성 + 전환
git checkout -b <브랜치명>

# 또는 (최신 Git)
git switch -c <브랜치명>
```

### 브랜치 병합

```bash
# 현재 브랜치에 다른 브랜치 병합
git merge <브랜치명>

# 충돌 해결 후
git add .
git commit -m "merge: 충돌 해결"
```

### 브랜치 삭제

```bash
# 로컬 브랜치 삭제
git branch -d <브랜치명>

# 강제 삭제
git branch -D <브랜치명>

# 원격 브랜치 삭제
git push origin --delete <브랜치명>
```

---

## 커밋 메시지 규칙

### 타입

| 타입 | 설명 | 예시 |
|------|------|------|
| `feat` | 새 기능 | `feat: 로그인 기능 추가` |
| `fix` | 버그 수정 | `fix: null 포인터 예외 수정` |
| `tidy` | 코드 정리 | `tidy: 복잡한 조건문 단순화` |
| `test` | 테스트 | `test: 로그인 테스트 추가` |
| `docs` | 문서 | `docs: README 업데이트` |
| `perf` | 성능 | `perf: 쿼리 최적화` |
| `chore` | 빌드/설정 | `chore: 의존성 업데이트` |

### 형식 (한글)

```
타입: 간단한 설명

상세 설명 (선택)
- 변경 이유
- 영향 범위
```

### 예시

```bash
git commit -m "feat: 사용자 알림 기능 추가

- 이메일 알림 지원
- 푸시 알림 지원
- 알림 설정 페이지 추가"
```

---

## 팀 협업 워크플로우

### Feature Branch 워크플로우

```bash
# 1. main에서 최신 코드 가져오기
git checkout main
git pull

# 2. 기능 브랜치 생성
git checkout -b feature/로그인-기능

# 3. 작업 및 커밋
git add .
git commit -m "feat: 로그인 폼 UI 구현"

# 4. 원격에 푸시
git push -u origin feature/로그인-기능

# 5. PR 생성 (GitHub/GitLab에서)

# 6. 리뷰 후 머지

# 7. 로컬 정리
git checkout main
git pull
git branch -d feature/로그인-기능
```

### 브랜치 명명 규칙

```
feature/기능명     # 새 기능
fix/버그명         # 버그 수정
hotfix/긴급수정    # 긴급 수정
refactor/대상      # 리팩토링
```

---

## 실수 복구

### 커밋 취소

```bash
# 마지막 커밋 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 취소 (변경사항도 취소)
git reset --hard HEAD~1

# 특정 커밋으로 되돌리기 (새 커밋 생성)
git revert <커밋해시>
```

### 변경사항 임시 저장

```bash
# 스태시에 저장
git stash

# 스태시 목록
git stash list

# 스태시 복원
git stash pop

# 특정 스태시 복원
git stash apply stash@{0}
```

### 파일 복구

```bash
# 특정 파일을 마지막 커밋 상태로
git checkout -- <파일명>

# 또는 (최신 Git)
git restore <파일명>

# 스테이징 취소
git reset HEAD <파일명>

# 또는 (최신 Git)
git restore --staged <파일명>
```

---

## Pull Request 체크리스트

### PR 생성 전

- [ ] 코드가 동작하는가?
- [ ] 테스트가 통과하는가?
- [ ] Semgrep 스캔 통과?
- [ ] 커밋 메시지가 명확한가?
- [ ] 불필요한 파일이 포함되지 않았는가?

### PR 설명 템플릿

```markdown
## 요약
변경 내용 간단 요약

## 변경 사항
- 변경 1
- 변경 2

## 테스트 방법
1. 단계 1
2. 단계 2

## 스크린샷 (UI 변경 시)
```

---

## .gitignore 예시

```gitignore
# Python
__pycache__/
*.py[cod]
venv/
.env

# IDE
.idea/
.vscode/
*.swp

# 빌드
dist/
build/
*.egg-info/

# 로그
*.log

# 데이터베이스
*.db
*.sqlite3

# OS
.DS_Store
Thumbs.db
```

---

## 빠른 참조

| 명령 | 설명 |
|------|------|
| `git status` | 상태 확인 |
| `git add .` | 모든 변경 스테이징 |
| `git commit -m "msg"` | 커밋 |
| `git push` | 푸시 |
| `git pull` | 풀 |
| `git checkout -b <브랜치>` | 브랜치 생성+전환 |
| `git merge <브랜치>` | 병합 |
| `git stash` | 임시 저장 |
| `git log --oneline` | 히스토리 |

---

## 팁

### 커밋 전 확인

```bash
# 변경 내용 확인
git diff

# 어떤 파일이 변경되었는지
git status

# 스테이징된 내용 확인
git diff --staged
```

### 히스토리 검색

```bash
# 메시지로 검색
git log --grep="로그인"

# 파일 변경 히스토리
git log --follow -p <파일명>

# 누가 수정했는지
git blame <파일명>
```
