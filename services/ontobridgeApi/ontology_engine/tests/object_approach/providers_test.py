from pathlib import Path
import os
import json
from typing import List

from ontology_engine.providers import get_rules, getRessourceFolder
from ontology_engine.rule_engine import RuleEngine
from ontology_engine.tools import ordered


def write_result(content, fileName):
    objectApprochDirectory = Path(__file__).parent
    objectApprochDirectory = os.path.join(objectApprochDirectory, "results")
    if not os.path.exists(objectApprochDirectory):
        os.makedirs(objectApprochDirectory)
    file_path = os.path.join(objectApprochDirectory, fileName + ".jsonld")
    f = open(file_path, "w")
    f.write(content)
    f.close()


def get_tests(fileName : str, provider : str) -> List[dict]:
    ressourcesDirectory = getRessourceFolder()
    providerDirectory = os.path.join(ressourcesDirectory, provider)
    path_file = os.path.join(providerDirectory, fileName)
    with open(path_file) as f:
        data = json.load(f)
        return data

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
    assert ordered(json_result) == ordered(expected_output)


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
    assert ordered(json_result) == ordered(expected_output)