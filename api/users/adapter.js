exports.signUp = async ({
  payload,
  repository,
  getToken,
  getNextEndpoint,
  sequenceEndpoints,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating user with', payload);

    const [[userFromDB], [orderEndpoint]] = await Promise.all([
      repository.user.find({ email: payload.email }),
      repository.orderEndpoint.find(),
    ]);

    if (userFromDB) {
      throw {
        message: 'User already exist',
        statusCode: 400,
      };
    }

    if (!orderEndpoint) {
      logger.info('Creating the first Sequence of endpoints with', sequenceEndpoints);
      await repository.orderEndpoint.save({
        event: 1,
        order: sequenceEndpoints,
      });
    }

    const token = getToken(payload.email);

    await repository.user.save({
      orderEndpoint: (orderEndpoint) ? orderEndpoint.event : 1,
      email: payload.email,
      password: payload.password,
      token,
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);

    return onSuccess({
      data: {
        success: true,
        token,
        'next-end-point': (orderEndpoint)
          ? orderEndpoint.order[getNextIndexEndpoint]
          : sequenceEndpoints[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on SignUp Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.signIn = async ({
  payload,
  repository,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Making login with user email', payload.email);

    const [userFromDB] = await repository.user.find({ email: payload.email });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    return onSuccess({
      data: {
        success: true,
        token: userFromDB.token,
        'next-end-point': 'cpf',
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on SignUp Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.cpf = async ({
  payload,
  repository,
  logger,
  isCpfValid,
  getNextEndpoint,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating cpf with', payload.cpf);

    const [userFromDB] = await repository.user.find({ token: payload.token });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    if (!isCpfValid(payload.cpf)) {
      throw {
        message: 'CPF is not valid',
        statusCode: 400,
      }
    }

    logger.info('The current event of endpoints sequence is', userFromDB.orderEndpoint);

    const [orderEndpoint] = await repository.orderEndpoint.find({ event: userFromDB.orderEndpoint });

    if (!orderEndpoint) {
      throw {
        message: `Ops, there is no endpoint sequence for the user ${userFromDB.email}`,
        statusCode: 400,
      };
    }

    logger.info('The current sequence of Endpoint is', orderEndpoint.order);

    const cpfFromDB = await repository.cpf.find({ user_id: userFromDB._id });

    let saveDB = {};

    const userAlreadyHasCpf = cpfFromDB.find(cpfDB => (cpfDB.cpf == payload.cpf));

    if (userAlreadyHasCpf) {
      saveDB = repository.cpf.update(cpfFromDB._id);
    } else {
      saveDB = repository.cpf.save;
    }

    await saveDB({
      user_id: userFromDB._id,
      cpf: payload.cpf,
      updated_at: new Date().toISOString(),
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);

    logger.info('Getting the next endpoint to cpf', orderEndpoint.order[getNextIndexEndpoint]);

    return onSuccess({
      data: {
        success: true,
        'next-end-point': orderEndpoint.order[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on CPF Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.fullname = async ({
  payload,
  repository,
  getNextEndpoint,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating fullname with', payload.fullname);

    const [userFromDB] = await repository.user.find({ token: payload.token });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    logger.info('The current event of endpoints sequence is', userFromDB.orderEndpoint);

    const [orderEndpoint] = await repository.orderEndpoint.find({ event: userFromDB.orderEndpoint });

    if (!orderEndpoint) {
      throw {
        message: `Ops, there is no endpoint sequence for the user ${userFromDB.email}`,
        statusCode: 400,
      };
    }

    logger.info('The current sequence of Endpoint is', orderEndpoint.order);

    const [firstName, ...restOfName] = payload.fullname.split(' ');

    const lastName = restOfName.reduce((prev, curr) => `${prev} ${curr}`, ' ').trim();

    const fullnameFromDB = await repository.fullname.find({ user_id: userFromDB._id });

    let saveDB = {};

    const userAlreadyHasName = fullnameFromDB.find(fullnameDB =>
      (fullnameDB.firstName == firstName && fullnameDB.lastName == lastName));

    if (userAlreadyHasName) {
      saveDB = repository.fullname.update(fullnameFromDB._id);
    } else {
      saveDB = repository.fullname.save;
    }

    await saveDB({
      user_id: userFromDB._id,
      firstName,
      lastName,
      updated_at: new Date().toISOString(),
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);
    logger.info('Getting the next endpoint to full-name', orderEndpoint.order[getNextIndexEndpoint]);

    return onSuccess({
      data: {
        success: true,
        'next-end-point': orderEndpoint.order[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on Fullname Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.birthdate = async ({
  payload,
  repository,
  getNextEndpoint,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating birthdate with', payload.birthdate);

    const [userFromDB] = await repository.user.find({ token: payload.token });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    logger.info('The current event of endpoints sequence is', userFromDB.orderEndpoint);

    const [orderEndpoint] = await repository.orderEndpoint.find({ event: userFromDB.orderEndpoint });

    if (!orderEndpoint) {
      throw {
        message: `Ops, there is no endpoint sequence for the user ${userFromDB.email}`,
        statusCode: 400,
      };
    }

    logger.info('The current sequence of Endpoint is', orderEndpoint.order);

    const birthdateFromDB = await repository.birthdate.find({ user_id: userFromDB._id });

    let saveDB = {};

    const userAlreadyHasbirthdate = birthdateFromDB.find(birthdateDB => (birthdateDB.birthdate == payload.birthdate));

    if (userAlreadyHasbirthdate) {
      saveDB = repository.birthdate.update(birthdateFromDB._id);
    } else {
      saveDB = repository.birthdate.save;
    }

    await saveDB({
      user_id: userFromDB._id,
      birthdate: payload.birthdate,
      updated_at: new Date().toISOString(),
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);
    logger.info('Getting the next endpoint to birth-date', orderEndpoint.order[getNextIndexEndpoint]);

    return onSuccess({
      data: {
        success: true,
        'next-end-point': orderEndpoint.order[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on Birthdate Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.phonenumber = async ({
  payload,
  repository,
  getNextEndpoint,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating phonenumber with', payload.phonenumber);

    const [userFromDB] = await repository.user.find({ token: payload.token });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    logger.info('The current event of endpoints sequence is', userFromDB.orderEndpoint);

    const [orderEndpoint] = await repository.orderEndpoint.find({ event: userFromDB.orderEndpoint });

    if (!orderEndpoint) {
      throw {
        message: `Ops, there is no endpoint sequence for the user ${userFromDB.email}`,
        statusCode: 400,
      };
    }

    logger.info('The current sequence of Endpoint is', orderEndpoint.order);

    const phonenumberFromDB = await repository.phonenumber.find({ user_id: userFromDB._id });

    let saveDB = {};

    const userAlreadyHasPhone = phonenumberFromDB.find(phone => (phone.phonenumber == payload.phonenumber));

    if (userAlreadyHasPhone) {
      saveDB = repository.phonenumber.update(userAlreadyHasPhone._id);
    } else {
      saveDB = repository.phonenumber.save;
    }

    await saveDB({
      user_id: userFromDB._id,
      phonenumber: payload.phonenumber,
      updated_at: new Date().toISOString(),
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);
    logger.info('Getting the next endpoint to phone-number', orderEndpoint.order[getNextIndexEndpoint]);

    return onSuccess({
      data: {
        success: true,
        'next-end-point': orderEndpoint.order[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on PhoneNumber Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.address = async ({
  payload,
  repository,
  getAddress,
  getNextEndpoint,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating address with the CEP ', payload.cep);

    const [userFromDB] = await repository.user.find({ token: payload.token });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    logger.info('The current event of endpoints sequence is', userFromDB.orderEndpoint);

    const [orderEndpoint] = await repository.orderEndpoint.find({ event: userFromDB.orderEndpoint });

    if (!orderEndpoint) {
      throw {
        message: `Ops, there is no endpoint sequence for the user ${userFromDB.email}`,
        statusCode: 400,
      };
    }

    logger.info('The current sequence of Endpoint is', orderEndpoint.order);

    const addressFromDB = await repository.address.find({ user_id: userFromDB._id });

    let saveDB = {};

    const userAlreadyHasAddress = addressFromDB.find(addressDB =>
      (addressDB.cep == payload.cep && addressDB.number == payload.number));

    if (userAlreadyHasAddress) {
      saveDB = repository.address.update(userAlreadyHasAddress._id);
    } else {
      saveDB = repository.address.save;
    }

    const fullAddress = await getAddress(payload.cep);

    await saveDB({
      user_id: userFromDB._id,
      cep: payload.cep,
      street: payload.street == fullAddress.address ? payload.street : fullAddress.address,
      number: payload.number,
      complement: payload.complement,
      city: payload.city,
      state: payload.state,
      updated_at: new Date().toISOString(),
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);
    logger.info('Getting the next endpoint to address', orderEndpoint.order[getNextIndexEndpoint]);

    return onSuccess({
      data: {
        success: true,
        'next-end-point': orderEndpoint.order[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on Address Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};

exports.amountRequested = async ({
  payload,
  repository,
  getNextEndpoint,
  logger,
  onSuccess,
  onError,
}) => {
  try {
    logger.info('Creating amountRequested with', payload.amount);

    const [userFromDB] = await repository.user.find({ token: payload.token });

    if (!userFromDB) {
      throw {
        message: 'User does not exist',
        statusCode: 400,
      };
    }

    logger.info('The current event of endpoints sequence is', userFromDB.orderEndpoint);

    const [orderEndpoint] = await repository.orderEndpoint.find({ event: userFromDB.orderEndpoint });

    if (!orderEndpoint) {
      throw {
        message: `Ops, there is no endpoint sequence for the user ${userFromDB.email}`,
        statusCode: 400,
      };
    }

    logger.info('The current sequence of Endpoint is', orderEndpoint.order);

    await repository.amountRequested.save({
      user_id: userFromDB._id,
      amountRequested: payload.amount,
      updated_at: new Date().toISOString(),
    });

    const getNextIndexEndpoint = getNextEndpoint(orderEndpoint);
    logger.info('Getting the next endpoint to amount-requested', orderEndpoint.order[getNextIndexEndpoint]);

    return onSuccess({
      data: {
        success: true,
        'next-end-point': orderEndpoint.order[getNextIndexEndpoint],
      },
      statusCode: 201,
    });
  } catch (error) {
    logger.error(`There is an error on AmountRequested Adapter ${JSON.stringify(error)}`);
    return onError(error);
  }
};
