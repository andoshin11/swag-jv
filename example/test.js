const schemaValidators = require('./validators/schema')
const pathsValidators = require('./validators/paths')

const correctData = {
  id: 1,
  name: 'Gritz',
  category: 2,
  sex: 'male'
}

console.log(schemaValidators.PetValidator(correctData))

// const inCorrectData = {
//   id: 1,
//   name: 'Gritz',
//   category: 1,
//   sex: 'others'
// }

// console.log(schemaValidators.PetValidator(inCorrectData))

const corretResponse = {
  total: 1,
  per_page: 5,
  page: 1,
  pets: [],
}

console.log(pathsValidators.GetPetsOperationValidator.parameters(corretResponse))
