const {
 // signIn,
  signUp,
  // search,
} = require('../api/users/factory');

const {
  requestSignIn,
  requestSignUp,
  requestUser,
  requestToken,
} = require('../api/users/schemas');

const {
  requestValidation,
} = require('../middlewares/schema-validation');


// const {
//   crypto: { secret },
// } = require('../config/environment');

module.exports = (app) => {
  app.post('/api/v1/signup',
    // requestValidation({ schema: requestSignUp, requestType: 'body' }),
    // crypto({ secret, requestType: 'body' }),
    signUp);

};
