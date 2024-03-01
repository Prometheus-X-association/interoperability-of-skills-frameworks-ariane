import { jest } from "@jest/globals";
import { checkUniqueValidity } from '../../../src/validations/helpers/checkValidity.js';

const mockGetByArgs = jest.fn()
const getMockDataLoader = () => ({
  getByArgs: mockGetByArgs
})
describe("test checkValidity", () => {
  const uniqueErrorText = 'Duplicate values found'
  const emptyErrorText = 'Empty values found'
  const existsErrorText = 'Value already exists'
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should throw error if detail list has items with duplicate values", async () => {
    await expect(checkUniqueValidity({
      detailList: [{
          key: [{ value: 'a' }]
        }, {
          key: [{ value: 'a' }]
        }],
      key: 'key',
      uniqueErrorText
    })).rejects.toThrowError(uniqueErrorText)
  })

  it("should throw error if detail list has items with empty values", async () => {
    await expect(checkUniqueValidity({
      detailList: [{
          key: [{ value: '' }]
        }, {
          key: [{ value: 'asdasd' }]
        }],
      key: 'key',
      uniqueErrorText,
      emptyErrorText
    })).rejects.toThrowError(emptyErrorText)

    await expect(checkUniqueValidity({
      detailList: [{
          key: [{ value: '' }]
        }],
      key: 'key',
      uniqueErrorText,
      emptyErrorText
    })).rejects.toThrowError(emptyErrorText)
  })

  it("should throw error if detail list has items with values that already exists in the database with different id", async () => {
    const dataLoader = getMockDataLoader()
    mockGetByArgs.mockResolvedValue([
      { id: '1', key: 'a' }
    ])
    await expect(checkUniqueValidity({
      detailList: [{
          key: [{ id: '2', value: 'a' }]
        }],
      key: 'key',
      uniqueErrorText,
      emptyErrorText,
      existsErrorText,
      filterKey: 'filter_key',
      context: {
        dataLoader
      },
      type: 'type'
    })).rejects.toThrowError(existsErrorText)

    expect(mockGetByArgs).toHaveBeenCalledWith({
      filters: {
        type: 'type',
        filter_key: 'a'
      },
      size: 1000
    }, {
      id: { raw: {} },
      filter_key: { raw: {} }
    })
  })

  it("should not throw error if detail list has items with values that already exists in the database with same id", async () => {
    const dataLoader = getMockDataLoader()
    mockGetByArgs.mockResolvedValue([
      { id: '1', key: 'a' }
    ])
    await expect(checkUniqueValidity({
      detailList: [{
          id: '1',
          key: [{ value: 'a' }]
        }],
      key: 'key',
      uniqueErrorText,
      emptyErrorText,
      existsErrorText,
      filterKey: 'filter_key',
      context: {
        dataLoader
      },
      type: 'type'
    })).resolves.toBeUndefined()

    expect(mockGetByArgs).toHaveBeenCalledWith({
      filters: {
        type: 'type',
        filter_key: 'a'
      },
      size: 1000
    }, {
      id: { raw: {} },
      filter_key: { raw: {} }
    })
  })
})