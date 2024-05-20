from datetime import datetime
from pathlib import Path
import os
import json
from typing import List
from jsonpath_ng.ext import parse


from ontology_engine.rule import Rule
from ontology_engine.rule_engine import RuleEngine

from ontology_engine.tools import ordered, toJsonLD

def getRessourceFolder()-> str: 
    ressourcesDirectory = Path(__file__).parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, 'ressources')
    return ressourcesDirectory

def get_rules(provider : str) -> List[Rule]:
    ressourcesDirectory = getRessourceFolder()
    gamingtestDirectory = os.path.join(ressourcesDirectory, provider)
    gamingtestRuleTest = os.path.join(gamingtestDirectory, f'{provider}-rules.json')
    
    if not os.path.exists(gamingtestRuleTest):
        return []
    
    with open(gamingtestRuleTest) as f:
        data = json.load(f)
        rules : List[Rule] = []
        for rule in data['graph']:
            currentRule = Rule(**rule)
            rules.append(currentRule)
    return rules





