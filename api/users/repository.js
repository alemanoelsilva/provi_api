module.exports = ({ db, collectionName, uuid }) => ({

  save: data => db.collection(collectionName)
    .insertOne({ _id: uuid(), ...data })
    .then(result => result.ops[0]),

  find: data => db.collection(collectionName)
    .find(data)
    .toArray(),

  update: _id => data => db.collection(collectionName)
    .updateOne({ _id }, { $set: { ...data } }),

});
