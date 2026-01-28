"""
Prompting Basics - Gradio Web UI
AWS Bedrock를 사용한 프롬프팅 기법 실습
"""

import os
import re
import json
import time
from collections import Counter

import boto3
import gradio as gr
from dotenv import load_dotenv

load_dotenv()

# Bedrock client setup
bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.environ.get("AWS_REGION", "us-east-1"),
)

MODEL_ID = "anthropic.claude-3-haiku-20240307-v1:0"

# 프롬프팅 예제 정의
EXAMPLES = {
    "k_shot": {
        "name": "K-shot Prompting",
        "description": "예시를 보여주고 패턴을 학습하게 하는 기법",
        "user_prompt": """다음 텍스트에서 정보를 추출하세요.

박지민(28세)은 A사에서 솔루션즈 아키텍트(SA)로 3년째 근무 중입니다. 주로 AWS와 Terraform을 사용하며, 최근에는 멀티 클라우드 전환 프로젝트를 리드하고 있습니다. 연봉은 8천만원이고, 재택근무를 주 2회 합니다.""",
        "expected": "",
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
    "chain_of_thought": {
        "name": "Chain of Thought",
        "description": "단계별로 추론하도록 유도하는 기법",
        "user_prompt": """질문에 답하세요.

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
    "self_consistency": {
        "name": "Self-Consistency",
        "description": "여러 번 실행 후 결과를 종합하여 신뢰도 높은 답을 도출하는 기법",
        "user_prompt": """다음 스타트업 아이디어의 성공 가능성을 평가해주세요.

아이디어: AI를 활용한 반려동물 건강 모니터링 서비스
- 스마트 목걸이로 반려동물의 활동량, 심박수, 수면 패턴을 측정
- AI가 이상 징후를 감지하면 보호자에게 알림
- 월 구독료 15,000원
- 타겟: 반려동물 양육 가구 (국내 약 600만 가구)

장점, 단점, 리스크를 분석하고 성공 가능성을 "상/중/하"로 평가해주세요.""",
        "expected": "",
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

    # "상", "중", "하" 패턴 (Self-Consistency용)
    text_lower = text.strip()
    if re.search(r'\b상\b', text_lower):
        return "상"
    if re.search(r'\b중\b', text_lower):
        return "중"
    if re.search(r'\b하\b', text_lower):
        return "하"

    return text.strip()[:50]  # 너무 길면 자르기


def run_single(example_key: str, system_prompt: str) -> tuple[str, str]:
    """단일 실행 - 시스템 프롬프트 없이/있이 비교"""
    example = EXAMPLES[example_key]

    try:
        # 시스템 프롬프트 없이 실행
        start_time = time.time()
        output_without = call_bedrock("", example["user_prompt"], example["temperature"])
        time_without = time.time() - start_time

        # 시스템 프롬프트 적용해서 실행
        start_time = time.time()
        output_with = call_bedrock(system_prompt, example["user_prompt"], example["temperature"])
        time_with = time.time() - start_time

        result_without = f"⏱️ {time_without:.1f}초\n\n{output_without}"
        result_with = f"⏱️ {time_with:.1f}초\n\n{output_with}"

        return result_without, result_with

    except Exception as e:
        return f"오류 발생: {str(e)}", f"오류 발생: {str(e)}"


def run_multiple(example_key: str, system_prompt: str, num_runs: int) -> tuple[str, str]:
    """다중 실행 (Self-Consistency용) - 결과 종합 분석"""
    example = EXAMPLES[example_key]

    try:
        results = []
        full_responses = []
        total_start = time.time()

        for i in range(int(num_runs)):
            start_time = time.time()
            output = call_bedrock(system_prompt, example["user_prompt"], example["temperature"])
            elapsed = time.time() - start_time

            results.append(f"--- 분석 {i+1} ({elapsed:.1f}초) ---\n{output}")
            full_responses.append(f"분석 {i+1}: {output}")

        # 종합 분석 요청
        synthesis_prompt = f"""다음은 동일한 스타트업 아이디어에 대한 {num_runs}개의 독립적인 분석입니다.

{chr(10).join(full_responses)}

위 분석들을 종합하여:
1. 공통적으로 언급된 장점
2. 공통적으로 언급된 단점/리스크
3. 의견이 갈린 부분
4. 종합 평가 (상/중/하)

를 정리해주세요."""

        start_time = time.time()
        synthesis = call_bedrock("여러 분석 결과를 객관적으로 종합해주세요.", synthesis_prompt, 0.3)
        synthesis_time = time.time() - start_time

        total_time = time.time() - total_start
        all_results = f"⏱️ 총 {total_time:.1f}초\n\n" + "\n\n".join(results)
        summary = f"⏱️ 종합 분석 ({synthesis_time:.1f}초)\n\n{synthesis}"

        return all_results, summary

    except Exception as e:
        return f"오류 발생: {str(e)}", ""


def create_tab(example_key: str):
    """각 프롬프팅 기법 탭 생성"""
    example = EXAMPLES[example_key]

    with gr.Column():
        gr.Markdown(f"### {example['description']}")

        with gr.Row():
            with gr.Column(scale=1):
                gr.Markdown("**User Prompt (문제)**")
                gr.Textbox(value=example["user_prompt"], lines=8, interactive=False, label="")
                with gr.Accordion("💡 힌트 보기 (직접 시도해본 후 열어보세요)", open=False):
                    gr.Textbox(value=example["hint"], lines=15, interactive=True, label="힌트 (복사해서 위 System Prompt에 붙여넣기)")

            with gr.Column(scale=1):
                system_prompt = gr.Textbox(
                    label="System Prompt (여기에 프롬프트 기법을 적용하세요)",
                    lines=12,
                    placeholder="프롬프팅 기법을 적용한 시스템 프롬프트를 입력하세요..."
                )

        with gr.Row():
            run_btn = gr.Button("실행", variant="primary")
            if example_key == "self_consistency":
                num_runs = gr.Slider(minimum=3, maximum=10, value=5, step=1, label="실행 횟수")

        if example_key == "self_consistency":
            with gr.Row():
                with gr.Column():
                    output_left = gr.Textbox(label="각 실행 결과", lines=12, max_lines=12)
                with gr.Column():
                    output_right = gr.Textbox(label="다수결 요약", lines=12, max_lines=12)
            run_btn.click(
                fn=lambda s, n: run_multiple(example_key, s, n),
                inputs=[system_prompt, num_runs],
                outputs=[output_left, output_right]
            )
        else:
            with gr.Row():
                with gr.Column():
                    output_left = gr.Textbox(label="시스템 프롬프트 없이", lines=12, max_lines=12)
                with gr.Column():
                    output_right = gr.Textbox(label="시스템 프롬프트 적용", lines=12, max_lines=12)
            run_btn.click(
                fn=lambda s: run_single(example_key, s),
                inputs=[system_prompt],
                outputs=[output_left, output_right]
            )


# Gradio 앱 생성
with gr.Blocks(title="Prompting Basics", theme=gr.themes.Soft()) as app:
    gr.Markdown("""
    # Prompting Basics
    ### AWS Bedrock를 사용한 프롬프팅 기법 실습

    각 탭에서 다양한 프롬프팅 기법을 실습해보세요. 시스템 프롬프트에 적절한 기법을 적용해보세요.
    """)

    with gr.Tabs():
        with gr.TabItem("K-shot Prompting"):
            create_tab("k_shot")

        with gr.TabItem("Chain of Thought"):
            create_tab("chain_of_thought")

        with gr.TabItem("Self-Consistency"):
            create_tab("self_consistency")


if __name__ == "__main__":
    app.launch()
