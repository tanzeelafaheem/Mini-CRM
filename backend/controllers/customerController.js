const Customer = require('../models/Customer');

// Add new customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const customer = new Customer({
      name,
      email,
      phone,
      company,
      ownerId: req.user
    });
    await customer.save();
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getCustomers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { ownerId: req.user };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await Customer.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Customer.countDocuments(query);

    res.json({ customers, total });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, ownerId: req.user });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update customer
exports.updateCustomer = async (req, res) => {
  try {
    const { name, email, phone, company } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user },
      { name, email, phone, company },
      { new: true }
    );
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({ _id: req.params.id, ownerId: req.user });
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });
    res.json({ msg: 'Customer deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
