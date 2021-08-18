import { DatabaseSetup } from 'edge-server-tools'

import { config } from './config'
import { getLowercaseSwapPlugins } from './lowercaseSwapPlugins'

export const minAmtDbPrefix = 'minamount_'

const swapPluginNamesArr = getLowercaseSwapPlugins(config.plugins)

export const couchSchema: DatabaseSetup[] = swapPluginNamesArr.map(
  pluginName => {
    return { name: minAmtDbPrefix + pluginName }
  }
)
