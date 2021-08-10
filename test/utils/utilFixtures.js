const inputFn1 = amount => {
  if (amount >= 123456) {
    return true
  }
  return false
}

export const fixture = {
  binarySearch: [
    {
      testDescription:
        'Resolve the number 123456 for a function that returns true for numbers greater than or equal to 123456 with a start of 0 and an end of 1000000',
      inputArgs: [inputFn1, 0, 1000000],
      outputType: 'number',
      expectedOutput: 123456
    },
    {
      testDescription:
        'Resolve the number 1000001 for a function that only returns false with a start of 0 and an end of 1000000',
      inputArgs: [() => false, 0, 1000000],
      outputType: 'number',
      expectedOutput: 1000001
    },
    {
      testDescription:
        'Resolve the number 0 for a function that only returns true with a start of 0 and an end of 1000000',
      inputArgs: [() => true, 0, 1000000],
      outputType: 'number',
      expectedOutput: 0
    },
    {
      testDescription:
        'Promise is rejected when dataFetchFn is a boolean instead of a function',
      inputArgs: [true, 0, 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected when dataFetchFn is undefined instead of a function',
      inputArgs: [undefined, 0, 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected when dataFetchFn is an empty array instead of a function',
      inputArgs: [[], 0, 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected when dataFetchFn is an empty object instead of a function',
      inputArgs: [{}, 0, 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with an Error when start is -Infinity instead of a number',
      inputArgs: [inputFn1, -Infinity, 1000000],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with an Error when start is a string instead of a number',
      inputArgs: [inputFn1, 'hello', 1000000],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with an Error when start is undefined instead of a number',
      inputArgs: [inputFn1, undefined, 1000000],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with an Error when start is an empty object instead of a number',
      inputArgs: [inputFn1, {}, 1000000],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with a TypeError when start is null instead of a number',
      inputArgs: [inputFn1, null, 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with a TypeError when start is false instead of a number',
      inputArgs: [inputFn1, false, 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with a TypeError when start is an empty array instead of a number',
      inputArgs: [inputFn1, [], 1000000],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with an Error when end is Infinity instead of a number',
      inputArgs: [inputFn1, 0, Infinity],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with an Error when end is a string instead of a number',
      inputArgs: [inputFn1, 0, 'hello'],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with an Error when end is undefined instead of a number',
      inputArgs: [inputFn1, 0, undefined],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with an Error when end is an empty object instead of a number',
      inputArgs: [inputFn1, 0, {}],
      outputType: 'Error'
    },
    {
      testDescription:
        'Promise is rejected with a TypeError when end is null instead of a number',
      inputArgs: [inputFn1, 0, null],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with a TypeError when end is false instead of a number',
      inputArgs: [inputFn1, 0, false],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with a TypeError when end is an empty array instead of a number',
      inputArgs: [inputFn1, 0, []],
      outputType: 'TypeError'
    },
    {
      testDescription:
        'Promise is rejected with an Error when start is greater than end initially',
      inputArgs: [inputFn1, 1, 0],
      outputType: 'Error'
    }
  ]
}
