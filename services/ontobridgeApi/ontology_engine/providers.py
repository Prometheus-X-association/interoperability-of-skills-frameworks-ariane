from datetime import datetime
from pathlib import Path
import os
import json
from typing import List
from jsonpath_ng.ext import parse


from ontology_engine.rule import Rule
from ontology_engine.rule_engine import RuleEngine

from ontology_engine.tools import ordered, toJsonLD



def get_provider_folder(provider) -> str:
    if provider == 'jobready_2':
        providerFolder = 'jobready'
    elif provider == 'orientoi_1':
        providerFolder = 'orientoi'
    else:
        providerFolder = provider
    return providerFolder


def getRessourceFolder() -> str:
    ressourcesDirectory = Path(__file__).parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, "ressources")
    ressourcesDirectory = os.path.join(ressourcesDirectory, "__26__")
    return ressourcesDirectory


def get_rules(provider: str) -> List[Rule]:
    ressourcesDirectory = getRessourceFolder()
    providerFolder = get_provider_folder(provider)
    
    gamingtestDirectory = os.path.join(ressourcesDirectory, providerFolder)
    
    gamingtestRuleTest = os.path.join(gamingtestDirectory, f"{provider}-rules.json")

    if not os.path.exists(gamingtestRuleTest):
        return []

    with open(gamingtestRuleTest, encoding="utf8") as f:
        data = json.load(f)
        rules: List[Rule] = []
        for rule in data["graph"]:
            currentRule = Rule(**rule)
            rules.append(currentRule)
    return rules
