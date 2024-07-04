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
        ruleEngine = RuleEngine(rules, name)
        serialisation = ruleEngine.generate(document)
        return serialisation

    def generate_mapping_from_rules_provided(self, mapping_rules: List[Rule], document: list[dict]) -> dict:
        # TODO : when rule are sent, we need to know the name of the provider to match term. e.g: custom must be changed.
        ruleEngine = RuleEngine(mapping_rules, "custom")
        serialisation = ruleEngine.generate(document)
        return serialisation
