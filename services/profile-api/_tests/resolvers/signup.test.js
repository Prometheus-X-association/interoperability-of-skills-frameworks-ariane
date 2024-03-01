import { jest } from "@jest/globals";

const mockSearchKCUser = jest.fn()
const mockCreateKCUser = jest.fn()
const mockUpdateKCUser = jest.fn()
// https://github.com/jestjs/jest/issues/10025
jest.unstable_mockModule("../../src/helpers/keycloak.js", () => ({
  searchUser: mockSearchKCUser,
  createUser: mockCreateKCUser,
  updateUser: mockUpdateKCUser
}))

const mockKeycloakAdminClient = {}
jest.unstable_mockModule("../../src/keycloak/adminClient.js", () => ({
  default: mockKeycloakAdminClient
}))

jest.unstable_mockModule("../../src/utils/randomString.js", () => ({
  randomString: () => "random"
}))

const mockGenerateOneTimeToken = jest.fn()
jest.unstable_mockModule("../../src/keycloak/oneTimeToken.js", () => ({
  generateOneTimeToken: mockGenerateOneTimeToken
}))

const mockCompileHtmlContent = jest.fn()
const mockSendEmail = jest.fn()
jest.unstable_mockModule("../../src/helpers/email.js", () => ({
  compileHtmlContent: mockCompileHtmlContent,
  sendEmail: mockSendEmail
}))

jest.unstable_mockModule("node:fs", () => ({
  readFileSync: () => "signupEmailTemplate"
}))

jest.unstable_mockModule("../../_confs/config.js", () => ({
  default: {
    signupCallbackLink: "signupCallbackLink",
    mailjet: {
      sender: "sender"
    }
  }
}))

jest.unstable_mockModule("nanoid", () => ({
  nanoid: () => "nanoid"
}))

const signup = (await import('../../src/resolvers/signup.js')).default;

const mockGetByArgs = jest.fn();
const mockESMutateCreateUser = jest.fn();
const mockESMutateCreatePersonalDataWallet = jest.fn();
const getMockDataLoader = () => {
  return {
    getByArgs: mockGetByArgs,
  }
}
const mockInfo = {
  schema: {
    getMutationType: () => {
      return {
        getFields: () => {
          return {
            createUser: {
              resolve: mockESMutateCreateUser
            },
            createPersonalDataWallet: {
              resolve: mockESMutateCreatePersonalDataWallet
            }
          }
        }
      }
    }
  }
}

