const user = require('../models/userModel.js');
const userValidator = require('../helper/validator.js');
const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require('jsonwebtoken');
const { success, error } = require('../helper/resFormatter.js');

module.exports = {

    async create(req, res) {
        
        let userUsername = await user.findOne({ username: req.body.username})
        if (userUsername) return res.status(400).send(`${req.body.username} is already taken!`)
        
        let userEmail = await user.findOne({ email: req.body.email })
        if (userEmail) return res.status(400).send(`${req.body.email} is already registered!`)
        
        let pwd = req.body.password
        bcrypt.hash(pwd, salt)
        .then(hash => {
            user.create({
                username: req.body.username,
                email: req.body.email,
                password: hash
            })
            .then(result => {
                res.status(201).json( success({id: result._id, username: result.username}, 'User created!') )
            })
            .catch(err => {
                res.status(422).json( error(err, 'Failed to create user!') )
            })
        })
        .catch(err => {
            res.status(422).json( error(err, 'Unexpected error!') )
        });
    },

    login(req, res) {
        user.findOne({ username: req.body.username })
        .then(data => {
            let pwd = req.body.password;
            let hash = data.password;
            bcrypt.compare(pwd, hash)
            .then(result => {
                if (result == true) {
                    let token = jwt.sign({_id: data._id}, process.env.DBLOGIN);
                    res.status(200).json( success(token, 'Token created, access granted!') );
                }
                else {
                    res.status(422).json( error(err, 'Incorrect password!') )
                }
            })
        })
        .catch(err => {
            res.status(422).json( error(err, "User not found!") )
        });
    },

    show(req, res) {
        user.findById(req.user)
        .then(result => {
            return res.status(200).json( success({id: result._id, username: result.username, todo: result.todos}, "This is ur details information!") );
        })
        .catch(err => {
            return res.status(422).json( error(err,'User is not found!') );
        });
    },
    update(req, res) {
        user.findByIdAndUpdate(req.user, req.body)
        .then(result => {
            return res.status(200).json( success(result, 'User updated!') );
        })
        .catch(err => {
            return res.status(422).json( error(err, 'Failed to update user!') );
        });
    },

    delete(req, res) {
        user.findByIdAndDelete(req.user)
        .then(result => {
            return res.status(200).json( success(result, 'User deleted!') );
        })
        .catch(err => {
            return res.status(422).json( error(err, 'User not found!') );
        });
    }
}
