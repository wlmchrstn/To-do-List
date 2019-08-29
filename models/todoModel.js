const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const toDoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    dueDate: String,
    body: String,
    users: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

toDoSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Todo', toDoSchema);
