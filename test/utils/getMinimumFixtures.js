export const fixture = {
  cleanSwapInfoDocs: [
    {
      testDescription:
        'Returns an object with two keys for an input array whose values in the data key are objects with values of strings',
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
      outputType: 'object',
      expectedOutput: {
        plugin1: {
          BTC_ETH: '1',
          ETH_BTC: '2'
        },
        plugin2: {
          0: '3',
          1: '4'
        }
      }
    },
    {
      testDescription:
        'Returns an empty object for an input array whose values in the data key are not objects with only values of strings',
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
      outputType: 'object',
      expectedOutput: {}
    },
    {
      testDescription: 'Returns an empty object for an input of an empty array',
      inputArgs: [],
      outputType: 'object',
      expectedOutput: {}
    },
    {
      testDescription:
        'Returns an empty object for an input of an array of different primitive data types',
      inputArgs: ['hello', 5, null, undefined, false],
      outputType: 'object',
      expectedOutput: {}
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
  ]
}
