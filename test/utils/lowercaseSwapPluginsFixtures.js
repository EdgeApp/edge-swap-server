export const fixture = {
  getLowercaseSwapPlugins: [
    {
      testDescription:
        'Returns an array of two elements for an object containing multiple plugins, one of which is an object, and one that is an array',
      inputArgs: {
        bitcoin: true,
        changelly: {},
        plugin3: [],
        plugin4: 10,
        plugin5: null,
        plugin6: undefined,
        plugin7: 'hello'
      },
      expectedOutput: ['changelly', 'plugin3']
    },
    {
      testDescription:
        'Returns an array of strings containing numbers for an input of an array that contains objects and arrays',
      inputArgs: [
        {},
        true,
        { apiKey: '' },
        [],
        [20],
        'hello',
        20,
        null,
        undefined
      ],
      expectedOutput: ['0', '2', '3', '4']
    },
    {
      testDescription: 'Returns an empty array for an input that is a boolean',
      inputArgs: true,
      expectedOutput: []
    },
    {
      testDescription: 'Returns an empty array for an input that is a number',
      inputArgs: 10,
      expectedOutput: []
    },
    {
      testDescription: 'Returns an empty array for an input that is a string',
      inputArgs: 'hello',
      expectedOutput: []
    },
    {
      testDescription: 'Throws a TypeError when the input is null',
      inputArgs: null,
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when the input is undefined',
      inputArgs: undefined,
      outputType: 'TypeError'
    }
  ]
}
