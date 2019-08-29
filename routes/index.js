const router = require('express').Router();
const userRouter = require('.//userRouter.js');
const todoRouter = require('./todoRouter.js');

router.use('/user', userRouter);
router.use('/user/todo', todoRouter);

module.exports = router;
