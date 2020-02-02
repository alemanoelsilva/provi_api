const {
  signUp,
} = require('../../api/users/adapter');

describe('User Adapter Unit tests', () => {
  const DEFAULT_SEQUENCE = ['first', 'second', 'third'];

  const mocks = {
    payload: {
      email: 'email',
      password: 'password',
    },
    repository: {
      user: {
        find: jest.fn(() => ([])),
        save: jest.fn(),
      },
      orderEndpoint: {
        find: jest.fn(() => ([{ id: 'id', event: 1, order: DEFAULT_SEQUENCE }])),
        save: jest.fn(),
      },
    },
    getToken: jest.fn(data => data),
    getNextEndpoint: jest.fn(() => 1),
    sequenceEndpoints: DEFAULT_SEQUENCE,
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
    onSuccess: jest.fn(),
    onError: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Execute the signUp function', () => {
    test('Should call the onSuccess Function when there are leastways one orderEndpoints', async () => {
      await signUp(mocks);

      expect(mocks.logger.info).toHaveBeenCalledTimes(1);
      expect(mocks.repository.user.find).toHaveBeenCalledTimes(1);
      expect(mocks.repository.user.save).toHaveBeenCalledTimes(1);
      expect(mocks.repository.orderEndpoint.find).toHaveBeenCalledTimes(1);
      expect(mocks.repository.orderEndpoint.save).toHaveBeenCalledTimes(0);
      expect(mocks.getToken).toHaveBeenCalledTimes(1);
      expect(mocks.getNextEndpoint).toHaveBeenCalledTimes(1);
      expect(mocks.onSuccess).toHaveBeenCalledTimes(1);
      expect(mocks.onError).toHaveBeenCalledTimes(0);
    });

    test('Should call the onSuccess Function when there is no one orderEndpoints', async () => {
      const orderEndpoint = {
        find: jest.fn(() => ([])),
        save: jest.fn(),
      };

      await signUp({
        ...mocks,
        repository: {
          ...mocks.repository,
          orderEndpoint,
        },
      });

      expect(mocks.logger.info).toHaveBeenCalledTimes(2);
      expect(mocks.repository.user.find).toHaveBeenCalledTimes(1);
      expect(mocks.repository.user.save).toHaveBeenCalledTimes(1);
      expect(orderEndpoint.find).toHaveBeenCalledTimes(1);
      expect(orderEndpoint.save).toHaveBeenCalledTimes(1);
      expect(mocks.getToken).toHaveBeenCalledTimes(1);
      expect(mocks.getNextEndpoint).toHaveBeenCalledTimes(1);
      expect(mocks.onSuccess).toHaveBeenCalledTimes(1);
      expect(mocks.onError).toHaveBeenCalledTimes(0);
    });

    test('Should call the onError Function when there is an user already registered', async () => {
      const user = {
        find: jest.fn(() => ([{ id: 'id' }])),
        save: jest.fn(),
      };

      try {
        await signUp({
          ...mocks,
          repository: {
            ...mocks.repository,
            user,
          },
        });
      } catch (error) {
        expect(error.message).toBeEqual('User already exist');
        expect(error.statusCode).toBeEqual(400);
      }

      expect(mocks.logger.info).toHaveBeenCalledTimes(1);
      expect(user.find).toHaveBeenCalledTimes(1);
      expect(user.save).toHaveBeenCalledTimes(0);
      expect(mocks.repository.orderEndpoint.find).toHaveBeenCalledTimes(1);
      expect(mocks.repository.orderEndpoint.save).toHaveBeenCalledTimes(0);
      expect(mocks.getToken).toHaveBeenCalledTimes(0);
      expect(mocks.getNextEndpoint).toHaveBeenCalledTimes(0);
      expect(mocks.onSuccess).toHaveBeenCalledTimes(0);
      expect(mocks.onError).toHaveBeenCalledTimes(1);
    });
  });

});
