const {
  hasUser,
  isValidToken,
  isValidSession,
  duplicatedEmail,
} = require('../../api/users/validators');

describe('User Validators Unit tests', () => {
  const INVALID_SESSION = 9;
  const INVALID_EMAIL = 'InvalidEmailConstraint';
  const mocks = {
    deps: {
      logger: {
        info: jest.fn(),
      },
      formatters: {
        getCurrentDate: jest.fn(() => 10),
        add30Minutes: jest.fn(date => date),
      },
    },
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Run the hasUser validator', () => {
    test('Should return an object with formatted error', () => {
      const result = hasUser({ user: null })(mocks.deps);

      expect(mocks.deps.logger.info).toHaveBeenCalledTimes(1);
      expect(result.error).toBeTruthy();
      expect(result.name).toEqual('NotAllowed');
      expect(result.message).toEqual('Usuário não autorizado');
    });
  });

  describe('Run the isValidToken validator', () => {
    test('Should return an object with formatted error', () => {
      const result = isValidToken({
        user: { token: 1 },
        paramsToken: 2,
      })(mocks.deps);

      expect(mocks.deps.logger.info).toHaveBeenCalledTimes(1);
      expect(result.error).toBeTruthy();
      expect(result.name).toEqual('InvalidToken');
      expect(result.message).toEqual('Não autorizado');
    });
  });

  describe('Run the isValidSession validator', () => {
    test('Should return an object with formatted error', () => {
      const result = isValidSession({
        user: { lastLogin: INVALID_SESSION },
      })(mocks.deps);

      expect(mocks.deps.logger.info).toHaveBeenCalledTimes(1);
      expect(result.error).toBeTruthy();
      expect(result.name).toEqual('InvalidSession');
      expect(result.message).toEqual('Não autorizado');
    });
  });

  describe('Run the duplicatedEmail validator', () => {
    test('Should return an object with formatted error', () => {
      const result = duplicatedEmail({
        responseDB: { name: INVALID_EMAIL, message: '', details: [] },
      })(mocks.deps);

      expect(mocks.deps.logger.info).toHaveBeenCalledTimes(1);
      expect(result.error).toBeTruthy();
      expect(result.name).toEqual(INVALID_EMAIL);
      expect(result.message).toEqual('');
      expect(result.details).toEqual([]);
    });
  });
});
