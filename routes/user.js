const {
  signUp,
  signIn,
  cpf,
  fullname,
  birthdate,
  phonenumber,
  address,
  amountRequested,
} = require('../api/users/factory');

module.exports = (app) => {
  app.post('/api/v1/signup', signUp);
  app.post('/api/v1/signin', signIn);
  app.post('/api/v1/cpf', cpf);
  app.post('/api/v1/full-name', fullname);
  app.post('/api/v1/birth-date', birthdate);
  app.post('/api/v1/phone-number', phonenumber);
  app.post('/api/v1/address', address);
  app.post('/api/v1/amount-requested', amountRequested);
};
