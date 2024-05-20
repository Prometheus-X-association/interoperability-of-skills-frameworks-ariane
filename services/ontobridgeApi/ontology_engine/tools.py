from datetime import datetime
from typing import List
from ontology_engine.tests.object_approach.pref_label import PrefLabel


def toJsonLD(object) -> dict:
        jsonLD = {}
        for attr, value in object.__dict__.items():
            if value == '':
                continue
            if value == None:
                continue
            if isinstance(value, List):
                if len(value) == 0:
                    continue
            if isinstance(value, PrefLabel):
                jsonLD[attr] = {}
                jsonLD[attr]['@value'] = value.value
                jsonLD[attr]['@language'] = value.language
                continue
            if isinstance(value, datetime):
                jsonLD[attr] = value.strftime("%Y-%m-%d")
                continue
            jsonLD[attr] = value
        return jsonLD
    
def ordered(obj):
    if isinstance(obj, dict):
        return sorted((k, ordered(v)) for k, v in obj.items())
    if isinstance(obj, list):
        return sorted(ordered(x) for x in obj)
    else:
        return obj
    
def clear_dict(d):
    if d is None:
        return None
    elif isinstance(d, list):
        return list(filter(lambda x: x is not None, map(clear_dict, d)))
    elif not isinstance(d, dict):
        return d
    else:
        r = dict(
                filter(lambda x: x[1] is not None,
                    map(lambda x: (x[0], clear_dict(x[1])),
                        d.items())))
        if not bool(r):
            return None
        return r