import { makeConfig } from 'cleaner-config'
import {
  asBoolean,
  asEither,
  asNumber,
  asObject,
  asOptional,
  asString
} from 'cleaners'

const {
  COUCH_HOSTNAME = '127.0.0.1',
  COUCH_FULL_PATH = 'http://username:password@localhost:5984',
  COUCH_PORT = '8008',
  TIME_BETWEEN_CYCLES_IN_MINUTES = '10',
  EDGE_API_KEY = '',
  EDGE_APP_ID = '',
  EDGE_USERNAME = '',
  EDGE_PASSWORD = '',
  EDGE_RATES_SERVER = 'https://rates1.edge.app/'
} = process.env

const asSwapPlugin = asObject({
  apiKey: asOptional(asString),
  secret: asOptional(asString),
  affiliateId: asOptional(asString),
  affiliateMargin: asOptional(asNumber),
  partnerContract: asOptional(asString)
})

const asPlugin = asObject(asEither(asBoolean, asSwapPlugin))

export const asConfig = asObject({
  dbFullpath: asOptional(asString, COUCH_FULL_PATH),
  httpHost: asOptional(asString, COUCH_HOSTNAME),
  httpPort: asOptional(asNumber, parseInt(COUCH_PORT)),
  timeBetweenCyclesInMinutes: asOptional(
    asNumber,
    parseInt(TIME_BETWEEN_CYCLES_IN_MINUTES)
  ),
  apiKey: asOptional(asString, EDGE_API_KEY),
  appId: asOptional(asString, EDGE_APP_ID),
  username: asOptional(asString, EDGE_USERNAME),
  password: asOptional(asString, EDGE_PASSWORD),
  ratesServerAddress: asOptional(asString, EDGE_RATES_SERVER),
  plugins: asOptional(asPlugin, {})
})

export const config = makeConfig(asConfig, 'serverConfig.json')
