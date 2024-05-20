from typing import List


class Skill:
    def __init__(
        self,
        experience: str = "",
        category: str = "",
        skillLevelScale: List[str] = [],
        skillLevelValue: str = "",
        type: str = "",
    ) -> None:
        self.experience: str = experience
        self.category: str = category
        self.skillLevelScale: List[str] = skillLevelScale
        self.skillLevelValue: str = skillLevelValue
        self.type: str = type

    def toJsonLD(self) -> dict:
        jsonLD = {}
        for attr, value in self.__dict__.items():
            if value == "":
                continue
            if value == None:
                continue
            jsonLD[attr] = value
        return jsonLD
