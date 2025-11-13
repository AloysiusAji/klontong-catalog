import mongoose from 'mongoose';

const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://aloysiusaji02_db_user:BdJRVCyHFxBObrDF@cluster0.qqa9imh.mongodb.net/klontong?appName=Cluster0';

const itemSchema = new mongoose.Schema({ name: String, price: Number });
const Item = mongoose.models.Item || mongoose.model('Item', itemSchema);

export default async (req, res) => {
  // Izinkan akses dari frontend dengan CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(mongoURI);
    }

    if (req.method === 'GET') {
      if (req.query.q) {
        // Pencarian
        const items = await Item.find({ name: { $regex: req.query.q, $options: 'i' } });
        return res.status(200).json(items);
      }
      // Ambil semua
      const items = await Item.find();
      return res.status(200).json(items);
    }

    else if (req.method === 'POST') {
      const data = req.body;
      if (!data.name || !data.price) {
        return res.status(400).json({ error: 'Nama dan harga wajib diisi' });
      }
      const item = new Item(data);
      await item.save();
      return res.status(201).json(item);
    }

    else if (req.method === 'PUT') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'ID diperlukan untuk update' });

      const updated = await Item.findByIdAndUpdate(id, req.body, { new: true });
      return res.status(200).json(updated);
    }

    else if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'ID diperlukan untuk hapus' });

      await Item.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Data berhasil dihapus' });
    }

    else {
      return res.status(405).json({ error: 'Method tidak diizinkan' });
    }
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
