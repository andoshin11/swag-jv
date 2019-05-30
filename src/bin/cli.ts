import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import * as commander from 'commander'
import Generator from '../generator'

const pkg = require('../../package.json')

const program = new commander.Command()

program
  .version(pkg.version)
  .description("Generate JSON validator from Open API spec")

program
  .command("generate <file>", "generate validator")
  .option("-d, --dist <dist>", "Output directory")
  .action(async (file: string, options: { dist?: string }) => {
    const { dist } = options
    try {
      if (!dist) {
        throw new Error('Dist directory is required. Please specify with --dist option.')
      }

      if (/\.ya?ml$/.test(file)) {
        if (!fs.existsSync(path.resolve(process.cwd(), file))) {
          throw new Error('File does not exist.')
        }
        const target = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
        const yaml = YAML.safeLoad(target)
        await new Generator(yaml, { dist }).generate()
      } else {
        throw new Error('YAML is the only file type that is supported.')
      }
    } catch (e) {
      console.error(e)
      process.exit(2)
    }
  })

program
  .command("convert <file>", "convert to json schema")
  .option("-d, --dist <dist>", "Output directory")
  .action(async (file: string, options: { dist?: string }) => {
    console.log('converting')
    const { dist } = options
    try {
      if (!dist) {
        throw new Error('Dist directory is required. Please specify with --dist option.')
      }

      if (/\.ya?ml$/.test(file)) {
        if (!fs.existsSync(path.resolve(process.cwd(), file))) {
          throw new Error('File does not exist.')
        }
        const target = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
        const yaml = YAML.safeLoad(target)
        await new Generator(yaml, { dist }).convert()
      } else {
        throw new Error('YAML is the only file type that is supported.')
      }
    } catch (e) {
      console.error(e)
      process.exit(2)
    }
  })

program.parse(process.argv)
