import { expect } from 'chai'
import { describe, it } from 'mocha'

import { createDisabledSwapPluginMap } from '../../src/utils/swapQuotes'
import { fixture } from './swapQuotesFixtures'

describe('createDisabledSwapPluginMap', () => {
  for (const testCase of fixture.createDisabledSwapPluginMap) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => createDisabledSwapPluginMap(...inputArgs)).to.throw(
          TypeError
        )
      } else {
        // Act
        const actualResult = createDisabledSwapPluginMap(...inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})
