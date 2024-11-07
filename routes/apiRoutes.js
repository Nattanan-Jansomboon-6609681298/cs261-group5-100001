const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Route for creating a new request
router.post('/requests', requestController.createRequest);

module.exports = router;