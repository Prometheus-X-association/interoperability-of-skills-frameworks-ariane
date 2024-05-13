from datetime import datetime
from pathlib import Path
import os
import json
from typing import List

import pytest

from ontology_engine.tests.object_approach.profile import Profile
from ontology_engine.tests.object_approach.experience import Experience
from ontology_engine.tests.object_approach.pref_label import PrefLabel
from ontology_engine.tests.object_approach.rule import Rule
from ontology_engine.tests.object_approach.skill import Skill
from ontology_engine.tests.object_approach.tools import ordered, toJsonLD

def get_gamingtest(fileName : str = '') -> List[dict]:
    ressourcesDirectory = Path(__file__).parent.parent.parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, 'ressources')
    gamingtestDirectory = os.path.join(ressourcesDirectory, 'gamingtest')
    gamingtestMinimal = os.path.join(gamingtestDirectory, fileName)
    with open(gamingtestMinimal) as f:
        data = json.load(f)
        return data 

@pytest.fixture
def get_gamingtest_rules() -> List[Rule]:
    ressourcesDirectory = Path(__file__).parent.parent.parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, 'ressources')
    gamingtestDirectory = os.path.join(ressourcesDirectory, 'gamingtest')
    gamingtestRuleTest = os.path.join(gamingtestDirectory, 'gamingtest-rules-structure.json')
    
    with open(gamingtestRuleTest) as f:
        data = json.load(f)
        rules : List[Rule] = []
        for rule in data['graph']:
            rule = Rule(**rule)
            rules.append(rule)
    return rules

@pytest.fixture
def get_gamingtest_minimal() -> List[dict]:
    return get_gamingtest('gamingtest-minimal.json')
    
@pytest.fixture
def get_gamingtest_all() -> List[dict]:
    return get_gamingtest('gamingtest.json')

def test_reading_gamintest_rules_structure(get_gamingtest_rules):
    assert len(get_gamingtest_rules) == 6

def test_reading_gamintest_miminal(get_gamingtest_minimal):
    assert len(get_gamingtest_minimal) == 1
    assert get_gamingtest_minimal[0]["User ID"] == "zayne.harding@gmail.com"

def test_reading_gamintest_all(get_gamingtest_all):
    assert len(get_gamingtest_all) == 50

def test_serialisation():
    experience = Experience()
    experience.id = "tr:__generated-id-1__"
    experience.type = "soo:Experience"
    experience.prefLabel = PrefLabel(value="Problem-Solving Puzzle", language= "en")
    experience.result = "validated"
    experience.dateFrom = datetime(2023,6,28)
        
    profile = Profile()
    profile.id = "tr:__profile-id-1__"
    profile.type = "soo:Profile"
    profile.email = "zayne.harding@gmail.com"
    profile.experience = experience.id
    
    experience.profile = profile.id
    
    skill = Skill()
    skill.id = "tr:__skill-id-1__"
    skill.type = "soo:Skill"
    skill.experience = experience.id
    skill.prefLabel = PrefLabel(value="Problem-Solving", language= "en")
    
    experience.skill = skill.id
    
    serialisation = {}
    todo = {}
    todo['@todo'] = "Define later with https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data/soo/onto-soo-context-1.0.0.jsonld"
    serialisation['@context'] = todo
    result = []
    result.append(toJsonLD(experience))
    result.append(toJsonLD(profile))
    result.append(toJsonLD(skill))
    serialisation['graph'] = result

    json_result = json.dumps(serialisation, sort_keys=True)
    
    expected_data = get_gamingtest('gamingtest-minimal-structure.output.jsonld')
    expected_output = json.dumps(expected_data, sort_keys=True)
    print('--------------------------------------')
    print(ordered(json_result))
    print('VS')
    print(ordered(expected_output))
    print('--------------------------------------')
    assert ordered(json_result) == ordered(expected_output)
       
     

    
    
    
    
    