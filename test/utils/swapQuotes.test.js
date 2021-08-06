import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  asFromSwapRequest,
  createDisabledSwapPluginMap
} from '../../src/utils/swapMinAmounts'
import { fixture } from './swapMinAmountsFixtures'

describe('asFromSwapRequest', () => {
  for (const testCase of fixture.asFromSwapRequest) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => asFromSwapRequest(inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = asFromSwapRequest(inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})

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
