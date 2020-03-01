const mongoose = require('mongoose');
const FormSchema = require('./models/FormSchema.js');
const Repository = require('./repository/Repository.js');

module.exports = class MongoDB {
  constructor() {
    mongoose.Promise = global.Promise;
    this.mongoose = mongoose;
  }

  connect() {
    return mongoose
      .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(m => {
        this.forms = new Repository(m, FormSchema);
        return this;
      });
  }
};
