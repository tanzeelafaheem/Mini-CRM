const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/user', require('./routes/user'));

app.use('/api/customers', require('./routes/customer'));

app.use('/api/leads', require('./routes/lead'));


app.get('/', (req, res) => {
  res.send('Mini-CRM API is running...');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
