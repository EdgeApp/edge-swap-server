// BASE SETUP
// =============================================================================

import { asArray, asString } from 'cleaners'
import cluster from 'cluster'
import { forkChildren, setupDatabase } from 'edge-server-tools'
import express from 'express'
// import { query, validationResult } from 'express-validator'
import http from 'http'
import nano from 'nano'
import promisify from 'promisify-node'

import { config } from './utils/config'
import { couchSchema } from './utils/couchSchema'
import { ErrorResponse, makeErrorResponse } from './utils/errorResponse'
import { getPluginSwapInfo } from './utils/getMinimum'

const asPluginList = asArray(asString)

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

const PluginListError: ErrorResponse = makeErrorResponse(
  'bad_request',
  400,
  'Invalid data for list of plugins'
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

// router.get('/getMinimum/', query('currencyPair').notEmpty(), (req, _, next) => {
//   const errorArr = validationResult(req).array()
//   return errorArr.length > 0 ? next(ParamError) : next()
// })

router.get('/getSwapInfo/:plugin', function (req, res, next) {
  const { plugin } = req.params

  getPluginSwapInfo(dbSwap, [plugin])
    .then(swapInfo => {
      res.json(swapInfo[plugin])
    })
    .catch(() => next(SwapInfoError))
})

router.get('/getSwapInfo/', function (req, res, next) {
  const swapPlugins = Object.keys(config.plugins).filter(
    plugin => typeof config.plugins[plugin] === 'object'
  )

  getPluginSwapInfo(dbSwap, swapPlugins)
    .then(swapInfo => res.json(swapInfo))
    .catch(next)
})

router.post('/getSwapInfo', function (req, res, next) {
  let pluginList
  try {
    pluginList = asPluginList(req.body)
  } catch {
    return next(PluginListError)
  }

  getPluginSwapInfo(dbSwap, pluginList)
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
