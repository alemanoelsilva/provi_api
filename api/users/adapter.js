exports.login = async ({
  body,
  repository,
  formatters,
  taskRunner,
  validators,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Logging with user', body.email);

    const user = await repository.find(body);

    taskRunner.addTasks([
      validators.hasUser({ user }),
    ]);

    const resultRunner = await taskRunner.exec();

    if (resultRunner && resultRunner.error) {
      return onError({
        message: resultRunner.message,
        statusCode: 401,
      });
    }

    logger.info('Updating the lastLogin time');

    await repository.updateLastLoginTime(user.id);

    return onSuccess({ data: formatters.response(user) });
  } catch (error) {
    logger.error(error);
    return onError(error);
  }
};

exports.create = async ({
  payload,
  repository,
  getToken,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating user with', payload);

    const userFromDB = await repository.user.find({ email: payload.email });

    if (userFromDB) {
      throw {
        message: 'User already exist',
        statusCode: 400,
      };
    }

    const token = getToken(payload.email);

    await repository.user.save({
      email: payload.email,
      password: payload.password,
      token,
    });

    return onSuccess({
      data: {
        success: true,
        token,
        'next-end-point': 'cpf',
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on SignUp Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.find = async ({
  params,
  repository,
  formatters,
  taskRunner,
  validators,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Finding user by', params);

    const user = await repository.findByID({ id: params.id });

    taskRunner.addTasks([
      validators.hasUser({ user }),
      validators.isValidToken({ user, paramsToken: params.token }),
      validators.isValidSession({ user }),
    ]);

    const resultRunner = await taskRunner.exec();

    if (resultRunner && resultRunner.error) {
      return onError({
        message: resultRunner.message,
        status: 401,
      });
    }

    return onSuccess({ data: formatters.response(user), statusCode: 200 });
  } catch (error) {
    logger.error(error);
    return onError(error);
  }
};
