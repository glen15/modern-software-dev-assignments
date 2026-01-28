"""
Prompting Basics - Streamlit Web UI
AWS Bedrock를 사용한 프롬프팅 기법 실습
"""

import os
import re
import json
import time

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

MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"

# 프롬프팅 예제 정의
EXAMPLES = {
    "K-shot Prompting": {
        "key": "k_shot",
        "description": "예시를 보여주고 패턴을 학습하게 하는 기법",
        "user_prompt": """다음 텍스트에서 정보를 추출하세요.

박지민(28세)은 A사에서 솔루션즈 아키텍트(SA)로 3년째 근무 중입니다. 주로 AWS와 Terraform을 사용하며, 최근에는 멀티 클라우드 전환 프로젝트를 리드하고 있습니다. 연봉은 8천만원이고, 재택근무를 주 2회 합니다.""",
        "temperature": 0.3,
        "hint": """다음 예시를 시스템 프롬프트에 복사해보세요:

입력: 김철수(32세)는 B사에서 솔루션즈 아키텍트(SA)로 5년째 일하고 있습니다. Azure와 Kubernetes 전문가이며, 현재 클라우드 마이그레이션 팀을 이끌고 있습니다. 연봉은 1억원이고, 풀 재택근무입니다.
출력:
[기본정보]
- 이름: 김철수
- 나이: 32세
- 경력: 5년

[회사정보]
- 회사: B사
- 직무: 솔루션즈 아키텍트(SA)
- 역할: 클라우드 마이그레이션 팀 리드

[기술스택]
- Azure, Kubernetes

[근무조건]
- 연봉: 1억원
- 재택: 풀 재택근무""",
    },
    "Chain of Thought": {
        "key": "chain_of_thought",
        "description": "단계별로 추론하도록 유도하는 기법",
        "user_prompt": """이 문제를 풀고, 마지막 줄에 "정답: <숫자>" 형식으로 최종 답을 적으세요.

영희는 3일간 자전거 여행을 했습니다.
- 첫째 날: 총 60km를 이동했고, 출발 후 20km 지점과 도착 15km 전에 휴식을 취했습니다.
- 둘째 날: 첫째 날보다 15km 더 이동했습니다.
- 셋째 날: 둘째 날 이동 거리의 절반만 이동했습니다.

질문: 3일간 총 이동 거리에서 첫째 날 두 휴식 지점 사이의 거리를 빼면 얼마인가요?""",
        "expected": "정답: 147.5",
        "temperature": 0.3,
        "hint": """다음을 시스템 프롬프트에 복사해보세요:

문제를 풀 때 다음 단계를 따르세요:
1. 첫째 날 이동 거리와 두 휴식 지점 사이 거리를 계산하세요
2. 둘째 날 이동 거리를 계산하세요
3. 셋째 날 이동 거리를 계산하세요
4. 3일간 총 이동 거리를 구하세요
5. 최종 답을 계산하세요

단계별로 차근차근 생각해보세요. Let's think step by step.""",
    },
    "Self-Consistency": {
        "key": "self_consistency",
        "description": "여러 번 실행 후 결과를 종합하여 신뢰도 높은 답을 도출하는 기법",
        "user_prompt": """다음 스타트업 아이디어의 성공 가능성을 평가해주세요.

아이디어: AI를 활용한 반려동물 건강 모니터링 서비스
- 스마트 목걸이로 반려동물의 활동량, 심박수, 수면 패턴을 측정
- AI가 이상 징후를 감지하면 보호자에게 알림
- 월 구독료 15,000원
- 타겟: 반려동물 양육 가구 (국내 약 600만 가구)

장점, 단점, 리스크를 분석하고 성공 가능성을 "상/중/하"로 평가해주세요.""",
        "temperature": 1.0,
        "hint": """Self-Consistency는 동일한 질문을 여러 번 실행하고 결과를 종합하는 기법입니다.

주관적 판단이 필요한 문제에서 AI도 매번 다른 관점으로 분석합니다.
여러 분석 결과를 종합하면 더 균형잡힌 판단을 얻을 수 있습니다.

시스템 프롬프트 예시:
스타트업 아이디어를 평가할 때 다음을 분석하세요:
1. 장점 (2-3가지)
2. 단점 (2-3가지)
3. 주요 리스크
4. 성공 가능성 (상/중/하)

간결하게 답변해주세요.""",
    },
}


def call_bedrock(system_prompt: str, user_prompt: str, temperature: float = 0.5) -> str:
    """Call Bedrock Claude model and return the response text."""
    body = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 2048,
        "temperature": temperature,
        "messages": [{"role": "user", "content": user_prompt}],
    }
    if system_prompt:
        body["system"] = system_prompt

    response = bedrock.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body),
    )
    response_body = json.loads(response["body"].read())
    return response_body["content"][0]["text"]


