const schemaValidators = require('./validators/schema')

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
