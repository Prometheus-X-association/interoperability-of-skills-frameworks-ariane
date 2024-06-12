import hashlib
from gql import gql, Client, transport
import requests
import inquirer

async def i_validate(message):
    name = '__i__'
    questions = [
        {
            'type': 'confirm',
            'name': name,
            'message': message,
            'default': True,
        }
    ]
    send_changes = await inquirer.prompt(questions)
    return send_changes[name]

# Helper functions
def md5(content : str) -> str:
    return hashlib.md5(content.encode('utf-8')).hexdigest()

def search_for_concept(concept_id):
    query = gql(f"""
    query {{
        concept(id: "{concept_id}") {{
            id
            prefLabel
        }}
    }}
    """)
    response = requests.post(endpoint, json={'query': query})
    return response.json().get('data', {}).get('concept', [])

def search_for_collection(collection_id):
    query = gql(f"""
    query {{
        collection(id: "{collection_id}") {{
            id
            prefLabel
        }}
    }}
    """)
    response = requests.post(endpoint, json={'query': query})
    return response.json().get('data', {}).get('collection', [])

def create_collection(collection_id, collection_label):
    mutation = gql(f"""
    mutation {{
        createCollection(id: "{collection_id}", prefLabel: "{collection_label}") {{
            id
            prefLabel
        }}
    }}
    """)
    response = requests.post(endpoint, json={'query': mutation})
    return response.json().get('data', {}).get('createCollection', {})

def create_concept(concept_id, concept_pref_label, collection_id):
    mutation = gql(f"""
    mutation {{
        createConcept(id: "{concept_id}", prefLabel: "{concept_pref_label}", collection: "{collection_id}") {{
            id
            prefLabel
        }}
    }}
    """)
    response = requests.post(endpoint, json={'query': mutation})
    return response.json().get('data', {}).get('createConcept', {})

def delete_concept(concept_id):
    mutation = gql(f"""
    mutation {{
        deleteConcept(id: "{concept_id}") {{
            id
        }}
    }}
    """)
    response = requests.post(endpoint, json={'query': mutation})
    return response.json().get('data', {}).get('deleteConcept', {})

def delete_collection(collection_id):
    mutation = gql(f"""
    mutation {{
        deleteCollection(id: "{collection_id}") {{
            id
        }}
    }}
    """)
    response = requests.post(endpoint, json={'query': mutation})
    return response.json().get('data', {}).get('deleteCollection', {})



# Function to send a request to the GraphQL endpoint
def request(endpoint, query, variables):
    response = requests.post(
        endpoint,
        json={'query': query, 'variables': variables}
    )
    if response.status_code == 200:
        return response.json()['data']
    else:
        raise Exception(f"Query failed with status code {response.status_code}. {response.text}")

#******* Collection related functions **********/
# search for Collection
async def search_for_collection(collection_id):
    query = """
    query searchCollection($skosId: [ID]){
        skos(id: $skosId) {
            Collection {
                id
                prefLabel {
                    value
                }
                member {
                    ... on Concept {
                        id
                        prefLabel {
                            value
                        }
                    }
                }
            }
        }
    }
    """

    variables = {
        "skosId": collection_id,  # "term:interim/polarity/scale/1"
    }

    data = await request(endpoint, query, variables)
    return data['skos']['Collection']

# polarity is with collection & family 
async def create_collection(collection_id, collection_label):
    query = """
    mutation CreateCollection($input: createCollectionInput) {
        createCollection(input: $input) {
            id
            prefLabel {
                value
            }
        }
    }
    """

    variables = {
        "input": {
            "data": {
                "id": collection_id,
                "prefLabel": [
                    {
                        "value": collection_label
                    }
                ]
            }
        }
    }

    data = await request(endpoint, query, variables)
    return data['createCollection']

