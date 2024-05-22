from typing import List, Optional
from pydantic import BaseModel, validator
import pydantic


class Rule(BaseModel):
    id: str = ""
    sourcePath: str = ""
    targetClass: str = ""
    targetLang: str = ""
    targetProperty: str = ""
    targetFunction: str = ""
    generateId: bool = False
    relationTo: str = ""
    relationName: str = ""
    relationNameInverse: str = ""
    targetValue : str = ""
    targetFunctionParam :  str = ""
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        anystr_strip_whitespace = True
        # check_fields=False

    def __init__(
        self,
        id: str = "",
        sourcePath: str = "",
        targetClass: str = "",
        targetLang: str = "",
        targetProperty: str = "",
        targetFunction: str = "",
        generateId: bool = False,
        relationTo: str = "",
        relationName: str = "",
        relationNameInverse: str = "",
        targetValue: str = "",
        targetFunctionParam :  str = "",
    ) -> None:
        super().__init__(
            id=id,
            sourcePath=sourcePath,
            targetClass=targetClass,
            targetLang=targetLang,
            targetProperty=targetProperty,
            targetFunction=targetFunction,
            generateId=True if generateId == "true" else False,
            relationTo=relationTo,
            relationName=relationName,
            relationNameInverse=relationNameInverse,
            targetValue=targetValue,
            targetFunctionParam= targetFunctionParam
        )

    def __str__(self):
        return f"""
            id : {self.id}
            sourcePath : {self.sourcePath}
            targetClass : {self.targetClass}
            targetLang : {self.targetLang}
            targetProperty : {self.targetProperty}
            targetFunction : {self.targetFunction}
            generateId : {self.generateId}
            relationTo : {self.relationTo}
            relationName : {self.relationName}
            relationNameInverse : {self.relationNameInverse}
        """

    