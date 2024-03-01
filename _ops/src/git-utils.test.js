import { statusParse, statusStates } from './git-utils.js'

// npm test -- --watch git-utils.test

describe('Parse status', () => {

  it('Parse the special `typechange` status as `staged` state', async () => {
    // !!! Be sure that mock response do not have spaces on start, but the one in the pristine response. 
    // Do not copy-paste from terminal as it include leading spaces transformations
    const testValue = `
## main...origin/main [ahead 14]
 M LogNotes.md
 M README-OLD.md
 M bfback-manager/src/git-utils.js
T  pythonTagging/data/suggestions.json
 M pythonTagging/data/suggestionsTagging.json
?? bfback-manager/src/git-utils.test.js
?? pythonTagging/data/TESTBIG-SAVE.txt
    `
    const r = await statusParse(undefined, { testValue })
    console.log(r)
    expect(r.byFile.size).toBe(9)
    expect(r.byStatus.size).toBe(4)
    expect(r.byStatus.get(statusStates.typechange).length).toBe(1)
    expect(r.byStatus.get(statusStates.staged).length).toBe(1)
  })

})
