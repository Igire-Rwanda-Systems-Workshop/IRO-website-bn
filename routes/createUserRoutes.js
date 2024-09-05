const express = require('express');
const router = express.Router();
const { createUser, updateUser, deleteUser, sendByEmail } = require('../controllers/createUserController');

// Create a new user
router.post('/create', createUser);

// Update an existing user
router.put('/update/:id', updateUser);

// Delete a user
router.delete('/delete/:id', deleteUser);
// send email to the user

// router.post('/sendEmail' ,sendByEmail);

module.exports = router;
