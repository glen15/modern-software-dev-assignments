# Multi-Agent 패턴

## 개요

여러 AI 에이전트를 협업시켜 복잡한 작업을 수행하는 패턴을 다룹니다.
에이전트 간 역할 분담, 병렬 처리, 결과 통합 등의 고급 기법을 소개합니다.

---

## 학습 목표

- 멀티 에이전트 아키텍처의 개념을 이해한다
- 주요 협업 패턴을 구현할 수 있다
- 에이전트 간 통신 및 결과 통합 방법을 안다
- 실전 워크플로우에 멀티 에이전트를 적용할 수 있다

---

## 1. 멀티 에이전트 개념

### 왜 멀티 에이전트인가?

```
단일 에이전트의 한계:
- 복잡한 작업에서 컨텍스트 초과
- 전문성의 깊이 부족
- 동시 처리 불가

멀티 에이전트의 장점:
- 역할별 전문화
- 병렬 처리로 속도 향상
- 교차 검증으로 품질 향상
```

### 기본 아키텍처

```
┌─────────────────────────────────────────────┐
│              Orchestrator (조율자)           │
│  - 작업 분배                                 │
│  - 결과 수집                                 │
│  - 최종 통합                                 │
└─────────────────────────────────────────────┘
           │         │          │
     ┌─────┴─────┐   │   ┌──────┴──────┐
     ▼           ▼   ▼   ▼             ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Agent A │ │ Agent B │ │ Agent C │
│ (분석)  │ │ (구현)  │ │ (검증)  │
└─────────┘ └─────────┘ └─────────┘
```

---

## 2. 주요 협업 패턴

### 패턴 1: 파이프라인 (Sequential Pipeline)

순차적으로 작업을 전달하는 패턴:

```
요청 → [Agent A] → [Agent B] → [Agent C] → 결과
         분석         구현         검증
```

**사용 사례**:
- 요구사항 분석 → 설계 → 구현 → 테스트
- 코드 분석 → 리팩토링 → 검증

**구현 예시**:

```python
# pipeline_agents.py
import subprocess
import json

def run_agent(prompt: str, context: str = "") -> str:
    """Claude Code 에이전트 실행"""
    full_prompt = f"{context}\n\n{prompt}" if context else prompt
    result = subprocess.run(
        ["claude", "-p", full_prompt],
        capture_output=True,
        text=True
    )
    return result.stdout

def pipeline_workflow(requirement: str):
    """파이프라인 워크플로우"""

    # 1단계: 분석 에이전트
    print("📊 1단계: 요구사항 분석")
    analysis = run_agent(f"""
    다음 요구사항을 분석하세요:
    {requirement}

    출력 형식:
    - 핵심 기능:
    - 필요한 컴포넌트:
    - 예상 복잡도:
    """)

    # 2단계: 설계 에이전트
    print("📐 2단계: 시스템 설계")
    design = run_agent(f"""
    다음 분석을 바탕으로 시스템을 설계하세요:

    파일 구조, 주요 함수, 데이터 흐름을 포함하세요.
    """, context=analysis)

    # 3단계: 구현 에이전트
    print("💻 3단계: 코드 구현")
    implementation = run_agent(f"""
    다음 설계를 바탕으로 코드를 구현하세요:

    완전하고 실행 가능한 코드를 작성하세요.
    """, context=design)

    # 4단계: 검증 에이전트
    print("✅ 4단계: 코드 검증")
    verification = run_agent(f"""
    다음 코드를 검증하세요:

    - 문법 오류
    - 로직 오류
    - 요구사항 충족 여부

    문제가 있으면 수정된 코드도 제시하세요.
    """, context=implementation)

    return verification
```

---

### 패턴 2: Fan-out/Fan-in (병렬 분산)

여러 에이전트가 동시에 작업하고 결과를 통합:

```
        ┌──► [Agent A] ──┐
        │       보안     │
요청 ───┼──► [Agent B] ──┼──► 통합 → 결과
        │       성능     │
        └──► [Agent C] ──┘
               가독성
```

