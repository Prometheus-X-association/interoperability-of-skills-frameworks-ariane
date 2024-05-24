from ontology_engine.document_tree import DocumentTreeFactory
from ontology_engine.providers import get_rules
from ontology_engine.tests.object_approach.test_tools import get_tests


def test_document_tree_interim():
    providerName = "interim"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)
    print('*--------------------------------------------------*')
    print(rules_tree)


def test_document_tree_gamingtest():
    providerName = "gamingtest"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)
    print('*--------------------------------------------------*')
    print(rules_tree)
    
    
def test_document_tree_jobready_2():
    providerName = "jobready_2"

    rules = get_rules(providerName)
    minimal_output = get_tests(f"{providerName}.json", providerName)

    rules_tree = DocumentTreeFactory.generate_rules_tree(provider_rules=rules)
    print('*--------------------------------------------------*')
    print(rules_tree)