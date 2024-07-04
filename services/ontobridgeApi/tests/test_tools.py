import json
import os
from pathlib import Path
from typing import List

from api.engines.ontology_engine.providers import get_provider_folder, getRessourceFolder


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
    providerFolder = get_provider_folder(provider)
    providerDirectory = os.path.join(ressourcesDirectory, providerFolder)
    path_file = os.path.join(providerDirectory, fileName)
    with open(path_file, encoding="utf8") as f:
        data = json.load(f)
        return data
