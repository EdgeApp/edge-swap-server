import { ErrorResponse, makeErrorResponse } from './errorResponse'

const ParamError: ErrorResponse = makeErrorResponse(
  'bad_request',
  400,
  'Missing query params'
)

export const checkQueryString = (
  queryValue: string
): string | ErrorResponse => {
  if (typeof queryValue !== 'string') {
    return ParamError
  }
  return queryValue
}

export const fetchSameKeyDocs = async (
  key: string,
  docScopeArr: any[]
): Promise<any[]> => {
  // Array of promises to get the documents of the same key per database
  const docPromisesArr = docScopeArr.map(async database => {
    return database.get(key)
  })
  // Capture the result of each promise, including whether it was fulfilled or rejected
  return await Promise.allSettled(docPromisesArr)
}
