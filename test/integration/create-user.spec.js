const {
  requestPost,
} = require('../helpers');

const SIGNUP_URL = '/api/signup';

const User = require('../../api/users/model');

const { userMock } = require('../helpers');

describe('Create User - Sign up Integration Test', () => {
  beforeAll(async () => User.destroy({ where: {} }));

  describe('Try to create user', () => {
    test('Should return the user with properties id and createdAt, lastLogin and token', async () => {
      try {
        const { body, statusCode } = await requestPost({
          url: SIGNUP_URL,
          body: userMock,
        });

        expect(statusCode).toEqual(201);

        expect(body).toHaveProperty('id', 'createdAt', 'lastLogin', 'token');
        expect(body.id).toEqual(userMock.id);
        expect(body.createdAt).toEqual(userMock.createdAt);
        expect(body.lastLogin).toEqual(userMock.lastLogin);
        expect(body.updatedAt).toEqual(userMock.updatedAt);
        expect(body.token).toEqual(userMock.token);
      } catch (error) {}
    });

    test('Should return statusCode 400 - email already created', async () => {
      try {
        const { body, statusCode } = await requestPost({
          url: SIGNUP_URL,
          body: userMock,
        });

        expect(statusCode).toEqual(400);

        expect(body.message).toEqual('E-mail já existente');
      } catch (error) {}
    });
  });
});
