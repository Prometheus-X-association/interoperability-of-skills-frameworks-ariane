import { jest } from '@jest/globals';

jest.unstable_mockModule('../../_confs/config.js', () => ({
  default: {
    keycloak: {
      base_url: 'https://keycloak.base.url',
      realm: 'testing-realm',
      account: {
        client_id: 'testing-client-id',
        client_secret: 'testing-client-secret'
      }
    }
  }
}))

const mockKCUsersFind = jest.fn()
const mockKCUsersCreate = jest.fn()
const mockKCUsersUpdate = jest.fn()
const mockKCUsersResetPassword = jest.fn()
const mockKCAdminClient = {
  users: {
    find: mockKCUsersFind,
    create: mockKCUsersCreate,
    update: mockKCUsersUpdate,
    resetPassword: mockKCUsersResetPassword
  }
}

const { searchUser, createUser, updateUser, updateNewPassword, login } = (await import('../../src/helpers/keycloak.js'));

describe('test keycloak helper', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should search user by email probably', async () => {
    mockKCUsersFind.mockResolvedValueOnce([{ id: 'user-id' }])
    const user = await searchUser({ kcAdminClient: mockKCAdminClient, email: 'email@email.com' });
    expect(user).toEqual({ id: 'user-id' })

    mockKCUsersFind.mockRejectedValueOnce(new Error('error'))
    const user2 = await searchUser({ kcAdminClient: mockKCAdminClient, email: 'email@email.com' });
    expect(user2).toEqual(null)
  })

  it('should create user probably', async () => {
    mockKCUsersCreate.mockResolvedValueOnce({ id: 'user-id' })
    const user = await createUser({
      kcAdminClient: mockKCAdminClient,
      args: {
        username: 'username',
        email: 'email@email.com',
        password: 'password',
        attr1: 'attr1',
        attr2: 'attr2'
      }
    })
    expect(user).toEqual({ id: 'user-id' })
    expect(mockKCUsersCreate).toBeCalledWith({
      username: 'username',
      email: 'email@email.com',
      enabled: true,
      attributes: {
        attr1: 'attr1',
        attr2: 'attr2'
      },
      credentials: [{
        type: 'password',
        value: 'password'
      }]
    })
  })

  it('should update user probably', async () => {
    mockKCUsersUpdate.mockResolvedValueOnce({ id: 'user-id' })
    const user = await updateUser({
      kcAdminClient: mockKCAdminClient,
      args: {
        id: 'user-id',
        email: 'email@email.com',
        password: 'password',
        attr3: 'attr3'
      }
    })
    expect(user).toEqual({ id: 'user-id' })
    expect(mockKCUsersUpdate).toBeCalledWith({
      id: 'user-id'
    }, {
      email: 'email@email.com',
      attributes: {
        attr3: 'attr3'
      }
    })
  })

  it('should reset password probably', async () => {
    mockKCUsersResetPassword.mockResolvedValueOnce({ id: 'user-id' })
    const user = await updateNewPassword({
      kcAdminClient: mockKCAdminClient,
      args: {
        id: 'user-id',
        password: 'password'
      }
    })
    expect(user).toEqual({ id: 'user-id' })
    expect(mockKCUsersResetPassword).toBeCalledWith({
      id: 'user-id',
      credential: {
        temporary: false,
        type: 'password',
        value: 'password'
      }
    })
  })
  
  it('should login probably', async () => {
    const username = 'test-username'
    const password = 'test-password'
    const queryParams = new URLSearchParams({
      grant_type: 'password',
      client_id: 'testing-client-id',
      client_secret: 'testing-client-secret',
      username,
      password
    })
    const mockFetch = jest.fn();
    global.fetch = mockFetch

    // 401
    mockFetch.mockResolvedValueOnce({
      status: 401
    })
    await expect(login({
      username, password
    })).rejects.toThrow('INVALID_CREDENTIALS')

    // Generic error
    mockFetch.mockResolvedValueOnce({
      status: 405
    })
    await expect(login({
      username, password
    })).rejects.toThrow('GENERIC_ERROR')

    // Success
    mockFetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        access_token: 'access_token'
      })
    })
    expect(await login({ username, password })).toEqual({ accessToken: 'access_token' })
  })
})