const todo = require('../models/todoModel.js');
const user = require('../models/userModel.js');
const { success, error } = require('../helper/resFormatter.js');

module.exports = {
    createUserTodo(req, res) {
        todo.create(req.body)
            .then(result => {
                user.findById(req.user, (err, data) => {
                    if (err) return res.status(404).json( error(err, 'User not found!') )
                    data.todos.push(result)
                    data.save();
                    result.users = req.user
                    result.save( (err, data) => {
                        if (err) res.status(400).json( error(err, 'Failed to save to do list!') )
                        res.status(201).json( success(data, 'To do list created!') )
                    })
                })
            })
            .catch(err => {
                return res.status(422).json( error(err, 'Unexpected error!') )
            });
    },

    getUserTodo(req, res) {
        todo.findById(req.params.id)
            .then(result => {
                return res.status(200).json( success(result, 'This is ur to do list details!') )
            })
            .catch(err => {
                return res.status(404).json( error(err, 'No to do list found!') )
            })
    },

    getAllUserTodo(req, res) {
        user.findById(req.user._id)
        .populate('todos')
        .then(result => {
            return res.status(200).json( success({username: result.username, todo: result.todos}, 'This is ur to do lists!') )
        })
        .catch(err => {
            return res.status(422).json( error(err, 'Unexpected error!') )
        });
    },

    updateUserTodo(req, res) {
        todo.findByIdAndUpdate(req.params.id, req.body)
            .then(result => {
                res.status(200).json( success(result,'To do list updated!') );
            })
            .catch(err => {
                res.status(422).json( error(err, 'Unexpected error!') );
            });
    },

    deleteUserTodo(req, res) {
        todo.findById(req.params.id)
        .populate('users', '_id')
        .exec( (err, data) => {
            todo.findByIdAndDelete(data._id)
                .then(
                    user.updateOne(
                        { _id: req.user._id },
                        { $pullAll: { todos: [req.params.id] } },
                        { safe: true, multi: true })
                        .then(result => {
                            res.status(204).json( success(result, 'To do list deleted!') )
                        })
                        .catch(err => {
                            res.status(422).json( error(err, 'Unexpected error!') )
                        })
                )
                .catch(err => {
                return res.status(404).json( error(err, 'To do list not found!') )
                })
            })
    }
}
