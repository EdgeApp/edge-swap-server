import { DatabaseSetup } from 'edge-server-tools'

import { config } from './config'

const pluginDocs = Object.keys(config.plugins).reduce(
  (res, pluginName) =>
    typeof config.plugins[pluginName] === 'object'
      ? { ...res, [pluginName]: {} }
      : res,
  {}
)

const timestampDoc = {
  '-timestamp': {}
}

export const couchSchema: DatabaseSetup = {
  name: config.dbName,
  templates: { ...pluginDocs, ...timestampDoc }
}
