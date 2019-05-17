import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import * as commander from 'commander'
import Generator from '../generator'

const pkg = require('../../package.json')

commander
  .version(pkg.version)
  .description("Generate JSON validator from Open API spec")
  .command("generate <file>")
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

commander.parse(process.argv)
