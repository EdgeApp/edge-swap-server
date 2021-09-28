import Big from 'big.js'

export const snooze = async (ms: number): Promise<void> =>
  await new Promise((resolve: Function) => setTimeout(resolve, ms))

export const binarySearch = async (
  dataFetchFn: (value: string) => Promise<boolean>,
  start: string,
  end: string
): Promise<string> => {
  // Put Big in strict mode to check for any input errors
  Object.assign(Big, { strict: true })
  let bigStart = Big(start)
  let bigEnd = Big(end)
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (bigStart.gt(bigEnd)) throw new Error('Invalid start/end parameter(s)')
  // Return Big to default mode
  Object.assign(Big, { strict: false })
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  while (bigStart.lte(bigEnd)) {
    const bigMid = bigStart.add(bigEnd).div('2').round(0, 0)

    const isSuccessfulResponse: boolean = await dataFetchFn(bigMid.toFixed(0))
    if (!isSuccessfulResponse) {
      bigStart = bigMid.add('1')
    } else {
      bigEnd = bigMid.sub('1')
    }
  }
  return bigStart.toFixed(0)
}
