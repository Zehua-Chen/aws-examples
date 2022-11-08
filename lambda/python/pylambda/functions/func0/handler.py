"""Body of func0
"""
import json

from pylambda import core
from pylambda.infrastructure import DynamoDBDatabase


def handler(event, context):
    """Lambda func0 handler

    Args:
        event (_type_): lambda event
        context (_type_): lambda context

    Returns:
        _type_: lambda result
    """
    database = DynamoDBDatabase()
    value = core.add(1, 2, database)

    return {"statusCode": 200, "body": json.dumps({"value": value})}
