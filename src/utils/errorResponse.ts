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
    message: message,
    errorType: errorType,
    errorCode: errorCode
  }
}
