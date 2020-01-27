const modelMock = {
  create: jest.fn(() => {

  }),
  update: jest.fn(),
  findOne: jest.fn(() => ({
    dataValues: {
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
    },
  })),
};

const repository = require('../../api/users/repository')(modelMock);

describe('User Repository Unit tests', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Repository save user', () => {
    test('Should execute model.create function', async () => {
      await repository.save();

      expect(modelMock.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('Repository get user', () => {
    test('Should execute model.findOne function', async () => {
      const user = await repository.find({});

      expect(user.name).toEqual('Alexandre');

      expect(modelMock.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('Repository update user', () => {
    test('Should execute model.update function', async () => {
      await repository.update({ id: '' });

      expect(modelMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
