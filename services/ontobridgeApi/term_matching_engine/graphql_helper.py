from multiprocessing.connection import Client
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport
from api.config import get_api_settings
import redis
from redis import client


class graphql_request_helper:

    def __init__(self) -> None:
        settings = get_api_settings()
        self.api_url = settings.graphql_url
        # Set up the transport and client
        self.transport = RequestsHTTPTransport(url=self.api_url, use_json=True)
        self.client = Client(transport=self.transport, fetch_schema_from_transport=True)

    def get_graphql_result(self, query_string: str, variables: dict) -> dict:
        gql_query = gql(query_string)
        result = self.client.execute(gql_query, variable_values=variables)
        return result
