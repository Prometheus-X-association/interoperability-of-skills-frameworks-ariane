import yaml
from pytest import MonkeyPatch
from pathlib import Path
import os

def test_reading_yamlfile():
    currentDirectory = os.path.dirname(__file__)
    os.chdir(currentDirectory)
    with open('config.yml', 'r') as file:
        prime_service = yaml.safe_load(file)
    assert prime_service['prime_numbers'][0] == 2
    assert prime_service['rest']['url'] == "https://example.org/primenumbers/v1"

