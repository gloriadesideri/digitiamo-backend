// Calling the modules
const express = require('express');
const router = express.Router();
const requestController=require('../controllers/requestController')
router.post('/api/HTTP', requestController.createRequest)
router.get('/api/pastRequests',requestController.getRequests)

module.exports = router;
