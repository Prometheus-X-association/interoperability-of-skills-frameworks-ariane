from typing import List

from ontology_engine.tests.object_approach.rule import Rule
from ontology_engine.tests.object_approach.tools import toJsonLD


class RuleEngine():
    def __init__(self, rules : List[Rule] ) -> None:
        self.rules = rules
        self.counters : dict[str, int] = {}
        self.instances : List[List[dict]] = []
    
    def getInstance(self, targetClass : str):
        if not targetClass in self.counters.keys:
            self.counters[targetClass] = 0
    
    
    
    def applyRulesToDocument(self, document : dict):
        for rule in self.rules:
            if document.keys().__contains__(rule['sourcePath']):
                print(rule.targetFunction)

    def generate(self, document : dict) -> dict:
        serialisation = {}
        todo = {}
        todo['@todo'] = "Define later with https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data/soo/onto-soo-context-1.0.0.jsonld"
        serialisation['@context'] = todo
        result = []
        self.applyRulesToDocument(document)
        for instance in self.instances:
            result.append(toJsonLD(instance))
        serialisation['graph'] = result
        return serialisation