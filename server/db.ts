import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Asset, PortfolioItem, AssetNews } from '../src/actions';

const DB_PATH = path.resolve(process.cwd(), 'homonobus.db');

export interface DbStatus {
  connected: boolean;
  type: 'sqlite' | 'supabase';
  pathOrUrl: string;
  totalAssets: number;
  totalPortfolioItems: number;
}

export interface UserWallet {
  user_id: string;
  cash_balance: number;
  currency: string;
  updated_at: string;
}

export interface BrokerOrder {
  id: string;
  user_id: string;
  isin: string;
  ticker: string;
  name: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  total_amount: number;
  fees: number;
  order_type: 'MARKET' | 'LIMIT';
  status: 'EXECUTED' | 'CANCELLED';
  created_at: string;
}

class DatabaseManager {
  private sqliteDb: DatabaseSync | null = null;
  private supabase: SupabaseClient | null = null;
  private dbType: 'sqlite' | 'supabase' = 'sqlite';

  constructor() {
    this.init();
  }

  private init() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey && !supabaseUrl.includes('MY_SUPABASE')) {
      try {
        this.supabase = createClient(supabaseUrl, supabaseKey);
        this.dbType = 'supabase';
        console.log(`[DB] Connecté à Supabase Cloud Database (${supabaseUrl})`);
      } catch (err) {
        console.warn(`[DB] Échec de connexion Supabase, repli sur SQLite:`, err);
        this.initSqlite();
      }
    } else {
      this.initSqlite();
    }
  }

  private initSqlite() {
    try {
      this.sqliteDb = new DatabaseSync(DB_PATH);
      this.dbType = 'sqlite';
      console.log(`[DB] Base de données SQLite persistante initialisée : ${DB_PATH}`);

      this.sqliteDb.exec(`
        CREATE TABLE IF NOT EXISTS assets_dictionary (
          isin TEXT PRIMARY KEY,
          ticker TEXT NOT NULL,
          name TEXT NOT NULL,
          asset_type TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'compatible',
          current_price REAL NOT NULL,
          currency TEXT NOT NULL DEFAULT 'EUR',
          change_percent_1d REAL NOT NULL DEFAULT 0.0,
          exchange_name TEXT NOT NULL DEFAULT '',
          dse_score INTEGER NOT NULL DEFAULT 75,
          laudato_si_alignment TEXT NOT NULL DEFAULT 'Conforme',
          bioethics_compliant INTEGER NOT NULL DEFAULT 1,
          human_dignity_score INTEGER NOT NULL DEFAULT 75,
          weapons_excluded INTEGER NOT NULL DEFAULT 1,
          vices_excluded INTEGER NOT NULL DEFAULT 1,
          carbon_intensity_tco2e REAL NOT NULL DEFAULT 50.0,
          full_data TEXT NOT NULL,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_assets_ticker ON assets_dictionary(ticker);
        CREATE INDEX IF NOT EXISTS idx_assets_name ON assets_dictionary(name);

        CREATE TABLE IF NOT EXISTS user_portfolios (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          isin TEXT NOT NULL,
          quantity REAL NOT NULL DEFAULT 1.0,
          average_entry_price REAL,
          added_at TEXT NOT NULL,
          UNIQUE(user_id, isin)
        );

        CREATE TABLE IF NOT EXISTS asset_news (
          id TEXT PRIMARY KEY,
          isin TEXT,
          title TEXT NOT NULL,
          summary TEXT NOT NULL,
          source_name TEXT NOT NULL,
          published_at TEXT NOT NULL,
          news_url TEXT NOT NULL,
          sentiment TEXT NOT NULL,
          category TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS user_wallets (
          user_id TEXT PRIMARY KEY,
          cash_balance REAL NOT NULL DEFAULT 15000.0,
          currency TEXT NOT NULL DEFAULT 'EUR',
          updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS broker_orders (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL,
          isin TEXT NOT NULL,
          ticker TEXT NOT NULL,
          name TEXT NOT NULL,
          side TEXT NOT NULL,
          quantity REAL NOT NULL,
          price REAL NOT NULL,
          total_amount REAL NOT NULL,
          fees REAL NOT NULL DEFAULT 0.0,
          order_type TEXT NOT NULL DEFAULT 'MARKET',
          status TEXT NOT NULL DEFAULT 'EXECUTED',
          created_at TEXT NOT NULL
        );

        CREATE INDEX IF NOT EXISTS idx_orders_user ON broker_orders(user_id);
      `);
    } catch (err) {
      console.error('[DB] Erreur fatale initialisation SQLite:', err);
    }
  }

  // --- ASSETS METHODS ---

  public async saveAsset(asset: Asset): Promise<void> {
    const now = new Date().toISOString();
    const fullDataStr = JSON.stringify(asset);

    if (this.dbType === 'supabase' && this.supabase) {
      try {
        const { error } = await this.supabase.from('assets_dictionary').upsert({
          isin: asset.isin,
          ticker: asset.ticker,
          name: asset.name,
          asset_type: asset.asset_type,
          status: asset.status,
          current_price: asset.current_price,
          currency: asset.currency,
          change_percent_1d: asset.change_1d_pct,
          market_status: 'open',
          exchange_name: asset.market_hours.exchange,
          dse_score: asset.catholic.dse_score,
          laudato_si_alignment: asset.catholic.laudato_si_alignment,
          bioethics_compliant: asset.catholic.bioethics_compliant,
          human_dignity_score: asset.catholic.human_dignity_score,
          weapons_excluded: asset.catholic.weapons_excluded,
          vices_excluded: asset.catholic.vices_excluded,
          carbon_intensity_tco2e: asset.catholic.carbon_intensity_tco2e,
          top_holdings: asset.holdings || [],
          impact_description: asset.impact_description,
          source_url: asset.source_url
        });
        if (error) {
          console.warn('[DB Supabase] Erreur upsert asset, sauvegarde locale SQLite:', error.message);
          this.saveAssetSqlite(asset, fullDataStr, now);
        }
        return;
      } catch (err) {
        console.warn('[DB Supabase] Exception, sauvegarde locale SQLite:', err);
      }
    }

    this.saveAssetSqlite(asset, fullDataStr, now);
  }

  private saveAssetSqlite(asset: Asset, fullDataStr: string, now: string) {
    if (!this.sqliteDb) return;
    try {
      const stmt = this.sqliteDb.prepare(`
        INSERT INTO assets_dictionary (
          isin, ticker, name, asset_type, status, current_price, currency,
          change_percent_1d, exchange_name, dse_score, laudato_si_alignment,
          bioethics_compliant, human_dignity_score, weapons_excluded, vices_excluded,
          carbon_intensity_tco2e, full_data, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?,
          ?, ?, ?, ?
        )
        ON CONFLICT(isin) DO UPDATE SET
          ticker = excluded.ticker,
          name = excluded.name,
          asset_type = excluded.asset_type,
          status = excluded.status,
          current_price = excluded.current_price,
          currency = excluded.currency,
          change_percent_1d = excluded.change_percent_1d,
          exchange_name = excluded.exchange_name,
          dse_score = excluded.dse_score,
          laudato_si_alignment = excluded.laudato_si_alignment,
          bioethics_compliant = excluded.bioethics_compliant,
          human_dignity_score = excluded.human_dignity_score,
          weapons_excluded = excluded.weapons_excluded,
          vices_excluded = excluded.vices_excluded,
          carbon_intensity_tco2e = excluded.carbon_intensity_tco2e,
          full_data = excluded.full_data,
          updated_at = excluded.updated_at
      `);

      stmt.run(
        asset.isin,
        asset.ticker,
        asset.name,
        asset.asset_type,
        asset.status,
        asset.current_price,
        asset.currency,
        asset.change_1d_pct,
        asset.market_hours.exchange || '',
        asset.catholic.dse_score,
        asset.catholic.laudato_si_alignment,
        asset.catholic.bioethics_compliant ? 1 : 0,
        asset.catholic.human_dignity_score,
        asset.catholic.weapons_excluded ? 1 : 0,
        asset.catholic.vices_excluded ? 1 : 0,
        asset.catholic.carbon_intensity_tco2e,
        fullDataStr,
        now,
        now
      );
    } catch (err) {
      console.error('[DB SQLite] Erreur saveAsset:', err);
    }
  }

  public async getAsset(isin: string): Promise<Asset | null> {
    const cleanIsin = isin.trim().toUpperCase();

    if (this.dbType === 'supabase' && this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('assets_dictionary')
          .select('*')
          .eq('isin', cleanIsin)
          .maybeSingle();

        if (!error && data) {
          return this.mapSupabaseRowToAsset(data);
        }
      } catch (err) {
        console.warn('[DB Supabase] Erreur getAsset, test SQLite:', err);
      }
    }

    if (this.sqliteDb) {
      try {
        const row = this.sqliteDb
          .prepare('SELECT full_data FROM assets_dictionary WHERE isin = ?')
          .get(cleanIsin) as { full_data: string } | undefined;

        if (row && row.full_data) {
          return JSON.parse(row.full_data) as Asset;
        }
      } catch (err) {
        console.error('[DB SQLite] Erreur getAsset:', err);
      }
    }

    return null;
  }

  public async searchAssetsInDb(query: string, limit: number = 10): Promise<Asset[]> {
    const q = `%${query.trim().toLowerCase()}%`;
    const results: Asset[] = [];

    if (this.sqliteDb) {
      try {
        const rows = this.sqliteDb
          .prepare(`
            SELECT full_data FROM assets_dictionary 
            WHERE LOWER(isin) LIKE ? OR LOWER(ticker) LIKE ? OR LOWER(name) LIKE ?
            LIMIT ?
          `)
          .all(q, q, q, limit) as { full_data: string }[];

        for (const row of rows) {
          try {
            results.push(JSON.parse(row.full_data));
          } catch {}
        }
      } catch (err) {
        console.error('[DB SQLite] Erreur searchAssetsInDb:', err);
      }
    }

    return results;
  }

  public async countAssets(): Promise<number> {
    if (this.sqliteDb) {
      try {
        const row = this.sqliteDb
          .prepare('SELECT COUNT(*) as count FROM assets_dictionary')
          .get() as { count: number };
        return row ? row.count : 0;
      } catch {
        return 0;
      }
    }
    return 0;
  }

  // --- PORTFOLIO METHODS ---

  public async getUserPortfolio(userId: string = 'default_user'): Promise<PortfolioItem[]> {
    if (this.sqliteDb) {
      try {
        const rows = this.sqliteDb
          .prepare(`
            SELECT p.quantity, p.added_at, p.average_entry_price, a.full_data
            FROM user_portfolios p
            JOIN assets_dictionary a ON p.isin = a.isin
            WHERE p.user_id = ?
            ORDER BY p.added_at DESC
          `)
          .all(userId) as { quantity: number; added_at: string; average_entry_price: number | null; full_data: string }[];

        return rows.map(r => {
          const asset = JSON.parse(r.full_data) as Asset;
          return {
            ...asset,
            added_at: r.added_at,
            quantity: r.quantity,
            total_value: Number((r.quantity * asset.current_price).toFixed(2))
          };
        });
      } catch (err) {
        console.error('[DB SQLite] Erreur getUserPortfolio:', err);
      }
    }
    return [];
  }

  public async addAssetToPortfolio(
    userId: string = 'default_user',
    asset: Asset,
    quantity: number = 10
  ): Promise<PortfolioItem> {
    // 1. Sauvegarder d'abord l'actif en base
    await this.saveAsset(asset);

    const now = new Date().toISOString();
    const id = `ptf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    if (this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`
          INSERT INTO user_portfolios (id, user_id, isin, quantity, average_entry_price, added_at)
          VALUES (?, ?, ?, ?, ?, ?)
          ON CONFLICT(user_id, isin) DO UPDATE SET
            quantity = excluded.quantity,
            average_entry_price = excluded.average_entry_price,
            added_at = excluded.added_at
        `);
        stmt.run(id, userId, asset.isin, quantity, asset.current_price, now);
      } catch (err) {
        console.error('[DB SQLite] Erreur addAssetToPortfolio:', err);
      }
    }

    return {
      ...asset,
      added_at: now,
      quantity,
      total_value: Number((quantity * asset.current_price).toFixed(2))
    };
  }

  public async removeAssetFromPortfolio(userId: string = 'default_user', isin: string): Promise<boolean> {
    const cleanIsin = isin.trim().toUpperCase();
    if (this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare('DELETE FROM user_portfolios WHERE user_id = ? AND isin = ?');
        stmt.run(userId, cleanIsin);
        return true;
      } catch (err) {
        console.error('[DB SQLite] Erreur removeAssetFromPortfolio:', err);
        return false;
      }
    }
    return true;
  }

  // --- BROKER & WALLET METHODS ---

  public async getWallet(userId: string = 'default_user'): Promise<UserWallet> {
    const now = new Date().toISOString();
    if (this.sqliteDb) {
      try {
        let row = this.sqliteDb.prepare('SELECT * FROM user_wallets WHERE user_id = ?').get(userId) as any;
        if (!row) {
          const stmt = this.sqliteDb.prepare(`
            INSERT INTO user_wallets (user_id, cash_balance, currency, updated_at)
            VALUES (?, ?, ?, ?)
          `);
          stmt.run(userId, 15000.0, 'EUR', now);
          row = { user_id: userId, cash_balance: 15000.0, currency: 'EUR', updated_at: now };
        }
        return {
          user_id: row.user_id,
          cash_balance: Number(row.cash_balance),
          currency: row.currency || 'EUR',
          updated_at: row.updated_at
        };
      } catch (err) {
        console.error('[DB SQLite] Erreur getWallet:', err);
      }
    }
    return { user_id: userId, cash_balance: 15000.0, currency: 'EUR', updated_at: now };
  }

  public async depositCash(userId: string = 'default_user', amount: number): Promise<UserWallet> {
    const wallet = await this.getWallet(userId);
    const newBalance = Number((wallet.cash_balance + Math.abs(amount)).toFixed(2));
    const now = new Date().toISOString();

    if (this.sqliteDb) {
      try {
        const stmt = this.sqliteDb.prepare(`
          UPDATE user_wallets SET cash_balance = ?, updated_at = ? WHERE user_id = ?
        `);
        stmt.run(newBalance, now, userId);
      } catch (err) {
        console.error('[DB SQLite] Erreur depositCash:', err);
      }
    }
    return { ...wallet, cash_balance: newBalance, updated_at: now };
  }

  public async executeBrokerOrder(
    userId: string = 'default_user',
    isin: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    orderType: 'MARKET' | 'LIMIT' = 'MARKET',
    limitPrice?: number
  ): Promise<{ success: boolean; order?: BrokerOrder; wallet?: UserWallet; error?: string }> {
    if (quantity <= 0) {
      return { success: false, error: 'La quantité doit être strictement supérieure à 0.' };
    }

    const cleanIsin = isin.trim().toUpperCase();
    const asset = await this.getAsset(cleanIsin);
    if (!asset) {
      return { success: false, error: `Actif introuvable pour l'ISIN ${cleanIsin}` };
    }

    const price = (orderType === 'LIMIT' && limitPrice && limitPrice > 0) ? limitPrice : asset.current_price;
    const totalAmount = Number((quantity * price).toFixed(2));
    const wallet = await this.getWallet(userId);
    const now = new Date().toISOString();
    const orderId = `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (side === 'BUY') {
      if (wallet.cash_balance < totalAmount) {
        return {
          success: false,
          error: `Solde espèces insuffisant (${wallet.cash_balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € disponible vs ${totalAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € requis). Effectuez un approvisionnement.`
        };
      }

      // Débiter le compte espèces
      const newBalance = Number((wallet.cash_balance - totalAmount).toFixed(2));
      if (this.sqliteDb) {
        this.sqliteDb.prepare('UPDATE user_wallets SET cash_balance = ?, updated_at = ? WHERE user_id = ?')
          .run(newBalance, now, userId);

        // Mettre à jour le portefeuille (position)
        const existing = this.sqliteDb.prepare('SELECT quantity, average_entry_price FROM user_portfolios WHERE user_id = ? AND isin = ?')
          .get(userId, cleanIsin) as { quantity: number; average_entry_price: number } | undefined;

        if (existing) {
          const newQty = existing.quantity + quantity;
          const oldAvg = existing.average_entry_price || price;
          const newAvgPrice = Number(((existing.quantity * oldAvg + totalAmount) / newQty).toFixed(2));
          this.sqliteDb.prepare('UPDATE user_portfolios SET quantity = ?, average_entry_price = ?, added_at = ? WHERE user_id = ? AND isin = ?')
            .run(newQty, newAvgPrice, now, userId, cleanIsin);
        } else {
          const ptfId = `ptf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
          this.sqliteDb.prepare('INSERT INTO user_portfolios (id, user_id, isin, quantity, average_entry_price, added_at) VALUES (?, ?, ?, ?, ?, ?)')
            .run(ptfId, userId, cleanIsin, quantity, price, now);
        }

        // Enregistrer l'ordre exécuté
        const stmtOrder = this.sqliteDb.prepare(`
          INSERT INTO broker_orders (id, user_id, isin, ticker, name, side, quantity, price, total_amount, fees, order_type, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmtOrder.run(orderId, userId, cleanIsin, asset.ticker, asset.name, 'BUY', quantity, price, totalAmount, 0.0, orderType, 'EXECUTED', now);
      }

      const order: BrokerOrder = {
        id: orderId,
        user_id: userId,
        isin: cleanIsin,
        ticker: asset.ticker,
        name: asset.name,
        side: 'BUY',
        quantity,
        price,
        total_amount: totalAmount,
        fees: 0.0,
        order_type: orderType,
        status: 'EXECUTED',
        created_at: now
      };

      return {
        success: true,
        order,
        wallet: { ...wallet, cash_balance: newBalance, updated_at: now }
      };
    } else {
      // VENTE
      let currentHoldingQty = 0;
      if (this.sqliteDb) {
        const row = this.sqliteDb.prepare('SELECT quantity FROM user_portfolios WHERE user_id = ? AND isin = ?')
          .get(userId, cleanIsin) as { quantity: number } | undefined;
        currentHoldingQty = row ? row.quantity : 0;
      }

      if (currentHoldingQty < quantity) {
        return {
          success: false,
          error: `Quantité insuffisante (${currentHoldingQty} titres détenus vs ${quantity} demandés à la vente).`
        };
      }

      const newBalance = Number((wallet.cash_balance + totalAmount).toFixed(2));
      const remainingQty = currentHoldingQty - quantity;

      if (this.sqliteDb) {
        this.sqliteDb.prepare('UPDATE user_wallets SET cash_balance = ?, updated_at = ? WHERE user_id = ?')
          .run(newBalance, now, userId);

        if (remainingQty <= 0) {
          this.sqliteDb.prepare('DELETE FROM user_portfolios WHERE user_id = ? AND isin = ?').run(userId, cleanIsin);
        } else {
          this.sqliteDb.prepare('UPDATE user_portfolios SET quantity = ?, added_at = ? WHERE user_id = ? AND isin = ?')
            .run(remainingQty, now, userId, cleanIsin);
        }

        const stmtOrder = this.sqliteDb.prepare(`
          INSERT INTO broker_orders (id, user_id, isin, ticker, name, side, quantity, price, total_amount, fees, order_type, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmtOrder.run(orderId, userId, cleanIsin, asset.ticker, asset.name, 'SELL', quantity, price, totalAmount, 0.0, orderType, 'EXECUTED', now);
      }

      const order: BrokerOrder = {
        id: orderId,
        user_id: userId,
        isin: cleanIsin,
        ticker: asset.ticker,
        name: asset.name,
        side: 'SELL',
        quantity,
        price,
        total_amount: totalAmount,
        fees: 0.0,
        order_type: orderType,
        status: 'EXECUTED',
        created_at: now
      };

      return {
        success: true,
        order,
        wallet: { ...wallet, cash_balance: newBalance, updated_at: now }
      };
    }
  }

  public async getBrokerOrders(userId: string = 'default_user', limit: number = 50): Promise<BrokerOrder[]> {
    if (this.sqliteDb) {
      try {
        const rows = this.sqliteDb.prepare(`
          SELECT * FROM broker_orders WHERE user_id = ? ORDER BY created_at DESC LIMIT ?
        `).all(userId, limit) as any[];

        return rows.map(r => ({
          id: r.id,
          user_id: r.user_id,
          isin: r.isin,
          ticker: r.ticker,
          name: r.name,
          side: r.side,
          quantity: Number(r.quantity),
          price: Number(r.price),
          total_amount: Number(r.total_amount),
          fees: Number(r.fees || 0),
          order_type: r.order_type || 'MARKET',
          status: r.status || 'EXECUTED',
          created_at: r.created_at
        }));
      } catch (err) {
        console.error('[DB SQLite] Erreur getBrokerOrders:', err);
      }
    }
    return [];
  }

  // --- STATS & HEALTH ---

  public async getDbStatus(): Promise<DbStatus> {
    const totalAssets = await this.countAssets();
    let totalPortfolioItems = 0;

    if (this.sqliteDb) {
      try {
        const row = this.sqliteDb
          .prepare('SELECT COUNT(*) as count FROM user_portfolios')
          .get() as { count: number };
        totalPortfolioItems = row?.count || 0;
      } catch {}
    }

    return {
      connected: true,
      type: this.dbType,
      pathOrUrl: this.dbType === 'supabase' ? (process.env.SUPABASE_URL || 'Supabase') : DB_PATH,
      totalAssets,
      totalPortfolioItems
    };
  }

  private mapSupabaseRowToAsset(row: any): Asset {
    return {
      isin: row.isin,
      ticker: row.ticker,
      name: row.name,
      asset_type: row.asset_type,
      status: row.status,
      current_price: Number(row.current_price),
      currency: row.currency || '€',
      change_1d_pct: Number(row.change_percent_1d || 0),
      change_1d_val: Number((row.current_price * (row.change_percent_1d || 0) / 100).toFixed(2)),
      market_hours: {
        exchange: row.exchange_name || 'Marché International',
        open: row.market_hours_open || '09:00',
        close: row.market_hours_close || '17:30',
        timezone: row.market_timezone || 'Europe/Paris',
        is_open: true,
        next_event: 'Ferme à 17:30'
      },
      returns: {
        '1j': Number(row.return_1d || 0.5),
        '1sem': Number(row.return_1w || 1.2),
        '1m': Number(row.return_1m || 2.5),
        '3m': Number(row.return_3m || 5.8),
        '6m': Number(row.return_6m || 9.4),
        'ytd': Number(row.return_ytd || 7.2),
        '1an': Number(row.return_1y || 14.1)
      },
      risk: {
        sri_level: row.sri_risk_level || 4,
        volatility_pct: Number(row.volatility_1y_pct || 12.0),
        sharpe_ratio: Number(row.sharpe_ratio || 1.2),
        max_drawdown_pct: Number(row.max_drawdown_pct || -8.5),
        beta: Number(row.beta || 1.0)
      },
      catholic: {
        dse_score: row.dse_score || 75,
        laudato_si_alignment: row.laudato_si_alignment || 'Conforme',
        bioethics_compliant: Boolean(row.bioethics_compliant),
        human_dignity_score: row.human_dignity_score || 75,
        weapons_excluded: Boolean(row.weapons_excluded),
        vices_excluded: Boolean(row.vices_excluded),
        episcopal_guidelines: row.episcopal_guidelines || 'Conforme CEF & USCCB',
        carbon_intensity_tco2e: Number(row.carbon_intensity_tco2e || 45.0),
        labels: row.labels || ['Conforme DSE'],
        pillars: {
          bioethics: 80,
          environmental: 75,
          social_solidarity: 80,
          governance: 78
        }
      },
      holdings: row.top_holdings || [],
      key_info: {
        aum: `${row.aum_millions || 150} M€`,
        ter_pct: Number(row.expense_ratio_ter_pct || 0),
        domicile: row.fund_domicile || row.isin.slice(0, 2),
        inception: row.inception_date || '2015-01-01',
        distribution: row.distribution_policy || 'Partage',
        benchmark: 'Indice de Référence Éthique',
        dividend_yield_pct: Number(row.dividend_yield_pct || 2.5),
        payment_frequency: row.payment_frequency || 'Annuelle',
        payout_ratio_pct: Number(row.payout_ratio_pct || 40),
        catholic_income_note: row.catholic_income_note || 'Dividendes audités selon la Doctrine Sociale de l\'Église.'
      },
      dividend_history: [
        { year: 2024, payout: Number((row.current_price * 0.024).toFixed(2)), growth_pct: 4.5 },
        { year: 2025, payout: Number((row.current_price * 0.026).toFixed(2)), growth_pct: 5.0 }
      ],
      impact_description: row.impact_description || `Actif certifié et audité dans la base de données.`,
      source_url: row.source_url || 'https://homonobus.catholique.fr',
      chart_data: {} as any
    };
  }
}

export const db = new DatabaseManager();
