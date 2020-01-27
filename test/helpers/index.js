const request = require('supertest');

const app = require('../../app')();

const arrayObjectToSktring = array => JSON.stringify(array);

exports.requestGet = async ({ url, query, token = null }) => request(app)
  .get(url)
  .query(query)
  .set(token ? { Authorization: `Bearer ${token}` } : null);

exports.requestPost = async ({ url, body = '' }) => request(app)
  .post(url)
  .send(body);

exports.populateDataOnDB = async ({ data: { phones, ...othersData }, model }) => {
  try {
    return model.create({
      phones: arrayObjectToSktring(phones),
      ...othersData,
    });
  } catch (error) {
    console.log('There was error on action callled', error);
  }
};

exports.userMockOnDB = {
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

exports.userMock = {
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
};
