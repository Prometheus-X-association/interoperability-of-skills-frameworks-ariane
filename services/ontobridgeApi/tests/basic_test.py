from datetime import datetime
from pathlib import Path
import os
import json
from typing import List
from jsonpath_ng.ext import parse

from api.engines.ontology_engine.providers import get_rules
from api.engines.ontology_engine.rule import Rule
from tests.test_tools import get_tests


def test_reading_gamintest_rules_structure():
    get_gamingtest_rules = get_rules("gamingtest")
    assert len(get_gamingtest_rules) == 6


def test_reading_gamintest_miminal():
    get_gamingtest_minimal = get_tests("gamingtest-minimal.json", "gamingtest")
    assert len(get_gamingtest_minimal) == 1
    assert get_gamingtest_minimal[0]["User ID"] == "zayne.harding@gmail.com"


def test_reading_gamintest_all():
    get_gamingtest_all = get_tests("gamingtest.json", "gamingtest")
    assert len(get_gamingtest_all) == 50


def test_jsonpath():
    print(os.getcwd())
    dir_path = os.path.dirname(os.path.realpath(__file__))
    print(dir_path)
    sample = os.path.join(dir_path, "movies.json")
    print(sample)
    with open(sample) as movies_json:
        movies = json.load(movies_json)

    jsonpath_expression = parse("$.movies[?(@.cast[:] =~ 'De Niro')].title")

    for match in jsonpath_expression.find(movies):
        print(match.value)


def test_jsonpath_gamingtest():
    get_gamingtest_minimal = get_tests("gamingtest.json", "gamingtest")

    jsonpath_expression = parse("[*].'Date'")
    print("start parsing")
    for match in jsonpath_expression.find(get_gamingtest_minimal):
        print(match.value)


def test_jsonpath_jobready():
    get_gamingtest_minimal = get_tests("jobready_2.json", "jobready_2")

    # fields.skill.name
    jsonpath_expression = parse("[*].fields[*].skill[*].description")
    print("start parsing")
    for match in jsonpath_expression.find(get_gamingtest_minimal):
        print(match.value)
