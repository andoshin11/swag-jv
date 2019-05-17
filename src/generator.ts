// @ts-ignore
import * as toJsonSchema from 'openapi-schema-to-json-schema'
import * as path from 'path'
import * as fs from 'fs'
import * as ejs from 'ejs'
import { dereference } from 'json-schema-ref-parser'
import { OpenAPIObject, PathItemObject } from 'openapi3-ts'
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
      const schemaTemplatePath = path.resolve(__dirname, '../templates/schema.ejs')
      const schemaDtsTemplatePath = path.resolve(__dirname, '../templates/schema.d.ts.ejs')
      const schemaTemplate = fs.readFileSync(schemaTemplatePath, 'utf-8')
      const schemaDtsTemplate = fs.readFileSync(schemaDtsTemplatePath, 'utf-8')
      const content = ejs.render(schemaTemplate, {
        schemas: Object.keys(this.spec.components.schemas).map(schema => ({
          name: schema,
          funcName: `${schema}Validator`
        }))
      })
      const dtsContent = ejs.render(schemaDtsTemplate, {
        schemas: Object.keys(this.spec.components.schemas).map(schema => ({
          name: schema,
          funcName: `${schema}Validator`
        }))
      })
      this.genFiles([
        {
          filepath: path.resolve(this.dist, 'schema.js'),
          content
        },
        {
          filepath: path.resolve(this.dist, 'schema.d.ts'),
          content: dtsContent
        }
      ])
    }

    // Render paths
      const pathTemplatePath = path.resolve(__dirname, '../templates/paths.ejs')
      const pathsDtsTemplatePath = path.resolve(__dirname, '../templates/paths.d.ts.ejs')
      const pathsTemplate = fs.readFileSync(pathTemplatePath, 'utf-8')
      const pathsDtsTemplate = fs.readFileSync(pathsDtsTemplatePath, 'utf-8')
      const paths = Object.values(this.spec.paths).reduce((acc, ac) => {
        for (const operation of Object.values(ac)) {
          const { operationId } = operation as any
          acc.push({
            name: operationId,
            funcName: `${operationId}Validator`
          })
        }
        return acc
      }, [] as { name: string; funcName: string; }[])
      this.genFiles([
        {
          filepath: path.resolve(this.dist, 'paths.js'),
          content: ejs.render(pathsTemplate, { paths })
        },
        {
          filepath: path.resolve(this.dist, 'paths.d.ts'),
          content: ejs.render(pathsDtsTemplate, { paths })
        }
      ])
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
