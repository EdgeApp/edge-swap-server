import { asNumber, asString } from 'cleaners'

export type ErrorResponse = Error & ExtraErrorInfo

interface ExtraErrorInfo {
  errorType: string
  errorCode: number
}

const defaultErrorMessage = 'Something went wrong.'

export const makeErrorResponse = (
  errorType: string,
  errorCode: number,
  message: string = defaultErrorMessage
): ErrorResponse =>
  Object.assign(new Error(asString(message)), {
    errorType: asString(errorType),
    errorCode: asNumber(errorCode)
  })
