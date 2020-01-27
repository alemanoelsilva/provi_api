const { connect } = require('../../config/sequelize');

const init = async () => {
  try {
    const connection = await connect();
    if (connection.models.user && connection.models.user.destroy) {
      await connection.models.user.destroy({ where: {} });
    }
    jest.setTimeout(300000);
  } catch (error) {}
};

init();
