# Scaffold service project

## Introduction

The purpose of this scaffold is to provide a base structure for an express service. It is architecture agnostic, meaning that you build your app with any pattern you want.

## Prerequisite

- Node version LTS `8.x`

## Quick start

- `$ npm install`
- `$ npm start` (or `$ npm run watch` to run with watch)
- Browse to [http://localhost:8008/helloworld](http://localhost:8008/helloworld) and [http://localhost:8008/helloworld?name=yp](http://localhost:8008/helloworld?name=yp), you should get the response

> Pro tip: run `$ LOGGER_PRETTY=true LOGGER_LEVEL=debug npm start` for pretty color and debug logs

## Creating a new service

- Fork this project (so you can easily get updates if needed). *IMPORTANT*: don't check the 'Enable fork syncing' options when you create a fork, otherwise your project will automatically merge with the scaffold. (if you checked it by mistake, you can uncheck it under your project settings/Fork syncing).
- Update `package.json`
  - name: service name
  - description: service description
  - version: service version
  - yp/*: cloud settings (port...)
  - author: Your squad info
  - ...
- `$ npm run remove:helloworld` to remove helloworld code
- `$ npm run remove:newrelic` to remove newrelic code if not needed
- Remember to sign your .drone.yml file before deploying

> Pro tip: Add a reference to the scaffold in order to update your project easily `git remote add scaffold ssh://git@git.ypg.com:7999/scaf/scaffold-service.git`. Then, whenever you need to update your project with the scaffold, run `git pull scaffold master`

## Tools

- nyc (istanbul)
- mocha (sinon, chai...)
- eslint (airbnb config)
- editorconfig
- jsdoc

## Configs

The project description and yp configs are defined in `package.json`.

Your application configs are defined under `/config`. Depending on the `NODE_ENV`, the config will be the overritten config of `/config/default.json` and `/config/<NODE_ENV>.json` (dev, qa, prod). Consider using the yp console config to put your environment configs. This will allow us to avoid having sensitive config in git.

For sensitive config information such as usernames and passwords, you should use the console configuration (https://console.ypcloud.io/manage) to inject those values to your configs.

Example: `/DAA/myservice/QA/someconfig.json` will override the `someconfig` key in `/config/default.json` file for the `qa` environment.

> Pro tip: create a `/config/local.json` to keep your secrets so it won't be pushed to your source control and run it locally.

### New relic configuration

the newrelic.js file stands as a generic configuration loader and any configuration should be put in the yp console. 
Here is a very basic example of a newrelic config file put under the yp console:


**< YOUR_SERVICE > / < ENVIRONMENT > / newrelic.json**
```
{
  "license_key": "your_license_key",
  "agent_enabled": true
}
```

You can add any valid new relic options in that config block and they will be loaded by the newrelic.js file.
see [nodejs agent configuration](https://docs.newrelic.com/docs/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration) for more options. 

NOTE: In order to keep naming consistency between cloud deployments and NR monitoring, new relic app_name property is also set in the drone file to match the yp-console namespace property.

```
- "NEW_RELIC_APP_NAME=${DRONE_REPO_OWNER_LC}/${DRONE_REPO_NAME}${DRONE_BRANCH|s/develop/DEV/|s/master/PROD/|s/^release.+/QA/}"
```

## Logger configuration

tldr;

```javascript
logger.info('hello world'); 
// result: {"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","time":1459529098958,"v":1}

logger.info({ testData: 'test', msg: 'hello world' });
// result {"pid":94473,"hostname":"MacBook-Pro-3.home","level":30,"msg":"hello world","testData": "test","time":1459529098960,"v":1}
```

The project use `yp-logger` that uses [pino](http://getpino.io/#/).

You can use the environment variable `LOGGER_PRETTY` to show pretty log on your console.
You can use the environment variable `LOGGER_LEVEL` to change the default level. By default level is `info`.

The supported levels are the same as those of [pino](https://github.com/pinojs/pino/blob/master/docs/API.md#level).

> Pro tip: run `$ LOGGER_PRETTY=true LOGGER_LEVEL=debug npm start` for pretty color and debug logs

## Commands

- `$ npm install`: Installs the package dependencies
- `$ npm start`: Starts the project
- `$ npm test`: Runs lint and coverage
- `$ npm run lint`: Runs eslint
- `$ npm run test:unit`: Runs the unit test
- `$ npm run test:integration`: Runs the integration tests
- `$ npm run coverage`: Runs the code coverage
- `$ npm run doc`: Builds the jsdoc
- `$ npm run watch`: Starts the project and restarts it when a file is changed ([nodemon](https://www.npmjs.com/package/nodemon))
- `$ npm run add:socketio`: Adds the socketio sample code from the project
- `$ npm run remove:all`: Removes all the sample codes
- `$ npm run remove:helloworld`: Removes the helloworld sample code from the project
- `$ npm run remove:socketio`: Removes the socketio sample code from the project
- `$ npm run remove:newrelic`: Removes the newrelic code from the project

## Directory layout

```
.
├── /.jsdoc/                    # (generated) jsdoc files
├── /.nyc_output/               # (generated) coverage files (internally used by nyc/istanbul)
├── /config/                    # Your app configs
├── /coverage/                  # (generated) coverage files
├── /db/                        # DB migration scripts here
├── /docs/                      # Documentations (recipes...)
├── /scripts/                   # custom npm command script
├── /src/                       # The source code of the application
│   ├── /core/                  # Contains the application core logic (like mongo config...)
│   ├── /Assembly.js            # Builds all the application dependencies
│   ├── /index.js               # Server-side startup script
│   ├── /Monitoring.js          # Monitoring code
│   └── /Router.js              # Service routes
├── /test/                      # mocha config and test helpers
│   ├── /fixtures/              # test fixtures
│   ├── /helpers/               # mocha helper files
│   ├── /integration/           # integration test files
│   └── /mocks                  # test common mocks
├── .drone                      # deployment config (https://github.com/drone/drone)
├── .editorconfig               # editor config (http://editorconfig.org/)
├── .eslintignore               # eslint ignore config (http://eslint.org/)
├── .eslintrc                   # eslint config (http://eslint.org/)
├── .gitignore                  # git ignore files config
├── newrelic.js                 # new relic configuration file
├── .nvmrc                      # node versioning manager config (https://github.com/creationix/nvm)
├── .nycrc                      # istanbul config (https://www.npmjs.com/package/nyc)
├── Dockerfile                  # Commands for building a Docker image for production
├── package.json                # The list of 3rd party libraries and utilities
└── README.md                   # Describes the project
```

## Code coverage

The code coverage detail can be found at `/coverage/lcov-report/index.html`. The coverage files are generated when you run `$ npm run coverage`.

It will also generate `/coverage/lcov.info` for [sonar](https://sonar.ypcloud.io).

## Code documentation

When you document your code using the comment style described at [JSDoc](http://usejsdoc.org/), it can automatically generate code documentation.

The code documentation can be found at `/.jsdoc/index.html`. The doc files are generated when you run `$ npm run doc`. 

## Errors

tldr;

[Custom JavaScript Errors in ES6](https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87)

The scaffold is shipped with a custom error called `ErrorWithCode` (it can be found at `/src/errors/errorWithCode.js`). This error is intend to be used everywhere in the code that is triggered by a call to the service. It allows to set a **code** and a **message** to allow the error middleware to work properly.

Here's a example:
```javascript
const errors = require('./errors');

class MyService {
  throwAwesomeness() {
    throw new errors.ErrorWithCode(500, 'This is an awesome error');
  }
}
```

Calling the `throwAwesomeness` function will return the following response to the service consumer:
```
{
  "result": false,
  "errors": {
    "codes": [
      500
    ],
    "details": [
      {
        "code": 500,
        "message": "This is an awesome error"
       }
    ]
  }
}
```

**Note that the HTTP Status will reflect the error code (500 in our case).**

## Tests

The testing framework used is [mocha](https://mochajs.org//). The test files should be named .spec.js located at the same place as the code. The advantages are explained here [Angular spec file location](https://angular.io/docs/ts/latest/guide/testing.html#!#q-spec-file-location).

Integration tests are located at `/test/integration`

## TODO

Improvements

- Recipes (db migration scripts, socket.io)
