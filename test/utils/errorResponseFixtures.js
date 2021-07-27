export const fixture = {
  errorResponse: [
    {
      testDescription: 'Returns an ErrorResponse object for 3 valid arguments',
      inputArgs: ['not_found', 404, 'Data not found'],
      outputType: 'error',
      expectedOutput: {
        message: 'Data not found',
        errorType: 'not_found',
        errorCode: 404
      }
    },
    {
      testDescription:
        'Returns an ErrorResponse object with the default message for 2 valid arguments',
      inputArgs: ['error', 500],
      outputType: 'error',
      expectedOutput: {
        message: 'Something went wrong.',
        errorType: 'error',
        errorCode: 500
      }
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when no arguments are provided',
      inputArgs: [],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when the first argument is null',
      inputArgs: [null, 500, 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when the first argument is an empty object',
      inputArgs: [{}, 500, 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when the first argument is an empty array',
      inputArgs: [[], 500, 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a number when the second argument is undefined',
      inputArgs: ['error', undefined, 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a number'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a number when the second argument is null',
      inputArgs: ['error', null, 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a number'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a number when the second argument is an empty object',
      inputArgs: ['error', {}, 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a number'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a number when the second argument is an empty array',
      inputArgs: ['error', [], 'Error message'],
      outputType: 'TypeError',
      expectedOutput: 'Expected a number'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when the third argument is null',
      inputArgs: ['error', 500, null],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when the third argument is an empty object',
      inputArgs: ['error', 500, {}],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    },
    {
      testDescription:
        'Throws a TypeError for expecting a string when the third argument is an empty array',
      inputArgs: ['error', 500, []],
      outputType: 'TypeError',
      expectedOutput: 'Expected a string'
    }
  ]
}
