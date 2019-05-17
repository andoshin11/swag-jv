// @ts-ignore
import * as toJsonSchema from 'openapi-schema-to-json-schema'
import * as path from 'path'
import * as fs from 'fs'
import * as ejs from 'ejs'
import { dereference } from 'json-schema-ref-parser'
import { OpenAPIObject } from 'openapi3-ts'
import { JsonSchema } from './types'

export default class Generator {
  private jsonSchema: JsonSchema

  constructor(private spec: OpenAPIObject, private options: CodeGenOptions) {
    this.jsonSchema = this.convertToJsonSchema(spec)
  }

  async generate() {
    // Setup dist
    if (!fs.existsSync(this.dist)) {
      fs.mkdirSync(this.dist)
    }

    // Need to parse $refs before passing to ajv
    const refParsed = await dereference(this.jsonSchema) as JsonSchema
    this.genFiles([
      {
        filepath: path.resolve(this.dist, 'schema.json'),
        content: JSON.stringify(refParsed, null, '\t')
      }
    ])

    // Render schemas
    if (this.spec.components && this.spec.components.schemas) {
      const schemaTemplatePath = path.resolve(__dirname, '../templates/schemas.ejs')
      const schemaTemplate = fs.readFileSync(schemaTemplatePath, 'utf-8')
      const content = ejs.render(schemaTemplate, {
        schemas: Object.keys(this.spec.components.schemas).map(schema => ({
          name: schema,
          funcName: `${schema}Validator`
        }))
      })
      this.genFiles([
        {
          filepath: path.resolve(this.dist, 'schema.js'),
          content
        }
      ])
    }
  }

  private convertToJsonSchema(spec: OpenAPIObject): JsonSchema {

    return toJsonSchema(spec)
  }

  /**
   * Generate files with requests
   * @param genCodeRequests
   */
  private genFiles(genCodeRequests: GenFileRequest[]) {
    genCodeRequests.forEach(v => {
      fs.writeFileSync(v.filepath, v.content, {
        encoding: 'utf-8',
        flag: 'w+'
      })
      console.log('Generated:', v.filepath)
    })
  }

  /**
   * Get dist path
   */
  get dist(): string {
    return path.resolve(process.cwd(), this.options.dist)
  }
}


/**
 * Options for Generator
 */
export interface CodeGenOptions {
  dist: string
}

export interface GenFileRequest {
  filepath: string
  content: string
}
