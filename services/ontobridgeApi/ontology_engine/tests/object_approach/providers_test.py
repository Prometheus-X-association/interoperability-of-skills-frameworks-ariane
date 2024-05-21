from pathlib import Path
import os
import json
from typing import List

import pytest

from ontology_engine.tests.object_approach.profile import Profile
from ontology_engine.tests.object_approach.experience import Experience
from ontology_engine.tests.object_approach.pref_label import PrefLabel
from ontology_engine.tests.object_approach.rule import Rule
from ontology_engine.tests.object_approach.rule_engine import RuleEngine
from ontology_engine.tests.object_approach.skill import Skill
from ontology_engine.tests.object_approach.tools import ordered, toJsonLD


def getRessourceFolder() -> str:
    ressourcesDirectory = Path(__file__).parent.parent.parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, "ressources")
    return ressourcesDirectory


def write_result(content, fileName):
    objectApprochDirectory = Path(__file__).parent
    objectApprochDirectory = os.path.join(objectApprochDirectory, "results")
    if not os.path.exists(objectApprochDirectory):
        os.makedirs(objectApprochDirectory)
    file_path = os.path.join(objectApprochDirectory, fileName + ".jsonld")
    f = open(file_path, "w")
    f.write(content)
    f.close()


def get_tests(fileName: str, provider: str) -> List[dict]:
    ressourcesDirectory = getRessourceFolder()
    providerDirectory = os.path.join(ressourcesDirectory, provider)
    path_file = os.path.join(providerDirectory, fileName)
    with open(path_file) as f:
        data = json.load(f)
        return data


def get_rules(provider: str) -> List[Rule]:
    ressourcesDirectory = getRessourceFolder()
    gamingtestDirectory = os.path.join(ressourcesDirectory, provider)
    gamingtestRuleTest = os.path.join(gamingtestDirectory, f"{provider}-rules.json")

    with open(gamingtestRuleTest) as f:
        data = json.load(f)
        rules: List[Rule] = []
        for rule in data["graph"]:
            rule = Rule(**rule)
            rules.append(rule)
    return rules


def test_apply_rules_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}.output-structure.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)
    print("--------------------------------------")
    print(ordered(json_result))
    print("VS")
    print(ordered(expected_output))
    print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
        f"{providerName}_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_expected_data",
    )
    assert ordered(json_result) == ordered(expected_output)


def test_apply_rules_jobready():
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}.output-structure.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)
    print("--------------------------------------")
    print(ordered(json_result))
    print("VS")
    print(ordered(expected_output))
    print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
        f"{providerName}_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_expected_data",
    )
    # assert ordered(json_result) == ordered(expected_output)


def test_apply_rules_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(
        f"{providerName}-minimal-structure.output.jsonld", providerName
    )
    expected_output = json.dumps(expected_data, sort_keys=True)
    print("--------------------------------------")
    print(ordered(json_result))
    print("VS")
    print(ordered(expected_output))
    print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
        f"{providerName}_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_expected_data",
    )
    # assert ordered(json_result) == ordered(expected_output)
