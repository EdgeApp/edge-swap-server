// indexAuth.js
// BASE SETUP
// =============================================================================

import { asArray, asEither, asNull, asString } from 'cleaners'
import cluster from 'cluster'
import { forkChildren, setupDatabase } from 'edge-server-tools'
import express from 'express'
import http from 'http'
import nano from 'nano'
import promisify from 'promisify-node'

import { config } from './utils/config'
import { couchSchema } from './utils/couchSchema'
import { ErrorResponse, makeErrorResponse } from './utils/errorResponse'
import { getPluginSwapInfo } from './utils/getMinimum'

const asStringListOrNull = asEither(asArray(asString), asNull)

const BodyParseError: ErrorResponse = makeErrorResponse(
  'bad_query',
  400,
  'Error parsing body data'
)

const RouteError: ErrorResponse = makeErrorResponse(
  'bad_query',
  404,
  'Endpoint not found'
)

const SwapInfoParamError: ErrorResponse = makeErrorResponse(
  'bad_request',
  400,
  'Invalid params for plugins and/or currencies'
)

const SwapInfoError: ErrorResponse = makeErrorResponse(
  'bad_request',
  400,
  'Unable to find swap information'
)

// call the packages we need
const app = express()

// Nano for CouchDB
// =============================================================================
const nanoDb = nano(config.dbFullpath)
const dbSwap = nanoDb.db.use(config.dbName)
promisify(dbSwap)

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router()

router.post('/getSwapInfo', function (req, res, next) {
  let pluginId, currencies
  try {
    pluginId = asStringListOrNull(req.body.pluginId)
    currencies = asStringListOrNull(req.body.currencies)
  } catch (e) {
    return next(SwapInfoParamError)
  }

  getPluginSwapInfo(dbSwap, pluginId, currencies)
    .then(swapInfo => res.json(swapInfo))
    .catch(() => next(SwapInfoError))
})

// REGISTER OUR ROUTES -------------------------------
// configure app to parse incoming requests with JSON payloads and return 400 error if body is not JSON
app.use(express.json({ limit: '50mb' }))
app.use((err, _req, _res, next) => next(err != null ? BodyParseError : null))
// Parse the url string
app.use(express.urlencoded({ limit: '50mb', extended: true }))
// Add router to the app with all of our routes prefixed with /v1
app.use('/v1', router)
// 404 Error Route
app.use((_req, _res, next) => next(RouteError))
// Catch and handle errors
app.use((err, _req, res, _next) => {
  res.status(err.errorCode ?? 500).json({ error: err })
})

// ---------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------

async function main(): Promise<void> {
  const { dbFullpath, httpPort, httpHost } = config
  if (cluster.isMaster) {
    await setupDatabase(dbFullpath, couchSchema).catch(e => console.log(e))
    forkChildren()
  } else {
    // Start the HTTP server:
    const httpServer = http.createServer(app)
    httpServer.listen(httpPort, `${httpHost}`)
    console.log(`Server cluster node listening on port ${httpPort}`)
  }
}

main().catch(e => console.log(e))
