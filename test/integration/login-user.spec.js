const {
  requestPost,
} = require('../helpers');

const SIGNIN_URL = '/api/signin';

const User = require('../../api/users/model');

const { userMockOnDB, populateDataOnDB } = require('../helpers');

describe('Login User - Sign in Integration Test', () => {
  beforeAll(async () => populateDataOnDB({ data: userMockOnDB, model: User }));

  afterAll(async () => User.destroy({ where: {} }));

  describe('Try to do login', () => {
    test('Should return statusCode 200 - user logged', async () => {
      try {
        const { body, statusCode } = await requestPost({
          url: SIGNIN_URL,
          body: {
            email: userMockOnDB.email,
            password: userMockOnDB.password,
          },
        });

        expect(statusCode).toEqual(200);

        expect(body).toHaveProperty('id', 'createdAt', 'lastLogin', 'token');
        expect(body.id).toEqual(userMock.id);
        expect(body.createdAt).toEqual(userMock.createdAt);
        expect(body.lastLogin).toEqual(userMock.lastLogin);
        expect(body.updatedAt).toEqual(userMock.updatedAt);
        expect(body.token).toEqual(userMock.token);
      } catch (error) {}
    });

    test('Should return statusCode 401 - user email and/or password invalid', async () => {
      try {
        const { body, statusCode } = await requestPost({
          url: SIGNIN_URL,
          body: {
            email: 'email_is_not_valid@gmail.com',
            password: 'password_is_not_valid123',
          },
        });

        expect(statusCode).toEqual(401);

        expect(body.message).toEqual('Usuário não autorizado');
      } catch (error) {}
    });
  });
});
