// THIS FILE IS GENERATED BY CODE GENERATOR. DO NOT CHANGE MANUALLY.
/* tslint:disable */
/* eslint-disable */
const AJV = require('ajv')
const ajv = new AJV({ unknownFormats: ['int32', 'float', 'int64'], nullable: true })
const json = require('./schema.json')

function validate (schema, data) {
  const valid = ajv.validate(schema, data)
  if (!valid) throw new Error(ajv.errorsText())
  return valid
}

export const PetValidator = function (data) {
  const schema = json.components.schemas['Pet']
  return validate(schema, data)
}

export const PetSeedValidator = function (data) {
  const schema = json.components.schemas['PetSeed']
  return validate(schema, data)
}

