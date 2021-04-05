# sfdocs-sfdx-plugin

Salesforce Documentation Generator plugin for sfdx

[![Version](https://img.shields.io/npm/v/sfdocs-sfdx-plugin.svg)](https://npmjs.org/package/sfdocs-sfdx-plugin)
[![CircleCI](https://circleci.com/gh/raspikabek/sfdocs-sfdx-plugin/tree/master.svg?style=shield)](https://circleci.com/gh/raspikabek/sfdocs-sfdx-plugin/tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/raspikabek/sfdocs-sfdx-plugin?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdocs-sfdx-plugin/branch/master)
[![Codecov](https://codecov.io/gh/raspikabek/sfdocs-sfdx-plugin/branch/master/graph/badge.svg)](https://codecov.io/gh/raspikabek/sfdocs-sfdx-plugin)
[![Greenkeeper](https://badges.greenkeeper.io/raspikabek/sfdocs-sfdx-plugin.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/raspikabek/sfdocs-sfdx-plugin/badge.svg)](https://snyk.io/test/github/raspikabek/sfdocs-sfdx-plugin)
[![Downloads/week](https://img.shields.io/npm/dw/sfdocs-sfdx-plugin.svg)](https://npmjs.org/package/sfdocs-sfdx-plugin)
[![License](https://img.shields.io/npm/l/sfdocs-sfdx-plugin.svg)](https://github.com/raspikabek/sfdocs-sfdx-plugin/blob/master/package.json)

<!-- toc -->
* [sfdocs-sfdx-plugin](#sfdocs-sfdx-plugin)
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
  <!-- install -->

```sh-session
$ sfdx plugins:install sfdocs-sfdx-plugin
```

<!-- usage -->
```sh-session
$ npm install -g sfdocs-sfdx-plugin
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdocs-sfdx-plugin/0.0.0 linux-x64 node-v14.16.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx sfdocs:generate [-d <filepath>] [-r markdown|json] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-sfdocsgenerate--d-filepath--r-markdownjson---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx sfdocs:generate [-d <filepath>] [-r markdown|json] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

generates documentation

```
generates documentation

USAGE
  $ sfdx sfdocs:generate [-d <filepath>] [-r markdown|json] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -d, --outputdir=outputdir                                                         [default: sfdocs] directory to store
                                                                                    the documentation files

  -r, --resultformat=(markdown|json)                                                [default: markdown] result format
                                                                                    stored in the outputdir; --json flag
                                                                                    overrides this parameter

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  $ sfdx sfdocs:generate --resultformat markdown --outputdir site
```

_See code: [lib/commands/sfdocs/generate.js](https://github.com/raspikabek/sfdocs-sfdx-plugin/blob/v0.0.0/lib/commands/sfdocs/generate.js)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->

# Debugging your plugin

We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command:

1. Start the inspector

If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch:

```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```

Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:

```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program.
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
   Congrats, you are debugging!
