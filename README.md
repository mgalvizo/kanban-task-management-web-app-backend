<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# KANBAN TASK MANAGEMENT WEB APP BACKEND

## ENDPOINTS

### BOARDS

`GET /boards` Get all boards
`GET /boards/:id` Get a single board by ID
`POST /boards` Create a new board
`PATCH /boards/:id` Update a board by ID
`DELETE /boards/:id` Delete a board by ID

### LISTS (COLUMNS)

`GET boards/:boardId/lists` Get all lists for a specific board
`GET /lists/:id` Get a single list by ID
`POST /boards/:boardId/lists` Create a new list in a specific board
`PATCH /lists/:id` Update a list by ID
`DELETE /lists/:id` Delete a list by ID

### TASKS

`GET lists/:listId/tasks` Get all tasks for a specific list
`GET tasks/:id` Get a single task by ID
`POST lists/:listId/tasks` Create a new task in a specific list
`PATCH tasks/:id` Update a task by ID
`DELETE tasks/:id` Delete a task by ID

### SUBTASKS

`GET /tasks/:taskId/subtasks` Get all subtasks for a specific task
`GET /subtasks/:id` Get a single subtask by ID
`POST /tasks/:taskId/subtasks` Create a new subtask in a specific task
`PATCH /subtasks/:id` Update a subtask by ID
`DELETE /subtasks/:id` Delete a subtask by ID

### CLI COMMANDS

Create module

```console
nest generate module <module-name>
```

Generate controller:

```console
nest generate controller <controller-name>
```

Generate controller with validation built-in:

```console
nest generate resource <resource-name>
```

Generate service:

```console
nest generate service <service-name>
```

## MIGRATIONS

In package.json:

```json
{
  "typeorm": "cross-env NODE_ENV=development typeorm-ts-node-commonjs -d src/data-source.ts"
}
```

Generate migrations:

```console
npm run typeorm migration:generate src/migrations/initial-schema
```

Run migrations:

```console
npm run typeorm migration:run
```

## Libraries

- @nestjs/typeorm
- typeorm
- sqlite3
- class-validator
- class-transformer
- @nestjs/config
- cross-env
- pg
- @nestjs/throttler
- helmet

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
