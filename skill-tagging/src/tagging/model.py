from pydantic import BaseModel, Field
from typing import List
from .enum import SkillSuggestionSourceEnum, SkillSuggestionReferentialEnum, SkillSuggestionStatusEnum

class SkillSuggestion(BaseModel):
    skill: str = Field()
    temp_prefLabel: str = Field()
    referential: SkillSuggestionReferentialEnum|None = Field(None)
    status: SkillSuggestionStatusEnum = Field(SkillSuggestionStatusEnum.PENDING)
    source: SkillSuggestionSourceEnum = Field(SkillSuggestionSourceEnum.API)


class Matching(BaseModel):
    key: str = Field()
    description: str = Field()
    provided_skills: List[str] = Field()
    suggested_skills: List[SkillSuggestion] = Field()
    created_at: float = Field()
    updated_at: float = Field()
