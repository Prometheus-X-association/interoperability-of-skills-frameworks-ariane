import { createHash } from 'node:crypto';
import { gql, request } from 'graphql-request'
import iValidate from './utils/iValidate.js';

let endpoint = `http://localhost:5020/` // for local testing 
endpoint = 'https://jobs-and-skills-v2-dev-wyew76oo4a-ew.a.run.app/graphql' // for online testing 


/* Example manuel de creation d'une polarity dans le fichier de sortie. La génération effectuée est différente au niveau des ids mais plus prédictible
{
  "id": "tr:__polarity-1__",
  "type": "soo:Polarity",
  "polarityScale": "term:interim/polarity/scale/1",
  "polarityValue": "term:interim/polarity/value/1"
},
*/

// Changer ces variables pour créer d'autres examples.
const providerName = 'interim'
const collectionPrefLabel = 'polarity'
const collectionCategory = 'scale'
const conceptPrefLabel = 'example-polarity-1'

///// find or create the concept 
// Search for concept 
const conceptId = `term:${providerName}/${collectionPrefLabel}/value/${md5(conceptPrefLabel)}`
const collectionId = `term:${providerName}/${collectionPrefLabel}/${collectionCategory}`

let concept = await searchForConcept(conceptId)
const conceptExist = concept.length >= 1
if(!conceptExist){
  console.log('This concept do not exist.')

  console.log('a) Check if the parent collection exist')
  const collection = await searchForCollection(collectionId)
  const collectionExist = collection.length >= 1

  if(!collectionExist){
    console.log('The collection do not exist, create it')
    const collectionLabel = `${providerName} collection for ${collectionPrefLabel}`
    const newCollection = await createCollection(collectionId, collectionLabel)
    console.log('   Collection created: \n', newCollection)
  }else{
    console.log('Collection exist')
  }

  console.log('b) Create the concept linked to the collection')
  concept = await createConcept(conceptId, conceptPrefLabel, collectionId) 
}else {
  console.log('Concept exists')
}

console.log('The concept value is:')
console.dir(concept)

if(await iValidate('Do you want to remove the Concept ?')){
  const deleted = await deleteConcept(conceptId)
  console.log('Concept deleted:', deleted)

  if(await iValidate('Do you want to delete the Collection ?')){
    const deleted = await deleteCollection(collectionId)
    console.log('Collection deleted:', deleted)
<<<<<<< HEAD
<<<<<<< HEAD
=======
    throw new Error('restart here')
>>>>>>> 104fada (feat: add script example for find-or-create-term function)
=======
>>>>>>> 67344d9 (feat: add js util for md5 calculate & fix dependencies)
  }
}

console.log('find-or-create process example finished')


//******* Collection related functions **********/
// search for Collection
async function searchForCollection(collectionId){
  const query = gql`
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
  `

  const variables = {
    skosId: collectionId, //"term:interim/polarity/scale/1"
  }

  const data = await request(endpoint, query, variables)
  return data.skos.Collection
}

// polarity is with collection & familly 
async function createCollection(collectionId, collectionLabel) {
  const query = `mutation CreateCollection($input: createCollectionInput) {
    createCollection(input: $input) {
      id
      prefLabel {
        value
      }
    }
  }`

  const variables = {
    input: {
      data: {
        id: collectionId,
        prefLabel: [
          {
            value: collectionLabel
          }
        ]
      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.createCollection
}

async function deleteCollection(collectionId){
  const query = gql`
  mutation DeleteCollection($input: deleteCollectionInput) {
    deleteCollection(input: $input) {
      id
    }
  }
  `

  const variables = {
    "input": {
      "where": {
        "id": collectionId
      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.deleteCollection
}


//******* Concept related functions **********/

async function searchForConcept(conceptId) {
  const query = gql`
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
`
  const variables = {
    skosId: conceptId, // "term:interim/polarity/value/1",
  }

  const data = await request(endpoint, query, variables)
  return data.skos.Concept
}


async function createConcept(conceptId, conceptPrefLabel, collectionId){

  const query = gql`
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
  `

  const variables= {
    input: {
      data: {
        id: conceptId,
        prefLabel: [ { value: conceptPrefLabel }], 
        memberOf: collectionId,
        
      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.createConcept
}

async function deleteConcept(conceptId){
  const query = gql`
  mutation DeleteConcept($input: deleteConceptInput) {
    deleteConcept(input: $input) {
      id
    }
  }
  `
  const variables= {
    "input": {
      "where": {
        "id": conceptId
      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.deleteConcept
}


function md5(content) {
  return createHash('md5').update(content).digest('hex')
}