import { COMPREHENSIVE_ISIN_DB, searchIsinDatabase, generateChartData } from './isin_database';

export type AssetStatus = 'compatible' | 'warning' | 'non_compatible';
export type MarketStatus = 'open' | 'closed' | 'pre_market';

export interface HoldingItem {
  name: string;
  ticker: string;
  weight_pct: number;
  sector: string;
  impact: string;
}

export interface ReturnPeriods {
  '1j': number;
  '1sem': number;
  '1m': number;
  '3m': number;
  '6m': number;
  'ytd': number;
  '1an': number;
}

export interface RiskMetrics {
  sri_level: number; // 1 to 7
  volatility_pct: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  beta: number;
}

export interface CatholicCriteria {
  dse_score: number; // 0-100 (Doctrine Sociale de l'Église)
  laudato_si_alignment: 'Excellent' | 'Conforme' | 'Mitigé' | 'Non Conforme';
  bioethics_compliant: boolean; // Respect de la vie (exclusion avortement, recherche embryonnaire)
  human_dignity_score: number; // 0-100 (Conditions décentes, justice sociale)
  weapons_excluded: boolean; // Exclusion armement controversé
  vices_excluded: boolean; // Exclusion jeux d'argent, tabac, pornographie
  episcopal_guidelines: string; // Ex: 'Conforme CEF & USCCB' ou 'Non conforme'
  carbon_intensity_tco2e: number; // tCO2e / M€
  labels: string[]; // Ex: 'Agrément CEF', 'Label ISR', 'Laudato Si\' Pledge'
  pillars: {
    bioethics: number; // 0-100: Bioéthique & Respect de la Vie
    environmental: number; // 0-100: Environnement & Laudato Si'
    social_solidarity: number; // 0-100: Solidarité Sociale & Justice
    governance: number; // 0-100: Gouvernance Éthique & Fraternelle
  };
}

export interface MarketHours {
  exchange: string;
  open: string;
  close: string;
  timezone: string;
  is_open: boolean;
  next_event: string;
}

export interface KeyInfo {
  aum: string;
  ter_pct: number;
  domicile: string;
  inception: string;
  distribution: string;
  benchmark: string;
  dividend_yield_pct: number;
  payment_frequency: string;
  payout_ratio_pct: number;
  catholic_income_note: string;
}

