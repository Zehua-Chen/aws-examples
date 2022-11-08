"""test core module
"""
from unittest import TestCase
from pylambda import core
from pylambda.infrastructure import InMemoryDatabase


class CoreTests(TestCase):

    def test_add(self) -> None:
        database = InMemoryDatabase()

        self.assertEqual(2, core.add(1, 1, database))
        self.assertEqual("2", database.entries["value"])
