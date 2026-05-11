const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Section = require('./models/section');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/atelier';
const PORT = parseInt(process.env.PORT, 10) || 3000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const buildSection = (key, name, data) => ({ key, name, data });

const seedDatabase = async () => {
  const exists = await Section.exists({ key: 'hero' });
  if (exists) return;

  const sections = [
    buildSection('hero', 'Hero Section', {
      headline: 'Extraordinary Experiences<br/>',
      subtitle:
        'Award-winning interior design studio crafting timeless, sophisticated environments for discerning clients across residential, commercial, and hospitality sectors.',
      categories: [
        { id: 'bg1', key: 'bg1', label: 'Residential', count: 18 },
        { id: 'bg2', key: 'bg2', label: 'Commercial', count: 12 },
        { id: 'bg3', key: 'bg3', label: 'Hospitality', count: 9 },
        { id: 'bg4', key: 'bg4', label: 'Retail', count: 8 }
      ]
    }),
    buildSection('services', 'Services', {
      items: [
        { id: 'svc1', title: 'Residential Design', description: 'Personalized living environments that reflect your lifestyle.' },
        { id: 'svc2', title: 'Commercial Design', description: 'Productive workspaces that strengthen brand and wellbeing.' },
        { id: 'svc3', title: 'Hospitality Design', description: 'Memorable guest experiences through thoughtful spatial design.' }
      ]
    }),
    buildSection('portfolio', 'Portfolio', {
      items: [
        { id: 'pf1', tag: 'Residential', title: 'Sunlit Loft' },
        { id: 'pf2', tag: 'Commercial', title: 'Wynwood Gallery' },
        { id: 'pf3', tag: 'Architecture', title: 'Courtyard House' }
      ]
    })
  ];

  await Section.insertMany(sections);
  console.log('Seeded initial section data.');
};

app.get('/api/sections', async (req, res) => {
  try {
    const sections = await Section.find().sort('key').lean();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch sections.' });
  }
});

app.get('/api/sections/:key', async (req, res) => {
  try {
    const section = await Section.findOne({ key: req.params.key }).lean();
    if (!section) return res.status(404).json({ error: 'Section not found.' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: 'Unable to fetch section.' });
  }
});

app.post('/api/sections', async (req, res) => {
  try {
    const { key, name, data } = req.body;
    if (!key || !name) return res.status(400).json({ error: 'Key and name are required.' });
    const section = await Section.create({ key, name, data: data || {} });
    res.status(201).json(section);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'Section key already exists.' });
    }
    res.status(500).json({ error: 'Unable to create section.' });
  }
});

app.put('/api/sections/:key', async (req, res) => {
  try {
    const updates = { ...req.body };
    const section = await Section.findOneAndUpdate({ key: req.params.key }, updates, {
      new: true,
      runValidators: true
    });
    if (!section) return res.status(404).json({ error: 'Section not found.' });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update section.' });
  }
});

app.delete('/api/sections/:key', async (req, res) => {
  try {
    const section = await Section.findOneAndDelete({ key: req.params.key });
    if (!section) return res.status(404).json({ error: 'Section not found.' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Unable to delete section.' });
  }
});

app.post('/api/sections/:key/items', async (req, res) => {
  try {
    const item = req.body;
    if (!item) return res.status(400).json({ error: 'Item payload is required.' });

    const section = await Section.findOne({ key: req.params.key });
    if (!section) return res.status(404).json({ error: 'Section not found.' });

    if (!section.data || !Array.isArray(section.data.items)) {
      section.data = section.data || {};
      section.data.items = [];
    }

    const id = new mongoose.Types.ObjectId().toString();
    section.data.items.push({ id, ...item });
    await section.save();

    res.status(201).json({ id, ...item });
  } catch (err) {
    res.status(500).json({ error: 'Unable to add item.' });
  }
});

app.put('/api/sections/:key/items/:itemId', async (req, res) => {
  try {
    const section = await Section.findOne({ key: req.params.key });
    if (!section) return res.status(404).json({ error: 'Section not found.' });
    if (!section.data?.items) return res.status(400).json({ error: 'Section has no items array.' });

    const item = section.data.items.find((it) => it.id === req.params.itemId);
    if (!item) return res.status(404).json({ error: 'Item not found.' });

    Object.assign(item, req.body);
    await section.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Unable to update item.' });
  }
});

app.delete('/api/sections/:key/items/:itemId', async (req, res) => {
  try {
    const section = await Section.findOne({ key: req.params.key });
    if (!section) return res.status(404).json({ error: 'Section not found.' });
    if (!section.data?.items) return res.status(400).json({ error: 'Section has no items array.' });

    section.data.items = section.data.items.filter((it) => it.id !== req.params.itemId);
    await section.save();
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: 'Unable to remove item.' });
  }
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
    process.exit(1);
  });
