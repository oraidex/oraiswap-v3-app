import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// @ts-ignore
BigInt.prototype.toJSON = function () {
  return this.toString()
}

afterEach(() => {
  cleanup()
})
