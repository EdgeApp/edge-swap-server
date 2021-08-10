import { asNumber } from 'cleaners'

export const fetchSameKeyDocs = async (
  key: string,
  docScopeArr: any[]
): Promise<any[]> => {
  // Array of promises to get the documents of the same key per database
  const docPromisesArr = docScopeArr.map(async database => database.get(key))
  // Capture the result of each promise, including whether it was fulfilled or rejected
  return await Promise.allSettled(docPromisesArr)
}

export const binarySearch = async (
  dataFetchFn: Function,
  start: number,
  end: number
): Promise<number> => {
  if (start > end || !isFinite(start) || !isFinite(end))
    throw new Error('Invalid start/end parameter(s)')
  while (asNumber(start) <= asNumber(end)) {
    const mid = Math.floor((start + end) / 2)

    const isSuccessfulResponse: boolean = await dataFetchFn(mid)

    if (!isSuccessfulResponse) {
      start = mid + 1
    } else {
      end = mid - 1
    }
  }
  return start
}
