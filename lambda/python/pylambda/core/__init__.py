"""Core
"""
from abc import abstractmethod


class KeyValueDatabase:
    """Database interface
    """

    @abstractmethod
    def put(self, key: str, value: str) -> None:
        """Put a key and a value

        Args:
            key (str): _description_
            value (str): _description_
        """


def add(value_a: int, value_b: int, database: KeyValueDatabase) -> int:
    """Add

    Args:
        value_a (int): a
        value_b (int): b

    Returns:
        int: a + b
    """
    result = value_a + value_b
    database.put("value", f"{result}")

    return result
