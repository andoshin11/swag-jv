# swag-jv [![npm version](https://badge.fury.io/js/swag-jv.svg)](https://badge.fury.io/js/swag-jv)
A type definition generator from Open API 3.0 spec.

# Requirements
- [ajv](https://www.npmjs.com/package/ajv)

# Install

```sh
$ yarn add swag-jv
```

# How to use
This command will generate validator functions for each schemas.

```sh
$ swag-jv generate swagger.yml --dist validators
```

# CLI Options

```
Usage: swag-jv [options] [command]

Generate JSON validator from Open API spec

Options:
  -V, --version              output the version number
  -h, --help                 output usage information

Commands:
  generate [options] <file>
  convert [options] <file>
```

# License
MIT
