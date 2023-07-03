# summary

Generates documentation of your project.

# description

Generates documentation under a folder in a particular format based on your project local metadata.

# flags.format.summary

The result format stored in the output directory.

# flags.package.summary

Name of the package to generate the documentation from. Allows multiple packages. Leave it empty to generate documentation from all existing packages in your sfdx-project.json file

# flags.package.description

Packages names have to match the name in the sfdx-project.json file.

Example with multiple packages:

<%= config.bin %> <%= command.id %> -p main-app -p reports-app

# flags.ignoretype.summary

List of metadata types to ignore. Valid values are Metadata Type Info names or folder names. Example: (CustomApplication or application, CustomObject or objects)

# flags.ignoretype.description

Examples:

Ignore one type:
<%= config.bin %> <%= command.id %> --ignoretype objects

Ignore multiple types:
<%= config.bin %> <%= command.id %> -i objects -i applications

# flags.reset.summary

Removes the existing target docs folder.

# flags.templatespath.summary

Path to folder with custom templates.

# flags.outputdir.summary

Target directory to store the output documentation files

# flags.outputdir.description

The target directory will create a folder package within your project and inside the appropriate Metadata Type structure. Example:

<%= config.bin %> <%= command.id %> -d docs -p force-app -p labels-app

Output:
docs/
..force-app/
..../objects/
....../Account.md
....../Contact.md
..../profiles/
....../Admin.md
..labels-app/
..../labels/
....../CustomLabels.md

# examples

- Generate documentation from all packages in your local project

  <%= config.bin %> <%= command.id %>

- Generate documentation from one package in your local project

  <%= config.bin %> <%= command.id %> --packages force-app

- Generate documentation without CustomObjects

<%= config.bin %> <%= command.id %> --ignoretypes objects

# info.generate

Documentation generated!
Path: %s
Format: %s
