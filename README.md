# NestJS Upload API

## Description

This is a sample application for upload files with **Nest Framework**.


## Configuration

The configuration happens in `multerOptions`.

In the project the following options are used:

- File size limit
- Check mimetype
- Storage destination is `files/` folder
- The original file name is overwritten with a `uuid`
- More options are available. See [multer documentation](https://www.npmjs.com/package/multer#multeropts).

## Installation

```bash
$ npm install
```

## Setting environment variable

Install [dotenv](https://www.npmjs.com/package/dotenv)

Add `require('dotenv').config();` in app.module.ts

Create .env file and set variables

```bash
API_PORT=4000
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

## Demo
https://seer-of-human.com