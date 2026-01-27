# 프롬프팅 기초

## 개요

이 세션에서는 LLM(Large Language Model)의 성능을 향상시키는 기본 프롬프팅 기법을 배웁니다.

---

## 학습 목표

- K-shot 프롬프팅의 원리를 이해하고 적용할 수 있다
- Chain of Thought (CoT) 기법으로 복잡한 문제를 해결할 수 있다
- Self-Consistency 기법으로 답변의 신뢰도를 높일 수 있다

---

## 실습 파일

| 파일 | 설명 |
|------|------|
| `k_shot_prompting.py` | K-shot 프롬프팅 실습 |
| `chain_of_thought.py` | Chain of Thought 실습 |
| `self_consistency_prompting.py` | Self-Consistency 실습 |

---

## 1. K-shot 프롬프팅

### 개념

LLM에게 **예시(example)**를 제공하여 원하는 출력 형식이나 패턴을 학습시키는 기법입니다.

```
Zero-shot: 예시 없이 질문만
One-shot:  예시 1개 + 질문
Few-shot:  예시 2~5개 + 질문
```

### 예시

**Zero-shot (예시 없음)**
```
입력: "happy"를 프랑스어로 번역해줘
출력: heureux (불확실한 형식)
```

**Few-shot (예시 있음)**
```
입력:
  영어: cat → 프랑스어: chat
  영어: dog → 프랑스어: chien
  영어: happy → 프랑스어: ?
출력: heureux (일관된 형식)
```

### 실습: k_shot_prompting.py

문자열 뒤집기 문제를 K-shot으로 해결합니다.

```bash
# 파일 열기
python k_shot_prompting.py
```

**과제**: `YOUR_SYSTEM_PROMPT`에 예시를 포함한 프롬프트를 작성하세요.

```python
# 힌트: 이런 형식으로 예시를 제공하세요
YOUR_SYSTEM_PROMPT = """
당신은 문자열을 뒤집는 전문가입니다.

예시:
- hello → olleh
- world → dlrow
- python → nohtyp

사용자가 제공하는 단어를 뒤집어서 출력하세요.
다른 설명 없이 뒤집힌 단어만 출력하세요.
"""
```

---

## 2. Chain of Thought (CoT)

### 개념

LLM에게 **단계별로 생각하도록** 유도하여 복잡한 추론 문제를 해결하는 기법입니다.

### 왜 효과적인가?

- 복잡한 문제를 작은 단계로 분해
- 중간 과정이 보이므로 검증 가능
- 수학, 논리 문제에서 정확도 크게 향상

### 예시

**CoT 없이**
```
Q: 3^12345 mod 100은?
A: 43 (바로 답, 틀릴 확률 높음)
```

**CoT 적용**
```
Q: 3^12345 mod 100은?
A: 단계별로 풀어보겠습니다.
   1. 3의 거듭제곱 패턴을 찾습니다: 3, 9, 27, 81, 43, 29, 87, 61, 83, 49, 47, 41, 23, 69, 7, 21, 63, 89, 67, 1, ...
   2. mod 100에서 3의 주기는 20입니다.
   3. 12345 mod 20 = 5
   4. 3^5 mod 100 = 243 mod 100 = 43
   Answer: 43
```

### 실습: chain_of_thought.py

수학 문제를 CoT로 해결합니다.

```bash
python chain_of_thought.py
```

**과제**: `YOUR_SYSTEM_PROMPT`에 단계별 사고를 유도하는 프롬프트를 작성하세요.

```python
# 힌트
YOUR_SYSTEM_PROMPT = """
당신은 수학 문제를 단계별로 푸는 전문가입니다.

문제를 풀 때:
1. 먼저 문제를 이해하고 필요한 개념을 파악합니다
2. 단계별로 풀이 과정을 보여줍니다
3. 각 단계에서 계산 결과를 명시합니다
4. 마지막 줄에 "Answer: <숫자>" 형식으로 최종 답을 출력합니다

차근차근 생각해봅시다.
"""
```

---

## 3. Self-Consistency

### 개념

같은 문제에 대해 **여러 번 추론**하고, 가장 **일관된(많이 나온) 답**을 선택하는 기법입니다.

### 작동 방식

```
문제: "15 + 27 = ?"

시도 1: 42 ✓
시도 2: 42 ✓
시도 3: 41 ✗
시도 4: 42 ✓
시도 5: 42 ✓

최종 답: 42 (4번 등장, 가장 일관됨)
```

### 실습: self_consistency_prompting.py

```bash
python self_consistency_prompting.py
```

---

## 핵심 정리

| 기법 | 적용 상황 | 핵심 |
|------|----------|------|
| K-shot | 특정 형식/패턴 필요 | 예시를 보여줘라 |
| CoT | 복잡한 추론 필요 | 단계별로 생각하게 해라 |
| Self-Consistency | 높은 정확도 필요 | 여러 번 시도하고 투표해라 |

---

## 연습 문제

### 문제 1: K-shot 적용
감정 분석 프롬프트를 K-shot으로 작성하세요.

### 문제 2: CoT 적용
"A 도시에서 B 도시까지 자동차로 3시간, B에서 C까지 2시간 걸린다. A에서 C까지 총 몇 시간?" 문제를 CoT로 풀어보세요.

---

## 다음 세션

**프롬프팅 심화**에서 RAG와 Tool Calling을 배웁니다.
