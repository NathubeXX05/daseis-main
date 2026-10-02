export interface PriceAlert {
  id: string;
  isin: string;
  assetName: string;
  ticker: string;
  targetPrice: number;
  direction: 'above' | 'below'; // 'above' = ≥ target, 'below' = ≤ target
  currency: string;
  currentPriceAtCreation: number;
  createdAt: string;
  triggered: boolean;
  triggeredAt?: string;
  note?: string;
}
