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
from copy import deepcopy


class RuleEngine:
    def __init__(self, rules: List[Rule]) -> None:
        self.rules = rules
        self.counters: dict[str, int] = {}
        self.instances: dict[str, dict] = {}
        self.rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)

    def generate_id(self, instance: dict):
        if "Experience" in instance["type"]:
            return f"tr:__generated-id-{instance['__counter__']}__"
        else:
            template = instance["type"].replace("soo:", "").lower()
            return f"tr:__{template}-id-{instance['__counter__']}__"

    def check_instance(self, targetClass: str, docIndex: int):
        key = f"{docIndex}-{targetClass}-"
        return any([x for x in self.instances if key.lower() in x.lower()])

    def get_last_instance(self, targetClass: str, docIndex: int):
        if not self.check_instance(targetClass, docIndex):
            return None
        key = f"{docIndex}-{targetClass}-"
        keys = [x for x in reversed(self.instances) if key.lower() in x.lower()]
        return self.instances[keys[0]]

    def get_instance(
        self, targetClass: str, index: int, docIndex: int, prefix: str = ""
    ) -> dict:
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
                    currentInstance = self.get_instance(
                        rule.targetClass, index, docIndex
                    )
                    target = self.get_field_name(rule.targetProperty)

                    if (
                        rule.targetProperty == "id"
                        and rule.targetFunction == "fno:generateId"
                    ) or rule.generateId == True:
                        currentInstance["id"] = self.generate_id(currentInstance)
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
                        currentInstanceTo = self.get_instance(
                            rule.relationTo, index, docIndex
                        )
                        currentInstanceTo[
                            self.get_field_name(rule.relationNameInverse).lower()
                        ] = currentInstance["id"]
                        currentInstance[
                            self.get_field_name(rule.relationTo).lower()
                        ] = currentInstanceTo["id"]

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
                        currentInstance["prefLabel"]["@language"] = rule.targetLang
                        continue

                    currentInstance[target] = document[rule.sourcePath]

    def fill_with_document(self, file: dict) -> None:
        self.rules_tree.matches = []
        self.rules_tree.matches.append(file)
        rules_trees = browse_rules_tree(self.rules_tree)
        i = 0
        for rules_tree in rules_trees:
            if rules_tree.depth == 0:
                continue

            # add matches in file to rule.
            jsonpath = "[*].'" + rules_tree.name + "'"
            jsonPath_expression = parse(jsonpath)
            rules_tree.matches = []

            for match in rules_tree.parent.matches:
                current_matches = jsonPath_expression.find(match)
                for current_match in current_matches:
                    rules_tree.matches.append(current_match.value)

    def generate_instances_by_tree(
        self, filed_rules_tree: RulesTree, docIndex: int
    ) -> None:
        rules_trees = browse_rules_tree(filed_rules_tree)
        lag_rules = []
        for rule_tree in rules_trees:
            if rule_tree.depth == 0:
                continue
            if len(rule_tree.rules) == 0:
                continue
            if rule_tree.parent == None:
                prefix = ""
            else:
                prefix = rule_tree.parent.name
            for rule in rule_tree.rules:
                for index, match in enumerate(rule_tree.matches):
                    currentInstance = self.get_instance(
                        rule.targetClass, index, docIndex, prefix
                    )

                    target = self.get_field_name(rule.targetProperty)
                    if (
                        rule.targetProperty == "id"
                        and rule.targetFunction == "fno:generateId"
                    ) or rule.generateId == True:
                        currentInstance["id"] = self.generate_id(currentInstance)
                        if rule.targetProperty == "id":
                            continue

                    for lag_rule in lag_rules:
                        currentInstanceFrom = self.get_last_instance(
                            lag_rule.relationNameInverse, docIndex
                        )
                        if (
                            currentInstanceFrom["type"] != currentInstance["type"]
                            and currentInstance["type"] == lag_rule.relationTo
                        ):
                            if not currentInstanceFrom == None:
                                if (
                                    self.get_field_name(lag_rule.relationTo).lower()
                                    in currentInstanceFrom
                                ):
                                    if isinstance(
                                        currentInstanceFrom[
                                            self.get_field_name(
                                                lag_rule.relationTo
                                            ).lower()
                                        ],
                                        str,
                                    ):
                                        prevRef = str(
                                            currentInstanceFrom[
                                                self.get_field_name(
                                                    lag_rule.relationTo
                                                ).lower()
                                            ]
                                        )
                                        currentInstanceFrom[
                                            self.get_field_name(
                                                lag_rule.relationTo
                                            ).lower()
                                        ] = []
                                        currentInstanceFrom[
                                            self.get_field_name(
                                                lag_rule.relationTo
                                            ).lower()
                                        ].append(prevRef)
                                    if (
                                        not currentInstance["id"]
                                        in currentInstanceFrom[
                                            self.get_field_name(
                                                lag_rule.relationTo
                                            ).lower()
                                        ]
                                    ):
                                        currentInstanceFrom[
                                            self.get_field_name(
                                                lag_rule.relationTo
                                            ).lower()
                                        ].append(currentInstance["id"])
                                else:
                                    currentInstanceFrom[
                                        self.get_field_name(lag_rule.relationTo).lower()
                                    ] = currentInstance["id"]

                    if rule.targetFunction == "fno:find-or-create-term":
                        currentInstance["id"] = self.generate_id(currentInstance)
                        currentInstance["polarityScale"] = (
                            "term:interim/polarity/scale/1"
                        )
                        currentInstance["polarityValue"] = (
                            "term:interim/polarity/value/1"
                        )
                        current_term_Instance = self.get_instance(
                            "soo:Term", 0, 0, prefix
                        )
                        current_term_Instance["id"] = "term:interim/polarity/value/1"
                        current_term_Instance["notation"] = match
                        current_term_Instance["prefLabel"] = {}
                        current_term_Instance["prefLabel"]["@value"] = str(match)
                        current_term_Instance["prefLabel"]["@language"] = "en"
                        continue

                    if rule.targetFunction == "fno:date-to-xsd":
                        dates = match
                        if rule.targetFunctionParam == "fno:year-only":
                            date = datetime.strptime(f"{match}-01-01", "%Y-%m-%d")

                        else:
                            date = datetime.strptime(dates, "%Y-%m-%d")
                        currentInstance[target] = date.strftime("%Y-%m-%d")
                        continue

                    if (
                        rule.relationTo != ""
                        and rule.relationName != ""
                        and rule.relationNameInverse != ""
                    ):
                        currentInstanceTo = self.get_last_instance(
                            rule.relationTo, docIndex
                        )
                        if not currentInstanceTo == None:
                            if (
                                self.get_field_name(rule.relationNameInverse).lower()
                                in currentInstanceTo
                            ):
                                prevRef = currentInstanceTo[
                                    self.get_field_name(
                                        rule.relationNameInverse
                                    ).lower()
                                ]
                                currentInstanceTo[
                                    self.get_field_name(
                                        rule.relationNameInverse
                                    ).lower()
                                ] = []
                                currentInstanceTo[
                                    self.get_field_name(
                                        rule.relationNameInverse
                                    ).lower()
                                ].append(prevRef)
                                currentInstanceTo[
                                    self.get_field_name(
                                        rule.relationNameInverse
                                    ).lower()
                                ].append(currentInstance["id"])
                            else:
                                currentInstanceTo[
                                    self.get_field_name(
                                        rule.relationNameInverse
                                    ).lower()
                                ] = currentInstance["id"]
                            currentInstance[
                                self.get_field_name(rule.relationTo).lower()
                            ] = currentInstanceTo["id"]
                        else:
                            lag_rules.append(rule)
                            pass

                    if rule.targetFunction == "fno:asIs_WithLang":
                        currentInstance[target] = {}
                        currentInstance[target]["@value"] = match
                        currentInstance[target]["@language"] = rule.targetLang
                        continue

                    if rule.targetFunction == "fno:search-for-mapping-with-source":
                        currentInstance["prefLabel"] = {}
                        currentInstance["prefLabel"]["@value"] = match
                        currentInstance["prefLabel"]["@language"] = rule.targetLang
                        continue

                    currentInstance[target] = match
        pass

    def apply_tree_rules_to_document(self, file: dict, docIndex: int):
        self.fill_with_document(file)
        self.generate_instances_by_tree(self.rules_tree, docIndex)

    def generate(self, documents: List[dict], by_tree: bool = True) -> dict:
        serialisation = {}
        todo = {}
        todo["@todo"] = (
            "Define later with https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data/soo/onto-soo-context-1.0.0.jsonld"
        )
        serialisation["@context"] = todo
        result = []
        docIndex = 0
        for document in documents:
            if not by_tree:
                self.apply_rules_to_document(document, docIndex)
            else:
                self.apply_tree_rules_to_document(document, docIndex)
            docIndex = docIndex + 1

        for instance in self.instances.values():
            del instance["__counter__"]
            result.append(instance)
        serialisation["graph"] = result
        return serialisation
