import { JSONSchema4 } from 'json-schema'

export interface JsonSchema {
  components: {
    schemas: {
      [key: string]: JSONSchema4
    }
  }
}
