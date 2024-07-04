from api.engines.ontology_engine.document_tree import DocumentTreeFactory
from api.engines.ontology_engine.providers import get_rules
from tests.test_tools import get_tests


def test_document_tree_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)
    print("*--------------------------------------------------*")
    print(DocumentTreeFactory.display_rules_tree(rules_tree))


def test_document_tree_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)
    print("*--------------------------------------------------*")
    print(DocumentTreeFactory.display_rules_tree(rules_tree))


def test_document_tree_jobready_2():
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)
    print("*--------------------------------------------------*")
    print(DocumentTreeFactory.display_rules_tree(rules_tree))
