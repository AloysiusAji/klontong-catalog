app.use(cors({ origin: 'https://klontong-catalog.vercel.app' }));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
// Melayani file statis (HTML, CSS, JS) dari folder root
app.use(express.static('.'));

// Koneksi ke MongoDB Atlas (ganti dengan connection string Anda)
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://aloysiusaji02_db_user:BdJRVCyHFxBObrDF@cluster0.qqa9imh.mongodb.net/klontong?appName=Cluster0';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Schema untuk item (barang)
const itemSchema = new mongoose.Schema({
  name: String,
  price: Number
});
const Item = mongoose.model('Item', itemSchema);

// API Routes (CRUD)
// Get all items
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// Add new item
app.post('/api/items', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.json(newItem);
});

// Update item
app.put('/api/items/:id', async (req, res) => {
  const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedItem);
});

// Delete item
app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

// Search items
app.get('/api/items/search', async (req, res) => {
  const query = req.query.q;
  const items = await Item.find({ name: { $regex: query, $options: 'i' } });
  res.json(items);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});