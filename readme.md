# edge-swap-server

## Description

An HTTP API server that stores and retrieves swap information for multiple cryptocurrencies across multiple providers. It uses CouchDB as the backend and Express as the HTTP server.

## Usage

### Install

```
yarn
```

### Configuration

A default config `serverConfig.json` is automatically created on install. The schema for this file is located in `src/utils/config.ts` and uses [cleaners](https://www.npmjs.com/package/cleaners) for type definitions.

You can use `yarn configure` to re-create the config file if removed.

The config file path can be customized with the `CONFIG` env var.

### Scripts

#### Running API

```
yarn start:api
```
NOTE: `yarn start:api` will genereate the necessary database and documents in CouchDB if it does not already exist. So run `yarn start:api` before `yarn start:engine` during initial operation.

#### Running Engine

```
yarn start:engine
```

#### Build

```
yarn prepare
```

## Testing

Testing is done with Mocha and Chai.

The following run scripts are available for testing:

- `yarn test` runs all the tests.
