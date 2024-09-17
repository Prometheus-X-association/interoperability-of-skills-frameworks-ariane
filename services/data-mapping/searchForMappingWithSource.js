import fs from 'fs'
import { createHash } from 'node:crypto';
import { gql, request } from 'graphql-request'
import iValidate from './utils/iValidate.js';
// This is this Rome position: "Technicien / Technicienne en traitement des déchets" / rome:term/position/20132
// https://dashemploi.kb.europe-west1.gcp.cloud.es.io:9243/app/enterprise_search/content/search_indices/.ent-search-engine-documents-ariane-first-test/documents
import vectStub from './data-stubs/vector-for-rome-position.json' assert {type: 'json'}

let endpoint = `http://localhost:5020/` // for local testing 
endpoint = 'https://jobs-and-skills-v2-dev-wyew76oo4a-ew.a.run.app/graphql' // for online testing 


// Changer ces variables pour créer d'autres examples.
const providerName = 'orientoi_1'
const sourceValue = {
  label: 'Agent / Agente de centre de tri de dechet',
  description: "<h3>Définition</h3><p>Réalise des opérations de tri de déchets et produits industriels en fin de vie (textiles, plastiques, verres, composants, ...) selon les règles de sécurité, d'environnement et les impératifs de récupération (qualité, cadence, ...).<br>Peut reconditionner des produits industriels pour valorisation par réutilisation ou recyclage.<br>Peut coordonner une équipe.</p><h3>Accès au métier</h3><p>Cet emploi/métier est accessible sans diplôme ni expérience professionnelle.<br>Un ou plusieurs Certificat(s) d'Aptitude à la Conduite En Sécurité -CACES- conditionné(s) par une aptitude médicale à renouveler périodiquement peu(ven)t être requis.<br>Des vaccinations spécifiques (leptospirose, hépatite, ...) peuvent être requises selon le secteur d'activité.</p><h3>Condition du métier</h3><p>L'activité de cet emploi/métier s'exerce au sein de sociétés de services, d'associations, de collectivités territoriales, d'entreprises industrielles en contact avec différents intervenants (particuliers, conducteurs d'engins, ...).<br>Elle varie selon le lieu d'intervention et le type de produits collectés.<br>Elle peut impliquer le port de charges.<br>Le port d'équipements de protection (gants, combinaison, ...) peut être requis.</p><h3>Environnement de travail</h3><p>Structures</p><ul><li>Association</li><li>Centre Véhicules hors d'usage - VHU</li><li>Collectivité territoriale</li><li>Déchetterie</li><li>Entreprise industrielle</li><li>Ressourcerie</li><li>Société de collecte et de traitement des déchets</li><li>Société de services</li></ul><p>Secteurs</p><ul><li>Recyclage</li></ul><h3>Compétences de Base attendues</h3><table><tbody><tr><td>Réaliste</td><td>100.0 %</td></tr></tbody></table>"
}
const sourceType = 'job'
const sourceLanguage = 'fr'

const targetFramework = 'rome'
const targetLanguage = sourceLanguage

// compatibility with findOrCreateTerm naming
const collectionPrefLabel = sourceType
const conceptPrefLabel = sourceValue.label

///// find or create the concept 
// Search for concept 
const conceptId = `term:${providerName}/${collectionPrefLabel}/value/${md5(conceptPrefLabel)}`
const collectionId = `term:${providerName}/collection/${collectionPrefLabel}`

/** Algorithm description 
calculate concept id, search if exist 
a) if not exist
    - did the collection exist ? if yes proceed. if not create it
    - create the entity and assign it to variable

b) if exist  
    I) if have matchings for the target Framework
      - have one validated ? if yes return it, else return all
    II) if don't have matchings : 
      - calculate the vector
      - run the search 
      - create the mappings from the search
      - add the mappings to the concept

  */

let concept = await searchForConceptWithMappings(conceptId)
concept = concept[0]

if (!concept) {
  console.log('This concept do not exist.')

  console.log('a) Check if the parent collection exist')
  const collection = await searchForCollection(collectionId)
  const collectionExist = collection.length >= 1

  if (!collectionExist) {
    console.log('The collection do not exist, create it')
    const collectionLabel = `${providerName} collection for ${collectionPrefLabel}`
    const newCollection = await createCollection(collectionId, collectionLabel)
    console.log('   Collection created: \n', newCollection)
  } else {
    console.log('Collection exist')
  }

  console.log('b) Create the concept linked to the collection')
  concept = await createConcept(conceptId, conceptPrefLabel, sourceLanguage, collectionId)
  concept = concept[0]
}

console.log('Concept exists. Search for mappings or create them', concept.id, 'mapping size', concept.mapping?.length ?? 0)
let mappings_list = []
if (concept.mapping?.length) {
  console.warn('==> Search for existings and validated mappings')

  mappings_list = concept.mapping
  console.log(`The concept ${concept.prefLabel[0].value} (${concept.id}) has mappings:`)
} else {
  // stub calculation
  const searchVector = vectStub
  let query = ``
  let accessValues = () => { throw new Error('Please ovverride') }
  if (targetFramework === 'rome' && sourceType === 'job') {
    query = fs.readFileSync(`graphql-vector-queries/vecRomeJob.gql`).toString()
    accessValues = (d) => d.rome.employment.Position
  } else {
    throw new Error('Theses others cases need to be implemented')
  }

  // search for matching 
  const variables = { "queryVector": searchVector }
  const data = await request(endpoint, gql`${query}`, variables)
  const values = accessValues(data)

  // build the mapping values and create them
  const mappings = values.map(v => {
    const mappingHash = md5(`${conceptId}-${v.id}`)
    const mappingId = `term:${providerName}/mapping/${mappingHash}`
    return {
      id: mappingId,
      lang: targetLanguage,
      score: v._met.score ?? 0,
      target: v.id,
      validated: 0,
      framework: targetFramework,
      source: "elastic-search",
      mappingType: "skos:exactMatch",
    }
  })

  const mappingsCreate = await createMappings(mappings)
  const mappings_ids = mappingsCreate.map(m => m.id)
  const conceptUpdate = await updateConceptMapping(conceptId, mappings_ids)

  console.log('Search for the resulting concept with mappings:')
  let finalMap = await searchForConceptWithMappings(conceptId)
  finalMap = finalMap[0]
  mappings_list = finalMap.mapping
}



