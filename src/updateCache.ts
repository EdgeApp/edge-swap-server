import redis from 'redis'
import { promisify } from 'util'

import { AllSwapInfo, SwapInfo } from './utils/getMinimum'

const client = redis.createClient()

export const getAsync = promisify(client.get).bind(client)
export const setAsync = promisify(client.set).bind(client)
export const hsetAsync = promisify(client.hset).bind(client)
export const hgetallAsync = promisify(client.hgetall).bind(client)
export const hmgetAsync = promisify(client.hmget).bind(client)
export const hmsetAsync = promisify(client.hmset).bind(client)
export const existsAsync = promisify(client.exists).bind(client)

export const TIMESTAMP_KEY = 'timestamp'

export const updateCache = async (
  swapInfos: AllSwapInfo,
  lastTimestamp: number
): Promise<void> => {
  client.on('error', function (error) {
    console.error(error)
  })
  const currentDate = new Date().toISOString()

  try {
    const swapInfo: Array<Promise<SwapInfo>> = []
    for (const [key, value] of Object.entries(swapInfos)) {
      if (Object.values(value).length > 0) {
        swapInfo.push(hmsetAsync(key, value))
      }
    }
    const timestamp = hmsetAsync(TIMESTAMP_KEY, { timestamp: lastTimestamp })
    await Promise.all([...swapInfo, timestamp])
  } catch (e) {
    console.log(currentDate)
    console.log(e)
  }
}
