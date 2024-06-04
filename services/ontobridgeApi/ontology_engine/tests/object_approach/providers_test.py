from pathlib import Path
import os
import json
from typing import List

from ontology_engine.providers import get_rules, getRessourceFolder
from ontology_engine.rule_engine import RuleEngine
from ontology_engine.tests.object_approach.test_tools import get_tests, write_result
from ontology_engine.tools import ordered


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
    assert ordered(json_result) == ordered(expected_output)


def test_apply_rules_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal-structure.output.jsonld", providerName)
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


def test_apply_tree_rules_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output, by_tree=True)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal-structure.output.jsonld", providerName)
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


def test_apply_tree_rules_gamingtest_all():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output, by_tree=True)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}-all-structure.output.jsonld", providerName)
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


def test_apply_tree_rules_jobready():
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output, by_tree=True)

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


def test_apply_tree_rules_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules)
    
    serialisation = ruleEngine.generate(minimal_output, by_tree=True)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
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


def test_apply_tree_rules_orientoi():
    providerName = "orientoi_1"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output, by_tree=True)

    json_result = json.dumps(serialisation, sort_keys=True)




    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
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


def test_apply_tree_rules_pitangoo():
    providerName = "PITANGOO"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules)

    serialisation = ruleEngine.generate(minimal_output, by_tree=True)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
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