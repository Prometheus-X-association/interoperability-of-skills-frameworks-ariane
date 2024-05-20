class Rule:
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
    ) -> None:
        self.id: str = id
        self.sourcePath: str = sourcePath
        self.targetClass: str = targetClass
        self.targetLang: str = targetLang
        self.targetProperty: str = targetProperty
        self.targetFunction: str = targetFunction
        self.generateId: bool = True if generateId == "true" else False
        self.relationTo: str = relationTo
        self.relationName: str = relationName
        self.relationNameInverse: str = relationNameInverse

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
