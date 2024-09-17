import mergeWith from 'lodash.mergewith'

export const mapAddStates = {
  multiple: 0,
  unique: 1,
  dynamic: 2,
}

export const mapAddMerges = {
  noMerge: 0,
  deep: 1,
  lastWin: 2,
}
/**
 * 
 * @param {Map} map 
 * @param {string} key 
 * @param {*} value 
 * @param {*} mode
 * @todo: implement the other mapAddStates options
 * @todo: implement "object already exist" check ? (as a hook or and indirection)
 * @todo: find how declare the `.mode` typing 
 */
export function mapAdd(map, key, value, mode = mapAddStates.multiple, merge = mapAddMerges.deep) {
  let found = map.get(key)
  if (!found) {
    found = initWithMode(value, mode)
    map.set(key, found)
    return map
  }

  if (Array.isArray(found)) {
    if (mode === mapAddStates.unique) throw new Error(`There is a mixed state with mode=${mode} & key ${key} with value: ${value}`)
    // @todo: add here and identity check between 2 objects (and associated indirection: `isSameObject`)
    found.push(value)
    return map

  } else {
    if (mode === mapAddStates.unique) {

      if (merge === mapAddMerges.deep) {
        // @todo? check if both objects ? 
        // @todo: add indirection here for customizer param: https://lodash.com/docs/4.17.15#merge
        mergeWith(found, value)
        return map
      }

      throw new Error('@implement: this particular case')

    }

  }




  // else cases of unique and dynamic to manage 
  throw new Error('@implement: this particular case')
}

function initWithMode(value, mode) {
  if (mode === mapAddStates.multiple) return [value]
  if (mode === mapAddStates.unique) return value
  if (mode === mapAddStates.dynamic) return value

  throw new Error(`@implement: this particular case. mode = ${mode}`)
}