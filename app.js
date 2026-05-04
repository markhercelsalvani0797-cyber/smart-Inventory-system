const express = require('express');
const app = express();

app.use(express.json());

let inventory = [];

// Get all inventory items
app.get('/inventory', (req, res) => {
  res.json(inventory);
});

// Add a new item to inventory
app.post('/inventory', (req, res) => {
  const { name, quantity, price } = req.body;
  if (!name || !quantity || !price) {
    return res.status(400).json({ error: 'Name, quantity, and price are required' });
  }
  const newItem = { id: inventory.length + 1, name, quantity: parseInt(quantity), price: parseFloat(price) };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// Update an item in inventory
app.put('/inventory/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, quantity, price } = req.body;
  const item = inventory.find(i => i.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  if (name) item.name = name;
  if (quantity) item.quantity = parseInt(quantity);
  if (price) item.price = parseFloat(price);
  res.json(item);
});

// Delete an item from inventory
app.delete('/inventory/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = inventory.findIndex(i => i.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  inventory.splice(index, 1);
  res.status(204).send();
});

// Get low stock items (smart feature: alert for items with quantity < 10)
app.get('/inventory/low-stock', (req, res) => {
  const lowStock = inventory.filter(item => item.quantity < 10);
  res.json(lowStock);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Smart Inventory System running on port ${PORT}`);
});