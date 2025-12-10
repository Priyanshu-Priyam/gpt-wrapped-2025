import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory store (replace with DB in production)
const dataStore = new Map();

// Endpoint for ChatGPT to POST the analysis
app.post('/api/wrapped', (req, res) => {
  try {
    const data = req.body;
    
    // Validate basic structure
    if (!data.persona || !data.totalPrompts) {
      return res.status(400).json({ error: 'Invalid payload structure' });
    }

    const id = uuidv4();
    dataStore.set(id, data);
    
    console.log(`[POST] Received data for ID: ${id}`);

    // Return the viewer URL
    res.json({
      success: true,
      id: id,
      viewer_url: `http://localhost:5173/?id=${id}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint for the React App to GET the data
app.get('/api/wrapped/:id', (req, res) => {
  const { id } = req.params;
  const data = dataStore.get(id);

  if (!data) {
    return res.status(404).json({ error: 'Wrapped not found' });
  }

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

