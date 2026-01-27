# Day 1 심화 과제

## 개요

오늘 배운 모든 프롬프팅 기법(K-shot, CoT, RAG, Tool Calling)을 종합하여 AI 어시스턴트 프로토타입을 만듭니다.

**예상 소요 시간**: 1시간 ~ 1시간 30분
**난이도**: ★★★ (심화)

---

## 과제: 코드 분석 AI 어시스턴트

### 목표

Python 파일을 분석하고 질문에 답하는 AI 어시스턴트를 구현합니다.

### 요구사항

1. **파일 읽기 도구**: 지정된 Python 파일을 읽어오는 기능
2. **코드 분석 도구**: 함수, 클래스 목록을 추출하는 기능
3. **RAG 기반 답변**: 코드를 컨텍스트로 제공하여 질문에 답변
4. **대화형 인터페이스**: 반복적으로 질문할 수 있는 CLI

### 예시 실행

```
=== 코드 분석 AI 어시스턴트 ===

분석할 파일 경로: ./example.py
파일을 불러왔습니다. (42줄)

질문을 입력하세요 (종료: quit):
> 이 파일에 있는 함수 목록을 알려줘

[도구 호출: analyze_functions]
분석 결과:
- calculate_total(items) -> float
- validate_input(data) -> bool
- main() -> None

이 파일에는 3개의 함수가 있습니다:
1. calculate_total: 항목들의 합계를 계산합니다
2. validate_input: 입력 데이터를 검증합니다
3. main: 프로그램 진입점입니다

> calculate_total 함수를 설명해줘

[RAG 컨텍스트: calculate_total 함수 코드]
calculate_total 함수는 items 리스트를 받아서...
```

---

## 구현 가이드

### 1단계: 도구 정의

```python
import ast
from typing import List, Dict, Any

def read_file(file_path: str) -> str:
    """파일 내용을 읽어서 반환"""
    # TODO: 구현

def analyze_functions(code: str) -> List[Dict[str, Any]]:
    """코드에서 함수 정보 추출"""
    # TODO: ast 모듈 사용하여 구현
    # 반환 형식: [{"name": "func_name", "args": [...], "returns": "..."}]

def analyze_classes(code: str) -> List[Dict[str, Any]]:
    """코드에서 클래스 정보 추출"""
    # TODO: 구현

TOOLS = {
    "read_file": read_file,
    "analyze_functions": analyze_functions,
    "analyze_classes": analyze_classes,
}
```

### 2단계: 프롬프트 설계

```python
SYSTEM_PROMPT = """
당신은 Python 코드 분석 전문가입니다.

## 사용 가능한 도구

### read_file
파일 내용을 읽습니다.
- 매개변수: file_path (문자열)
- 반환: 파일 내용

### analyze_functions
코드에서 함수 목록을 추출합니다.
- 매개변수: code (문자열)
- 반환: 함수 정보 리스트

### analyze_classes
코드에서 클래스 목록을 추출합니다.
- 매개변수: code (문자열)
- 반환: 클래스 정보 리스트

## 응답 규칙

1. 도구가 필요한 경우 JSON 형식으로 호출:
   {"tool": "도구이름", "args": {"매개변수": "값"}}

2. 도구 결과를 받은 후 사용자에게 친절하게 설명

3. 코드 관련 질문에는 항상 구체적인 근거를 제시
"""
```

### 3단계: 메인 루프

```python
from ollama import chat

def main():
    print("=== 코드 분석 AI 어시스턴트 ===\n")

    file_path = input("분석할 파일 경로: ")
    code = read_file(file_path)
    print(f"파일을 불러왔습니다. ({len(code.splitlines())}줄)\n")

    conversation = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"분석할 코드:\n```python\n{code}\n```"}
    ]

    while True:
        question = input("\n질문 (종료: quit): ")
        if question.lower() == "quit":
            break

        conversation.append({"role": "user", "content": question})

        # TODO: LLM 호출 및 도구 실행 로직
        # 1. LLM 응답 받기
        # 2. 도구 호출이면 실행
        # 3. 결과를 다시 LLM에 전달
        # 4. 최종 응답 출력

        response = process_with_tools(conversation)
        print(f"\n{response}")
        conversation.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    main()
```

### 4단계: 도구 실행 로직

```python
import json

def process_with_tools(conversation: List[Dict]) -> str:
    """LLM 응답을 처리하고 필요시 도구 실행"""

    response = chat(
        model="llama3.1:8b",
        messages=conversation,
        options={"temperature": 0.3}
    )

    content = response.message.content

    # JSON 도구 호출 감지
    try:
        tool_call = json.loads(content)
        if "tool" in tool_call:
            # 도구 실행
            tool_name = tool_call["tool"]
            tool_args = tool_call.get("args", {})

            if tool_name in TOOLS:
                result = TOOLS[tool_name](**tool_args)

                # 결과를 LLM에 피드백
                conversation.append({"role": "assistant", "content": content})
                conversation.append({
                    "role": "user",
                    "content": f"[도구 결과]\n{result}\n\n이 결과를 바탕으로 질문에 답해줘."
                })

                # 재귀적으로 처리 (추가 도구 호출 가능)
                return process_with_tools(conversation)
    except json.JSONDecodeError:
        pass

    return content
```

---

## 테스트용 예제 파일

`example.py`를 생성하여 테스트하세요:

```python
"""예제 모듈: 간단한 계산기"""

from typing import List

class Calculator:
    """기본 계산기 클래스"""

    def __init__(self):
        self.history: List[str] = []

    def add(self, a: float, b: float) -> float:
        """두 수를 더합니다"""
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result

    def subtract(self, a: float, b: float) -> float:
        """두 수를 뺍니다"""
        result = a - b
        self.history.append(f"{a} - {b} = {result}")
        return result

def validate_number(value: str) -> bool:
    """문자열이 숫자인지 검증"""
    try:
        float(value)
        return True
    except ValueError:
        return False

def main():
    """메인 함수"""
    calc = Calculator()
    print(calc.add(10, 5))
    print(calc.subtract(10, 5))

if __name__ == "__main__":
    main()
```

---

## 평가 기준

| 항목 | 배점 |
|------|------|
| 도구 정의 및 구현 | 30% |
| RAG 기반 컨텍스트 제공 | 25% |
| 프롬프트 설계 | 20% |
| 대화형 인터페이스 | 15% |
| 에러 처리 및 UX | 10% |

---

## 보너스 도전

- [ ] **다중 파일 지원**: 여러 파일을 동시에 분석
- [ ] **코드 수정 제안**: 리팩토링 제안 기능
- [ ] **의존성 분석**: import 문 분석하여 의존 관계 시각화
- [ ] **테스트 생성**: 함수에 대한 테스트 코드 자동 생성

---

## 제출물

1. `code_assistant.py` - 완성된 어시스턴트
2. `example.py` - 테스트에 사용한 예제 파일
3. 실행 결과 스크린샷 또는 로그

---

## 참고 자료

- [Python ast 모듈](https://docs.python.org/3/library/ast.html)
- [Ollama Python 라이브러리](https://github.com/ollama/ollama-python)
