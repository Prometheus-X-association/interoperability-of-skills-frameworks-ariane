from datetime import datetime
from ontology_engine.tests.object_approach.pref_label import PrefLabel

class Experience():
    def __init__(self, id : str = '', prefLabel = {"value" : "", "language" : ''} , description : str = '', experienceType : str = '', experienceStatus : str = '', dateFrom: datetime = None, dateTo: datetime = None, result : str = '', type : str = '') -> None:
        self.id : str = ''
        self.prefLabel : PrefLabel = PrefLabel(**prefLabel)
        self.description : str = description
        self.experienceType : str = experienceType
        self.experienceStatus : str = experienceStatus
        self.dateFrom: datetime = dateFrom
        self.dateTo: datetime = dateTo
        self.result : str = result
        self.type : str = type
        
    