// const collectionPrefLabel = 'polarity'
const collectionCategory = 'scale'
// const conceptPrefLabel = 'example-polarity-1'

// voir la possibilité de filtrer par framework et de sort par "validated"

if (mappings_list.length) {
  // console.log('Identified mappings: \n', mappings_list)
  const infos = mappings_list.map( m => ({validated: m.validated[0], score: m.score[0], prefLabel: m.target[0]?.prefLabel?.[0]?.value}))
  console.table(infos,['validated','score', 'prefLabel'])
  if (await iValidate('Do you want to detete the mappings ?')) {
    // 1/ delete the mappings 
    const del_map_id = mappings_list.map(m => m.id)
    const del_map = await deleteMappings(del_map_id)
    console.log('Mappings deleted', del_map)
    // 2/ empty the array of concept.mapping
    const del = await updateConceptMapping(conceptId, [])
    console.log('Concept.mapping property updated', del)

  }else{
    const random = Math.floor(Math.random() * (mappings_list.length - 0 + 1) + 0);
    if(await iValidate(`Do you want to validate a random mapping (the ${random} one), in order to test it on next run ?`)){
      const validatedId = mappings_list[random].id
      const r = await validateMapping(validatedId)
      console.log('For the next run: this entry was validated', r[0])
    }

  }
}



if (await iValidate('Do you want to remove the Concept ?')) {
  const deleted = await deleteConcept(conceptId)
  console.log('Concept deleted:', deleted)

  if (await iValidate('Do you want to delete the Collection ?')) {
    const deleted = await deleteCollection(collectionId)
    console.log('Collection deleted:', deleted)
  }
}

console.log('search-for-mapping-with-source process example finished')

//******* Matchings related concepts *************/
async function createMappings(mappings) {

  const query = gql`
  mutation CreateMapping($input: createMappingInput) {
    createMapping(input: $input) {
      id
      score
    }
  }
  `

  const variables = {
    "input": {
      "bulk": mappings
    }
  }
  const data = await request(endpoint, query, variables)
  return data.createMapping
}


async function deleteMappings(mappingIds) {
  const query = gql`
  mutation DeleteMapping($input: deleteMappingInput) {
    deleteMapping(input: $input) {
      id
    }
  }
  `
  const variables = {
    "input": {
      "where": {
        "id": mappingIds
      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.deleteMapping
}

async function validateMapping(mappingId){
  const query = gql`
  mutation UpdateMapping($input: updateMappingInput) {
    updateMapping(input: $input) {
      id
      validated
    }
  }
  `
  const variables = {
    "input": {
      "bulk": [
        {
          "id": mappingId,
          "validated": 1
        }
      ]
    }
  }

  const data = await request(endpoint, query, variables)
  return data.updateMapping
}

//******* Collection related functions **********/
// search for Collection
async function searchForCollection(collectionId) {
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

async function deleteCollection(collectionId) {
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

async function searchForConceptWithMappings(conceptId) {
  const query = gql`
  query searchForConceptWithMappings($skosId: [ID], $sort: String, $query: String, $where: JSON) {
    skos(id: $skosId) {
      Concept {
        id
        prefLabel {
          value
          language
        }
        mapping(sort: $sort, query: $query, where: $where) {
          id
          score
          framework
          lang
          source
          validated
          target {
            id
            type
            prefLabel {
              language
              value
            }
          }
          mappingType
        }
      }
    }
  }  
`
  const variables = {
    skosId: [conceptId],
    sort: 'validated:desc,score:desc'
  }

  const data = await request(endpoint, query, variables)
  return data.skos.Concept
}


async function createConcept(conceptId, conceptPrefLabel, sourceLanguage, collectionId) {

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

  const variables = {
    input: {
      data: {
        id: conceptId,
        prefLabel: [{ value: conceptPrefLabel, language: sourceLanguage }],
        memberOf: collectionId,

      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.createConcept
}

async function deleteConcept(conceptId) {
  const query = gql`
  mutation DeleteConcept($input: deleteConceptInput) {
    deleteConcept(input: $input) {
      id
    }
  }
  `
  const variables = {
    "input": {
      "where": {
        "id": conceptId
      }
    }
  }

  const data = await request(endpoint, query, variables)
  return data.deleteConcept
}

async function updateConceptMapping(conceptId, mappings) {
  const query = gql`
  mutation UpdateConcept($input: updateConceptInput) {
    updateConcept(input: $input) {
      id
    }
  }
  `
  const variables = {
    "input": {
      "bulk": [
        {
          "id": conceptId,
          "mapping": mappings
        }
      ]
    }
  }

  const data = await request(endpoint, query, variables)
  return data.updateConcept
}


function md5(content) {
  return createHash('md5').update(content).digest('hex')
}