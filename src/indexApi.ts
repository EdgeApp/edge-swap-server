// BASE SETUP
// =============================================================================

import cluster from 'cluster'
import { forkChildren, setupDatabase } from 'edge-server-tools'
import { query, validationResult } from 'express-validator'

import { config } from './utils/config'
import { couchSchema, minAmtDbPrefix } from './utils/couchSchema'
import { ErrorResponse, makeErrorResponse } from './utils/errorResponse'
import { checkDbAndFindMinAmount } from './utils/getMinimum'
import { mockPlugins } from './utils/mockPlugins'

const express = require('express')
const http = require('http')
const nano = require('nano')
const promisify = require('promisify-node')

const RouteError: ErrorResponse = makeErrorResponse(
  'bad_query',
  404,
  'Endpoint not found'
)

const ParamError: ErrorResponse = makeErrorResponse(
  'bad_request',
  400,
  'Missing query params'
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

router.get(
  '/getMinimum/',
  query('currencyPair').notEmpty(),
  (req, res, next) => {
    const errorArr = validationResult(req).array()
    return errorArr.length > 0 ? next(ParamError) : next()
  }
)

router.get('/getMinimum/', async function (req, res, next) {
  try {
    const minAmountInfo = await checkDbAndFindMinAmount(
      req.query.currencyPair,
      minAmtDocScopeArr
    )
    res.json(minAmountInfo)
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
  if (process.env?.pm_id != null && process.env.NODE_APP_INSTANCE === '0') {
    // running in pm2
    for (let i = 0; i < couchSchema.length; i++) {
      await setupDatabase(dbFullpath, couchSchema[i]).catch(e => console.log(e))
    }
  } else if (cluster.isMaster) {
    // Not running in pm2
    for (let i = 0; i < couchSchema.length; i++) {
      await setupDatabase(dbFullpath, couchSchema[i]).catch(e => console.log(e))
    }
    forkChildren()
  } else {
    // Start the HTTP server:
    const httpServer = http.createServer(app)
    httpServer.listen(httpPort, `${httpHost}`)
    console.log(`Server cluster node listening on port ${httpPort}`)
  }
}

main().catch(e => console.log(e))
