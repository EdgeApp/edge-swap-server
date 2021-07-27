export const fixture = {
  cleanMinAmountDocs: [
    {
      testDescription:
        'Returns an array of length 2 for an input of an array of length 3 where two of the elements contain a minAmount key inside the data object whose values are strings',
      inputArgs: [
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { minAmount: '1' }
          }
        },
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { maxAmount: '0' }
          }
        },
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { minAmount: '0.5' }
          }
        }
      ],
      outputType: 'object',
      expectedOutput: [{ minAmount: '1' }, { minAmount: '0.5' }]
    },
    {
      testDescription:
        'Returns an empty array for an input of an array of rejected promises',
      inputArgs: [
        {
          status: 'rejected',
          reason: 'Error: an error'
        },
        {
          status: 'rejected',
          reason: 'Error: an error'
        }
      ],
      outputType: 'object',
      expectedOutput: []
    },
    {
      testDescription: 'Returns an empty array for an input of an empty array',
      inputArgs: [],
      outputType: 'object',
      expectedOutput: []
    },
    {
      testDescription:
        'Returns an empty array for an input of an array where the value of each minAmount is not a string',
      inputArgs: [
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { minAmount: 1 }
          }
        },
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { maxAmount: true }
          }
        },
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { minAmount: null }
          }
        },
        {
          status: 'fulfilled',
          value: {
            _id: '2021-07-14:BTC_ETH',
            _rev: '',
            data: { minAmount: undefined }
          }
        }
      ],
      outputType: 'object',
      expectedOutput: []
    },
    {
      testDescription:
        'Returns an empty array for an input of an array of different primitive data types',
      inputArgs: ['hello', 5, null, undefined, false],
      outputType: 'object',
      expectedOutput: []
    },
    {
      testDescription: 'Throws a TypeError for an input of an empty object',
      inputArgs: {},
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError for an input of null',
      inputArgs: null,
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError for an input that is a string',
      inputArgs: 'hello',
      outputType: 'TypeError'
    }
  ],
  findMinimum: [
    {
      testDescription:
        'Returns a string containing a valid finite number for an input of an array of length 4 whose elements contain keys for minAmount with values that are strings',
      inputArgs: [
        { minAmount: '0.5' },
        { minAmount: '2' },
        { minAmount: '0.25' },
        { minAmount: '1' }
      ],
      outputType: 'string',
      expectedOutput: '0.25'
    },
    {
      testDescription:
        'Returns a string containing a valid finite number for an input of an array of length 5 whose elements contain keys for minAmount with values that are numbers, some of which are not finite, or less than or equal to zero',
      inputArgs: [
        { minAmount: -Infinity },
        { minAmount: NaN },
        { minAmount: 0.25 },
        { minAmount: Infinity },
        { minAmount: -1 },
        { minAmount: 0 }
      ],
      outputType: 'string',
      expectedOutput: '0.25'
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an empty array',
      inputArgs: [],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an array with a single element whose minAmount is a string containing -Infinity',
      inputArgs: [{ minAmount: '-Infinity' }],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an array with a single element whose minAmount is a string containing Infinity',
      inputArgs: [{ minAmount: 'Infinity' }],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an array with a single element whose minAmount is a string containing 0 (zero)',
      inputArgs: [{ minAmount: '0' }],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an array with a single element whose minAmount is a string containing negative number',
      inputArgs: [{ minAmount: '-1' }],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an array with a single element whose minAmount is a string that does not contain a valid number',
      inputArgs: [{ minAmount: 'hello' }],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription:
        'Returns a CurrencyPairDataError for an input of an array with where the minAmount of each element is not a string or a number',
      inputArgs: [
        { minAmount: null },
        { minAmount: undefined },
        { minAmount: true }
      ],
      outputType: 'error',
      expectedOutput: {
        message: 'Data for currencyPair not found',
        errorCode: 404,
        errorType: 'not_found'
      }
    },
    {
      testDescription: 'Throws a TypeError for an input of an empty object',
      inputArgs: {},
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError for an input of a null',
      inputArgs: null,
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError for an input of a string',
      inputArgs: 'hello',
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError for an input of an array of different primitive data types',
      inputArgs: ['hello', 5, null, undefined, false],
      outputType: 'TypeError'
    }
  ]
}
