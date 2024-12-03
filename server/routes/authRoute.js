const express = require('express');
const authController = require('../controllers/authController');
const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
    destination: function ( req, file, cb) {
        cb(null, 'media/users/');
    },
    filename:  function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create multer instance
const upload = multer({ storage: storage });

router.post('/login', authController.login);
router.post('/newuser/add', upload.single('image'), authController.signUp);
router.get('/details', authController.fetchToken);
router.post('/logout', authController.logout);


module.exports = router;