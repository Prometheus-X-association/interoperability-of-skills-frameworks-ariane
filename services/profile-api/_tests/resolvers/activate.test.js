import { jest } from "@jest/globals";

const mockValidateOneTimeToken = jest.fn()
jest.unstable_mockModule("../../src/keycloak/oneTimeToken.js", () => ({
  validateOneTimeToken: mockValidateOneTimeToken
}))

const mockGetByArgs = jest.fn();
const getMockDataLoader = () => {
  return {
    getByArgs: mockGetByArgs,
  }
}

const mockESMutateUpdateUser = jest.fn()
const mockInfo = {
  schema: {
    getMutationType: () => {
      return {
        getFields: () => {
          return {
            updateUser: {
              resolve: mockESMutateUpdateUser
            },
          }
        }
      }
    }
  }
}

const activate = (await import('../../src/resolvers/activate.js')).default;
describe("test activate resolver", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  const mockArgs = {
    token: 'testing-token'
  }

  it("should throw an error if the token is invalid", async () => {
    mockValidateOneTimeToken.mockImplementation(() => {
      throw new Error('The token is not valid')
    })
    await expect(activate(null, { token: 'token' }, { dataLoader: getMockDataLoader() }, {}))
      .rejects.toThrow('The token is not valid')
  })

  it("should throw error if extracted token is invalid", async () => {
    mockValidateOneTimeToken.mockReturnValue({ sub: 'sub' })
    mockGetByArgs.mockResolvedValueOnce([{}])
    await expect(activate(null, mockArgs, { dataLoader: getMockDataLoader() }, {}))
      .rejects.toThrow('Invalid activation token')
    expect(mockGetByArgs).toHaveBeenCalledWith({ size: 1, filters: { type: 'mms:User', id: 'sub' } }, null)
  })

  it("should throw error if user is already activated", async () => {
    mockValidateOneTimeToken.mockReturnValue({ sub: 'sub' })
    mockGetByArgs.mockResolvedValueOnce([{ status: [{ value: 'Active' }] }])
    await expect(activate(null, mockArgs, { dataLoader: getMockDataLoader() }, {}))
      .rejects.toThrow('User already activated')
  })

  it("should throw error if user is not pending", async () => {
    mockValidateOneTimeToken.mockReturnValue({ sub: 'sub' })
    mockGetByArgs.mockResolvedValueOnce([{ status: [{ value: 'Inactive' }] }])
    await expect(activate(null, mockArgs, { dataLoader: getMockDataLoader() }, {}))
      .rejects.toThrow('Account cannot be activated')
  })

  it("should call updateUser mutation", async () => {
    mockValidateOneTimeToken.mockReturnValue({ sub: 'sub' })
    mockGetByArgs.mockResolvedValueOnce([{ status: [{ value: 'Pending' }] }])
    const res = await activate(null, mockArgs, { dataLoader: getMockDataLoader() }, mockInfo)
    expect(mockESMutateUpdateUser).toHaveBeenCalledWith(undefined, {
      input: {
        data: {
          id: 'sub',
          status: [{ value: 'Active' }],
        },
        where: {
          id: ['sub']
        }
      }
    }, { dataLoader: getMockDataLoader() }, mockInfo)
    expect(res).toEqual({ userId: 'sub' })
  })
})