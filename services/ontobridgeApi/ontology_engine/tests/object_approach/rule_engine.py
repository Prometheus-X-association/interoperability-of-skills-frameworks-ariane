from datetime import datetime
from typing import List

from ontology_engine.tests.object_approach.rule import Rule
from ontology_engine.tests.object_approach.tools import toJsonLD


class RuleEngine():
    def __init__(self, rules : List[Rule] ) -> None:
        self.rules = rules
        self.counters : dict[str, int] = {}
        self.instances : List[dict] = []
        
        
    def generateId(self, targetClass : str):
        if 'Experience' in targetClass:
            return f'tr:__generated-id-{self.counters[targetClass]}__'
        else:
            template = targetClass.replace('soo:','').lower()
            return f'tr:__{template}-id-{self.counters[targetClass]}__'
                
    def getInstance(self, targetClass : str) -> dict:
        if not targetClass in self.counters.keys():
            self.counters[targetClass] = 0
        currentInstance = None
        for instance in self.instances:
            if instance['type'] == targetClass:
                currentInstance = instance

        if currentInstance == None:
            self.counters[targetClass] = self.counters[targetClass] + 1
            currentInstance = {}
            currentInstance['type'] = targetClass
            self.instances.append(currentInstance)
        return currentInstance
    
    def applyRulesToDocument(self, document : dict):
        for rule in self.rules:
            if rule.sourcePath in document.keys():
                currentInstance = self.getInstance(rule.targetClass)
            
                if (rule.targetProperty == 'id' and rule.targetFunction == 'fno:generateId') or rule.generateId == True:
                    currentInstance['id'] = self.generateId(rule.targetClass)
                    if rule.targetProperty == 'id': 
                        continue
                    
                if rule.targetFunction == 'fno:date-to-xsd':
                    dates = document[rule.sourcePath]
                    date = datetime.strptime(dates, '%Y-%m-%d')
                    currentInstance[rule.targetProperty] = date.strftime('%Y-%m-%d')
                    continue
                
                if rule.relationTo != '' and rule.relationName != '' and rule.relationNameInverse != '':
                    currentInstanceTo = self.getInstance(rule.relationTo)
                    currentInstanceTo[rule.relationNameInverse.lower().replace('soo:has','')] = currentInstance['id']
                    currentInstance[rule.relationTo.lower().replace('soo:','')] = currentInstanceTo['id']
                    
                if rule.targetFunction =="fno:asIs_WithLang" and rule.targetProperty == "soo:label":
                    currentInstance['prefLabel'] = {}
                    currentInstance['prefLabel']['@value'] = document[rule.sourcePath]
                    currentInstance['prefLabel']['@language'] = rule.targetLang
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
        for instance in self.instances:
            result.append(instance)
        serialisation['graph'] = result
        return serialisation
    
