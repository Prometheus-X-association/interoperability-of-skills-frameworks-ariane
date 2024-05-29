import json
from typing import List
from ontology_engine.providers import get_rules
from ontology_engine.rule import Rule
from ontology_engine.rule_engine import RuleEngine


class OntologyService:
    def __init__(self) -> None:
        pass

    def get_mapping_rules(self, name: str) -> List[Rule]:
        rules = get_rules(name)
        return rules

    def generate_mapping_from_provider_rules(self, name: str, document: list[dict]) -> dict:
        rules = get_rules(name)
        ruleEngine = RuleEngine(rules)
        serialisation = ruleEngine.generate(document)
        return serialisation

    def generate_mapping_from_rules_provided(self, mapping_rules: List[Rule], document: list[dict]) -> dict:
        ruleEngine = RuleEngine(mapping_rules)
        serialisation = ruleEngine.generate(document)
        return serialisation
