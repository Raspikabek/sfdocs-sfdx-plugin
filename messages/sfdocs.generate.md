# summary

Generate documentation of your project in a particular format and based on Handlebar templates

# description

Documentation is generated based on your local source code. Supports multi-package solutions, custom templates and custom handlebar helpers. Read more in https://sfdocs.netlify.app

# flags.format.summary

The result format stored in the output directory.

# flags.package.summary

Name of the package to generate the documentation from. Allows multiple packages. Leave it empty to generate documentation from all existing packages in your sfdx-project.json file

# flags.package.description

Packages names have to match the name in the sfdx-project.json file.

Example with multiple packages:

<%= config.bin %> <%= command.id %> -p main-app -p reports-app

# flags.ignoretype.summary

(in-progress) List of metadata types to ignore. Valid values are Metadata Type names or folder names. Example: (CustomApplication or applications, CustomObject or objects)

# flags.ignoretype.description

Examples:

Ignore one type:
<%= config.bin %> <%= command.id %> --ignoretype CustomObject

Ignore multiple types:
<%= config.bin %> <%= command.id %> -i objects -i applications

# flags.reset.summary

Removes the existing target docs folder before generating the new content

# flags.templatespath.summary

Path to folder with custom templates.

# flags.templatespath.description

Will override all default templates and missing templates will ignore the missing metadata types. If `objects.md` is missing in the path, the `objects` will not be generated.

# flags.helperspath.summary

Path to file with additional custom helper definition methods.

# flags.helperspath.summary

Custom methods can override existing default methods, the rest will be merged and will coexist with the default helpers.

# flags.outputdir.summary

Target directory to store the output documentation files

# flags.outputdir.description

It will create a folder per sfdx package within your project and inside the appropriate Metadata Type structure.

# examples

- Generate documentation from all packages in your local project

  <%= config.bin %> <%= command.id %>

- Generate documentation from one package in your local project

  <%= config.bin %> <%= command.id %> --packages force-app

- Generate documentation without CustomObjects

<%= config.bin %> <%= command.id %> --ignoretypes objects

- Generate documentation with custom templates

<%= config.bin %> <%= command.id %> --templates-path config/templates

- Generate documentation with helpers

<%= config.bin %> <%= command.id %> --helpers-path config/helpers.ts

# info.generate

Documentation generated!
Path: %s
Format: %s
