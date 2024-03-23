// @ts-ignore
import { readJson } from '@mmorg/fsutils'
import { it, expect } from 'vitest'

function ontoTermTransform(input1, mappingRules){
  console.log('This is the transformation function to define')
  return {
    '@context': {}, // context to define
    graph: [], // with a good context, the `graph` key do not have to be `@graph`
  }
}

const testDataDir = `${__dirname}`
it('Should export a unique function that make mapping', () => {

  const input1 = readJson(`${testDataDir}/input.json`)
  const mappingRules = { 'rules': 'to-define'}
  const output1 = ontoTermTransform(input1, mappingRules)


  expect(output1.graph.length > 0).toBeTruthy()
  

})