import { asNumber, asString } from 'cleaners'

export interface ErrorResponse {
  message: string
  errorType: string
  errorCode: number
}

const defaultErrorMessage = 'Something went wrong.'

export const makeErrorResponse = (
  errorType: string,
  errorCode: number,
  message: string = defaultErrorMessage
): ErrorResponse => {
  return {
    message: asString(message),
    errorType: asString(errorType),
    errorCode: asNumber(errorCode)
  }
}
