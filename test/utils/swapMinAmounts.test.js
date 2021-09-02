import { expect } from 'chai'
import { describe, it } from 'mocha'

import { createCurrencyPairs } from '../../src/utils/swapMinAmounts'
import { fixture } from './swapMinAmountsFixtures'

describe('createCurrencyPairs', () => {
  for (const testCase of fixture.createCurrencyPairs) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => createCurrencyPairs(...inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = createCurrencyPairs(...inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})