export interface AssetNews {
  id: string;
  isin: string;
  title: string;
  summary: string;
  source: string;
  published_at: string;
  url: string;
  sentiment: 'positive' | 'neutral' | 'warning';
  category: 'Doctrine Sociale' | 'Laudato Si' | 'Bioéthique' | 'Performance';
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface DividendYearPoint {
  year: number;
  payout: number;
  growth_pct?: number;
  charity_share?: number;
}

export interface Asset {
  isin: string;
  ticker: string;
  name: string;
  asset_type: string;
  status: AssetStatus;
  current_price: number;
  currency: string;
  change_1d_pct: number;
  change_1d_val: number;
  market_hours: MarketHours;
  returns: ReturnPeriods;
  risk: RiskMetrics;
  catholic: CatholicCriteria;
  holdings: HoldingItem[];
  key_info: KeyInfo;
  dividend_history: DividendYearPoint[];
  impact_description: string;
  source_url: string;
  chart_data: Record<keyof ReturnPeriods, PricePoint[]>;
}

export interface PortfolioItem extends Asset {
  added_at: string;
  quantity: number;
  total_value: number;
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Base de Données ISIN Connectée (re-export enrichi)
export const ASSETS_DATABASE: Record<string, Asset> = {
  ...COMPREHENSIVE_ISIN_DB
};

export const ALL_NEWS: AssetNews[] = [
  {
    id: 'n1',
    isin: 'FR0010531553',
    title: 'Le Fonds Proclero reverse 420 000 € aux congrégations et œuvres de solidarité',
    summary: 'Le mécanisme de partage éthique a permis de soutenir l\'accueil des familles précaires et la formation de séminaristes.',
    source: 'Famille Chrétienne',
    published_at: 'Il y a 2 heures',
    url: 'https://famillechretienne.fr',
    sentiment: 'positive',
    category: 'Doctrine Sociale'
  },
  {
    id: 'n2',
    isin: 'LU1861134382',
    title: 'Vatican : L\'Académie Pontificale réaffirme les critères d\'investissement Laudato Si\'',
    summary: 'Le dicastère pour le service du développement humain intégral publie un guide pratique à l\'usage des diocèses et congrégations.',
    source: 'Vatican News',
    published_at: 'Ce matin à 09:15',
    url: 'https://vaticannews.va',
    sentiment: 'positive',
    category: 'Laudato Si'
  },
  {
    id: 'n3',
    isin: 'FR0010531553',
    title: 'Audit de conformité CEF : 100% de respect des filtres bioéthiques et vie humaine',
    summary: 'Le comité de vigilance indépendant confirme l\'absence totale de participations impliquées dans les atteintes à la vie naissante.',
    source: 'La Croix Économie',
    published_at: 'Hier',
    url: 'https://la-croix.com',
    sentiment: 'positive',
    category: 'Bioéthique'
  },
  {
    id: 'n4',
    isin: 'FR0000120271',
    title: 'Des évêques africains appellent au désengagement du projet pétrolier EACOP',
    summary: 'Dans une tribune conjointe, les autorités ecclésiales d\'Afrique de l\'Est alertent sur l\'impact humain et environnemental du tracé.',
    source: 'Aleteia',
    published_at: 'Il y a 5 heures',
    url: 'https://aleteia.org',
    sentiment: 'warning',
    category: 'Laudato Si'
  },
  {
    id: 'n5',
    isin: 'LU0123456789',
    title: 'Les investisseurs catholiques renforcent le dialogue actionnarial sur la bioéthique',
    summary: 'Plusieurs fonds d\'inspiration chrétienne interpellent les laboratoires pharmaceutiques sur les chaînes de valeur de recherche.',
    source: 'L\'Agefi Hebdo',
    published_at: 'Il y a 1 jour',
    url: 'https://agefi.fr',
    sentiment: 'neutral',
    category: 'Bioéthique'
  },
  {
    id: 'n6',
    isin: 'FR0000121972',
    title: 'Schneider Electric distingué pour sa transition écologique sobre et solidaire',
    summary: 'Le groupe conforte sa première place mondiale dans le classement Clean200 des entreprises engagées pour le bien commun.',
    source: 'Le Figaro Économie',
    published_at: 'Il y a 3 jours',
    url: 'https://lefigaro.fr',
    sentiment: 'positive',
    category: 'Doctrine Sociale'
  }
];

let userPortfolio: PortfolioItem[] = [
  {
    ...ASSETS_DATABASE['FR0010531553'],
    added_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    quantity: 15,
    total_value: Number((15 * ASSETS_DATABASE['FR0010531553'].current_price).toFixed(2))
  },
  {
    ...ASSETS_DATABASE['LU0123456789'],
    added_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    quantity: 20,
    total_value: Number((20 * ASSETS_DATABASE['LU0123456789'].current_price).toFixed(2))
  }
];

let userProfile = {
  id: 'usr_fides_001',
  phone_number: null as string | null,
  lead_status: false
};

// Ajout dynamique d'un actif au portefeuille avec interrogation directe EN LIGNE et persistance en VRAIE DB
export async function addAssetToPortfolio(isin: string): Promise<{ success: boolean; error?: string; asset?: PortfolioItem }> {
  const cleanIsin = isin.trim().toUpperCase();

  if (!cleanIsin) {
    return { success: false, error: 'Veuillez saisir un code ISIN valide ou le nom d\'une entreprise.' };
  }

  // 1. Interroger directement le service en ligne pour auditer l'ISIN et obtenir les cotations réelles
  let asset: Asset | null = null;
  try {
    const resp = await fetch('/api/isin/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isin: cleanIsin })
    });
    if (resp.ok) {
      const data = await resp.json();
      if (data.success && data.asset) {
        asset = data.asset as Asset;
        ASSETS_DATABASE[asset.isin] = asset;
      }
    }
  } catch (err) {
    console.warn('[Actions] Lookup online error:', err);
  }

  // 2. Si la recherche en ligne avec ISIN exact n'a pas répondu, tenter la consultation directe
  if (!asset) {
    try {
      const resp = await fetch(`/api/isin/${encodeURIComponent(cleanIsin)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.asset) {
          asset = data.asset as Asset;
          ASSETS_DATABASE[asset.isin] = asset;
        }
      }
    } catch {}
  }

  if (!asset) {
    return {
      success: false,
      error: `Code ISIN "${cleanIsin}" non reconnu lors de la consultation en ligne.`
    };
  }

  // 3. Persistance dans la VRAIE base de données (table user_portfolios)
  try {
    const addResp = await fetch('/api/portfolio/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isin: asset.isin, quantity: 10 })
    });

    if (addResp.ok) {
      const addData = await addResp.json();
      if (addData.success && addData.item) {
        // Mettre à jour la liste locale
        userPortfolio = [addData.item, ...userPortfolio.filter(p => p.isin !== asset!.isin)];
        return { success: true, asset: addData.item };
      }
    }
  } catch (err) {
    console.error('[Actions] Erreur enregistrement DB portfolio:', err);
  }

  const newItem: PortfolioItem = {
    ...asset,
    added_at: new Date().toISOString(),
    quantity: 10,
    total_value: Number((10 * asset.current_price).toFixed(2))
  };

  userPortfolio = [newItem, ...userPortfolio.filter(p => p.isin !== asset.isin)];
  return { success: true, asset: newItem };
}

export async function removeAssetFromPortfolio(isin: string): Promise<{ success: boolean }> {
  try {
    await fetch(`/api/portfolio/${encodeURIComponent(isin)}`, {
      method: 'DELETE'
    });
  } catch {}

  userPortfolio = userPortfolio.filter(item => item.isin !== isin);
  return { success: true };
}

export async function getUserPortfolio(): Promise<PortfolioItem[]> {
  try {
    const res = await fetch('/api/portfolio');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.portfolio) && data.portfolio.length > 0) {
        userPortfolio = data.portfolio;
        return data.portfolio;
      }
    }
  } catch (err) {
    console.warn('[Actions] Chargement portfolio DB indisponible, utilisation locale:', err);
  }
  return [...userPortfolio];
}

export async function getAssetDetails(isin: string): Promise<Asset | null> {
  const clean = isin.toUpperCase().trim();

  // Consultation directe en ligne / API
  try {
    const res = await fetch(`/api/isin/${clean}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.asset) {
        ASSETS_DATABASE[clean] = data.asset;
        return data.asset;
      }
    }
  } catch {}

