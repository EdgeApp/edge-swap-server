export const fixture = {
  cleanSwapInfoDocs: [
    {
      testDescription:
        'Returns an array with two elements for an input array whose values in the data key are objects with values of strings',
      inputArgs: [
        {
          _id: 'plugin1',
          _rev: '',
          data: {
            BTC_ETH: '1',
            ETH_BTC: '2'
          }
        },
        {
          _id: 'plugin2',
          _rev: '',
          data: ['3', '4']
        }
      ],
      outputType: 'array',
      expectedOutput: [
        {
          BTC_ETH: '1',
          ETH_BTC: '2'
        },
        {
          0: '3',
          1: '4'
        }
      ]
    },
    {
      testDescription:
        'Returns an empty array for an input array whose values in the data key are not objects with only values of strings',
      inputArgs: [
        {
          _id: 'plugin1',
          _rev: '',
          data: true
        },
        {
          _id: 'plugin2',
          _rev: '',
          data: 1
        },
        {
          _id: 'plugin3',
          _rev: '',
          data: null
        },
        {
          _id: 'plugin4',
          _rev: '',
          data: undefined
        },
        {
          _id: 'plugin5',
          _rev: '',
          data: [true, 1, null, undefined, '']
        },
        {
          _id: 'plugin6',
          _rev: '',
          data: { key1: true, key2: 1, key3: null, key4: undefined, key5: '' }
        }
      ],
      outputType: 'array',
      expectedOutput: []
    },
    {
      testDescription: 'Returns an empty array for an input of an empty array',
      inputArgs: [],
      outputType: 'array',
      expectedOutput: []
    },
    {
      testDescription:
        'Returns an empty array for an input of an array of different primitive data types',
      inputArgs: ['hello', 5, null, undefined, false],
      outputType: 'array',
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
  filterSwapInfoData: [
    {
      testDescription:
        'Returns an object with all keys that contain the string `BTC`',
      inputArgs: [
        {
          BTC_ETH: '13',
          BTC_LTC: '265',
          LTC_BTC: '0.004',
          LTC_ETH: '0.048',
          ETH_BTC: '0.078',
          ETH_LTC: '21'
        },
        ['BTC']
      ],
      outputType: 'object',
      expectedOutput: {
        BTC_ETH: '13',
        BTC_LTC: '265',
        LTC_BTC: '0.004',
        ETH_BTC: '0.078'
      }
    },
    {
      testDescription: 'Returns an empty object for an empty currencies array',
      inputArgs: [
        {
          BTC_ETH: '13',
          BTC_LTC: '265',
          LTC_BTC: '0.004',
          LTC_ETH: '0.048',
          ETH_BTC: '0.078',
          ETH_LTC: '21'
        },
        []
      ],
      outputType: 'object',
      expectedOutput: {}
    },
    {
      testDescription:
        'Returns an empty object for a currencies array that does not contain a currency in the keys of the input object',
      inputArgs: [
        {
          BTC_ETH: '13',
          BTC_LTC: '265',
          LTC_BTC: '0.004',
          LTC_ETH: '0.048',
          ETH_BTC: '0.078',
          ETH_LTC: '21'
        },
        ['DOGE']
      ],
      outputType: 'object',
      expectedOutput: {}
    },
    {
      testDescription:
        'Returns an object matching the input object for a currencies array that contains 1 element that is an empty string',
      inputArgs: [
        {
          BTC_ETH: '13',
          BTC_LTC: '265',
          LTC_BTC: '0.004',
          LTC_ETH: '0.048',
          ETH_BTC: '0.078',
          ETH_LTC: '21'
        },
        ['']
      ],
      outputType: 'object',
      expectedOutput: {
        BTC_ETH: '13',
        BTC_LTC: '265',
        LTC_BTC: '0.004',
        LTC_ETH: '0.048',
        ETH_BTC: '0.078',
        ETH_LTC: '21'
      }
    },
    {
      testDescription:
        'Returns an empty object for an input of an empty object',
      inputArgs: [{}, ['BTC', 'ETH']],
      outputType: 'object',
      expectedOutput: {}
    }
  ],
  findSwapInfoMins: [
    {
      testDescription:
        'Returns an object with 6 currency pairs whose values are the lower of the two objects in the input array, both of which have the same 6 currency pairs',
      inputArgs: [
        {
          BTC_ETH: '13',
          BTC_LTC: '2650',
          LTC_BTC: '0.004',
          LTC_ETH: '0.48',
          ETH_BTC: '0.078',
          ETH_LTC: '210'
        },
        {
          BTC_ETH: '130',
          BTC_LTC: '265',
          LTC_BTC: '0.04',
          LTC_ETH: '0.048',
          ETH_BTC: '0.78',
          ETH_LTC: '21'
        }
      ],
      outputType: 'object',
      expectedOutput: {
        BTC_ETH: '13',
        BTC_LTC: '265',
        LTC_BTC: '0.004',
        LTC_ETH: '0.048',
        ETH_BTC: '0.078',
        ETH_LTC: '21'
      }
    },
    {
      testDescription:
        'Returns an object containing the currency pairs between the two objects in the input array with no overlapping keys',
      inputArgs: [
        { BTC_ETH: '13', BTC_LTC: '265', LTC_BTC: '0.004' },
        {
          LTC_ETH: '0.048',
          ETH_BTC: '0.078',
          ETH_LTC: '21'
        }
      ],
      outputType: 'object',
      expectedOutput: {
        BTC_ETH: '13',
        BTC_LTC: '265',
        LTC_BTC: '0.004',
        LTC_ETH: '0.048',
        ETH_BTC: '0.078',
        ETH_LTC: '21'
      }
    },
    {
      testDescription:
        'Returns an object matching the 2nd element of the input array when the 1st element is an empty object',
      inputArgs: [
        {},
        {
          BTC_ETH: '13',
          BTC_LTC: '265',
          LTC_BTC: '0.004',
          LTC_ETH: '0.048',
          ETH_BTC: '0.078',
          ETH_LTC: '21'
        }
      ],
      outputType: 'object',
      expectedOutput: {
        BTC_ETH: '13',
        BTC_LTC: '265',
        LTC_BTC: '0.004',
        LTC_ETH: '0.048',
        ETH_BTC: '0.078',
        ETH_LTC: '21'
      }
    },
    {
      testDescription: 'Returns an empty object for an empty array',
      inputArgs: [],
      outputType: 'object',
      expectedOutput: {}
    },
    {
      testDescription:
        'Returns an object with a key value pair containing a finite number when one of the values in an object in the input array is Infinity',
      inputArgs: [{ BTC_ETH: 'Infinity', ETH_BTC: '0.078' }, { BTC_ETH: '13' }],
      outputType: 'object',
      expectedOutput: { BTC_ETH: '13', ETH_BTC: '0.078' }
    },
    {
      testDescription:
        'Returns an empty object for an input array of objects whose values are not finite or valid number strings',
      inputArgs: [
        { BTC_ETH: 'hello' },
        { BTC_ETH: '-Infinity' },
        { ETH_BTC: 'Infinity' },
        { ETH_BTC: 'NaN' }
      ],
      outputType: 'object',
      expectedOutput: {}
    }
  ]
}
