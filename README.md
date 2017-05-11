# Vietloka-internal

[![Build Status](https://travis-ci.org/chitoge/vietloka-internal.svg?branch=master)](https://travis-ci.org/chitoge/vietloka-internal)
[![Coverage Status](https://coveralls.io/repos/github/chitoge/vietloka-internal/badge.svg?branch=master)](https://coveralls.io/github/chitoge/vietloka-internal?branch=master)


A RESTful API server for [Vietloka project](https://github.com/abn-volk/vietloka), built with the help of [Yeoman](http://yeoman.io/) and [generator-rest](https://github.com/diegohaz/generator-rest).

NOTE: this is only just a barebone (for now). Almost all logic hasn't been implemented. Tests will fail (I haven't actually rewrite tests yet). Devs will cry foul. But, this is currently just a barebone, so please bear with me for a while. At least, development server should work normally.

More documentation will be added later :p.

## Commands

After you generate your project, these commands are available in `package.json`.

```bash
npm test # test using Jest
npm run test:unit # run unit tests
npm run test:integration # run integration tests
npm run coverage # test and open the coverage report in the browser
npm run lint # lint using ESLint
npm run dev # run the API in development mode
npm run prod # run the API in production mode
npm run docs # generate API docs
```

## Directory structure

### Overview

You can customize the `src` and `api` directories.

```
src/
├─ api/
│  ├─ user/
│  │  ├─ controller.js
│  │  ├─ index.js
│  │  ├─ index.test.js
│  │  ├─ model.js
│  │  └─ model.test.js
│  └─ index.js
├─ services/
│  ├─ express/
│  ├─ mongoose/
│  ├─ passport/
│  └─ your-service/
├─ app.js
├─ config.js
└─ index.js
```

### src/api/

Here is where the API endpoints are defined. Each API has its own folder.

#### src/api/some-endpoint/model.js

It defines the Mongoose schema and model for the API endpoint. Any changes to the data model should be done here.

#### src/api/some-endpoint/controller.js

This is the API controller file. It defines the main router middlewares which use the API model.

#### src/api/some-endpoint/index.js

This is the entry file of the API. It defines the routes using, along other middlewares (like session, validation etc.), the middlewares defined in the `some-endpoint.controller.js` file.

### services/

Here you can put `helpers`, `libraries` and other types of modules which you want to use in your APIs.
