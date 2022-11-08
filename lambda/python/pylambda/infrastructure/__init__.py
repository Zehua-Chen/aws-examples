from pylambda.core import KeyValueDatabase


class InMemoryDatabase(KeyValueDatabase):

    def __init__(self) -> None:
        super().__init__()

        self.entries = {}

    def put(self, key: str, value: str) -> None:
        self.entries[key] = value


class DynamoDBDatabase(KeyValueDatabase):

    def put(self, key: str, value: str) -> None:
        print(f"storing {key} {value} to DynamoDB...")
        return super().put(key, value)
