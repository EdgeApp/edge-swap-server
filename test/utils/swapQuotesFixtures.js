export const fixture = {
  createDisabledSwapPluginMap: [
    {
      testDescription:
        'Returns an object whose keys match the input array with the exception of the input plugin string, and all corresponding values are true',
      inputArgs: ['changelly', ['changelly', 'changenow', 'godex', 'totle']],
      outputType: 'object',
      expectedOutput: {
        changenow: true,
        godex: true,
        totle: true
      }
    },
    {
      testDescription:
        'Returns an object whose keys match the input array and all corresponding values are true for a plugin argument of undefined',
      inputArgs: [undefined, ['changelly', 'changenow', 'godex', 'totle']],
      outputType: 'object',
      expectedOutput: {
        changelly: true,
        changenow: true,
        godex: true,
        totle: true
      }
    },
    {
      testDescription:
        'Returns an object whose keys match the input array and all corresponding values are true for a plugin argument of null',
      inputArgs: [null, ['changelly', 'changenow', 'godex', 'totle']],
      outputType: 'object',
      expectedOutput: {
        changelly: true,
        changenow: true,
        godex: true,
        totle: true
      }
    },
    {
      testDescription:
        'Returns an object whose keys match the input array and all corresponding values are true for a plugin argument of an empty object',
      inputArgs: [{}, ['changelly', 'changenow', 'godex', 'totle']],
      outputType: 'object',
      expectedOutput: {
        changelly: true,
        changenow: true,
        godex: true,
        totle: true
      }
    },
    {
      testDescription:
        'Returns an object whose keys match the input array and all corresponding values are true for a plugin argument of an empty array',
      inputArgs: [[], ['changelly', 'changenow', 'godex', 'totle']],
      outputType: 'object',
      expectedOutput: {
        changelly: true,
        changenow: true,
        godex: true,
        totle: true
      }
    },
    {
      testDescription:
        'Returns an object whose keys are the primitives within the input array and all corresponding values are true',
      inputArgs: ['godex', ['godex', undefined, true, null, 10, 'string']],
      outputType: 'object',
      expectedOutput: {
        undefined: true,
        true: true,
        null: true,
        10: true,
        string: true
      }
    },
    {
      testDescription:
        'Returns an object whose key is the contents of the array nested in the second argument and its corresponding value is true',
      inputArgs: ['godex', [['string', true, 1]]],
      outputType: 'object',
      expectedOutput: {
        'string,true,1': true
      }
    },
    {
      testDescription:
        'Returns an object whose key is [object Object] for a second argument of an object inside an array, and its corresponding value is true',
      inputArgs: ['godex', [{}]],
      outputType: 'object',
      expectedOutput: {
        '[object Object]': true
      }
    },
    {
      testDescription:
        'Returns an empty object when the second argument is an empty array',
      inputArgs: ['godex', []],
      outputType: 'object',
      expectedOutput: {}
    },
    {
      testDescription: 'Throws a TypeError when no arguments are provided',
      inputArgs: [],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when only one argument of a string is provided',
      inputArgs: ['changelly'],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when the second argument for the plugin name array is null',
      inputArgs: ['changelly', null],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when the second argument for the plugin name array is a number',
      inputArgs: ['changelly', 10],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when the second argument for the plugin name array is an empty object',
      inputArgs: ['changelly', {}],
      outputType: 'TypeError'
    }
  ]
}
