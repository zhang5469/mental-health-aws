import json
import boto3
from decimal import Decimal

# Connect to DynamoDB
dynamodb = boto3.resource("dynamodb")

# Get the screening questions table
table = dynamodb.Table("screening-questions")


def convert_decimal(value):
    """
    Converts DynamoDB Decimal values into normal
    Python integers or floating-point numbers.
    """
    if isinstance(value, Decimal):
        if value % 1 == 0:
            return int(value)

        return float(value)

    raise TypeError


def lambda_handler(event, context):
    try:
        # Get the screening type from the API URL:
        # /questions/anxiety or /questions/depression
        path_parameters = event.get("pathParameters") or {}
        screening_type = path_parameters.get("screeningType", "").upper()

        if screening_type not in ["ANXIETY", "DEPRESSION"]:
            return {
                "statusCode": 400,
                "headers": {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*"
                },
                "body": json.dumps({
                    "message": "Invalid screening type"
                })
            }

        # Scan the table and return questions matching the test type
        response = table.scan(
            FilterExpression="testId = :test_id",
            ExpressionAttributeValues={
                ":test_id": screening_type
            }
        )

        questions = response.get("Items", [])

        # Put questions in their correct order
        questions.sort(
            key=lambda question: question.get("order", 0)
        )

        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(
                {
                    "questions": questions
                },
                default=convert_decimal
            )
        }

    except Exception as error:
        print(f"Error loading questions: {error}")

        return {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({
                "message": "Unable to load screening questions"
            })
        }