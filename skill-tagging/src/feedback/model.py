from pydantic import BaseModel, Field
from typing import Union

class FeedbackModel(BaseModel):
    offerKey: str = Field(..., min_length=1, description="OfferKey is the course key in Edunao SI")
    skillCode: str = Field(..., min_length=1, description="SkillCode the framework (esco, rome,..) skill key")
    accepted: bool = Field(..., description="The feedback provided from Edunao for approval or refusal the skill suggestion")
    timestamp: Union[int, float] = Field(..., description="The timestamp when the skill suggestion has been refused or approved")