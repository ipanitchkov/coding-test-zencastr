# The project demonstrates a Node.js/typescript standalone caching service

It provides an in-memory storage and manipulation functionality for key/value pairs.

## Installation

```bash
$ npm install
```

## Running the service

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Configuration

The service is listening on a port number configured by the PORT environment variable or 3000 by default.

## Playground and testing

The service is exposing basic routes to allow key/value manipulations. 
It's possible to add, retrieve and delete items as well as fetching all registered keys. 
There is a possibility to specify TTL per item, so items with reached TTLs will be cleaned up accordingly.
The service is also providing a Swagger UI that could be used to play with the solution. 
Please refer to the Swagger UI mentioned below.

### Swagger

[Swagger UI](<http://localhost:3000/api>)

[Swagger JSON](<http://localhost:3000/api-json>)

### Testing the service

The project uses [Jest](https://github.com/facebook/jest) to run tests.

Tests could be found under `src/app.controller.spec.ts`.

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Data structure
Key/value pairs are stored in a map structure allowing O(1) complexity when manipulating content.

The `value` part known as `item` has the following format:

```
export interface Item {
  data: any;
  meta: {
    timestamp: number;
    expire?: number;
  };
}
```

## Extras
* It's written in typescript
* ESLint support
* Prettier support
* Tests
* Coverage

## Coding test description

The purpose of this assignment is to figure a few things: your architecture and coding style, interpretation of requirements, and your creativity. We expect that this homework assignment will become a major conversation for our in-person interview.

We’d like you to build a caching service, something similar to Redis or Memcached. The purpose of this assignment is really an exploration in a problem, there is no right answer. Perhaps there is a wrong answer :). We think that spending about 3 hours on this assignment should get you to a good place, but we don’t want to define what is too much or too little. 

Requirements:
Build a standalone caching service (choose your language, maybe typescript?)
You should be able to add item(s), remove items, and fetch items
The data structure used to store these items is up to you
The API definitions and formats used to communicate with this API are up to you
We expect that this service will be runnable, we’ll be able to connect to it, cache things and retrieve them.
PRO TIP: Spending time on the cache internals would be better than spending time on the API
If you are writing this homework in typescript / javascript please make sure there is a valid package.json in the root of the repo
Upload code to a github repo and send back to your Zencastr contact

Have fun!

-Zencastr
