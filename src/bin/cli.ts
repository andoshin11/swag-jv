import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import * as prog from 'caporal'
import Generator from '../generator'

const pkg = require('../../package.json')

prog
  .version(pkg.version)
  .description("Generate JSON validator from Open API spec")
  .command("generate", "generate validator")
  .argument("<file>", "targe yaml")
  .option("-d, --dist <dist>", "Output directory")
  .action((args, options: { dist?: string }) => {
    const { file } = args
    const { dist } = options
    if (!dist) {
      throw new Error('Dist directory is required. Please specify with --dist option.')
    }

    if (/\.ya?ml$/.test(file)) {
      if (!fs.existsSync(path.resolve(process.cwd(), file))) {
        throw new Error('File does not exist.')
      }
      const target = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
      const yaml = YAML.safeLoad(target)
      new Generator(yaml, { dist }).generate()
    } else {
      throw new Error('YAML is the only file type that is supported.')
    }
  })
  .command("convert", "convert to json schema")
  .argument("<file>", "targe yaml")
  .option("-d, --dist <dist>", "Output directory")
  .action((args, options: { dist?: string }) => {
    const { file } = args
    const { dist } = options
    if (!dist) {
      throw new Error('Dist directory is required. Please specify with --dist option.')
    }

    if (/\.ya?ml$/.test(file)) {
      if (!fs.existsSync(path.resolve(process.cwd(), file))) {
        throw new Error('File does not exist.')
      }
      const target = fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8')
      const yaml = YAML.safeLoad(target)
      new Generator(yaml, { dist }).convert()
    } else {
      throw new Error('YAML is the only file type that is supported.')
    }
  })

prog.parse(process.argv)
