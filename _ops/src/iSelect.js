import inquirer from 'inquirer'

export default async function iSelect(choicable, ichoices, message = '-> default message'){
  const name = '__i__'

  const choices = []
  const map = new Map()
  for(const c of choicable){
    map.set(c.name, c)
    choices.push(c.name)
  }

  choices.push(...ichoices)

  const sendChanges = await inquirer.prompt([
    {
      type: 'rawlist',
      name,
      message,
      choices,
      default: true,
    }
  ])
  const key = sendChanges[name]
  
  if(!map.get(key)){
    return key
  }

  return map.get(key).value
}