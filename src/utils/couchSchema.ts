import { DatabaseSetup } from 'edge-server-tools'

import { config } from './config'

export const couchSchema: DatabaseSetup = {
  name: config.dbName,
  templates: Object.keys(config.plugins).reduce(
    (res, pluginName) =>
      typeof config.plugins[pluginName] === 'object'
        ? { ...res, [pluginName]: {} }
        : res,
    {}
  )
}
