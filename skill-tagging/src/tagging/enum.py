from enum import StrEnum, auto

class SkillTypeEnum(StrEnum):
    COMPETENCY = "skill/competence" 
    KNOWLEDGE = auto()
    ALL = auto()

class SkillSuggestionReferentialEnum(StrEnum):
    ESCO = "ESCO"
    ROME = "ROME"
    RNCP = "RNCP"

class SkillSuggestionSourceEnum(StrEnum):
    API = auto()
    FILE = auto()

class SkillSuggestionStatusEnum(StrEnum):
    PENDING = auto()
    VALIDATED = auto()
    REJECTED = auto()