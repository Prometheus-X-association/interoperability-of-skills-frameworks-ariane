import json
import os
from pathlib import Path
from typing import List

from ontology_engine.providers import getRessourceFolder


def write_result(content, fileName):
    objectApprochDirectory = Path(__file__).parent
    objectApprochDirectory = os.path.join(objectApprochDirectory, "results")
    if not os.path.exists(objectApprochDirectory):
        os.makedirs(objectApprochDirectory)
    file_path = os.path.join(objectApprochDirectory, fileName + ".jsonld")
    f = open(file_path, "w")
    f.write(content)
    f.close()


def get_tests(fileName: str, provider: str) -> List[dict]:
    ressourcesDirectory = getRessourceFolder()
    providerDirectory = os.path.join(ressourcesDirectory, provider)
    path_file = os.path.join(providerDirectory, fileName)
    with open(path_file) as f:
        data = json.load(f)
        return data
