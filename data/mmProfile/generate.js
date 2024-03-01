import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
import { readData } from '@mmorg/fsutils'
import YAML from 'yaml'
import { readJson, saveJson } from '@mmorg/fsutils'
import loadWorldGraph from './src/loadWorldGraph.js'
// import {updateStrategies, updateEntity} from '@mmorg/rdfx-layer'
// import getApiLabel from '@mmorg/rdfx-graphql/src/rdfx-id/getApiLabel.js'
import textView from './src/textView.js'
import parseYamlModels from './rdfx-from-yaml/parseYamlModels.js'
import { updateStrategies, updateLayers } from "@mmorg/rdfx-layer";

const modelFolder = `${__dirname}/model` 
const otherGraph = [
  `${modelFolder}/searchedUser.jsonld`,
  `${modelFolder}/overrides.jsonld`
]
// const current_graph = []
// const graphMap = new Map()

const worldGraph = loadWorldGraph()
const model = YAML.parse(readData(`${__dirname}/model/model.yaml`))

const ontoPath = './mm-profile-1.0.0.jsonld'

const context = readJson(ontoPath)['@context']


console.log('Generate the mms skills profile ontology')

console.log(model)

const current_ld = parseYamlModels({context, worldGraph}, model)

// @TODO: put this Ontology entity into a yml file
current_ld.graph.push(getOntologyEntity())

const loaded = otherGraph.map( path => readJson(path))

const aggregated_ld = mergeOntologies(current_ld, ...loaded)

saveJson(aggregated_ld, ontoPath)


console.log(textView(aggregated_ld), '===')


function getOntologyEntity() {
  return {
    "id": "mms:Ontology",
    "type": [
      "owl:Ontology"
    ],
    "title": [
      {
        "@language": "en",
        "@value": "Ontologie for Competencies & Skills Profiles"
      }
    ],
    "contributor": [],
    "creator": [
      {
        "@language": "fr",
        "@value": "Florent André (mindmatcher.org)"
      }
    ],
    "description": [
      {
        "@language": "fr",
        "@value": "Ontologie pour la description d'un profil de compétences"
      }
    ],
    "imports": []
  }
}

function mergeOntologies(ld1, ...ld2) {
  const sourceLayer = {
    ld: ld1,
  };

  const otherLayers = ld2.map((ld) => ({
    updateStrategy: updateStrategies.add,
    ld,
  }));

  const mergedLayer = updateLayers(sourceLayer, otherLayers);
  // updateExternalEngine(mergedLayer.ld, extraEngineOntology)
  return mergedLayer.ld;
}