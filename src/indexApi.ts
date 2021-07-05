// BASE SETUP
// =============================================================================

import { asObject, asOptional, asString } from 'cleaners'
import cluster from 'cluster'
import { formatISO } from 'date-fns'
import { forkChildren, rebuildCouch } from 'edge-server-tools'

import { config } from './utils/config'
import { couchSchema, minAmtDbPrefix } from './utils/couchSchema'
import { ErrorResponse, makeErrorResponse } from './utils/errorResponse'
import { mockPlugins } from './utils/mockPlugins'

const express = require('express')
const http = require('http')
const nano = require('nano')
const promisify = require('promisify-node')

const asFulfilledPromise = asObject({
  status: asString,
  value: asObject({
    _id: asString,
    _rev: asOptional(asString),
    data: asObject({ minAmount: asString })
  })
})

const GetMinimumParamError: ErrorResponse = makeErrorResponse(
  'bad_request',
  400,
  'Missing query params'
)

const CurrencyPairDataError: ErrorResponse = makeErrorResponse(
  'not_found',
  404,
  'Data for currencyPair not found'
)

const RouteError: ErrorResponse = makeErrorResponse(
  'bad_query',
  404,
  'Endpoint not found'
)

// call the packages we need
const app = express()

// Nano for CouchDB
// =============================================================================
const nanoDb = nano(config.dbFullpath)
const swapMinAmts = mockPlugins.map(plugin => {
  const pluginMinAmt = nanoDb.db.use(minAmtDbPrefix + plugin.pluginName)
  return promisify(pluginMinAmt)
})

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router()

router.use(function (req, res, next) {
  console.log('Something is happening.')
  next() // make sure we go to the next routes and don't stop here
})

router.get('/getMinimum/', async function (req, res, next) {
  const currencyPair: string = req.query.currencyPair // Param of 'currencyPair' in URI
  if (currencyPair === undefined) {
    return next(GetMinimumParamError)
  }
  const currentUTCDate: string = formatISO(new Date(), {
    representation: 'date'
  }) // Variable for current UTC date using date-fns
  try {
    // Array of promises to get the latest documents for the min amount data per plugin
    const docPromisesArr = swapMinAmts.map(async pluginDb => {
      return pluginDb.get(currentUTCDate + ':' + currencyPair)
    })
    // Capture the result of each promise, including whether it was fulfilled or rejected
    const docs = await Promise.allSettled(docPromisesArr)

    // Use 'reduce' to go through settled promises and find the lowest minAmount amongst the plugins
    const minAmountFloat = docs.reduce((currentMinAmount, doc) => {
      try {
        const cleanedDoc = asFulfilledPromise(doc) // Clean doc for a fulfilled promise
        const pluginMinAmount = parseFloat(cleanedDoc.value.data.minAmount) // Grab the plugin's minAmount for the currencyPair
        // If the plugin's minAmount is lower than currentMinAmount, update currentMinAmount
        return pluginMinAmount < currentMinAmount
          ? pluginMinAmount
          : currentMinAmount
      } catch {
        // Promise was rejected or fulfilled promise returned invalid data
        return currentMinAmount
      }
    }, Infinity) // Start currentMinAmount at Infinity

    // Check if minAmountFloat is still Infinity
    if (!isFinite(minAmountFloat)) {
      // No data could be found in the database, return next with the error
      return next(CurrencyPairDataError)
    }

    res.json({
      currencyPair,
      date: currentUTCDate,
      minAmount: minAmountFloat.toString()
    })
  } catch (e) {
    console.log(e)
  }
})

// REGISTER OUR ROUTES -------------------------------
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
    await rebuildCouch(dbFullpath, couchSchema).catch(e => console.log(e))
    forkChildren()
  } else {
    // Start the HTTP server:
    const httpServer = http.createServer(app)
    httpServer.listen(httpPort, `${httpHost}`)
    console.log(`Server cluster node listening on port ${httpPort}`)
  }
}

main().catch(e => console.log(e))
