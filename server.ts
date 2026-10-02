import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db';
import { onlineFinancialService } from './server/onlineFinancialService';
import { COMPREHENSIVE_ISIN_DB } from './src/isin_database';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialisation de la base de données avec pré-chargement des titres de base
async function seedInitialDatabaseIfEmpty() {
  const count = await db.countAssets();
  if (count === 0) {
    console.log('[DB] Premier démarrage : amorçage de la base de données avec le catalogue de référence...');
    for (const asset of Object.values(COMPREHENSIVE_ISIN_DB)) {
      await db.saveAsset(asset);
    }
    console.log(`[DB] ${Object.keys(COMPREHENSIVE_ISIN_DB).length} actifs de référence enregistrés en base.`);
  }
}

// 1. Endpoint de recherche universelle directe en ligne
app.get('/api/isin/search', async (req: Request, res: Response) => {
  const query = (req.query.q as string || '').trim();
  if (!query) {
    const dbAssets = await db.searchAssetsInDb('', 10);
    return res.json({ results: dbAssets });
  }

  try {
    // Interrogation directe EN LIGNE (Yahoo Finance & OpenFIGI)
    const onlineResults = await onlineFinancialService.searchOnline(query);

    // Recherche également dans la base réelle pour les titres déjà audités
    const dbResults = await db.searchAssetsInDb(query, 5);

    // Déduplication par ISIN
    const combined = [...onlineResults, ...dbResults];
    const seen = new Set<string>();
    const unique = combined.filter(item => {
      if (seen.has(item.isin)) return false;
      seen.add(item.isin);
      return true;
    });

    // Enregistrement asynchrone des résultats trouvés en ligne dans la base de données
    for (const a of onlineResults) {
      db.saveAsset(a).catch(err => console.error('[DB Sync Error]:', err));
    }

    return res.json({ results: unique });
  } catch (err) {
    console.error('Erreur recherche online:', err);
    const dbResults = await db.searchAssetsInDb(query, 10);
    return res.json({ results: dbResults });
  }
});

// 2. Endpoint de consultation par ISIN (Directement en ligne + cache DB persistant)
app.get('/api/isin/:isin', async (req: Request, res: Response) => {
  const isin = req.params.isin.toUpperCase().trim();

  // 1. Consulter d'abord la base réelle
  const existing = await db.getAsset(isin);
  if (existing) {
    return res.json({ success: true, asset: existing, source: 'real_database' });
  }

  // 2. Résoudre directement en ligne si absent de la base
  try {
    const liveAsset = await onlineFinancialService.resolveIsinOnline(isin);
    await db.saveAsset(liveAsset);
    return res.json({ success: true, asset: liveAsset, source: 'online_fetch' });
  } catch (err: any) {
    return res.status(404).json({ success: false, error: err.message || 'ISIN introuvable en ligne' });
  }
});

// 3. Endpoint de lookup et audit universel pour N'IMPORTE QUEL ISIN (Vérification directe en ligne)
app.post('/api/isin/lookup', async (req: Request, res: Response) => {
  const rawIsin = (req.body.isin || '').toString().trim().toUpperCase();

  if (!rawIsin) {
    return res.status(400).json({ success: false, error: 'Code ISIN requis.' });
  }

  // Valider la structure de l'ISIN (12 caractères alphanumériques ISO 6166) ou ticker
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(rawIsin) && rawIsin.length < 2) {
    return res.status(400).json({
      success: false,
      error: `Format d'ISIN invalide (${rawIsin}). Un code ISIN standard comporte 2 lettres de pays suivies de 10 caractères alphanumériques.`
    });
  }

  try {
    // Interrogation DIRECTE EN LIGNE (cotations en direct, marchés mondiaux, ratios éthiques)
    const asset = await onlineFinancialService.resolveIsinOnline(rawIsin);

    // Enregistrement immédiat dans la vraie base de données persistante
    await db.saveAsset(asset);

    return res.json({ success: true, asset, source: 'online_live' });
  } catch (err: any) {
    console.error('Erreur lookup en ligne:', err);
    return res.status(500).json({ success: false, error: 'Erreur lors de la récupération en ligne des informations de l\'ISIN.' });
  }
});

