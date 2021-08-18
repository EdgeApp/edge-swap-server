import { expect } from 'chai'
import { describe, it } from 'mocha'

import { getLowercaseSwapPlugins } from '../../src/utils/lowercaseSwapPlugins'
import { fixture } from './lowercaseSwapPluginsFixtures'

describe('getLowercaseSwapPlugins', () => {
  for (const testCase of fixture.getLowercaseSwapPlugins) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => getLowercaseSwapPlugins(inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = getLowercaseSwapPlugins(inputArgs)

        // Assert
        expect(actualResult).to.be.an.instanceof(Array)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})
