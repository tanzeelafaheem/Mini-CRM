const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');
const auth = require('../middleware/auth');

// Routes
router.post('/:customerId', auth, leadController.createLead);         
router.get('/:customerId', auth, leadController.getLeadsByCustomer); 
router.put('/:id', auth, leadController.updateLead);                 
router.delete('/:id', auth, leadController.deleteLead);             

module.exports = router;
