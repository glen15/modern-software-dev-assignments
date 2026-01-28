"""
Prompting Basics - Streamlit Web UI
AWS Bedrock를 사용한 프롬프팅 기법 실습
"""

import os
import re
import json
from collections import Counter

import boto3
import streamlit as st
from dotenv import load_dotenv

load_dotenv()

# Bedrock client setup
@st.cache_resource
def get_bedrock_client():
    return boto3.client(
        "bedrock-runtime",
        region_name=os.environ.get("AWS_REGION", "us-east-1"),
    )

bedrock = get_bedrock_client()

MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0")

# 프롬프팅 예제 정의
EXAMPLES = {
    "K-shot Prompting": {
        "key": "k_shot",
        "description": "예시를 보여주고 패턴을 학습하게 하는 기법",
        "user_prompt": """다음 텍스트에서 정보를 추출하세요.

박지민(28세)은 카카오에서 백엔드 개발자로 3년째 근무 중입니다.""",
        "expected": "이름: 박지민\n나이: 28\n회사: 카카오\n직무: 백엔드 개발자\n경력: 3년",
        "temperature": 0.3,
        "hint": """예시를 시스템 프롬프트에 추가해서 출력 형식을 지정해보세요:

입력: 김철수(32세)는 네이버에서 프론트엔드 개발자로 5년째 일하고 있습니다.
출력:
이름: 김철수
나이: 32
회사: 네이버
직무: 프론트엔드 개발자
경력: 5년""",
    },
    "Chain of Thought": {
        "key": "chain_of_thought",
        "description": "단계별로 추론하도록 유도하는 기법",
        "user_prompt": """이 문제를 풀고, 마지막 줄에 "정답: <숫자>" 형식으로 최종 답을 적으세요.

3의 12345제곱을 100으로 나눈 나머지는 얼마인가요? (3^12345 mod 100)""",
        "expected": "정답: 43",
        "temperature": 0.3,
        "hint": "'단계별로 생각해보세요' 또는 'Let's think step by step'을 추가해보세요.",
    },
    "Self-Consistency": {
        "key": "self_consistency",
        "description": "여러 번 실행 후 다수결로 답을 결정하는 기법",
        "user_prompt": """이 문제를 풀고, 마지막 줄에 "정답: <숫자>" 형식으로 최종 답을 적으세요.

영희는 60km 자전거 여행 중 두 번 멈췄습니다. 첫 번째는 출발 후 20km 지점에서 멈췄고,
두 번째는 도착 15km 전에 멈췄습니다. 첫 번째 정류장과 두 번째 정류장 사이의 거리는 몇 km인가요?""",
        "expected": "정답: 25",
        "temperature": 1.0,
        "hint": "높은 temperature로 다양한 답변을 생성하고 다수결로 결정합니다.",
    },
}


def call_bedrock(system_prompt: str, user_prompt: str, temperature: float = 0.5) -> str:
    """Call Bedrock Nova model and return the response text."""
    messages = [{"role": "user", "content": [{"text": user_prompt}]}]

    body = {
        "messages": messages,
        "inferenceConfig": {
            "temperature": temperature,
            "maxTokens": 2048,
        },
    }

    if system_prompt:
        body["system"] = [{"text": system_prompt}]

    response = bedrock.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
    )

    response_body = json.loads(response["body"].read())
    return response_body["output"]["message"]["content"][0]["text"]


def extract_final_answer(text: str) -> str:
    """Extract the final '정답: ...' or 'Answer: ...' line from a verbose reasoning trace."""
    # 한글 "정답:" 패턴 먼저 시도
    matches = re.findall(r"(?mi)^\s*정답\s*:\s*(.+)\s*$", text)
    if matches:
        value = matches[-1].strip()
        num_match = re.search(r"-?\d+(?:\.\d+)?", value.replace(",", ""))
        if num_match:
            return f"정답: {num_match.group(0)}"
        return f"정답: {value}"

    # 영어 "Answer:" 패턴
    matches = re.findall(r"(?mi)^\s*answer\s*:\s*(.+)\s*$", text)
    if matches:
        value = matches[-1].strip()
        num_match = re.search(r"-?\d+(?:\.\d+)?", value.replace(",", ""))
        if num_match:
            return f"정답: {num_match.group(0)}"
        return f"정답: {value}"
    return text.strip()


