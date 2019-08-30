const router = require('express').Router();
const userRouter = require('../controllers/userController.js');
const userAuth = require('../helper/auth.js');

router.post('/create', userRouter.create);
router.post('/login', userRouter.login);
router.get('/show', userAuth, userRouter.show);
router.get('/showall', userRouter.showAll);

module.exports = router;
