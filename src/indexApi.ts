// BASE SETUP
// =============================================================================

import cluster from 'cluster'
import { forkChildren, setupDatabase } from 'edge-server-tools'

import { config } from './utils/config'
import { couchSchema } from './utils/couchSchema'

const express = require('express')
const http = require('http')

// call the packages we need
const app = express()

// ---------------------------------------------------------------------
// INITIALIZATION
// ---------------------------------------------------------------------

async function main(): Promise<void> {
  const { dbFullpath, httpPort, httpHost } = config
  if (cluster.isMaster) {
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
