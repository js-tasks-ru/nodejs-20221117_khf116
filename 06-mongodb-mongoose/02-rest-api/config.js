module.exports = {
  mongodb: {
    uri: (process.env.NODE_ENV === 'test') ?
      'mongodb://127.0.0.1:27017/6-module-2-task' :
      'mongodb://127.0.0.1:27017/any-shop',
  },
};
