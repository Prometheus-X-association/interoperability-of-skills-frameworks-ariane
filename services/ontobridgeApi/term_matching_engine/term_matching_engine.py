from term_matching_engine.graphql_helper import graphql_request_helper
import json
import os


class TermMatching:

    def __init__(self) -> None:
        # Load the model
        self.graphql_engine = graphql_request_helper()
        cwd=os.getcwd()
        self.glq_queries = self.load_queries(f"{cwd}/term_matching_engine/gql_functions.json")

    def load_queries(self,filename):
        with open(filename, "r") as file:
            return json.load(file)

    def get_query_function(self, provider: str, feature: str):
        gql_functions = self.glq_queries[provider][feature]
        return gql_functions

    def get_gql_term_matching(self, provider: str, feature: str, query_vector: list[float]) -> dict:
        query_function = self.get_query_function(provider, feature)
        gql_variables = {"queryVector": query_vector}
        return self.graphql_engine.get_graphql_result(query_function, gql_variables)


    
