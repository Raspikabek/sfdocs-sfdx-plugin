# sfdocs-sfdx-plugin

Salesforce Documentation Generator plugin for sfdx

[![Version](https://img.shields.io/npm/v/sfdocs-sfdx-plugin.svg)](https://npmjs.org/package/sfdocs-sfdx-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/sfdocs-sfdx-plugin)](https://npmjs.org/package/sfdocs-sfdx-plugin)
[![license: MIT](https://img.shields.io/badge/license-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Netlify Status](https://api.netlify.com/api/v1/badges/aeeb80ba-211c-4b4c-a061-5af4ce9bbb2c/deploy-status)](https://app.netlify.com/sites/sfdocs/deploys)

## Overview

Check the Documentation in [sfdocs.netlify.app](http://sfdocs.netlify.app/)

Generate documentation given the source content of your project. We use [Handlebarsjs](https://handlebarsjs.com/) to parse the metadata into the templates format.

Content will be generated in the following structure:

```sh
docs/ # root folder defined by <outputdir> flag
  force-app/ # one folder per package in the sfdx-project
    profiles/ # folder per MetadataTypeInfo
      Admin.md # md file per element
      MyCustomProfile.md
    objects/
      Account.md
      CustomObject.md
    <metadata-type>/
      <element>.md
  awesome-app/ # my second package in the project
    objects/
      ...
  ...
```

This will bring the possibility to publish or import this content in public/private documentation pages for your own project.

## Install

```bash
sf plugins install sfdocs-sfdx-plugin
```

## Issues

Please report any issues at https://github.com/raspikabek/sfdocs-sfdx-plugin/issues

## Contributing

1. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) -- _under construction_
2. Create a new issue before starting your project so that we can keep track of
   what you are trying to add/fix. That way, we can also offer suggestions or
   let you know if there is already an effort in progress.
3. Fork this repository.
4. [Build the plugin locally](#build)
5. Create a _topic_ branch in your fork. Note, this step is recommended but technically not required if contributing using a fork.
6. Edit the code in your fork.
7. Write appropriate tests for your changes. Try to achieve at least 95% code coverage on any new code. No pull request will be accepted without unit tests.
8. Send us a pull request when you are done. We'll review your code, suggest any needed changes, and merge it in.

### Build

To build the plugin locally, make sure to have yarn installed and run the following commands:

```bash
# Clone the repository
git clone git@github.com:raspikabek/sfdocs-sfdx-plugin

# Install the dependencies and compile
yarn && yarn build
```

To use your plugin, run using the local `./bin/dev` or `./bin/dev.cmd` file.

```bash
# Run using local run file.
./bin/dev docs
```

There should be no differences when running via the Salesforce CLI or using the local run file. However, it can be useful to link the plugin to do some additional testing or run your commands from anywhere on your machine.

```bash
# Link your plugin to the sf cli
sf plugins link .
# To verify
sf plugins
```

## Commands

<!-- commands -->

- [`sf docs generate`](#sf-docs-generate)

## `sf docs generate`

Generate documentation of your project in a particular format and based on Handlebar templates

```
USAGE
  $ sf docs generate [--json] [-d <value>] [-f json|markdown] [-p <value>] [-i <value>] [--reset] [--templates-path
    <value>] [--helpers-path <value>]

FLAGS
  -d, --output-dir=<value>      [default: docs] Target directory to store the output documentation files
  -f, --format=<option>         [default: json] The result format stored in the output directory.
                                <options: json|markdown>
  -i, --ignore-type=<value>...  List of metadata types to ignore. Valid values are Metadata Type names or folder names.
                                Example: (CustomApplication or applications, CustomObject or objects)
  -p, --package=<value>...      Name of the package to generate the documentation from. Allows multiple packages. Leave
                                it empty to generate documentation from all existing packages in your sfdx-project.json
                                file
  --helpers-path=<value>        Custom methods can override existing default methods, the rest will be merged and will
                                coexist with the default helpers.
  --reset                       Removes the existing target docs folder before generating the new content
  --templates-path=<value>      Path to folder with custom templates.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Generate documentation of your project in a particular format and based on Handlebar templates

  Documentation is generated based on your local source code. Supports multi-package solutions, custom templates and
  custom handlebar helpers. Read more in https://sfdocs.netlify.app

EXAMPLES
  - Generate documentation from all packages in your local project
    sf docs generate
  - Generate documentation from one package in your local project
    sf docs generate --packages force-app
  - Generate documentation without CustomObjects
  $ sf docs generate --ignoretypes objects
  - Generate documentation with custom templates
  $ sf docs generate --templates-path config/templates
  - Generate documentation with helpers
  $ sf docs generate --helpers-path config/helpers.ts

FLAG DESCRIPTIONS
  -d, --output-dir=<value>  Target directory to store the output documentation files

    It will create a folder per sfdx package within your project and inside the appropriate Metadata Type structure.

  -i, --ignore-type=<value>...

    List of metadata types to ignore. Valid values are Metadata Type names or folder names. Example: (CustomApplication
    or applications, CustomObject or objects)

    Examples:

    Ignore one type:
    sf docs generate --ignoretype CustomObject

    Ignore multiple types:
    sf docs generate -i objects -i applications

  -p, --package=<value>...

    Name of the package to generate the documentation from. Allows multiple packages. Leave it empty to generate
    documentation from all existing packages in your sfdx-project.json file

    Packages names have to match the name in the sfdx-project.json file.

    Example with multiple packages:

    sf docs generate -p main-app -p reports-app
```

<!-- commandsstop -->
