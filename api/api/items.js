     // api/items.js
     import mongoose from 'mongoose';

     const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://aloysiusaji02_db_user:BdJRVCyHFxBObrDF@cluster0.qqa9imh.mongodb.net/klontong?appName=Cluster0';

     // Schema
     const itemSchema = new mongoose.Schema({ name: String, price: Number });
     const Item = mongoose.model('Item', itemSchema);

     export default async (req, res) => {
       // CORS headers
       res.setHeader('Access-Control-Allow-Origin', '*');
       res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
       res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

       if (req.method === 'OPTIONS') return res.status(200).end();

       try {
         await mongoose.connect(mongoURI);  // Connect per request

         if (req.method === 'GET') {
           if (req.query.q) {  // Search
             const items = await Item.find({ name: { $regex: req.query.q, $options: 'i' } });
             return res.status(200).json(items);
           }
           const items = await Item.find();
           return res.status(200).json(items);
         } else if (req.method === 'POST') {
           const item = new Item(req.body);
           await item.save();
           return res.status(201).json(item);
         } else if (req.method === 'PUT') {
           const item = await Item.findByIdAndUpdate(req.query.id, req.body, { new: true });
           return res.status(200).json(item);
         } else if (req.method === 'DELETE') {
           await Item.findByIdAndDelete(req.query.id);
           return res.status(200).json({ message: 'Deleted' });
         }
       } catch (err) {
         return res.status(500).json({ error: err.message });
       }
     };
     