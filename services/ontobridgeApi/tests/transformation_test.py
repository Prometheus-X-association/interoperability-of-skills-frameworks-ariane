from pathlib import Path
import os
import json
from typing import List
import pytest

from api.engines.ontology_engine.providers import get_rules
from api.engines.ontology_engine.rule_engine import RuleEngine
from api.engines.ontology_engine.tools import ordered
from api.engines.matching_engine.source_mapping_engine import SourceMappingEngine
from api.engines.matching_engine.term_matching_engine import TermMatchingEngine
from tests.test_tools import get_tests, write_result
from tests.graph_content_check import graph_content_check


def test_apply_tree_rules_orientoi():
    providerName = "orientoi_1"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

    serialisation = ruleEngine.generate(minimal_output)

    term_matching_engine = TermMatchingEngine()
    serialisationWithTerm = term_matching_engine.generate(serialisation, providerName)

    target_framework = "esco"

    matching_source_engine = SourceMappingEngine()
    serialisationWithTermAndMatching = matching_source_engine.generate(serialisationWithTerm, target_framework, providerName)

    json_result = json.dumps(serialisationWithTermAndMatching, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)

    graph_content_check(expected_data, serialisationWithTermAndMatching)

    # print("--------------------------------------")
    # print(ordered(json_result))
    # print("VS")
    # print(ordered(expected_output))
    # print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
        f"{providerName}_full_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_full_expected_data",
    )


def test_apply_tree_rules_pitangoo():
    providerName = "pitangoo"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

    serialisation = ruleEngine.generate(minimal_output)

    term_matching_engine = TermMatchingEngine()
    serialisationWithTerm = term_matching_engine.generate(serialisation, providerName)

    target_framework = "rome"

    matching_source_engine = SourceMappingEngine()
    serialisationWithTermAndMatching = matching_source_engine.generate(serialisationWithTerm, target_framework, providerName)

    json_result = json.dumps(serialisationWithTermAndMatching, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)
    # print("--------------------------------------")
    # print(ordered(json_result))
    # print("VS")
    # print(ordered(expected_output))
    # print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
        f"{providerName}_full_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_full_expected_data",
    )
    
    graph_content_check(expected_data, serialisationWithTermAndMatching)


def test_apply_tree_rules_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

    serialisation = ruleEngine.generate(minimal_output)

    # withMatching = [e for e in serialisation['graph'] if 'id' in e and e.get('id') == 'tr:__skill-id-1__']
    # print(withMatching)
    # print('///////////////')

    term_matching_engine = TermMatchingEngine()
    serialisationWithTerm = term_matching_engine.generate(serialisation, providerName)

    target_framework = "esco"

    matching_source_engine = SourceMappingEngine()
    serialisationWithTermAndMatching = matching_source_engine.generate(serialisationWithTerm, target_framework, providerName)

    json_result = json.dumps(serialisationWithTermAndMatching, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)

    graph_content_check(expected_data, serialisationWithTermAndMatching)
    
    # print("--------------------------------------")
    # print(ordered(json_result))
    # print("VS")
    # print(ordered(expected_output))
    # print("--------------------------------------")
    write_result(
        json.dumps(serialisation, sort_keys=True, indent=1),
        f"{providerName}_full_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_full_expected_data",
    )


def test_apply_tree_rules_jobready():
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)
    serialisation = ruleEngine.generate(minimal_output)
    
    # withMatching = [e for e in serialisation['graph'] if 'id' in e and e.get('id') == 'tr:__skill-id-1__']
    # print(withMatching)
    # print('///////////////')

    term_matching_engine = TermMatchingEngine()
    serialisationWithTerm = term_matching_engine.generate(serialisation, providerName)

    target_framework = "esco"

    matching_source_engine = SourceMappingEngine()
    serialisationWithTermAndMatching = matching_source_engine.generate(serialisationWithTerm, target_framework, providerName)

    json_result = json.dumps(serialisationWithTermAndMatching, sort_keys=True)

    expected_data = get_tests(f"{providerName}.output.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)

    graph_content_check(expected_data, serialisationWithTermAndMatching)

    # print("--------------------------------------")
    # print(ordered(json_result))
    # print("VS")
    # print(ordered(expected_output))
    # print("--------------------------------------")
    write_result(
        json.dumps(serialisationWithTermAndMatching, sort_keys=True, indent=1),
        f"{providerName}_full_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_full_expected_data",
    )


def test_apply_tree_rules_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}-minimal.json", providerName)

    ruleEngine = RuleEngine(rules, providerName)

    serialisation = ruleEngine.generate(minimal_output)

    term_matching_engine = TermMatchingEngine()
    serialisationWithTerm = term_matching_engine.generate(serialisation, providerName)

    target_framework = "esco"

    matching_source_engine = SourceMappingEngine()
    serialisationWithTermAndMatching = matching_source_engine.generate(serialisationWithTerm, target_framework, providerName)

    json_result = json.dumps(serialisationWithTermAndMatching, sort_keys=True)

    expected_data = get_tests(f"{providerName}-minimal.output.jsonld", providerName)
    expected_output = json.dumps(expected_data, sort_keys=True)

    # print("--------------------------------------")
    # print(ordered(json_result))
    # print("VS")
    # print(ordered(expected_output))
    # print("--------------------------------------")
    write_result(
        json.dumps(serialisationWithTermAndMatching, sort_keys=True, indent=1),
        f"{providerName}_full_generated_data",
    )
    write_result(
        json.dumps(expected_data, sort_keys=True, indent=1),
        f"{providerName}_full_expected_data",
    )

    graph_content_check(expected_data, serialisationWithTermAndMatching, False)
