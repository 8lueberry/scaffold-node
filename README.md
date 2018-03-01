# Scaffold service project

## Introduction

## Prerequisite

- Node version LTS `8.9.0`

## Quick start

- `$ npm install`
- `$ npm start` (or `$ npm run watch` to run with watch)
- Browse to [http://localhost:8008/helloworld](http://localhost:8008/helloworld) and [http://localhost:8008/helloworld?name=yp](http://localhost:8008/helloworld?name=yp), you should get the response

## Creating a new service

## Tools

- express
- jest

## Commands

- `$ npm install`: Installs the package dependencies
- `$ npm start`: Starts the project
- `$ npm test`: Runs lint and coverage

## Directory layout

```
.
├── /config/                    # Your app configs
├── /db/                        # DB migration scripts here
├── /scripts/                   # custom npm command script
├── /src/                       # The source code of the application
│   ├── /Assembly.js            # Builds all the application dependencies
│   ├── /Bootstrapper.js        # Builds all the application dependencies
│   ├── /index.js               # Server-side startup script
│   ├── /Monitoring.js          # Monitoring code
│   └── /Router.js              # Service routes
├── .editorconfig               # editor config (http://editorconfig.org/)
├── .gitignore                  # git ignore files config
├── .nvmrc                      # node versioning manager config (https://github.com/creationix/nvm)
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # The list of 3rd party libraries and utilities
└── README.md                   # Describes the project
```

## Configs
## Logger

## Errors

tldr;

[Custom JavaScript Errors in ES6](https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87)

## Tests
## Code coverage
## Code documentation
