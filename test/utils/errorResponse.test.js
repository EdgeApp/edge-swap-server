import { assert, expect } from 'chai'
import { describe, it } from 'mocha'

import { makeErrorResponse } from '../../src/utils/errorResponse'
import { fixture } from './errorResponseFixtures'

describe('errorResponse', () => {
  for (const testCase of fixture.errorResponse) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        assert.throws(
          () => {
            makeErrorResponse(...inputArgs)
          },
          TypeError,
          expectedOutput
        )
      } else {
        // Act
        const actualResult = makeErrorResponse(...inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        for (const [key, value] of Object.entries(expectedOutput)) {
          expect(actualResult).to.have.property(key, value)
        }
      }
    })
  }
})
