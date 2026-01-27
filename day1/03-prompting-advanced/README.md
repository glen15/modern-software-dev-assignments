# 프롬프팅 심화

## 개요

이 세션에서는 외부 데이터와 도구를 활용하는 고급 프롬프팅 기법을 배웁니다.

---

## 학습 목표

- RAG(Retrieval-Augmented Generation)의 원리를 이해하고 구현할 수 있다
- Tool Calling을 통해 AI가 외부 함수를 호출하도록 구현할 수 있다
- Reflexion 기법으로 AI의 자기 개선 과정을 이해할 수 있다

---

## 실습 파일

| 파일 | 설명 |
|------|------|
| `rag.py` | RAG 패턴 실습 |
| `tool_calling.py` | Tool Calling 실습 |
| `reflexion.py` | Reflexion 패턴 실습 |
| `data/api_docs.txt` | RAG 실습용 문서 |

---

## 1. RAG (Retrieval-Augmented Generation)

### 개념

LLM에게 **외부 문서(Context)**를 제공하여 정확하고 최신의 정보를 기반으로 답변하게 하는 기법입니다.

### 왜 필요한가?

```
LLM의 한계:
- 학습 데이터 이후 정보 모름 (지식 컷오프)
- 사내 문서, 개인 데이터 접근 불가
- 환각(Hallucination) 발생 가능

RAG로 해결:
- 최신 문서 검색하여 제공
- 회사 내부 문서 활용 가능
- 출처 기반 답변으로 신뢰도 향상
```

### 동작 방식

```
┌─────────┐    ┌─────────┐    ┌─────────┐
│  질문   │ -> │  검색   │ -> │  LLM    │
│         │    │(문서DB) │    │+ 문서   │
└─────────┘    └─────────┘    └─────────┘
                   │               │
                   v               v
              관련 문서들      정확한 답변
```

### 실습: rag.py

API 문서를 기반으로 코드를 생성합니다.

```bash
python rag.py
```

### 핵심 코드 이해

```python
# 문서 로드
CORPUS = load_corpus_from_files(DATA_FILES)

# 컨텍스트 제공 함수 (TODO: 구현 필요)
def YOUR_CONTEXT_PROVIDER(corpus: List[str]) -> List[str]:
    """관련 문서를 선택하여 반환"""
    return []  # <- 이 부분을 수정하세요

# 프롬프트 생성
def make_user_prompt(question: str, context_docs: List[str]) -> str:
    context_block = "\n".join(context_docs)
    return f"Context:\n{context_block}\n\nTask: {question}"
```

### 과제

1. `YOUR_CONTEXT_PROVIDER`에서 관련 문서를 반환하도록 수정하세요
2. `YOUR_SYSTEM_PROMPT`를 작성하여 문서 기반 코딩을 유도하세요

---

## 2. Tool Calling

### 개념

LLM이 **외부 함수(Tool)**를 호출하여 실제 작업을 수행하도록 하는 기법입니다.

### 왜 필요한가?

```
LLM만으로 못하는 것:
- 실시간 날씨 조회
- 데이터베이스 쿼리
- 파일 시스템 접근
- 계산기 (복잡한 수학)

Tool Calling으로 해결:
- LLM이 적절한 도구를 선택
- 도구 호출 명령 생성
- 실행 결과를 LLM에 피드백
```

### 동작 방식

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  질문   │ -> │  LLM    │ -> │  도구   │ -> │  LLM    │
│         │    │(도구선택)│    │  실행   │    │(최종답변)│
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                   │               │
                   v               v
              {"tool": "...",   실행 결과
               "args": {...}}
```

### 실습: tool_calling.py

파일의 함수 반환 타입을 분석하는 도구를 호출합니다.

```bash
python tool_calling.py
```

### 핵심 코드 이해

```python
# 도구 정의
def output_every_func_return_type(file_path: str = None) -> str:
    """파일 내 모든 함수의 반환 타입을 출력"""
    ...

# 도구 레지스트리
TOOL_REGISTRY = {
    "output_every_func_return_type": output_every_func_return_type,
}

# LLM이 생성해야 하는 JSON 형식
{
    "tool": "output_every_func_return_type",
    "args": {"file_path": "tool_calling.py"}
}
```

### 과제

`YOUR_SYSTEM_PROMPT`를 작성하여 LLM이 올바른 JSON 형식의 도구 호출을 생성하도록 하세요.

```python
# 힌트
YOUR_SYSTEM_PROMPT = """
당신은 도구를 호출하는 AI 어시스턴트입니다.

사용 가능한 도구:
- output_every_func_return_type: 파일 내 함수들의 반환 타입을 출력합니다
  - 매개변수: file_path (문자열, 선택적)

응답 형식 (JSON만 출력):
{
    "tool": "도구이름",
    "args": {"인자명": "값"}
}

다른 텍스트 없이 JSON만 출력하세요.
"""
```

---

## 3. Reflexion

### 개념

LLM이 자신의 출력을 **검토하고 개선**하는 반복적 프로세스입니다.

### 동작 방식

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  질문   │ -> │ 초기답변 │ -> │  검토   │ -> │ 개선된  │
│         │    │  생성   │    │ (반성)  │    │  답변   │
└─────────┘    └─────────┘    └─────────┘    └─────────┘
                                  │
                                  v
                            "이 부분이 틀렸네,
                             이렇게 고쳐야겠다"
```

### 실습: reflexion.py

```bash
python reflexion.py
```

---

## 핵심 정리

| 기법 | 적용 상황 | 핵심 |
|------|----------|------|
| RAG | 외부 지식 필요 | 문서를 검색하여 컨텍스트로 제공 |
| Tool Calling | 실제 작업 필요 | LLM이 도구 호출 명령 생성 |
| Reflexion | 높은 품질 필요 | 자기 검토 후 개선 반복 |

---

## 실제 활용 사례

### RAG 활용

- 회사 내부 문서 기반 Q&A 챗봇
- 제품 매뉴얼 기반 고객 지원
- 코드베이스 이해 및 설명

### Tool Calling 활용

- AI 에이전트 (Claude Code, GPT Actions)
- 자동화된 워크플로우
- 데이터 분석 파이프라인

### Reflexion 활용

- 코드 품질 개선
- 문서 작성 및 교정
- 복잡한 문제 해결

---

## 다음 세션

**AI 코딩 도구 실습**에서 Cursor와 Claude Code를 직접 사용해봅니다.
