import { PriceAlert } from '../types/alerts';
import { Asset } from '../actions';

const STORAGE_KEY = 'homonobus_price_alerts_v1';

// Initial sample alerts so the user immediately sees the feature populated
const DEFAULT_ALERTS: PriceAlert[] = [
  {
    id: 'alt_sample_1',
    isin: 'FR0010531553',
    assetName: 'Proclero Éthique & Partage Euro',
    ticker: 'PROCL',
    targetPrice: 152.00,
    direction: 'above',
    currency: '€',
    currentPriceAtCreation: 148.60,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    triggered: false,
    note: 'Objectif de renforcement pastoral'
  },
  {
    id: 'alt_sample_2',
    isin: 'LU0123456789',
    assetName: 'Nouvelle Stratégie 50 Euro',
    ticker: 'NS50',
    targetPrice: 90.00,
    direction: 'above',
    currency: '€',
    currentPriceAtCreation: 88.20,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    triggered: false,
    note: 'Seuil de sortie & purge vers fonds chrétien'
  }
];

export function loadPriceAlerts(): PriceAlert[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      savePriceAlerts(DEFAULT_ALERTS);
      return DEFAULT_ALERTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_ALERTS;
  } catch {
    return DEFAULT_ALERTS;
  }
}

export function savePriceAlerts(alerts: PriceAlert[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
  } catch (err) {
    console.error('Erreur sauvegarde alertes:', err);
  }
}

export interface CheckAlertsResult {
  updatedAlerts: PriceAlert[];
  newlyTriggered: {
    alert: PriceAlert;
    currentPrice: number;
  }[];
}

export function evaluatePriceAlerts(alerts: PriceAlert[], assets: Asset[]): CheckAlertsResult {
  const assetsMap = new Map<string, Asset>();
  assets.forEach(a => assetsMap.set(a.isin, a));

  const newlyTriggered: { alert: PriceAlert; currentPrice: number }[] = [];

  const updatedAlerts = alerts.map(alert => {
    const asset = assetsMap.get(alert.isin);
    if (!asset) return alert;

    const currentPrice = asset.current_price;
    const isConditionMet =
      alert.direction === 'above'
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;

    // If condition is newly met and alert wasn't already triggered
    if (isConditionMet && !alert.triggered) {
      const triggeredAlert: PriceAlert = {
        ...alert,
        triggered: true,
        triggeredAt: new Date().toISOString()
      };
      newlyTriggered.push({
        alert: triggeredAlert,
        currentPrice
      });
      return triggeredAlert;
    }

    return alert;
  });

  return {
    updatedAlerts,
    newlyTriggered
  };
}
