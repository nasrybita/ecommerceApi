const express = require('express');
const getUsers = require('./../controllers/userController');
const authMiddleware = require('../helpers/authMiddleware');

const router = express.Router();

router.get('/', getUsers.getUsers); //protected globally
router.post('/', getUsers.postUsers); //protected globally
router.get('/:id', getUsers.getUserById); //protected globally
router.post('/login', getUsers.login);
router.get('/get/count', getUsers.getUserCount);
router.delete('/:id', getUsers.deleteUserById);
router.put('/:id', getUsers.updateUserById); 

module.exports = router;