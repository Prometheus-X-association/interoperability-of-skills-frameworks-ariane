from datetime import datetime


class Experience:
    def __init__(self) -> None:
        self.id : str = ''
        self.prefLabel : str = ''
        self.description : str = ''
        self.experienceType : str = ''
        self.experienceStatus : str = ''
        self.dateFrom: datetime = datetime.min
        self.dateTo: datetime = datetime.max
        