**사용 사례**:
- 다관점 코드 리뷰
- 병렬 분석 (보안, 성능, 스타일)
- 여러 솔루션 비교

**구현 예시**:

```python
# fanout_agents.py
import subprocess
import concurrent.futures

def parallel_review(code: str) -> dict:
    """병렬 코드 리뷰"""

    perspectives = {
        "security": """
        보안 전문가로서 다음 코드를 검토하세요:
        - 입력 검증
        - 인증/인가
        - 데이터 노출
        - 인젝션 취약점
        """,
        "performance": """
        성능 전문가로서 다음 코드를 검토하세요:
        - 시간 복잡도
        - 메모리 사용
        - 불필요한 연산
        - 캐싱 가능성
        """,
        "maintainability": """
        유지보수 전문가로서 다음 코드를 검토하세요:
        - 코드 가독성
        - 명명 규칙
        - 중복 코드
        - 테스트 용이성
        """
    }

    results = {}

    # 병렬 실행
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(run_agent, f"{prompt}\n\n코드:\n{code}"): name
            for name, prompt in perspectives.items()
        }

        for future in concurrent.futures.as_completed(futures):
            name = futures[future]
            results[name] = future.result()

    # 결과 통합
    integrated = run_agent(f"""
    다음 세 가지 관점의 코드 리뷰를 통합하여 최종 리포트를 작성하세요:

    ## 보안 리뷰
    {results['security']}

    ## 성능 리뷰
    {results['performance']}

    ## 유지보수성 리뷰
    {results['maintainability']}

    심각도 순으로 정리하고 우선순위를 제시하세요.
    """)

    return {
        "individual_reviews": results,
        "integrated_report": integrated
    }
```

---

### 패턴 3: 전문가 패널 (Expert Panel)

다양한 전문가 관점에서 의견을 수렴:

```
질문 → [시니어 개발자] ──┐
    → [보안 전문가]    ──┼──► [중재자] → 최종 결론
    → [DevOps 엔지니어] ─┘
```

**사용 사례**:
- 아키텍처 결정
- 기술 선택
- 복잡한 문제 해결

**구현 예시**:

```python
# expert_panel.py

def expert_panel(question: str) -> str:
    """전문가 패널 토론"""

    experts = {
        "senior_dev": """
        당신은 10년 경력의 시니어 개발자입니다.
        코드 품질, 아키텍처, 장기 유지보수 관점에서 답변하세요.
        """,
        "security": """
        당신은 보안 전문가입니다.
        OWASP, 규정 준수, 위협 모델링 관점에서 답변하세요.
        """,
        "devops": """
        당신은 DevOps 엔지니어입니다.
        배포, 확장성, 운영 관점에서 답변하세요.
        """
    }

    opinions = {}

    # 각 전문가 의견 수집
    for role, system_prompt in experts.items():
        opinions[role] = run_agent(f"""
        {system_prompt}

        질문: {question}

        의견을 제시하고 그 근거를 설명하세요.
        """)

    # 중재자가 종합
    final = run_agent(f"""
    다음 전문가들의 의견을 종합하여 최선의 결론을 도출하세요:

    ## 시니어 개발자 의견
    {opinions['senior_dev']}

    ## 보안 전문가 의견
    {opinions['security']}

    ## DevOps 엔지니어 의견
    {opinions['devops']}

    각 의견의 장단점을 분석하고,
    상충되는 부분은 균형점을 찾아 제시하세요.
    최종 권장 사항을 명확히 정리하세요.
    """)

    return final
```

---

### 패턴 4: 검증 루프 (Verification Loop)

생성과 검증을 반복하여 품질 향상:

```
         ┌───────────────────┐
         │                   │
         ▼                   │
요청 → [생성자] → [검증자] ──┤
         │          │        │
         │     통과? ──YES──► 결과
         │          │
         └───NO─────┘
```

**사용 사례**:
- 코드 품질 보장
- 복잡한 알고리즘 구현
- 정확성이 중요한 작업

**구현 예시**:

