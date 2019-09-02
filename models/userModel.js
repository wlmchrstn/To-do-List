const mongoose = require('mongoose');
const uniqueValidator = (require('mongoose-unique-validator'));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    todos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Todo'
    }]
});

userSchema.plugin(uniqueValidator);
var User = mongoose.model('User', userSchema);

User.generateHash = function(data) {
    let salt = 10
    return bcrypt.hashSync(data, salt)
}

module.exports = User
