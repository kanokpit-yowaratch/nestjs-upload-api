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
API_PORT=[YOUR_PORT]
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
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


## PM2 command


```bash
# build to create dist/main.js
$ npm run build

# pm2 to start api service
$ pm2 start dist/main.js --name "upload-api"
```


## DB Structure Example

```
CREATE TABLE `medias` (
	`image_code` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`source` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`file_name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`active_status` INT(10) NOT NULL,
	PRIMARY KEY (`image_code`) USING BTREE
)
COLLATE='utf8mb4_unicode_ci'
ENGINE=InnoDB;
```

## Important config on NGINX

CASE: always show 500 Internal Server Error

May be can't access to upload directory, so:

```
sudo chown -R [owner user] [project]
```

## Demo
https://seer-of-human.com