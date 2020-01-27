const Joi = require('joi');

const {
  requestValidation,
} = require('../../middlewares/schema-validation');

describe('Handler Schema Validation Unit tests', () => {
  const mock = {
    request: {
      body: { name: 'test', age: 1 },
      query: { name: 'test', age: 1 },
      params: { name: 'test', age: 1 },
    },
    response: {
      data: { name: 'test', age: 1 },
      status: jest.fn(() => ({
        json: jest.fn(() => ({
          end: jest.fn(),
        })),
      })),
    },
    next: jest.fn(data => data),
  };

  const schema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().optional(),
  });

  beforeEach(() => jest.clearAllMocks());

  describe('Handler Request', () => {
    test('Should execute body validation with success', async () => {
      const result = requestValidation({
        schema,
        requestType: 'body',
      })(mock.request, mock.response, mock.next);

      expect(mock.next).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    test('Should execute body validation with error', async () => {
      const result = requestValidation({
        schema: { name: 1 },
        requestType: 'body',
      })(mock.request, mock.response, mock.next);

      expect(mock.next).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();

      expect(result.isJoi).toBeTruthy();
      expect(result.name).toEqual('ValidationError');
      expect(result.details[0].message).toEqual('"name" must be a number');
    });

    test('Should execute params validation with success', async () => {
      const result = requestValidation({
        schema,
        requestType: 'params',
      })(mock.request, mock.response, mock.next);

      expect(mock.next).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    test('Should execute params validation with error', async () => {
      const result = requestValidation({
        schema: { name: 1 },
        requestType: 'params',
      })(mock.request, mock.response, mock.next);

      expect(mock.next).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();

      expect(result.isJoi).toBeTruthy();
      expect(result.name).toEqual('ValidationError');
      expect(result.details[0].message).toEqual('"name" must be a number');
    });

    test('Should execute query validation with success', async () => {
      const result = requestValidation({
        schema,
        requestType: 'query',
      })(mock.request, mock.response, mock.next);

      expect(mock.next).toHaveBeenCalledTimes(1);
      expect(result).toBeUndefined();
    });

    test('Should execute query validation with error', async () => {
      const result = requestValidation({
        schema: { name: 1 },
        requestType: 'query',
      })(mock.request, mock.response, mock.next);

      expect(mock.next).toHaveBeenCalledTimes(1);
      expect(result).toBeDefined();

      expect(result.isJoi).toBeTruthy();
      expect(result.name).toEqual('ValidationError');
      expect(result.details[0].message).toEqual('"name" must be a number');
    });
  });
});