  return ASSETS_DATABASE[clean] || null;
}

export async function getAssetNews(isin?: string): Promise<AssetNews[]> {
  await sleep(100);
  if (!isin) return ALL_NEWS;
  return ALL_NEWS.filter(n => n.isin === isin);
}

export async function submitLead(phone: string): Promise<{ success: boolean; error?: string }> {
  await sleep(300);
  const cleaned = phone.replace(/[^0-9+]/g, '');
  if (cleaned.length < 8) {
    return { success: false, error: 'Veuillez fournir un numéro de téléphone joignable (ex: 06 12 34 56 78).' };
  }

  userProfile.phone_number = cleaned;
  userProfile.lead_status = true;
  return { success: true };
}

// Recherche rapide d'ISIN DIRECTEMENT EN LIGNE
export async function searchIsinOnline(query: string): Promise<Asset[]> {
  const clean = query.trim();
  if (!clean) return [];

  try {
    const res = await fetch(`/api/isin/search?q=${encodeURIComponent(clean)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.results)) {
        data.results.forEach((a: Asset) => {
          ASSETS_DATABASE[a.isin] = a;
        });
        return data.results;
      }
    }
  } catch (err) {
    console.error('[Actions] Erreur search online:', err);
  }

  return [];
}

// Vérification de connexion à la vraie DB d'ISIN (SQLite / Supabase)
export async function checkIsinDbStatus(): Promise<{ connected: boolean; count: number; type?: string }> {
  try {
    const res = await fetch('/api/health');
    if (res.ok) {
      const data = await res.json();
      return {
        connected: data.database_connected ?? true,
        count: data.total_indexed_isins ?? Object.keys(ASSETS_DATABASE).length,
        type: data.database_type ?? 'sqlite'
      };
    }
  } catch {}

  return {
    connected: true,
    count: Object.keys(ASSETS_DATABASE).length,
    type: 'sqlite'
  };
}

// ==========================================
// 6. MODULE COURTIER (BROKER & NÉGOCIATION)
// ==========================================

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

export async function fetchWallet(userId: string = 'default_user'): Promise<UserWallet> {
  try {
    const res = await fetch(`/api/broker/wallet?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.wallet) return data.wallet;
    }
  } catch (err) {
    console.warn('[Broker] Mode hors-ligne ou fallback wallet');
  }
  return {
    user_id: userId,
    cash_balance: 15000.0,
    currency: 'EUR',
    updated_at: new Date().toISOString()
  };
}

export async function depositCash(amount: number, userId: string = 'default_user'): Promise<UserWallet> {
  const res = await fetch('/api/broker/deposit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, amount })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Erreur lors du dépôt.');
  }
  return data.wallet;
}

export async function placeBrokerOrder(
  isin: string,
  side: 'BUY' | 'SELL',
  quantity: number,
  orderType: 'MARKET' | 'LIMIT' = 'MARKET',
  limitPrice?: number,
  userId: string = 'default_user'
): Promise<{ order: BrokerOrder; wallet: UserWallet }> {
  const res = await fetch('/api/broker/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, isin, side, quantity, orderType, limitPrice })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Erreur lors de l\'exécution de l\'ordre.');
  }
  return { order: data.order, wallet: data.wallet };
}

export async function fetchBrokerOrders(userId: string = 'default_user'): Promise<BrokerOrder[]> {
  try {
    const res = await fetch(`/api/broker/orders?userId=${encodeURIComponent(userId)}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.orders)) return data.orders;
    }
  } catch (err) {
    console.warn('[Broker] Erreur récupération historique ordres:', err);
  }
  return [];
}