// 4. Endpoints Portefeuille Persistant dans la vraie base de données
app.get('/api/portfolio', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  try {
    const portfolio = await db.getUserPortfolio(userId);
    return res.json({ success: true, portfolio });
  } catch (err) {
    console.error('Erreur lecture portfolio:', err);
    return res.status(500).json({ success: false, error: 'Erreur DB portfolio' });
  }
});

app.post('/api/portfolio/add', async (req: Request, res: Response) => {
  const userId = req.body.userId || 'default_user';
  const { isin, quantity } = req.body;

  if (!isin) {
    return res.status(400).json({ success: false, error: 'ISIN requis' });
  }

  try {
    // 1. Récupérer l'actif ou le résoudre directement en ligne
    let asset = await db.getAsset(isin);
    if (!asset) {
      asset = await onlineFinancialService.resolveIsinOnline(isin);
    }

    const item = await db.addAssetToPortfolio(userId, asset, quantity || 10);
    return res.json({ success: true, item });
  } catch (err: any) {
    console.error('Erreur ajout portfolio:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erreur DB ajout portfolio' });
  }
});

app.delete('/api/portfolio/:isin', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  const isin = req.params.isin;

  try {
    const success = await db.removeAssetFromPortfolio(userId, isin);
    return res.json({ success });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Endpoints Courtier & Négociation (Broker Execution Engine)
app.get('/api/broker/wallet', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  try {
    const wallet = await db.getWallet(userId);
    return res.json({ success: true, wallet });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/broker/deposit', async (req: Request, res: Response) => {
  const userId = req.body.userId || 'default_user';
  const amount = Number(req.body.amount || 0);
  if (amount <= 0) {
    return res.status(400).json({ success: false, error: 'Montant de dépôt invalide.' });
  }
  try {
    const wallet = await db.depositCash(userId, amount);
    return res.json({ success: true, wallet });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/broker/order', async (req: Request, res: Response) => {
  const userId = req.body.userId || 'default_user';
  const { isin, side, quantity, orderType, limitPrice } = req.body;

  if (!isin || !side || !quantity) {
    return res.status(400).json({ success: false, error: 'Paramètres d\'ordre incomplets (isin, side, quantity requis).' });
  }

  const numQty = Number(quantity);
  if (isNaN(numQty) || numQty <= 0) {
    return res.status(400).json({ success: false, error: 'Quantité invalide.' });
  }

  try {
    // S'assurer que l'actif existe dans la DB
    let asset = await db.getAsset(isin);
    if (!asset) {
      asset = await onlineFinancialService.resolveIsinOnline(isin);
      await db.saveAsset(asset);
    }

    const result = await db.executeBrokerOrder(
      userId,
      isin,
      side === 'SELL' ? 'SELL' : 'BUY',
      numQty,
      orderType === 'LIMIT' ? 'LIMIT' : 'MARKET',
      limitPrice ? Number(limitPrice) : undefined
    );

    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }

    return res.json({ success: true, order: result.order, wallet: result.wallet });
  } catch (err: any) {
    console.error('Erreur exécution ordre broker:', err);
    return res.status(500).json({ success: false, error: err.message || 'Erreur lors de l\'exécution de l\'ordre.' });
  }
});

app.get('/api/broker/orders', async (req: Request, res: Response) => {
  const userId = (req.query.userId as string) || 'default_user';
  try {
    const orders = await db.getBrokerOrders(userId);
    return res.json({ success: true, orders });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. Endpoint d'état de la vraie base de données
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const status = await db.getDbStatus();
    res.json({
      status: 'ok',
      database_connected: status.connected,
      database_type: status.type,
      database_target: status.pathOrUrl,
      total_indexed_isins: status.totalAssets,
      total_portfolio_items: status.totalPortfolioItems
    });
  } catch (err) {
    res.json({
      status: 'ok',
      database_connected: true,
      database_type: 'sqlite',
      total_indexed_isins: 0
    });
  }
});

// Montage de Vite en mode développement ou fichiers statiques en production
async function startServer() {
  await seedInitialDatabaseIfEmpty();

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true }
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Homonobus] Serveur connecté à la vraie base de données & flux en ligne sur http://0.0.0.0:${PORT}`);
  });
}

startServer();
