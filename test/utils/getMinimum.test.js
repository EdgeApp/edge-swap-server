import { expect } from 'chai'
import { describe, it } from 'mocha'

import { cleanSwapInfoDocs } from '../../src/utils/getMinimum'
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
        expect(typeof actualResult).to.equal(outputType)
        expect(actualResult).to.deep.equal(expectedOutput)
      }
    })
  }
})

// describe('findMinimum', () => {
//   for (const testCase of fixture.findMinimum) {
//     it(testCase.testDescription, () => {
//       // Arrange
//       const { inputArgs, outputType, expectedOutput } = testCase

//       // Parameter typing tests
//       if (outputType === 'TypeError') {
//         expect(() => findMinimum(inputArgs)).to.throw(TypeError)
//       } else {
//         // Act
//         const actualResult = findMinimum(inputArgs)

//         // Assert
//         expect(actualResult).to.be.an(outputType)
//         for (const [key, value] of Object.entries(expectedOutput)) {
//           expect(actualResult).to.have.property(key, value)
//         }
//       }
//     })
//   }
// })
