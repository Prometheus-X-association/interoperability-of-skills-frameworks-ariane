<<<<<<< HEAD
<<<<<<< HEAD

from api.engines.matching_engine.source_mapping_engine import SourceMappingEngine
=======
from term_matching_engine.source_mapping_engine import SourceMappingEngine
>>>>>>> 3b02988 (refactor and update folders)
=======

from api.engines.term_matching_engine.source_mapping_engine import SourceMappingEngine
>>>>>>> dabfdae (fix launch of api)


class SourceMappingService:

    def __init__(self) -> None:
        self.source_mapping_engine = SourceMappingEngine()
