export const fixture = {
  createCurrencyPairs: [
    {
      testDescription:
        'Returns an array containing 3 CurrencyWalletPair elements for an input of 3 EdgeCurrencyWallets and an object containing exchange rates',
      inputArgs: [
        [
          {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          {
            name: 'ETH wallet',
            currencyInfo: {
              currencyCode: 'ETH'
            }
          }
        ],
        {
          BTC: '0.00002066',
          DOGE: '3.47099835',
          ETH: '0.00026521'
        }
      ],
      outputType: 'array',
      expectedOutput: [
        {
          fromWallet: {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          fromCurrencyCode: 'BTC',
          fromRate: '0.00002066',
          toWallet: {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          toCurrencyCode: 'DOGE',
          toRate: '3.47099835',
          currencyPair: 'BTC_DOGE'
        },
        {
          fromWallet: {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          fromCurrencyCode: 'BTC',
          fromRate: '0.00002066',
          toWallet: {
            name: 'ETH wallet',
            currencyInfo: {
              currencyCode: 'ETH'
            }
          },
          toCurrencyCode: 'ETH',
          toRate: '0.00026521',
          currencyPair: 'BTC_ETH'
        },
        {
          fromWallet: {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          fromCurrencyCode: 'DOGE',
          fromRate: '3.47099835',
          toWallet: {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          toCurrencyCode: 'BTC',
          toRate: '0.00002066',
          currencyPair: 'DOGE_BTC'
        },
        {
          fromWallet: {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          fromCurrencyCode: 'DOGE',
          fromRate: '3.47099835',
          toWallet: {
            name: 'ETH wallet',
            currencyInfo: {
              currencyCode: 'ETH'
            }
          },
          toCurrencyCode: 'ETH',
          toRate: '0.00026521',
          currencyPair: 'DOGE_ETH'
        },
        {
          fromWallet: {
            name: 'ETH wallet',
            currencyInfo: {
              currencyCode: 'ETH'
            }
          },
          fromCurrencyCode: 'ETH',
          fromRate: '0.00026521',
          toWallet: {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          toCurrencyCode: 'BTC',
          toRate: '0.00002066',
          currencyPair: 'ETH_BTC'
        },
        {
          fromWallet: {
            name: 'ETH wallet',
            currencyInfo: {
              currencyCode: 'ETH'
            }
          },
          fromCurrencyCode: 'ETH',
          fromRate: '0.00026521',
          toWallet: {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          toCurrencyCode: 'DOGE',
          toRate: '3.47099835',
          currencyPair: 'ETH_DOGE'
        }
      ]
    },
    {
      testDescription:
        'Returns an array containing 2 CurrencyWalletPair elements where all rates are `1` for an input of 2 EdgeCurrencyWallets and no second argument',
      inputArgs: [
        [
          {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          }
        ]
      ],
      outputType: 'array',
      expectedOutput: [
        {
          fromWallet: {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          fromCurrencyCode: 'BTC',
          fromRate: '1',
          toWallet: {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          toCurrencyCode: 'DOGE',
          toRate: '1',
          currencyPair: 'BTC_DOGE'
        },
        {
          fromWallet: {
            name: 'DOGE wallet',
            currencyInfo: {
              currencyCode: 'DOGE'
            }
          },
          fromCurrencyCode: 'DOGE',
          fromRate: '1',
          toWallet: {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          },
          toCurrencyCode: 'BTC',
          toRate: '1',
          currencyPair: 'DOGE_BTC'
        }
      ]
    },
    {
      testDescription:
        'Returns an empty array for an input of 1 EdgeCurrencyWallet',
      inputArgs: [
        [
          {
            name: 'BTC wallet',
            currencyInfo: {
              currencyCode: 'BTC'
            }
          }
        ],
        { BTC: '0.00002066' }
      ],
      outputType: 'array',
      expectedOutput: []
    },
    {
      testDescription:
        'Returns an empty array for an input of an empty array and an empty object',
      inputArgs: [[], {}],
      outputType: 'array',
      expectedOutput: []
    }
  ]
}
