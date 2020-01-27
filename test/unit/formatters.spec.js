const {
  formatterUserResponse,
  formatterUserRequest,
} = require('../../api/users/formatters');

describe('User Formatters Unit tests', () => {
  const mock = {
    moment: jest.fn(() => ({
      format: jest.fn(data => data),
    })),
    stringToArrayObject: jest.fn(data => data),
    arrayObjectToString: jest.fn(data => data),
  };

  const userMock = {
    id: '400117f1-1388-4eb9-a10f-c8b30e2b40b1',
    name: 'Alexandre',
    email: 'email@gmail.com',
    password: 'jndkejndkejndkejn',
    phones: [{
      number: 123123,
      ddd: 33,
    }, {
      number: 123123,
      ddd: 23,
    }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    token: '419d1c0f-cd8a-47ea-a9ea-2665043189e7',
  };

  beforeEach(() => jest.clearAllMocks());

  describe('Format user response', () => {
    test('Should return an user object formatted', async () => {
      const user = await formatterUserResponse({
        moment: mock.moment,
        formatDate: '',
        stringToArrayObject: mock.stringToArrayObject,
      })(userMock);

      expect(user.id).toEqual(userMock.id);
      expect(user.name).toEqual(userMock.name);
      expect(user.password).toEqual(userMock.password);
      expect(user.phones).toEqual(userMock.phones);
      expect(user.token).toEqual(userMock.token);

      expect(mock.moment).toHaveBeenCalledTimes(3);
      expect(mock.stringToArrayObject).toHaveBeenCalledTimes(1);
    });
  });

  describe('Format user request', () => {
    test('Should return an user object formatted', async () => {
      const user = await formatterUserRequest({
        arrayObjectToString: mock.arrayObjectToString,
      })(userMock);

      expect(user.name).toEqual(userMock.name);
      expect(user.email).toEqual(userMock.email);
      expect(user.password).toEqual(userMock.password);
      expect(user.phones).toEqual(userMock.phones);

      expect(mock.arrayObjectToString).toHaveBeenCalledTimes(1);
    });
  });
});
