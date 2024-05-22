from ontology_engine.document_tree import DocumentTreeFactory
from ontology_engine.providers import get_rules
from ontology_engine.tests.object_approach.test_tools import get_tests


def test_document_tree_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    document_tree = DocumentTreeFactory.GenerateDocumentTree(provider_rules=rules)
    print('*--------------------------------------------------*')
    print(document_tree)
