/* eslint-disable no-var */
import { DatabaseSetup } from 'edge-server-tools'

import { mockPlugins } from './mockPlugins'

export const minAmtDbPrefix = 'minamount_'

export const couchSchema: DatabaseSetup[] = mockPlugins.map(plugin => {
  return { name: minAmtDbPrefix + plugin.pluginName }
})
