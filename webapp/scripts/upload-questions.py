import json
from pathlib import Path
import boto3

questions_file = Path(__file__).parent / "questions.json"

dynamodb = boto3.resource(
    "dynamodb",
    region_name = "us-east-1"
)

table = dynamodb.Table("screening-questions")

with questions_file.open("r", encoding="utf-8") as file:
    questions = json.load(file)

with table.batch_writer() as batch:
    for question in questions:
        batch.put_item(Item = question)
        print(
            f"Uploaded {question['testId']} "
            f"{question['questionId']}"
        )

print(f"Upload complete: {len(questions)} questions uploaded.")
