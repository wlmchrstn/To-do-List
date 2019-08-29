const router = require('express').Router();
const todoRouter = require('../controllers/todoController.js');
const auth = require('../helper/auth.js');

router.post('/create', auth, todoRouter.createUserTodo);
router.get('/show/:id', auth, todoRouter.getUserTodo);
router.get('/show', auth, todoRouter.getAllUserTodo);
router.put('/update/:id', auth, todoRouter.updateUserTodo);
router.delete('/delete/:id', auth, todoRouter.deleteUserTodo);

module.exports = router;
