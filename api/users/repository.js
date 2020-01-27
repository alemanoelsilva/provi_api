module.exports = ({ db, collectionName, uuid }) => ({

  save: data => db.collection(collectionName)
    .insertOne({ _id: uuid(), ...data })
    .then(result => result.ops[0]),

  find: data => db.collection(collectionName)
    .findOne(data),

  update: id => model.update({
    updatedAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }, { where: { id } }),

});
