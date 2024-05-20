import enum


class TargetFunctionEnum(enum):
    none = 0
    generateId = 1
    asIs_WithLang = 2
    date__to__xsd = 3
    as_is = 4
    search__for__mapping__with__source = 5

    def __str__(self):
        return f'fno:{self.name.replace("__", "-")}'
