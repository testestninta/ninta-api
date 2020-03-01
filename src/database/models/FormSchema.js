const { Schema, model } = require('mongoose');

const ConfigSchema = new Schema({
  rpgName: { type: String, required: true },
  rpgDateL: { type: Date, required: true }
});

const FormSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: String,
    default: 'pending'
  },
  config: ConfigSchema
});

module.exports = model('Form', FormSchema);
