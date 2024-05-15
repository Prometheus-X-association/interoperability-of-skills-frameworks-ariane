from datetime import datetime
from typing import List
from jsonpath_ng.ext import parse

from ontology_engine.tests.object_approach.rule import Rule
from ontology_engine.tests.object_approach.tools import toJsonLD


class RuleEngine():
    def __init__(self, rules : List[Rule] ) -> None:
        self.rules = rules
        self.counters : dict[str, int] = {}
        self.instances : dict[str, dict] = {}
        
        
    def generateId(self, instance : dict):
        if 'Experience' in instance['type']:
            return f"tr:__generated-id-{instance['__counter__']}__"
        else:
            template = instance['type'].replace('soo:','').lower()
            return f"tr:__{template}-id-{instance['__counter__']}__"
                
    def getInstance(self, targetClass : str, index : int) -> dict:
        key = f'{targetClass}-{index}'
        if not targetClass in self.counters.keys():
            self.counters[targetClass] = 0
        currentInstance = None
        if key in self.instances.keys():
            return self.instances[key]

        self.counters[targetClass] = self.counters[targetClass] + 1
        currentInstance = {}
        currentInstance['type'] = targetClass
        currentInstance['__counter__'] = self.counters[targetClass]
        self.instances[key] = currentInstance
        return currentInstance
    
    def getDocumentsFromFiles(self, file: dict) -> List[dict]:
        documents = []
        sourcepaths = []
        depth = 0   
        for rule in self.rules:
            if not rule.sourcePath in sourcepaths:
                pathDepth = rule.sourcePath.split('.')
                depth = max(depth, len(pathDepth))
                sourcepaths.append(rule.sourcePath)
        
        numberOfDocuments = 0
        filedValues = {}  
        for sourcepath in sourcepaths:
            #[*].'Date'
            jsonpath = ''
            for source_path_element in sourcepath.split('.'):
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

    def applyRulesToDocument(self, file : dict):
        
        documents : List[dict]= self.getDocumentsFromFiles(file)
        for index, document in enumerate(documents):
            for rule in self.rules:
                if rule.sourcePath in document.keys():
                    currentInstance = self.getInstance(rule.targetClass, index)
                
                    if (rule.targetProperty == 'id' and rule.targetFunction == 'fno:generateId') or rule.generateId == True:
                        currentInstance['id'] = self.generateId(currentInstance)
                        if rule.targetProperty == 'id': 
                            continue
                        
                    if rule.targetFunction == 'fno:date-to-xsd':
                        dates = document[rule.sourcePath]
                        date = datetime.strptime(dates, '%Y-%m-%d')
                        currentInstance[rule.targetProperty] = date.strftime('%Y-%m-%d')
                        continue
                    
                    if rule.relationTo != '' and rule.relationName != '' and rule.relationNameInverse != '':
                        currentInstanceTo = self.getInstance(rule.relationTo, index)
                        currentInstanceTo[rule.relationNameInverse.lower().replace('soo:has','')] = currentInstance['id']
                        currentInstance[rule.relationTo.lower().replace('soo:','')] = currentInstanceTo['id']
                        
                    if rule.targetFunction =="fno:asIs_WithLang" and rule.targetProperty == "soo:label":
                        currentInstance['prefLabel'] = {}
                        currentInstance['prefLabel']['@value'] = document[rule.sourcePath]
                        currentInstance['prefLabel']['@language'] = rule.targetLang
                        continue
                    
                    if rule.targetFunction =="fno:asIs_WithLang":
                        target = rule.targetProperty.replace('soo:','')
                        currentInstance[target] = {}
                        currentInstance[target]['@value'] = document[rule.sourcePath]
                        currentInstance[target]['@language'] = rule.targetLang
                        continue
                    
                    if rule.targetFunction == "fno:search-for-mapping-with-source":
                        currentInstance['prefLabel'] = {}
                        currentInstance['prefLabel']['@value'] = document[rule.sourcePath]
                        currentInstance['prefLabel']['@language'] = 'en'
                        continue
                    
                    if rule.targetFunction == "fno:as-is":
                        currentInstance[rule.targetProperty] = str(document[rule.sourcePath]).lower()
                        continue
                    
                    currentInstance[rule.targetProperty] = document[rule.sourcePath]
                

    def generate(self, document : dict) -> dict:
        serialisation = {}
        todo = {}
        todo['@todo'] = "Define later with https://gitlab.com/mmorg/bupm/ariane/-/blob/main/data/soo/onto-soo-context-1.0.0.jsonld"
        serialisation['@context'] = todo
        result = []
        self.applyRulesToDocument(document)
        for instance in self.instances.values():
            del instance['__counter__']
            result.append(instance)
        serialisation['graph'] = result
        return serialisation
    