async def delete_collection(collection_id):
    query = gql("""
    mutation DeleteCollection($input: deleteCollectionInput) {
        deleteCollection(input: $input) {
            id
        }
    }
    """)

    variables = {
        "input": {
            "where": {
                "id": collection_id
            }
        }
    }

    async with Client(transport=transport.RequestsHTTPTransport(endpoint)) as client:
        data = await client.execute(query, variable_values=variables)
    return data["deleteCollection"]


async def search_for_concept(concept_id):
    query = gql("""
    query searchConcept($skosId: [ID]) {
        skos(id: $skosId) {
            Concept {
                id
                prefLabel {
                    value
                }
                memberOf {
                    id
                    prefLabel {
                        value
                    }
                }
            }
        }
    }
    """)

    variables = {
        "skosId": concept_id,
    }

    async with Client(transport=transport.RequestsHTTPTransport(url=endpoint)) as client:
        data = await client.execute(query, variable_values=variables)
    return data["skos"]["Concept"]


async def create_concept(concept_id, concept_pref_label, collection_id):
    query = gql("""
    mutation CreateConcept($input: createConceptInput) {
        createConcept(input: $input) {
            id
            prefLabel {
                value
            }
            memberOf {
                id
                prefLabel {
                    value
                }
            }
        }
    }
    """)

    variables = {
        "input": {
            "data": {
                "id": concept_id,
                "prefLabel": [{"value": concept_pref_label}],
                "memberOf": collection_id
            }
        }
    }

    async with Client(transport=transport.RequestsHTTPTransport(endpoint)) as client:
        data = await client.execute(query, variable_values=variables)
    return data["createConcept"]

async def delete_concept(concept_id):
    query = gql("""
    mutation DeleteConcept($input: deleteConceptInput) {
        deleteConcept(input: $input) {
            id
        }
    }
    """)
    variables = {
        "input": {
            "where": {
                "id": concept_id
            }
        }
    }
    async with Client(transport=transport.RequestsHTTPTransport(url=endpoint)) as client:
        data = await client.execute(query, variable_values=variables)
    return data["deleteConcept"]


def first_test():
    endpoint = 'http://localhost:5020/'  # for local testing
    endpoint = 'https://jobs-and-skills-v2-dev-wyew76oo4a-ew.a.run.app/graphql'  # for online testing

    # Example manuel de creation d'une polarity dans le fichier de sortie. La génération effectuée est différente au niveau des ids mais plus prédictible
    # {
    #   "id": "tr:__polarity-1__",
    #   "type": "soo:Polarity",
    #   "polarityScale": "term:interim/polarity/scale/1",
    #   "polarityValue": "term:interim/polarity/value/1"
    # }

    # Changer ces variables pour créer d'autres examples.
    provider_name = 'interim'
    collection_pref_label = 'polarity'
    collection_category = 'scale'
    concept_pref_label = 'example-polarity-1' 
    
    # Find or create the concept
    concept_id = f"term:{provider_name}/{collection_pref_label}/value/{md5(concept_pref_label)}"
    collection_id = f"term:{provider_name}/{collection_pref_label}/{collection_category}"

    concept = search_for_concept(concept_id)
    concept_exist = len(concept) >= 1
    if not concept_exist:
        print('This concept does not exist.')

        print('a) Check if the parent collection exists')
        collection = search_for_collection(collection_id)
        collection_exist = len(collection) >= 1

        if not collection_exist:
            print('The collection does not exist, create it')
            collection_label = f"{provider_name} collection for {collection_pref_label}"
            new_collection = create_collection(collection_id, collection_label)
            print('   Collection created: \n', new_collection)
        else:
            print('Collection exists')

        print('b) Create the concept linked to the collection')
        concept = create_concept(concept_id, concept_pref_label, collection_id)
    else:
        print('Concept exists')

    print('The concept value is:')
    print(concept)

    if iValidate('Do you want to remove the Concept ?'):
        deleted = delete_concept(concept_id)
        print('Concept deleted:', deleted)

        if iValidate('Do you want to delete the Collection ?'):
            deleted = delete_collection(collection_id)
            print('Collection deleted:', deleted)

    print('find-or-create process example finished')