describe("test signup resolver", () => {
  const testArgs = {
    firstName: "test",
    lastName: "test",
    email: "email@email.com",
    company: "co",
    directManager: "dm"
  }

  beforeEach(() => {
    jest.resetAllMocks()
    mockGenerateOneTimeToken.mockReturnValue("oneTimeToken")
    mockCompileHtmlContent.mockReturnValue("html")
  })

  test("should throw error if company not found", async () => {
    mockGetByArgs.mockResolvedValueOnce(undefined)
    await expect(
      signup(
        null,
        testArgs,
        { dataLoader: getMockDataLoader() },
        mockInfo
      )
    ).rejects.toThrow("Company not found")
    expect(mockGetByArgs).toHaveBeenCalledTimes(1)
    expect(mockGetByArgs).toHaveBeenCalledWith({
      size: 1,
      filters: {
        type: "mms:Company",
        id: "co",
        status__value: "Active"
      },
    }, null)
  })

  test("should throw error if direct manager not found", async () => {
    mockGetByArgs
      .mockResolvedValueOnce([{ id: "co" }]) // for company search
      .mockResolvedValueOnce(undefined) // for direct manager search
    await expect(
      signup(
        null,
        testArgs,
        { dataLoader: getMockDataLoader() },
        mockInfo
      )
    ).rejects.toThrow("Direct manager not found")
    expect(mockGetByArgs).toHaveBeenCalledTimes(2)
    expect(mockGetByArgs).toHaveBeenNthCalledWith(2, {
      size: 1,
      filters: {
        type: "mms:User",
        id: "dm",
        status__value: "Active"
      },
    }, null)
  })

  test("should throw error if user already exists with status active in same company", async () => {
    mockGetByArgs
      .mockResolvedValueOnce([{ id: "co" }]) // for company search
      .mockResolvedValueOnce([{ id: "dm" }]) // for direct manager search
      .mockResolvedValueOnce([{
        id: "user",
        status: [{ value: "Active" }]
      }]); // for user search

    mockSearchKCUser.mockResolvedValue({ id: "user" }); // for keycloak user search
    await expect(
      signup(
        null,
        testArgs,
        { dataLoader: getMockDataLoader() },
        mockInfo
      )
    ).rejects.toThrow("User already exists")
    expect(mockGetByArgs).toHaveBeenCalledTimes(3)
    expect(mockGetByArgs).toHaveBeenNthCalledWith(3, {
      size: 1,
      filters: {
        type: "mms:User",
        id: "user",
        company: "co",
      },
    }, null)
  })

  test("should update user in keycloak if user exists in different company", async () => {
    const dataLoader = getMockDataLoader()
    mockGetByArgs
      .mockResolvedValueOnce([{ id: "co" }]) // for company search
      .mockResolvedValueOnce([{ id: "dm" }]) // for direct manager search
      .mockResolvedValueOnce([{
        id: "user",
        personalData: ["pd"],
        status: [{ value: "Pending" }]
      }]); // for user search
    mockSearchKCUser.mockResolvedValue({ id: "user" }); // for keycloak user search
    const result = await signup(
      null,
      testArgs,
      { dataLoader },
      mockInfo
    )
    expect(mockUpdateKCUser).toHaveBeenCalledWith({
      kcAdminClient: mockKeycloakAdminClient,
      args: {
        id: "user",
        ...testArgs
      }
    })
    expect(mockESMutateCreateUser).toHaveBeenCalledWith(
      undefined,
      {
        input: {
          data: {
            id: "user",
            searchedUser: [`mirrored/user`],
            company: ["co"],
            keycloakId: [{ value: 'user' }],
            status: [{ value: 'Pending' }],
            directManager: ["dm"],
          },
          where: {
            id: ['user']
          }
        },
      },
      { dataLoader },
      mockInfo
    )
    expect(mockESMutateCreatePersonalDataWallet).toHaveBeenCalledWith(
      undefined,
      {
        input: {
          data: {
            id: "pd",
            personalDataOf: ["user"],
            searchedUser: [`mirrored/user`],
            family: [{ value: "test" }],
            given: [{ value: "test" }],
            email: [{value: "email@email.com"}]
          },
          where: {
            id: ["pd"]
          }
        }
      },
      { dataLoader },
      mockInfo
    )
    expect(mockGenerateOneTimeToken).toHaveBeenCalledWith("user")
    expect(mockCompileHtmlContent).toHaveBeenCalledWith({
      template: "signupEmailTemplate",
      data: {
        customerName: "test test",
        url: "signupCallbackLink?token=oneTimeToken"
      }
    })
    expect(mockSendEmail).toHaveBeenCalledWith({
      from: "sender",
      to: "email@email.com",
      subject: 'Activate your Jobsong account',
      html: "html"
    })
  })

  test("should create user in keycloak if user does not exist", async () => {
    const dataLoader = getMockDataLoader()
    mockGetByArgs
      .mockResolvedValueOnce([{ id: "co" }]) // for company search
      .mockResolvedValueOnce([{ id: "dm" }]) // for direct manager search
      .mockResolvedValueOnce([{
        id: "user",
        personalData: ["pd"],
        status: [{ value: "Pending" }]
      }]); // for user search
    mockSearchKCUser.mockResolvedValue(undefined); // for keycloak user search
    mockCreateKCUser.mockResolvedValue({ id: "new-user" }); // for keycloak user creation
    const result = await signup(
      null,
      testArgs,
      { dataLoader },
      mockInfo
    )
    expect(mockCreateKCUser).toHaveBeenCalledWith({
      kcAdminClient: mockKeycloakAdminClient,
      args: {
        password: "random",
        ...testArgs
      }
    })
    expect(mockESMutateCreateUser).toHaveBeenCalledWith(
      undefined,
      {
        input: {
          data: {
            id: "new-user",
            searchedUser: [`mirrored/new-user`],
            company: ["co"],
            keycloakId: [{ value: 'new-user' }],
            status: [{ value: 'Pending' }],
            directManager: ["dm"],
          },
          where: {
            id: ['new-user']
          }
        },
      },
      { dataLoader },
      mockInfo
    )
    expect(mockESMutateCreatePersonalDataWallet).toHaveBeenCalledWith(
      undefined,
      {
        input: {
          data: {
            id: "personalDataWallet/nanoid",
            personalDataOf: ["new-user"],
            searchedUser: [`mirrored/new-user`],
            family: [{ value: "test" }],
            given: [{ value: "test" }],
            email: [{value: "email@email.com"}]
          },
          where: {
            id: ["personalDataWallet/nanoid"]
          }
        }
      },
      { dataLoader },
      mockInfo
    )
    expect(mockGenerateOneTimeToken).toHaveBeenCalledWith("new-user")
    expect(mockCompileHtmlContent).toHaveBeenCalledWith({
      template: "signupEmailTemplate",
      data: {
        customerName: "test test",
        url: "signupCallbackLink?token=oneTimeToken"
      }
    })
    expect(mockSendEmail).toHaveBeenCalledWith({
      from: "sender",
      to: "email@email.com",
      subject: 'Activate your Jobsong account',
      html: "html"
    })
    expect(result).toStrictEqual({ userId: 'new-user' }
    )
  })
})