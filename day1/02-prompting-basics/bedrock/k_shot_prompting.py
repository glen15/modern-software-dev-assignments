import os
import json
import boto3
from dotenv import load_dotenv

load_dotenv()

# Bedrock client setup
bedrock = boto3.client(
    "bedrock-runtime",
    region_name=os.environ.get("AWS_REGION", "us-east-1"),
)

MODEL_ID = os.environ.get("BEDROCK_MODEL_ID", "amazon.nova-lite-v1:0")

NUM_RUNS_TIMES = 5

# TODO: Fill this in!
YOUR_SYSTEM_PROMPT = ""

USER_PROMPT = """
Reverse the order of letters in the following word. Only output the reversed word, no other text:

httpstatus
"""


EXPECTED_OUTPUT = "sutatsptth"


def call_bedrock(system_prompt: str, user_prompt: str, temperature: float = 0.5) -> str:
    """Call Bedrock Nova model and return the response text."""
    messages = [{"role": "user", "content": [{"text": user_prompt}]}]

    body = {
        "messages": messages,
        "inferenceConfig": {
            "temperature": temperature,
            "maxTokens": 1024,
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


def test_your_prompt(system_prompt: str) -> bool:
    """Run the prompt up to NUM_RUNS_TIMES and return True if any output matches EXPECTED_OUTPUT.

    Prints "SUCCESS" when a match is found.
    """
    for idx in range(NUM_RUNS_TIMES):
        print(f"Running test {idx + 1} of {NUM_RUNS_TIMES}")
        output_text = call_bedrock(system_prompt, USER_PROMPT, temperature=0.5)
        output_text = output_text.strip()
        if output_text.strip() == EXPECTED_OUTPUT.strip():
            print("SUCCESS")
            return True
        else:
            print(f"Expected output: {EXPECTED_OUTPUT}")
            print(f"Actual output: {output_text}")
    return False


if __name__ == "__main__":
    test_your_prompt(YOUR_SYSTEM_PROMPT)
