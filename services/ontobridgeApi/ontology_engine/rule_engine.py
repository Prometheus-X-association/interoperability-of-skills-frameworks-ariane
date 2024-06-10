from datetime import datetime
from typing import List
from jsonpath_ng.ext import parse

from ontology_engine.document_tree import (
    DocumentTreeFactory,
    RulesTree,
    browse_rules_tree,
)
from ontology_engine.rule import Rule
from ontology_engine.tools import toJsonLD
from copy import copy, deepcopy


class RuleEngine:
    def __init__(self, rules: List[Rule]) -> None:
        self.rules = rules
        self.counters: dict[str, int] = {}
        self.instances: dict[str, dict] = {}
        self.rules_tree: RulesTree = None

    def generate_id(self, instance: dict):
        if "Experience" in instance["type"]:
            return f"tr:__generated-id-{instance['__counter__']}__"
        else:
            template = instance["type"].replace("soo:", "").lower()
            return f"tr:__{template}-id-{instance['__counter__']}__"

    def check_instance(self, targetClass: str, docIndex: int, index: int):
        if index == -1:
            key = f"{docIndex}-{targetClass}"
        else: 
            key = f"{docIndex}-{targetClass}-{index}"
        return any([x for x in self.instances if key.lower() in x.lower()])

    def get_last_instance(self, targetClass: str, docIndex: int, index: int):
        if not self.check_instance(targetClass, docIndex, index):
            return None
        if index == -1:
            key = f"{docIndex}-{targetClass}"
        else: 
            key = f"{docIndex}-{targetClass}-{index}"
        keys = [x for x in reversed(self.instances) if key.lower() in x.lower()]
        return self.instances[keys[0]]

    def get_instance(self, targetClass: str, index: int, docIndex: int, prefix: str = "") -> dict:
        key = f"{docIndex}-{targetClass}-{index}-{prefix}"
        if not targetClass in self.counters.keys():
            self.counters[targetClass] = 0
        currentInstance = None
        if key in self.instances.keys():
            return self.instances[key]

        self.counters[targetClass] = self.counters[targetClass] + 1
        currentInstance = {}
        currentInstance["type"] = targetClass
        currentInstance["__counter__"] = self.counters[targetClass]
        self.instances[key] = currentInstance
        return currentInstance

    def get_documents_from_files(self, file: dict) -> List[dict]:
        documents = []
        sourcepaths: dict[int, List[str]] = {}
        depth = 0
        for rule in self.rules:
            if not rule.sourcePath in sourcepaths:
                split_path = rule.sourcePath.split(".")
                depth_path = len(split_path)
                if not depth_path in sourcepaths:
                    sourcepaths[depth_path] = []
                sourcepaths[depth_path].append(rule.sourcePath)

        orderDepths = sorted(sourcepaths)
        for depth in orderDepths:
            numberOfDocuments = 0
            filedValues = {}
            for sourcepath in sourcepaths[depth]:
                # [*].'Date'
                jsonpath = ""
                for source_path_element in sourcepath.split("."):
                    jsonpath = jsonpath + "[*].'" + source_path_element + "'"
                jsonPath_expression = parse(jsonpath)
                matches = jsonPath_expression.find(file)
                filedValues[sourcepath] = []
                numberOfDocuments = max(numberOfDocuments, len(matches))
                for match in matches:
                    filedValues[sourcepath].append(match.value)

        for i in range(0, numberOfDocuments):
            document = {}
            for key in filedValues.keys():
                document[key] = filedValues[key][i]
            documents.append(document)
        return documents

    def get_field_name(self, field: str) -> str:
        return field.replace("soo:has", "").replace("soo:", "").replace("skos:", "")

    def apply_rules_to_document(self, file: dict, docIndex: int):
        documents: List[dict] = self.get_documents_from_files(file)
        for index, document in enumerate(documents):
            for rule in self.rules:
                if rule.sourcePath in document.keys():
                    currentInstance = self.get_instance(rule.targetClass, index, docIndex)
                    target = self.get_field_name(rule.targetProperty)

                    if (rule.targetProperty == "id" and rule.targetFunction == "fno:generateId") or rule.generateId == True:
                        currentInstance["id"] = self.generate_id(currentInstance)
                        if rule.targetProperty == "id":
                            continue

                    if rule.targetFunction == "fno:date-to-xsd":
                        dates = document[rule.sourcePath]
                        date = datetime.strptime(dates, "%Y-%m-%d")
                        currentInstance[target] = date.strftime("%Y-%m-%d")
                        continue

                    if rule.relationTo != "" and rule.relationName != "" and rule.relationNameInverse != "":
                        currentInstanceTo = self.get_instance(rule.relationTo, index, docIndex)
                        currentInstanceTo[self.get_field_name(rule.relationNameInverse).lower()] = currentInstance["id"]
                        currentInstance[self.get_field_name(rule.relationTo).lower()] = currentInstanceTo["id"]

                    if rule.targetFunction == "fno:asIs_WithLang":
                        currentInstance[target] = {}
                        currentInstance[target]["@value"] = document[rule.sourcePath]
                        currentInstance[target]["@language"] = rule.targetLang
                        continue

                    if rule.targetFunction == "fno:search-for-mapping-with-source":
                        currentInstance["prefLabel"] = {}
                        currentInstance["prefLabel"]["@value"] = document[rule.sourcePath]
                        currentInstance["prefLabel"]["@language"] = rule.targetLang
                        continue

                    currentInstance[target] = document[rule.sourcePath]

    def generate(self, document: dict) -> dict:
        serialisation = {}
        todo = {}
        todo["@todo"] = (
            "Define later with https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data/soo/onto-soo-context-1.0.0.jsonld"
        )
        serialisation["@context"] = todo
        result = []
        self.applyRulesToDocument(document)
        for instance in self.instances.values():
            del instance["__counter__"]
            result.append(instance)
        serialisation["graph"] = result
        return serialisation
