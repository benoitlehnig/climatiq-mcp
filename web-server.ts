// web-server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';
import { ClimatiqService } from './src/services/ClimatiqService.js'; // Votre service existant
import { SearchEmissionFactorsArgs, CalculateEmissionsArgs } from './src/types/index.js';

const app = express();
const PORT = process.env.PORT || 8080; // Port requis par Hugging Face

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Pour servir les fichiers statiques

// Initialiser votre service Climatiq existant
const climatiqService = new ClimatiqService(process.env.CLIMATIQ_API_KEY || '');

// Routes API - Réutilisent votre code MCP existant
app.post('/api/search-emission-factors', async (req, res) => {
  try {
    const args: SearchEmissionFactorsArgs = req.body;
    const result = await climatiqService.searchEmissionFactors(args);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/calculate-emissions', async (req, res) => {
  try {
    const args: CalculateEmissionsArgs = req.body;
    const result = await climatiqService.calculateEmissions(args);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

// Route pour servir l'interface web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`🚀 Climatiq MCP Interface running on port ${PORT}`);
  console.log(`🌍 Hugging Face Space: https://huggingface.co/spaces/YOUR_USERNAME/climatiq-mcp`);
});

export default app;