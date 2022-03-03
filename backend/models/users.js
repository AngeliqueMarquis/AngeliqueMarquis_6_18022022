/* mongoose import */
const mongoose = require('mongoose');
/* import unique validator */
const uniqueValidator = require('mongoose-unique-validator');

/* schema */
const usersSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

usersSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', usersSchema);