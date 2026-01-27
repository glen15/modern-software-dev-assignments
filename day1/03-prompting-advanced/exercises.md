# 프롬프팅 심화 실습

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
03-prompting-advanced/
├── gemini/           # Google Gemini API 사용
│   ├── rag.py
│   ├── tool_calling.py
│   └── reflexion.py
├── bedrock/          # Amazon Bedrock (Nova) 사용
│   ├── rag.py
│   ├── tool_calling.py
│   └── reflexion.py
└── data/
    └── api_docs.txt  # RAG 실습용 문서
```

---

## 실습 1: RAG (Retrieval-Augmented Generation)

### 목표
외부 API 문서를 기반으로 정확한 코드를 생성하세요.

### 파일
- Gemini: `gemini/rag.py`
- Bedrock: `bedrock/rag.py`
- `data/api_docs.txt` - API 문서

### 문제
API 문서를 참조하여 `fetch_user_name` 함수를 생성해야 합니다.

### 단계

1. 먼저 `data/api_docs.txt` 내용을 확인하세요:
   ```bash
   cat data/api_docs.txt
   ```

2. `rag.py`를 열고 두 가지를 수정하세요:
   - `YOUR_SYSTEM_PROMPT`: 시스템 프롬프트 작성
   - `YOUR_CONTEXT_PROVIDER`: 관련 문서 반환

3. 테스트 실행:
   ```bash
   python gemini/rag.py  # 또는 bedrock/rag.py
   ```

### 힌트: CONTEXT_PROVIDER 구현

```python
def YOUR_CONTEXT_PROVIDER(corpus: List[str]) -> List[str]:
    # 가장 간단한 구현: 모든 문서 반환
    return corpus

    # 또는 특정 문서만 선택
    # return [corpus[0]]  # 첫 번째 문서만
```

### 힌트: SYSTEM_PROMPT 작성

```python
YOUR_SYSTEM_PROMPT = """
당신은 Python 코드를 작성하는 전문가입니다.

규칙:
1. 제공된 Context의 API 문서만 참조하세요
2. 문서에 명시된 Base URL, 엔드포인트, 헤더를 정확히 사용하세요
3. requests 라이브러리를 사용하세요
4. 함수는 사용자 이름(문자열)만 반환해야 합니다
5. 코드를 ```python 블록으로 감싸서 출력하세요
"""
```

### 체크리스트

- [ ] 문서를 컨텍스트로 제공했는가?
- [ ] 문서 내용만 사용하도록 지시했는가?
- [ ] 출력 형식을 명확히 지정했는가?

---

## 실습 2: Tool Calling

### 목표
LLM이 올바른 형식의 도구 호출 JSON을 생성하도록 하세요.

### 파일
- Gemini: `gemini/tool_calling.py`
- Bedrock: `bedrock/tool_calling.py`

### 문제
`output_every_func_return_type` 도구를 호출하는 JSON을 생성해야 합니다.

### 단계

1. 파일을 열고 도구 정의를 확인하세요
2. `YOUR_SYSTEM_PROMPT`를 작성하세요
3. 테스트 실행:
   ```bash
   python gemini/tool_calling.py  # 또는 bedrock/tool_calling.py
   ```

### 기대하는 LLM 출력

```json
{
    "tool": "output_every_func_return_type",
    "args": {"file_path": "tool_calling.py"}
}
```

### 힌트

```python
YOUR_SYSTEM_PROMPT = """
당신은 도구 호출 전문가입니다.

## 사용 가능한 도구

### output_every_func_return_type
파일 내 모든 함수의 반환 타입을 분석합니다.
- 매개변수: file_path (문자열, 파일 경로)
- 반환값: "함수명: 반환타입" 형식의 목록

## 응답 형식
반드시 아래 JSON 형식으로만 응답하세요:

{
    "tool": "도구이름",
    "args": {"매개변수명": "값"}
}

JSON 외의 다른 텍스트는 출력하지 마세요.
"""
```

### 체크리스트

- [ ] 도구 이름과 매개변수를 정확히 설명했는가?
- [ ] JSON 형식을 명확히 지정했는가?
- [ ] 다른 텍스트 없이 JSON만 출력하도록 지시했는가?

---

## 실습 3: Reflexion (보너스)

### 목표
AI가 자기 출력을 검토하고 개선하는 과정을 이해하세요.

### 파일
- Gemini: `gemini/reflexion.py`
- Bedrock: `bedrock/reflexion.py`

### 단계

1. 코드를 읽고 Reflexion 루프를 이해하세요
2. 실행하여 개선 과정을 관찰하세요:
   ```bash
   python gemini/reflexion.py  # 또는 bedrock/reflexion.py
   ```

---

## 도전 과제

### 과제 1: 나만의 RAG 시스템

다음 시나리오 중 하나를 선택하여 RAG를 구현하세요:

1. **프로그래밍 언어 문서 기반 코드 생성**
   - Python 공식 문서 일부를 컨텍스트로 제공
   - 특정 기능을 구현하는 코드 생성

2. **FAQ 기반 Q&A 봇**
   - 자주 묻는 질문 목록을 컨텍스트로 제공
   - 사용자 질문에 적절한 답변 생성

### 과제 2: 새로운 도구 추가

`tool_calling.py`에 새로운 도구를 추가하세요:

```python
# 예시: 파일 내 코드 줄 수를 세는 도구
def count_lines_of_code(file_path: str) -> str:
    """파일의 코드 줄 수를 반환"""
    with open(file_path, 'r') as f:
        lines = f.readlines()
    code_lines = [l for l in lines if l.strip() and not l.strip().startswith('#')]
    return f"코드 줄 수: {len(code_lines)}"

# TOOL_REGISTRY에 추가
TOOL_REGISTRY["count_lines_of_code"] = count_lines_of_code
```

그리고 시스템 프롬프트를 수정하여 LLM이 새 도구를 사용하도록 하세요.

---

## 심화 학습

### RAG 고도화

1. **청킹(Chunking)**: 긴 문서를 작은 조각으로 분할
2. **임베딩(Embedding)**: 문서를 벡터로 변환
3. **벡터 검색**: 질문과 유사한 문서 검색

```python
# 간단한 키워드 기반 검색 예시
def simple_retriever(query: str, documents: List[str]) -> List[str]:
    keywords = query.lower().split()
    scores = []
    for doc in documents:
        score = sum(1 for kw in keywords if kw in doc.lower())
        scores.append((score, doc))
    scores.sort(reverse=True)
    return [doc for score, doc in scores if score > 0][:3]
```

### Tool Calling 고도화

1. **다중 도구 호출**: 여러 도구를 순차/병렬 호출
2. **오류 처리**: 도구 실패 시 재시도 로직
3. **권한 관리**: 위험한 도구 호출 제한

---

## 자가 점검

### RAG

- [ ] RAG가 필요한 상황을 설명할 수 있다
- [ ] 컨텍스트 제공 방법을 이해한다
- [ ] RAG의 한계 (컨텍스트 길이, 검색 품질)를 알고 있다

### Tool Calling

- [ ] Tool Calling의 동작 방식을 설명할 수 있다
- [ ] JSON 형식의 도구 호출 명세를 작성할 수 있다
- [ ] 새로운 도구를 추가할 수 있다

### Reflexion

- [ ] 자기 개선 루프의 원리를 이해한다
- [ ] Reflexion이 효과적인 상황을 알고 있다

---

## 참고 자료

- [LangChain RAG 튜토리얼](https://python.langchain.com/docs/tutorials/rag/)
- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [Reflexion 논문](https://arxiv.org/abs/2303.11366)
