import { makeConfig } from 'cleaner-config'
import { asNumber, asObject, asOptional, asString } from 'cleaners'

export const asConfig = asObject({
  dbFullpath: asOptional(asString, 'http://username:password@localhost:5984'),
  httpHost: asOptional(asString, '127.0.0.1'),
  httpPort: asOptional(asNumber, 8008),
  timeBetweenCyclesInMinutes: asOptional(asNumber, 10)
})

export const config = makeConfig(asConfig, 'serverConfig.json')
