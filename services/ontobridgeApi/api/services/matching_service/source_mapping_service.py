<<<<<<< HEAD
<<<<<<< HEAD

from api.engines.matching_engine.source_mapping_engine import SourceMappingEngine
=======
from term_matching_engine.source_mapping_engine import SourceMappingEngine
>>>>>>> 3b02988 (refactor and update folders)
=======

<<<<<<< HEAD
from api.engines.term_matching_engine.source_mapping_engine import SourceMappingEngine
>>>>>>> dabfdae (fix launch of api)
=======
from api.engines.matching_engine.source_mapping_engine import SourceMappingEngine
>>>>>>> 5a091b3 (fix matching_engine folder name)


class SourceMappingService:

    def __init__(self) -> None:
        self.source_mapping_engine = SourceMappingEngine()
