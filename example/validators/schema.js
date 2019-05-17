const AJV = require('ajv')
const ajv = new AJV({ unknownFormats: ['int32', 'float', 'int64'] })
const json = require('./schema.json')

function validate (schema, data) {
  const valid = ajv.validate(schema, data)
  if (!valid) throw new Error(ajv.errorsText())
  return valid
}

exports.PetValidator = function (data) {
  const schema = json.components.schemas['Pet']
  return validate(schema, data)
}

exports.PetSeedValidator = function (data) {
  const schema = json.components.schemas['PetSeed']
  return validate(schema, data)
}

