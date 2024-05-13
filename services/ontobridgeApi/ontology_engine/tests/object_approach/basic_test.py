import yaml
from pytest import MonkeyPatch
from pathlib import Path
import os
import json


def test_reading_rule_file():
    currentDirectory = os.path.dirname(__file__)
    ressourcesDirectory = Path(__file__).parent
    print(ressourcesDirectory)
    print('je suis la ')
    assert True
    # os.chdir    # os.chdir(currentDirectory)
    # rentDi'je suis la ')
    # with open('config.yml', 'r') as file:
    #     prime_service = yaml.safe_load(file)
    # assert prime_service['prime_numbers'][0] == 2
    # assert prime_service['rest']['url'] == "https://example.org/primenumbers/v1"