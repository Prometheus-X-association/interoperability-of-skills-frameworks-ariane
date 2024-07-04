from term_matching_engine.source_mapping_engine import SourceMappingEngine


class SourceMappingService:

    def __init__(self) -> None:
        self.source_mapping_engine = SourceMappingEngine()
