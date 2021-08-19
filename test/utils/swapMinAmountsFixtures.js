export const fixture = {
  asFromSwapRequest: [
    {
      testDescription:
        'Returns an EdgeSwapRequest with valid properties for an argument of interface EdgeSwapInfo',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'object',
      expectedOutput: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        fromCurrencyCode: 'BTC',
        toCurrencyCode: 'DOGE',
        nativeAmount: '1000000',
        quoteFor: 'from'
      }
    },
    {
      testDescription: 'Returns an EdgeSwapRequest for a string of NaN',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: 'NaN'
      },
      outputType: 'object',
      expectedOutput: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        fromCurrencyCode: 'BTC',
        toCurrencyCode: 'DOGE',
        nativeAmount: 'NaN',
        quoteFor: 'from'
      }
    },
    {
      testDescription: 'Returns an EdgeSwapRequest for a string of Infinity',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: 'Infinity'
      },
      outputType: 'object',
      expectedOutput: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        fromCurrencyCode: 'BTC',
        toCurrencyCode: 'DOGE',
        nativeAmount: 'Infinity',
        quoteFor: 'from'
      }
    },
    {
      testDescription: 'Throws a TypeError for an argument of undefined',
      inputArgs: undefined,
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when the fromWallet is an empty object',
      inputArgs: {
        fromWallet: {},
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when the nested value of currencyCode for fromWallet is not a string',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 20
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when fromWallet is null',
      inputArgs: {
        fromWallet: null,
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when key value pair for fromWallet is missing',
      inputArgs: {
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when fromWallet is an empty array',
      inputArgs: {
        fromWallet: [],
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when toWallet is an empty object',
      inputArgs: {
        fromWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        toWallet: {},
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when the nested value of currencyCode for toWallet is not a string',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 10
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when key value pair for toWallet is missing',
      inputArgs: {
        fromWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when toWallet is null',
      inputArgs: {
        fromWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        toWallet: null,
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when toWallet is an empty array',
      inputArgs: {
        fromWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        toWallet: [],
        amount: '1000000'
      },
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Throws a TypeError when key value pair for amount is missing',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        }
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when amount is null',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: null
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when amount is an empty object',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: {}
      },
      outputType: 'TypeError'
    },
    {
      testDescription: 'Throws a TypeError when amount is an empty array',
      inputArgs: {
        fromWallet: {
          name: 'BTC wallet',
          currencyInfo: {
            currencyCode: 'BTC'
          }
        },
        toWallet: {
          name: 'DOGE wallet',
          currencyInfo: {
            currencyCode: 'DOGE'
          }
        },
        amount: []
      },
      outputType: 'TypeError'
    }
  ],
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
