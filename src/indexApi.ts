// BASE SETUP
// =============================================================================

import cluster from 'cluster'
import { formatISO } from 'date-fns'
import { forkChildren, rebuildCouch } from 'edge-server-tools'

import { config } from './utils/config'
import { couchSchema, minAmtDbPrefix } from './utils/couchSchema'
import { ErrorResponse, makeErrorResponse } from './utils/errorResponse'
import { findMinimum } from './utils/getMinimum'
import { mockPlugins } from './utils/mockPlugins'
import { checkQueryString, fetchSameKeyDocs } from './utils/utils'

const express = require('express')
const http = require('http')
const nano = require('nano')
const promisify = require('promisify-node')

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
const minAmtDocScopeArr = mockPlugins.map(plugin => {
  const pluginMinAmtDocScope = nanoDb.db.use(minAmtDbPrefix + plugin.pluginName)
  return promisify(pluginMinAmtDocScope)
})

// ROUTES FOR OUR API
// =============================================================================
const router = express.Router()

router.use(function (req, res, next) {
  console.log('Something is happening.')
  next() // make sure we go to the next routes and don't stop here
})

router.get('/getMinimum/', async function (req, res, next) {
  const currencyPairResult = checkQueryString(req.query.currencyPair) // Param of 'currencyPair' in URI
  if (typeof currencyPairResult !== 'string') {
    return next(currencyPairResult) // currencyPairResult is equal to ParamError
  }
  const currentUTCDate: string = formatISO(new Date(), {
    representation: 'date'
  }) // Variable for current UTC date using date-fns

  const minAmtDocKey = currentUTCDate + ':' + currencyPairResult

  try {
    const minAmtDocs = await fetchSameKeyDocs(minAmtDocKey, minAmtDocScopeArr)
    const minAmtResult = findMinimum(minAmtDocs)

    if (typeof minAmtResult !== 'string') {
      return next(minAmtResult) // minAmtResult is equal to CurrencyPairDataError
    }

    res.json({
      currencyPair: currencyPairResult,
      date: currentUTCDate,
      minAmount: minAmtResult
    })
  } catch (e) {
    return next(e)
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
