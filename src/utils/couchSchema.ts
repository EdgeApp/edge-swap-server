/* eslint-disable no-var */
import { CouchDbInfo } from 'edge-server-tools'

import { mockPlugins } from './mockPlugins'

export const minAmtDbPrefix = 'minamount_'

export const couchSchema: CouchDbInfo[] = mockPlugins.map(plugin => {
  return { name: minAmtDbPrefix + plugin.pluginName }
})