```python
# verification_loop.py

def verified_code_generation(task: str, max_iterations: int = 3) -> str:
    """검증 루프를 통한 코드 생성"""

    code = None

    for iteration in range(1, max_iterations + 1):
        print(f"🔄 반복 {iteration}/{max_iterations}")

        if code is None:
            # 초기 생성
            code = run_agent(f"""
            다음 작업을 수행하는 Python 코드를 작성하세요:
            {task}

            코드만 출력하세요. 설명은 필요 없습니다.
            """)
        else:
            # 피드백 반영
            code = run_agent(f"""
            다음 피드백을 반영하여 코드를 수정하세요:

            피드백:
            {feedback}

            기존 코드:
            {code}

            수정된 코드만 출력하세요.
            """)

        # 검증
        feedback = run_agent(f"""
        다음 코드를 엄격하게 검증하세요:

        {code}

        검사 항목:
        1. 문법 오류
        2. 로직 오류
        3. 엣지 케이스 처리
        4. 보안 문제
        5. 요구사항 충족

        문제가 없으면 정확히 'PASS'라고만 답하세요.
        문제가 있으면 구체적으로 설명하세요.
        """)

        if "PASS" in feedback:
            print("✅ 검증 통과!")
            return code

        print(f"⚠️ 피드백: {feedback[:100]}...")

    print("⚠️ 최대 반복 횟수 도달")
    return code
```

---

## 3. 실전 워크플로우

### 워크플로우 1: 코드 리뷰 파이프라인

```python
# code_review_workflow.py

def comprehensive_code_review(pr_diff: str) -> dict:
    """종합 코드 리뷰 워크플로우"""

    results = {}

    # Phase 1: 병렬 분석
    print("📊 Phase 1: 병렬 분석")
    with concurrent.futures.ThreadPoolExecutor() as executor:
        security_future = executor.submit(
            run_agent,
            f"보안 관점 코드 리뷰:\n{pr_diff}"
        )
        performance_future = executor.submit(
            run_agent,
            f"성능 관점 코드 리뷰:\n{pr_diff}"
        )
        style_future = executor.submit(
            run_agent,
            f"코드 스타일 리뷰:\n{pr_diff}"
        )

        results["security"] = security_future.result()
        results["performance"] = performance_future.result()
        results["style"] = style_future.result()

    # Phase 2: 통합 및 우선순위 지정
    print("📋 Phase 2: 통합 분석")
    results["integrated"] = run_agent(f"""
    세 가지 리뷰 결과를 통합하고 우선순위를 지정하세요:

    보안: {results['security']}
    성능: {results['performance']}
    스타일: {results['style']}

    심각도: Critical > Warning > Suggestion
    """)

    # Phase 3: 수정 제안
    print("💡 Phase 3: 수정 제안")
    results["suggestions"] = run_agent(f"""
    다음 리뷰 결과에 대한 구체적인 수정 코드를 제안하세요:

    {results['integrated']}
    """)

    return results
```

### 워크플로우 2: 버그 수정 에이전트 팀

```python
# bug_fix_team.py

def bug_fix_team(bug_report: str, codebase_context: str) -> dict:
    """버그 수정 에이전트 팀"""

    # Agent 1: 탐정 - 버그 원인 분석
    print("🔍 탐정 에이전트: 원인 분석")
    root_cause = run_agent(f"""
    버그 탐정으로서 다음 버그의 근본 원인을 찾으세요:

    버그 리포트: {bug_report}

    코드베이스 컨텍스트: {codebase_context}

    가능한 원인들을 나열하고 가장 가능성 높은 것을 선택하세요.
    """)

    # Agent 2: 수리공 - 수정 구현
    print("🔧 수리공 에이전트: 수정 구현")
    fix = run_agent(f"""
    수리공으로서 다음 버그를 수정하세요:

    원인 분석: {root_cause}

    수정된 코드와 변경 이유를 설명하세요.
    """)

    # Agent 3: 테스터 - 수정 검증
    print("🧪 테스터 에이전트: 검증")
    verification = run_agent(f"""
    테스터로서 다음 수정이 올바른지 검증하세요:

    버그: {bug_report}
    수정: {fix}

    테스트 케이스를 작성하고 수정이 문제를 해결하는지 확인하세요.
    """)

    # Agent 4: 리뷰어 - 최종 검토
    print("📝 리뷰어 에이전트: 최종 검토")
    final_review = run_agent(f"""
    시니어 개발자로서 최종 검토하세요:

    원인: {root_cause}
    수정: {fix}
    테스트: {verification}

    승인/반려 결정과 그 이유를 설명하세요.
    """)

    return {
        "root_cause": root_cause,
        "fix": fix,
        "verification": verification,
        "final_review": final_review
    }
```

