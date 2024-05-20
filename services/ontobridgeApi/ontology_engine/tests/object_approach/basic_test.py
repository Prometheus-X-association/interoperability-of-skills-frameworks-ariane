from datetime import datetime
from pathlib import Path
import os
import json
from typing import List
from jsonpath_ng.ext import parse


from ontology_engine.tests.object_approach.profile import Profile
from ontology_engine.tests.object_approach.experience import Experience
from ontology_engine.tests.object_approach.pref_label import PrefLabel
from ontology_engine.rule import Rule
from ontology_engine.tests.object_approach.skill import Skill
from ontology_engine.tools import ordered, toJsonLD

def write_result(content, fileName):
    ressourcesDirectory = Path(__file__).parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, 'results')
    if not os.path.exists(ressourcesDirectory):
        os.makedirs(ressourcesDirectory)
    file_path = os.path.join(ressourcesDirectory, fileName + '.jsonld')
    f = open(file_path, "w")
    f.write(content)
    f.close()

def get_tests(fileName : str, provider : str) -> List[dict]:
    ressourcesDirectory = Path(__file__).parent.parent.parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, 'ressources')
    providerDirectory = os.path.join(ressourcesDirectory, provider)
    path_file = os.path.join(providerDirectory, fileName)
    with open(path_file) as f:
        data = json.load(f)
        return data 

def get_rules(provider : str) -> List[Rule]:
    ressourcesDirectory = Path(__file__).parent.parent.parent
    ressourcesDirectory = os.path.join(ressourcesDirectory, 'ressources')
    gamingtestDirectory = os.path.join(ressourcesDirectory, provider)
    gamingtestRuleTest = os.path.join(gamingtestDirectory, f'{provider}-rules.json')
    
    with open(gamingtestRuleTest) as f:
        data = json.load(f)
        rules : List[Rule] = []
        for rule in data['graph']:
            rule = Rule(**rule)
            rules.append(rule)
    return rules

def test_reading_gamintest_rules_structure():
    get_gamingtest_rules = get_rules('gamingtest')
    assert len(get_gamingtest_rules) == 6

def test_reading_gamintest_miminal():
    get_gamingtest_minimal = get_tests('gamingtest-minimal.json','gamingtest')
    assert len(get_gamingtest_minimal) == 1
    assert get_gamingtest_minimal[0]["User ID"] == "zayne.harding@gmail.com"

def test_reading_gamintest_all():
    get_gamingtest_all = get_tests('gamingtest.json','gamingtest')
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
    
    expected_data = get_tests('gamingtest-minimal-structure.output.jsonld','gamingtest')
    expected_output = json.dumps(expected_data, sort_keys=True)
    print('--------------------------------------')
    print(ordered(json_result))
    print('VS')
    print(ordered(expected_output))
    print('--------------------------------------')
    assert ordered(json_result) == ordered(expected_output)
    
def test_jsonpath():
    print(os.getcwd())
    dir_path = os.path.dirname(os.path.realpath(__file__))
    print(dir_path)
    sample = os.path.join(dir_path, 'movies.json')
    print(sample)
    with open(sample) as movies_json:
        movies = json.load(movies_json)

    jsonpath_expression = parse("$.movies[?(@.cast[:] =~ 'De Niro')].title")

    for match in jsonpath_expression.find(movies):
	    print(match.value)
     
def test_jsonpath_gamingtest():
    get_gamingtest_minimal = get_tests('gamingtest.json','gamingtest')

    jsonpath_expression = parse("[*].'Date'")
    print('start parsing')
    for match in jsonpath_expression.find(get_gamingtest_minimal):
	    print(match.value)
     
def test_jsonpath_jobready():
    get_gamingtest_minimal = get_tests('jobready_2.json','jobready_2')

    # fields.skill.name
    jsonpath_expression = parse("[*].fields[*].skill[*].description")
    print('start parsing')
    for match in jsonpath_expression.find(get_gamingtest_minimal):
	    print(match.value)


