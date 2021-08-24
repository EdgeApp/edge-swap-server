import { DatabaseSetup } from 'edge-server-tools'

import { config } from './config'

export const couchSchema: DatabaseSetup = {
  name: config.dbName,
  documents: Object.keys(config.plugins).reduce(
    (res, pluginName) => ({ ...res, [pluginName]: {} }),
    {}
  )
}
