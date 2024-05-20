class Profile:
    def __init__(self, id: str = "", email: str = "", type: str = "") -> None:
        self.id: str = id
        self.email: str = email
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
