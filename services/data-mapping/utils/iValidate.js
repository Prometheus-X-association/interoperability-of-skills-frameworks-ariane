import inquirer from 'inquirer'

export default async function iValidate(message){
  const name = '__i__'
  const sendChanges = await inquirer.prompt([
    {
      type: 'confirm',
      name,
      message,
      default: true,
    }
  ])
  return sendChanges[name]
}