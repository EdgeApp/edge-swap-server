import { expect } from 'chai'
import { describe, it } from 'mocha'

import {
  cleanSwapInfoDocs,
  filterSwapInfoData,
  findSwapInfoMins
} from '../../src/utils/getMinimum'
import { fixture } from './getMinimumFixtures'

describe('cleanSwapInfoDocs', () => {
  for (const testCase of fixture.cleanSwapInfoDocs) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => cleanSwapInfoDocs(inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = cleanSwapInfoDocs(inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})

describe('filterSwapInfoData', () => {
  for (const testCase of fixture.filterSwapInfoData) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'TypeError') {
        expect(() => filterSwapInfoData(...inputArgs)).to.throw(TypeError)
      } else {
        // Act
        const actualResult = filterSwapInfoData(...inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})

describe('findSwapInfoMins', () => {
  for (const testCase of fixture.findSwapInfoMins) {
    it(testCase.testDescription, () => {
      // Arrange
      const { inputArgs, outputType, expectedOutput } = testCase

      // Parameter typing tests
      if (outputType === 'Error') {
        expect(() => findSwapInfoMins(inputArgs)).to.throw(Error)
      } else {
        // Act
        const actualResult = findSwapInfoMins(inputArgs)

        // Assert
        expect(actualResult).to.be.an(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})
