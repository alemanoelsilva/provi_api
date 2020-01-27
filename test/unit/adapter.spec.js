const {
  login,
  create,
  find,
} = require('../../api/users/adapter');

describe('User Adapter Unit tests', () => {
  const mocks = {
    query: '',
    params: '',
    body: '',
    repository: {
      find: jest.fn(() => ({ id: 'id' })),
      save: jest.fn(),
      updateLastLoginTime: jest.fn(),
      findByID: jest.fn(),
    },
    formatters: {
      payload: jest.fn(data => data),
      response: jest.fn(data => data),
    },
    taskRunner: {
      addTasks: jest.fn(),
      exec: jest.fn(),
    },
    validators: {
      hasUser: jest.fn(),
      duplicatedEmail: jest.fn(),
      isValidToken: jest.fn(),
      isValidSession: jest.fn(),
    },
    logger: {
      info: jest.fn(),
      error: jest.fn(),
    },
    onSuccess: jest.fn(),
    onError: jest.fn(),
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Run the login function', () => {
    test('Should call the onSuccess Function', async () => {
      await login(mocks);

      expect(mocks.logger.info).toHaveBeenCalledTimes(2);
      expect(mocks.repository.find).toHaveBeenCalledTimes(1);
      expect(mocks.taskRunner.addTasks).toHaveBeenCalledTimes(1);
      expect(mocks.taskRunner.exec).toHaveBeenCalledTimes(1);
      expect(mocks.repository.updateLastLoginTime).toHaveBeenCalledTimes(1);
      expect(mocks.onSuccess).toHaveBeenCalledTimes(1);
      expect(mocks.onError).toHaveBeenCalledTimes(0);
    });
  });

  describe('Run the create function', () => {
    test('Should call the onSuccess Function', async () => {
      await create(mocks);

      expect(mocks.logger.info).toHaveBeenCalledTimes(1);
      expect(mocks.taskRunner.addTasks).toHaveBeenCalledTimes(1);
      expect(mocks.taskRunner.exec).toHaveBeenCalledTimes(1);
      expect(mocks.repository.save).toHaveBeenCalledTimes(1);
      expect(mocks.onSuccess).toHaveBeenCalledTimes(1);
      expect(mocks.onError).toHaveBeenCalledTimes(0);
    });
  });

  describe('Run the search function', () => {
    test('Should call the onSuccess Function', async () => {
      await find(mocks);

      expect(mocks.logger.info).toHaveBeenCalledTimes(1);
      expect(mocks.taskRunner.addTasks).toHaveBeenCalledTimes(1);
      expect(mocks.taskRunner.exec).toHaveBeenCalledTimes(1);
      expect(mocks.repository.findByID).toHaveBeenCalledTimes(1);
      expect(mocks.onSuccess).toHaveBeenCalledTimes(1);
      expect(mocks.onError).toHaveBeenCalledTimes(0);
    });
  });
});
