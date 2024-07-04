from pathlib import Path
import os
import json
from typing import List

from api.engines.ontology_engine.providers import get_rules
from api.engines.ontology_engine.rule_engine import RuleEngine
from api.engines.ontology_engine.tools import ordered
from tests.test_tools import get_tests, write_result


<<<<<<< HEAD
<<<<<<< HEAD
def test_apply_tree_rules_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

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
        f"{providerName}-structure-generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}-structure-expected_data",
    )
    # assert ordered(json_result) == ordered(expected_output)


def test_apply_tree_rules_gamingtest_all():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

    serialisation = ruleEngine.generate(minimal_output)

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
        f"{providerName}-structure-all-generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}-structure-all-expected_data",
    )
    assert ordered(json_result) == ordered(expected_output)


def test_apply_tree_rules_jobready():
=======
def test_apply_rules_jobready():
>>>>>>> 3b02988 (refactor and update folders)
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

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
<<<<<<< HEAD
        f"{providerName}-structure-generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}-structure-expected_data",
=======
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

    ruleEngine = RuleEngine(rules, providerName)

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


=======
>>>>>>> 94f4f40 (fix test)
def test_apply_tree_rules_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

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


def test_apply_tree_rules_gamingtest_all():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

    serialisation = ruleEngine.generate(minimal_output)

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
        f"{providerName}_all_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_all_expected_data",
    )
    assert ordered(json_result) == ordered(expected_output)


def test_apply_tree_rules_jobready():
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

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
>>>>>>> 3b02988 (refactor and update folders)
    )
    # assert ordered(json_result) == ordered(expected_output)


def test_apply_tree_rules_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

<<<<<<< HEAD
<<<<<<< HEAD
    serialisation = ruleEngine.generate(minimal_output)
=======
    serialisation = ruleEngine.generate(minimal_output, by_tree=True)
>>>>>>> 3b02988 (refactor and update folders)
=======
    serialisation = ruleEngine.generate(minimal_output)
>>>>>>> f246298 (remove previous algorithm.)

    json_result = json.dumps(serialisation, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.structure.output.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)
    print("--------------------------------------")
    print(ordered(json_result))
    print("VS")
    print(ordered(expected_output))
    print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
<<<<<<< HEAD
        f"{providerName}-structure-generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}-structure-expected_data",
=======
        f"{providerName}_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_expected_data",
>>>>>>> 3b02988 (refactor and update folders)
    )
    # assert ordered(json_result) == ordered(expected_output)


def test_apply_tree_rules_orientoi():
    providerName = "orientoi_1"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

<<<<<<< HEAD
<<<<<<< HEAD
    serialisation = ruleEngine.generate(minimal_output)
=======
    serialisation = ruleEngine.generate(minimal_output, by_tree=True)
>>>>>>> 3b02988 (refactor and update folders)
=======
    serialisation = ruleEngine.generate(minimal_output)
>>>>>>> f246298 (remove previous algorithm.)

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
<<<<<<< HEAD
        f"{providerName}-structure-generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}-structure-expected_data",
=======
        f"{providerName}_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_expected_data",
>>>>>>> 3b02988 (refactor and update folders)
    )
    # assert ordered(json_result) == ordered(expected_output)


def test_apply_tree_rules_pitangoo():
    providerName = "PITANGOO"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

<<<<<<< HEAD
<<<<<<< HEAD
    serialisation = ruleEngine.generate(minimal_output)
=======
    serialisation = ruleEngine.generate(minimal_output, by_tree=True)
>>>>>>> 3b02988 (refactor and update folders)
=======
    serialisation = ruleEngine.generate(minimal_output)
>>>>>>> f246298 (remove previous algorithm.)

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
<<<<<<< HEAD
        f"{providerName}-structure-generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}-structure-expected_data",
=======
        f"{providerName}_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_expected_data",
>>>>>>> 3b02988 (refactor and update folders)
    )
    # assert ordered(json_result) == ordered(expected_output)
