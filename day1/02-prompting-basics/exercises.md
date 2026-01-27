# 프롬프팅 기초 실습

## 실습 환경 확인

```bash
# Gemini 사용 시
echo $GEMINI_API_KEY  # API 키가 설정되어 있어야 함

# Bedrock 사용 시
aws sts get-caller-identity  # AWS 자격증명 확인
```

---

## 폴더 구조

실습 파일은 사용하는 AI 서비스에 따라 선택하세요:

```
02-prompting-basics/
├── gemini/           # Google Gemini API 사용
│   ├── k_shot_prompting.py
│   ├── chain_of_thought.py
│   └── self_consistency_prompting.py
└── bedrock/          # Amazon Bedrock (Nova) 사용
    ├── k_shot_prompting.py
    ├── chain_of_thought.py
    └── self_consistency_prompting.py
```

---

## 실습 1: K-shot 프롬프팅

### 목표
문자열을 뒤집는 작업을 K-shot 프롬프팅으로 성공시키세요.

### 파일
- Gemini: `gemini/k_shot_prompting.py`
- Bedrock: `bedrock/k_shot_prompting.py`

### 문제
"httpstatus"를 뒤집어 "sutatsptth"를 출력해야 합니다.

### 단계

1. 파일을 열고 `YOUR_SYSTEM_PROMPT`를 확인하세요
2. 예시를 포함한 시스템 프롬프트를 작성하세요
3. `python gemini/k_shot_prompting.py` (또는 `bedrock/...`)로 테스트하세요
4. "SUCCESS"가 출력될 때까지 프롬프트를 개선하세요

### 힌트

```python
# 이렇게 예시를 제공해보세요
YOUR_SYSTEM_PROMPT = """
당신은 문자열 뒤집기 전문가입니다.

예시:
- abc → cba
- hello → olleh
- test → tset

규칙:
1. 입력 문자열의 문자 순서를 뒤집습니다
2. 결과만 출력하고 다른 설명은 하지 않습니다
"""
```

### 체크리스트

- [ ] 예시를 3개 이상 포함했는가?
- [ ] 출력 형식을 명확히 지정했는가?
- [ ] 불필요한 설명을 하지 않도록 지시했는가?

---

## 실습 2: Chain of Thought

### 목표
복잡한 수학 문제를 CoT 기법으로 해결하세요.

### 파일
- Gemini: `gemini/chain_of_thought.py`
- Bedrock: `bedrock/chain_of_thought.py`

### 문제
`3^12345 mod 100` 을 계산하여 `Answer: 43`을 출력해야 합니다.

### 단계

1. 파일을 열고 `YOUR_SYSTEM_PROMPT`를 확인하세요
2. 단계별 사고를 유도하는 프롬프트를 작성하세요
3. `python gemini/chain_of_thought.py` (또는 `bedrock/...`)로 테스트하세요
4. "SUCCESS"가 출력될 때까지 프롬프트를 개선하세요

### 힌트

```python
YOUR_SYSTEM_PROMPT = """
당신은 수학 문제를 단계별로 푸는 전문가입니다.

문제 해결 과정:
1. 문제를 분석합니다
2. 필요한 수학적 개념을 파악합니다 (이 경우: 모듈러 연산의 주기성)
3. 단계별로 계산합니다
4. 중간 결과를 검증합니다
5. 마지막 줄에 "Answer: <숫자>" 형식으로 답을 출력합니다

차근차근 생각하면서 풀어봅시다.
"""
```

### 체크리스트

- [ ] "단계별로", "차근차근" 같은 유도 문구를 사용했는가?
- [ ] 출력 형식 (Answer: <숫자>)을 명시했는가?
- [ ] 중간 과정을 보여주도록 유도했는가?

---

## 실습 3: Self-Consistency (보너스)

### 목표
여러 번의 추론을 통해 일관된 답을 얻는 원리를 이해하세요.

### 파일
- Gemini: `gemini/self_consistency_prompting.py`
- Bedrock: `bedrock/self_consistency_prompting.py`

### 단계

1. 파일 코드를 읽고 Self-Consistency가 어떻게 구현되어 있는지 파악하세요
2. `python gemini/self_consistency_prompting.py` (또는 `bedrock/...`)로 실행하세요
3. 여러 번 실행하여 결과의 일관성을 확인하세요

---

## 도전 과제

### 과제 1: 나만의 K-shot 프롬프트

다음 작업 중 하나를 선택하여 K-shot 프롬프트를 작성하세요:

1. **감정 분석**: 텍스트를 긍정/부정/중립으로 분류
2. **엔티티 추출**: 텍스트에서 인물, 장소, 조직 추출
3. **코드 변환**: Python 코드를 JavaScript로 변환

### 과제 2: CoT 프롬프트 설계

다음 문제를 CoT로 풀 수 있는 프롬프트를 작성하세요:

```
문제: 철수는 사과 5개를 가지고 있었다. 영희에게 2개를 주고,
      민수에게 1개를 받았다. 그 후 가지고 있던 사과의 절반을
      먹었다. 철수에게 남은 사과는 몇 개인가?
```

---

## 자가 점검

### K-shot 프롬프팅

- [ ] Zero-shot과 Few-shot의 차이를 설명할 수 있다
- [ ] 적절한 예시 개수를 판단할 수 있다
- [ ] 예시의 다양성이 중요한 이유를 이해한다

### Chain of Thought

- [ ] CoT가 효과적인 문제 유형을 알고 있다
- [ ] 단계별 추론을 유도하는 프롬프트를 작성할 수 있다
- [ ] CoT의 한계(토큰 사용량 증가)를 이해한다

### Self-Consistency

- [ ] 다수결 방식의 원리를 이해한다
- [ ] 비용과 정확도의 트레이드오프를 이해한다

---

## 참고 자료

- [Prompt Engineering Guide](https://www.promptingguide.ai/)
- [Chain-of-Thought Prompting 논문](https://arxiv.org/abs/2201.11903)
- [Self-Consistency 논문](https://arxiv.org/abs/2203.11171)
