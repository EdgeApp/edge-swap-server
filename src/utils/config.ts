import { makeConfig } from 'cleaner-config'
import {
  asBoolean,
  asEither,
  asNumber,
  asObject,
  asOptional,
  asString
} from 'cleaners'

const asSwapPlugin = asObject({
  apiKey: asOptional(asString),
  secret: asOptional(asString),
  affiliateId: asOptional(asString),
  affiliateMargin: asOptional(asNumber),
  partnerContract: asOptional(asString)
})

const asPlugin = asObject(asEither(asBoolean, asSwapPlugin))

export const asConfig = asObject({
  dbFullpath: asOptional(asString, 'http://username:password@localhost:5984'),
  httpHost: asOptional(asString, '127.0.0.1'),
  httpPort: asOptional(asNumber, 8008),
  timeBetweenCyclesInMinutes: asOptional(asNumber, 10),
  apiKey: asOptional(asString, ''),
  appId: asOptional(asString, ''),
  username: asOptional(asString, ''),
  password: asOptional(asString, ''),
  plugins: asOptional(asPlugin, {})
})

export const config = makeConfig(asConfig, 'serverConfig.json')