# Streamlit 앱 시작
st.set_page_config(page_title="Prompting Basics", page_icon="🤖", layout="wide")

st.title("🤖 Prompting Basics")
st.markdown("### AWS Bedrock를 사용한 프롬프팅 기법 실습")
st.caption(f"사용 모델: `{MODEL_ID}`")

# 탭 생성
tabs = st.tabs(list(EXAMPLES.keys()))

for tab, (name, example) in zip(tabs, EXAMPLES.items()):
    with tab:
        st.markdown(f"**{example['description']}**")

        col1, col2 = st.columns(2)

        with col1:
            st.markdown("##### User Prompt (문제)")
            st.code(example["user_prompt"], language=None)
            st.info(f"💡 **힌트:** {example['hint']}")

        with col2:
            st.markdown("##### System Prompt")
            system_prompt = st.text_area(
                "프롬프팅 기법을 적용한 시스템 프롬프트를 입력하세요",
                key=f"system_prompt_{example['key']}",
                height=150,
                placeholder="여기에 시스템 프롬프트를 입력하세요..."
            )

            if example["key"] == "self_consistency":
                num_runs = st.slider("실행 횟수", min_value=3, max_value=10, value=5, key=f"num_runs_{example['key']}")

            run_btn = st.button("▶️ 실행", key=f"run_{example['key']}", type="primary", use_container_width=True)

        st.divider()

        # 결과 표시 영역
        if run_btn:
            if example["key"] == "self_consistency":
                # 다중 실행
                results = []
                answers = []

                progress_bar = st.progress(0)
                status_text = st.empty()

                for i in range(num_runs):
                    status_text.text(f"실행 중... ({i+1}/{num_runs})")
                    progress_bar.progress((i + 1) / num_runs)

                    try:
                        output = call_bedrock(system_prompt, example["user_prompt"], example["temperature"])
                        final_answer = extract_final_answer(output)
                        results.append({"run": i + 1, "output": output, "answer": final_answer})
                        answers.append(final_answer.strip())
                    except Exception as e:
                        st.error(f"실행 {i+1} 오류: {str(e)}")

                progress_bar.empty()
                status_text.empty()

                if answers:
                    counts = Counter(answers)
                    majority_answer, majority_count = counts.most_common(1)[0]

                    col_result1, col_result2 = st.columns([1, 2])

                    with col_result1:
                        st.metric("다수결 결과", majority_answer, f"{majority_count}/{num_runs}")

                        st.markdown("**답변 분포:**")
                        for ans, cnt in counts.most_common():
                            st.write(f"- `{ans}`: {cnt}회")

                    with col_result2:
                        with st.expander("상세 결과 보기", expanded=True):
                            for r in results:
                                st.markdown(f"**실행 {r['run']}** - 추출된 답: `{r['answer']}`")
                                st.code(r["output"], language=None)
                                st.divider()

            else:
                # 단일 실행
                with st.spinner("실행 중..."):
                    try:
                        output = call_bedrock(system_prompt, example["user_prompt"], example["temperature"])

                        if "정답:" in example["expected"] or "Answer:" in example["expected"]:
                            final_answer = extract_final_answer(output)
                        else:
                            final_answer = output.strip()

                        col_result1, col_result2 = st.columns([1, 2])

                        with col_result1:
                            st.metric("추출된 결과", final_answer)

                        with col_result2:
                            st.markdown("**모델 출력:**")
                            st.code(output, language=None)

                    except Exception as e:
                        st.error(f"오류 발생: {str(e)}")
