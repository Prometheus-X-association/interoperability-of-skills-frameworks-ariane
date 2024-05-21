from datetime import datetime
from typing import List
from jsonpath_ng.ext import parse

from ontology_engine.rule import Rule
from ontology_engine.tools import toJsonLD


class RuleEngine:
    def __init__(self, rules: List[Rule]) -> None:
        self.rules = rules
        self.counters: dict[str, int] = {}
        self.instances: dict[str, dict] = {}

    def generateId(self, instance: dict):
        if "Experience" in instance["type"]:
            return f"tr:__generated-id-{instance['__counter__']}__"
        else:
            template = instance["type"].replace("soo:", "").lower()
            return f"tr:__{template}-id-{instance['__counter__']}__"

    def getInstance(self, targetClass: str, index: int,docIndex : int) -> dict:
        key = f"{docIndex}-{targetClass}-{index}"
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

    def getDocumentsFromFiles(self, file: dict) -> List[dict]:
        documents = []
        sourcepaths : dict[int, List[str]]= {}
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

    def getFieldName(self, field: str) -> str:
        return field.replace("soo:has", "").replace("soo:", "").replace("skos:", "")

    def applyRulesToDocument(self, file: dict, docIndex : int):
        documents: List[dict] = self.getDocumentsFromFiles(file)
        for index, document in enumerate(documents):
            for rule in self.rules:
                if rule.sourcePath in document.keys():
                    currentInstance = self.getInstance(rule.targetClass, index, docIndex)
                    target = self.getFieldName(rule.targetProperty)

                    if (
                        rule.targetProperty == "id"
                        and rule.targetFunction == "fno:generateId"
                    ) or rule.generateId == True:
                        currentInstance["id"] = self.generateId(currentInstance)
                        if rule.targetProperty == "id":
                            continue

                    if rule.targetFunction == "fno:date-to-xsd":
                        dates = document[rule.sourcePath]
                        date = datetime.strptime(dates, "%Y-%m-%d")
                        currentInstance[target] = date.strftime("%Y-%m-%d")
                        continue

                    if (
                        rule.relationTo != ""
                        and rule.relationName != ""
                        and rule.relationNameInverse != ""
                    ):
                        currentInstanceTo = self.getInstance(rule.relationTo, index, docIndex)
                        currentInstanceTo[
                            self.getFieldName(rule.relationNameInverse).lower()
                        ] = currentInstance["id"]
                        currentInstance[self.getFieldName(rule.relationTo).lower()] = (
                            currentInstanceTo["id"]
                        )

                    if rule.targetFunction == "fno:asIs_WithLang":
                        currentInstance[target] = {}
                        currentInstance[target]["@value"] = document[rule.sourcePath]
                        currentInstance[target]["@language"] = rule.targetLang
                        continue

                    if rule.targetFunction == "fno:search-for-mapping-with-source":
                        currentInstance["prefLabel"] = {}
                        currentInstance["prefLabel"]["@value"] = document[
                            rule.sourcePath
                        ]
                        currentInstance["prefLabel"]["@language"] = "en"
                        continue

                    currentInstance[target] = document[rule.sourcePath]

    def generate(self, documents: List[dict]) -> dict:
        serialisation = {}
        todo = {}
        todo["@todo"] = (
            "Define later with https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data/soo/onto-soo-context-1.0.0.jsonld"
        )
        serialisation["@context"] = todo
        result = []
        docIndex = 0
        for document in documents:
            self.applyRulesToDocument(document, docIndex)
            docIndex = docIndex + 1
        
        for instance in self.instances.values():
            del instance["__counter__"]
            result.append(instance)
        serialisation["graph"] = result
        return serialisation