---

## 4. 에이전트 통신 전략

### 컨텍스트 전달

```python
# 명시적 컨텍스트 전달
def pass_context(previous_output: str, next_prompt: str) -> str:
    return f"""
    이전 단계 결과:
    ---
    {previous_output}
    ---

    현재 작업:
    {next_prompt}
    """
```

### 구조화된 출력

```python
# JSON 형식으로 출력 요청
json_prompt = """
다음 JSON 형식으로 출력하세요:
{
    "analysis": "분석 내용",
    "confidence": 0.0-1.0,
    "recommendations": ["추천1", "추천2"],
    "next_action": "다음 에이전트를 위한 지시"
}
"""
```

### 에러 핸들링

```python
def safe_run_agent(prompt: str, retries: int = 3) -> str:
    """에러 처리가 포함된 에이전트 실행"""
    for attempt in range(retries):
        try:
            result = run_agent(prompt)
            if result and len(result.strip()) > 0:
                return result
        except Exception as e:
            print(f"시도 {attempt + 1} 실패: {e}")

    return "[에이전트 실행 실패]"
```

---

## 5. 비용 및 성능 최적화

### 비용 관리

```python
# 작업 복잡도에 따른 모델 선택
def select_model(task_complexity: str) -> str:
    if task_complexity == "simple":
        return "haiku"  # 빠르고 저렴
    elif task_complexity == "medium":
        return "sonnet"  # 균형
    else:
        return "opus"    # 높은 품질
```

### 캐싱

```python
import hashlib
import json
from pathlib import Path

CACHE_DIR = Path(".agent_cache")

def cached_run_agent(prompt: str) -> str:
    """캐시된 에이전트 실행"""
    cache_key = hashlib.md5(prompt.encode()).hexdigest()
    cache_file = CACHE_DIR / f"{cache_key}.json"

    if cache_file.exists():
        return json.loads(cache_file.read_text())["result"]

    result = run_agent(prompt)

    CACHE_DIR.mkdir(exist_ok=True)
    cache_file.write_text(json.dumps({"prompt": prompt, "result": result}))

    return result
```

---

## 6. 실습 과제

### 과제 1: 파이프라인 구현

3단계 파이프라인 워크플로우를 구현하세요:
1. 요구사항 분석
2. 코드 생성
3. 테스트 생성

### 과제 2: 병렬 리뷰어

4가지 관점(보안, 성능, 가독성, 테스트)에서 동시에 코드를 분석하고
결과를 통합하는 시스템을 구현하세요.

### 과제 3: 자가 개선 에이전트

검증 루프를 사용하여 주어진 알고리즘 문제를
3번의 반복 내에 올바르게 해결하는 시스템을 구현하세요.

---

## 자가 점검

- [ ] 파이프라인 패턴을 설명하고 구현할 수 있다
- [ ] Fan-out/Fan-in 패턴으로 병렬 처리를 구현할 수 있다
- [ ] 전문가 패널 패턴의 장점을 이해한다
- [ ] 검증 루프로 품질을 향상시킬 수 있다
- [ ] 에이전트 간 컨텍스트 전달 방법을 안다

---

## 참고 자료

- [LangGraph Multi-Agent](https://python.langchain.com/docs/langgraph)
- [AutoGen Multi-Agent](https://microsoft.github.io/autogen/)
- [CrewAI Framework](https://www.crewai.com/)
