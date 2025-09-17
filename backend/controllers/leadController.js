const Lead = require('../models/Lead');

// Create a new lead for a customer
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead({ ...req.body, customerId: req.params.customerId });
    await lead.save();
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Get all leads for a customer
exports.getLeadsByCustomer = async (req, res) => {
  try {
    const leads = await Lead.find({ customerId: req.params.customerId });
    res.json(leads);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Update a lead by ID
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Delete a lead by ID
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ msg: 'Lead not found' });
    res.json({ msg: 'Lead deleted' });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};
