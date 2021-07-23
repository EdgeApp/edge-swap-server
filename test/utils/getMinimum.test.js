import { expect } from 'chai'
import { describe, it } from 'mocha'
import { cleanMinAmountDocs, findMinimum } from '../../src/utils/getMinimum'
import { fixture } from './getMinimumFixtures'

describe('cleanMinAmountDocs', () => {
  for (const testCase of fixture.cleanMinAmountDocs) {
    it(testCase.testDescription, () => {
      // Arrange
      const {inputArgs, outputType, expectedOutput} = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => cleanMinAmountDocs(inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = cleanMinAmountDocs(inputArgs)

        // Assert
        expect(actualResult).to.be.an.instanceof(Array)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})

describe('findMinimum', () => {
  for (const testCase of fixture.findMinimum) {
    it(testCase.testDescription, () => {
      // Arrange
      const {inputArgs, outputType, expectedOutput} = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => findMinimum(inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = findMinimum(inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        for (const [key, value] of Object.entries(expectedOutput)) {
          expect(actualResult).to.have.property(key, value)
        }
      }
    })
  }
})