def extract_final_answer(text: str) -> str:
    """Extract the final answer from response text."""
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

    return text.strip()[:50]


# Streamlit 앱 시작
st.set_page_config(page_title="Prompting Basics", page_icon="🤖", layout="wide")

st.title("Prompting Basics")
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
            with st.expander("💡 힌트 보기 (직접 시도해본 후 열어보세요)"):
                st.code(example["hint"], language=None)

        with col2:
            st.markdown("##### System Prompt")
            system_prompt = st.text_area(
                "프롬프팅 기법을 적용한 시스템 프롬프트를 입력하세요",
                key=f"system_prompt_{example['key']}",
                height=200,
                placeholder="여기에 시스템 프롬프트를 입력하세요..."
            )

            if example["key"] == "self_consistency":
                num_runs = st.slider("실행 횟수", min_value=3, max_value=10, value=5, key=f"num_runs_{example['key']}")

            run_btn = st.button("▶️ 실행", key=f"run_{example['key']}", type="primary", use_container_width=True)

        st.divider()

        # 결과 표시 영역
        if run_btn:
            if example["key"] == "self_consistency":
                # Self-Consistency: 다중 실행 후 종합 분석
                results = []
                full_responses = []

                progress_bar = st.progress(0)
                status_text = st.empty()

                total_start = time.time()

                for i in range(num_runs):
                    status_text.text(f"분석 중... ({i+1}/{num_runs})")
                    progress_bar.progress((i + 1) / num_runs)

                    try:
                        start_time = time.time()
                        output = call_bedrock(system_prompt, example["user_prompt"], example["temperature"])
                        elapsed = time.time() - start_time

                        results.append({"run": i + 1, "output": output, "time": elapsed})
                        full_responses.append(f"분석 {i+1}: {output}")
                    except Exception as e:
                        st.error(f"실행 {i+1} 오류: {str(e)}")

                # 종합 분석 요청
                status_text.text("종합 분석 중...")
                try:
                    synthesis_prompt = f"""다음은 동일한 스타트업 아이디어에 대한 {num_runs}개의 독립적인 분석입니다.

{chr(10).join(full_responses)}

위 분석들을 종합하여:
1. 공통적으로 언급된 장점
2. 공통적으로 언급된 단점/리스크
3. 의견이 갈린 부분
4. 종합 평가 (상/중/하)

를 정리해주세요."""

                    synthesis_start = time.time()
                    synthesis = call_bedrock("여러 분석 결과를 객관적으로 종합해주세요.", synthesis_prompt, 0.3)
                    synthesis_time = time.time() - synthesis_start

                except Exception as e:
                    synthesis = f"종합 분석 오류: {str(e)}"
                    synthesis_time = 0

                total_time = time.time() - total_start

                progress_bar.empty()
                status_text.empty()

                col_result1, col_result2 = st.columns(2)

                with col_result1:
                    st.markdown(f"##### 각 실행 결과 (⏱️ 총 {total_time:.1f}초)")
                    with st.container(height=400):
                        for r in results:
                            st.markdown(f"**--- 분석 {r['run']} ({r['time']:.1f}초) ---**")
                            st.text(r["output"])
                            st.divider()

                with col_result2:
                    st.markdown(f"##### 종합 분석 (⏱️ {synthesis_time:.1f}초)")
                    with st.container(height=400):
                        st.markdown(synthesis)

            else:
                # K-shot, Chain of Thought: 시스템 프롬프트 유무 비교
                col_result1, col_result2 = st.columns(2)

                with col_result1:
                    st.markdown("##### 시스템 프롬프트 없이")
                    with st.spinner("실행 중..."):
                        try:
                            start_time = time.time()
                            output_without = call_bedrock("", example["user_prompt"], example["temperature"])
                            time_without = time.time() - start_time

                            st.caption(f"⏱️ {time_without:.1f}초")
                            with st.container(height=300):
                                st.text(output_without)
                        except Exception as e:
                            st.error(f"오류 발생: {str(e)}")

                with col_result2:
                    st.markdown("##### 시스템 프롬프트 적용")
                    with st.spinner("실행 중..."):
                        try:
                            start_time = time.time()
                            output_with = call_bedrock(system_prompt, example["user_prompt"], example["temperature"])
                            time_with = time.time() - start_time

                            st.caption(f"⏱️ {time_with:.1f}초")
                            with st.container(height=300):
                                st.text(output_with)
                        except Exception as e:
                            st.error(f"오류 발생: {str(e)}")
