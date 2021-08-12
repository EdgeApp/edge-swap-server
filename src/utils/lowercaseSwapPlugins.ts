import { asSwapPlugin } from './config'

export const getLowercaseSwapPlugins = (pluginObj): string[] => {
  const swapPluginNamesArr: string[] = []
  for (const [key, value] of Object.entries(pluginObj)) {
    try {
      asSwapPlugin(value)
      swapPluginNamesArr.push(key.toLowerCase())
    } catch {
      continue
    }
  }
  return swapPluginNamesArr
}
