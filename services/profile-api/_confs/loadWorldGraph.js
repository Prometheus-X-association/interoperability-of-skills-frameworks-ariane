import { getGraph } from '@mmorg/rdfx-graphql'
import { default as xmlDataTypes } from '@mmorg/rdfx-onto-xml-datatypes'
import { default as rdf } from '@mmorg/rdfx-onto-rdf' 
import { default as rdfs } from '@mmorg/rdfx-onto-rdfs'


// loading the "Ontology World"
export default function loadWorldGraph(onto) {
  spliceSpecialCases(rdfs, ['rdfs:member'])
  return getGraph(onto, xmlDataTypes, rdf, rdfs)
}

// this function remove properties that are in conflic with other property
function spliceSpecialCases(onto, ids){
  const indexes = ids.map( id => onto.graph.findIndex( e => e.id === id))
  indexes.forEach( i => onto.graph.splice(i, 1)) 
} 