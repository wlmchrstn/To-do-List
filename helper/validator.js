const Joi = require('@hapi/joi');

function userValidation(userSchema) {
    const schema = {
        username: Joi.string().alphanum().min(4).max(12).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(userSchema, schema);
}

module.exports =  userValidation;
