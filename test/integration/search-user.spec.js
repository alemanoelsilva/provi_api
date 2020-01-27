const uuidv4 = require('uuid/v4');

const {
  requestGet,
} = require('../helpers');

const SEARCH_URL = '/api/users';

const User = require('../../api/users/model');

const {
  populateDataOnDB,
  userMockOnDB,
} = require('../helpers');

describe('Get user - search Integration Test', () => {
  beforeAll(async () => populateDataOnDB({ data: userMockOnDB, model: User }));

  afterAll(async () => User.destroy({ where: {} }));

  describe('Try to get the user by ID', () => {
    test('Should return the user', async () => {
      try {
        const { body, statusCode } = await requestGet({
          url: `${SEARCH_URL}/${userMockOnDB.id}`,
          token: userMockOnDB.token,
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

    test('Should return the message when User id is not valid', async () => {
      try {
        const { body, statusCode } = await requestGet({
          url: `${SEARCH_URL}/${uuidv4()}`,
          token: userMockOnDB.token,
        });

        expect(statusCode).toEqual(401);

        expect(body.message).toEqual('Usuário não autorizado');
      } catch (error) {}
    });

    test('Should return the message when User token is not valid', async () => {
      try {
        const { body, statusCode } = await requestGet({
          url: `${SEARCH_URL}/${userMockOnDB.id}`,
          token: uuidv4(),
        });

        expect(statusCode).toEqual(401);

        expect(body.message).toEqual('Não autorizado');
      } catch (error) {}
    });
  });
});
