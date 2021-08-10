import { describe, it } from 'mocha'

import { binarySearch } from '../../src/utils/utils'
import { fixture } from './utilFixtures'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)
const expect = chai.expect
chai.should()

describe('binarySearch', () => {
  for (const testCase of fixture.binarySearch) {
    it(testCase.testDescription, async () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Act
      const actualResultPromise = binarySearch(...inputArgs)

      // Assert
      if (outputType === 'Error') {
        return actualResultPromise.should.be.rejectedWith(
          Error,
          'Invalid start/end parameter(s)'
        )
      } else if (outputType === 'TypeError') {
        return actualResultPromise.should.be.rejectedWith(TypeError)
      } else {
        const actualResult = await actualResultPromise
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.equal(expectedOutput)
      }
    })
  }
})
