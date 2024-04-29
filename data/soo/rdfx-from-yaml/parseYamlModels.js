import updateGraphMapFromYaml from './updateGraphMapFromYaml.js'

export default function parseYamlModels({context, worldGraph}, ...ymlContents){
  const graphMap = new Map()

  for(const model of ymlContents.flat()){
    updateGraphMapFromYaml(graphMap, model, worldGraph)
  }

  const ld = {
    "@context": context, // @TODO: generate clean context
    graph: [...graphMap.values()]
  }
  return ld
}
