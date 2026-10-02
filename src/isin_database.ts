import { Asset, PricePoint, ReturnPeriods } from './actions';

export function generateChartData(basePrice: number, returns: ReturnPeriods): Record<keyof ReturnPeriods, PricePoint[]> {
  const periods: (keyof ReturnPeriods)[] = ['1j', '1sem', '1m', '3m', '6m', 'ytd', '1an'];
  const result: Record<string, PricePoint[]> = {};

  const daysMap: Record<keyof ReturnPeriods, number> = {
    '1j': 24,
    '1sem': 7,
    '1m': 30,
    '3m': 90,
    '6m': 180,
    'ytd': 120,
    '1an': 250
  };

  periods.forEach(p => {
    const days = daysMap[p];
    const returnPct = returns[p];
    const startPrice = basePrice / (1 + returnPct / 100);
    const points: PricePoint[] = [];

    for (let i = 0; i < days; i++) {
      const progress = i / (days - 1);
      const noise = (Math.sin(i * 1.5) * 0.015 + (Math.cos(i * 0.7) * 0.01)) * basePrice;
      const trend = startPrice + (basePrice - startPrice) * progress;
      const price = Number((trend + (i === days - 1 ? 0 : noise)).toFixed(2));
      
      let dateLabel = `J-${days - i}`;
      if (p === '1j') dateLabel = `${8 + Math.floor(i / 3)}:${(i % 3) * 20 || '00'}`;
      else if (p === '1sem') dateLabel = `Jour ${i + 1}`;
      else if (p === '1an') dateLabel = `Mois ${Math.floor(i / 21) + 1}`;

      points.push({ date: dateLabel, price });
    }
    result[p] = points;
  });

  return result as Record<keyof ReturnPeriods, PricePoint[]>;
}

// Validation de somme de contrôle ISIN (Norme ISO 6166 / Luhn MOD-10)
export function validateIsinChecksum(isin: string): boolean {
  const clean = isin.trim().toUpperCase();
  if (!/^[A-Z]{2}[A-Z0-9]{9}[0-9]$/.test(clean)) return false;

  let converted = '';
  for (let i = 0; i < clean.length; i++) {
    const code = clean.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      converted += (code - 55).toString();
    } else {
      converted += clean[i];
    }
  }

  let sum = 0;
  let doubleIt = true;
  for (let i = converted.length - 2; i >= 0; i--) {
    let digit = parseInt(converted[i], 10);
    if (doubleIt) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    doubleIt = !doubleIt;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(clean[11], 10);
}

// Base de Données ISIN Enrichie (Fonds Catholiques, CAC 40, Europe, Tech & Monde)
export const COMPREHENSIVE_ISIN_DB: Record<string, Asset> = {
  // --- 1. FONDS CATHOLIQUES & ÉTHIQUES HOMOLOGUÉS ---
  'FR0010531553': {
    isin: 'FR0010531553',
    ticker: 'PROCL',
    name: 'Proclero Éthique & Partage Euro',
    asset_type: 'Fonds d\'Action Catholique (DSE)',
    status: 'compatible',
    current_price: 148.60,
    currency: '€',
    change_1d_pct: 0.88,
    change_1d_val: 1.30,
    market_hours: {
      exchange: 'Euronext Paris',
      open: '09:00',
      close: '17:30',
      timezone: 'Europe/Paris (CET)',
      is_open: true,
      next_event: 'Ferme à 17:30 CET'
    },
    returns: { '1j': 0.88, '1sem': 2.10, '1m': 4.15, '3m': 8.40, '6m': 13.90, 'ytd': 11.20, '1an': 20.80 },
    risk: { sri_level: 4, volatility_pct: 10.80, sharpe_ratio: 1.48, max_drawdown_pct: -9.20, beta: 0.91 },
    catholic: {
      dse_score: 96,
      laudato_si_alignment: 'Excellent',
      bioethics_compliant: true,
      human_dignity_score: 94,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Conforme Conférence des Évêques de France (CEF) & USCCB',
      carbon_intensity_tco2e: 38.5,
      labels: ['Agrément CEF', 'Label ISR Partage', 'Laudato Si\' Pledge'],
      pillars: { bioethics: 98, environmental: 92, social_solidarity: 96, governance: 95 }
    },
    holdings: [
      { name: 'Schneider Electric SE', ticker: 'SU', weight_pct: 5.6, sector: 'Efficacité Énergétique', impact: 'Gestion sobre de l\'énergie' },
      { name: 'Air Liquide SA', ticker: 'AI', weight_pct: 5.1, sector: 'Santé & Gaz Médicaux', impact: 'Préservation de la santé humaine' },
      { name: 'Vestas Wind Systems', ticker: 'VWS', weight_pct: 4.5, sector: 'Énergie Éolienne', impact: 'Sauvegarde de la Création' },
      { name: 'EssilorLuxottica', ticker: 'EL', weight_pct: 4.2, sector: 'Santé Visuelle', impact: 'Accès aux soins pour tous' }
    ],
    key_info: {
      aum: '412.5 M€',
      ter_pct: 0.85,
      domicile: 'France',
      inception: '14/10/2007',
      distribution: 'Partage caritatif (10% des frais reversés aux congrégations)',
      benchmark: 'MSCI Europe Catholic Ethical Index',
      dividend_yield_pct: 3.10,
      payment_frequency: 'Semestrielle (Juin & Décembre)',
      payout_ratio_pct: 48,
      catholic_income_note: 'Modèle de Partage Solidaire : 10% des flux et frais distribués aux congrégations et œuvres caritatives.'
    },
    dividend_history: [
      { year: 2021, payout: 3.40, growth_pct: 4.6, charity_share: 0.34 },
      { year: 2022, payout: 3.65, growth_pct: 7.4, charity_share: 0.37 },
      { year: 2023, payout: 3.90, growth_pct: 6.8, charity_share: 0.39 },
      { year: 2024, payout: 4.20, growth_pct: 7.7, charity_share: 0.42 },
      { year: 2025, payout: 4.60, growth_pct: 9.5, charity_share: 0.46 }
    ],
    impact_description: 'Fonds d\'actions européennes géré en conformité stricte avec la Doctrine Sociale de l\'Église. Filtre rigoureux d\'exclusion bioéthique, zéro armement, zéro pornographie et partage d\'une partie des frais de gestion à des œuvres d\'Église.',
    source_url: 'https://www.proclero.fr',
    chart_data: generateChartData(148.60, { '1j': 0.88, '1sem': 2.10, '1m': 4.15, '3m': 8.40, '6m': 13.90, 'ytd': 11.20, '1an': 20.80 })
  },

  'LU1861134382': {
    isin: 'LU1861134382',
    ticker: 'LAUDA',
    name: 'Laudato Si\' Global Sustainable Equities',
    asset_type: 'Fonds Écologie Intégrale (Vatican Hub)',
    status: 'compatible',
    current_price: 112.40,
    currency: '€',
    change_1d_pct: 0.65,
    change_1d_val: 0.72,
    market_hours: {
      exchange: 'Euronext Paris',
      open: '09:00',
      close: '17:30',
      timezone: 'Europe/Paris (CET)',
      is_open: true,
      next_event: 'Ferme à 17:30 CET'
    },
    returns: { '1j': 0.65, '1sem': 1.85, '1m': 3.40, '3m': 7.10, '6m': 11.50, 'ytd': 9.80, '1an': 18.40 },
    risk: { sri_level: 3, volatility_pct: 8.90, sharpe_ratio: 1.62, max_drawdown_pct: -6.80, beta: 0.82 },
    catholic: {
      dse_score: 94,
      laudato_si_alignment: 'Excellent',
      bioethics_compliant: true,
      human_dignity_score: 92,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Aligné Académie Pontificale & USCCB Guidelines',
      carbon_intensity_tco2e: 41.2,
      labels: ['Laudato Si\' Alliance', 'SFDR Article 9', 'Label Greenfin'],
      pillars: { bioethics: 95, environmental: 98, social_solidarity: 90, governance: 93 }
    },
    holdings: [
      { name: 'Xylem Inc', ticker: 'XYL', weight_pct: 4.8, sector: 'Technologies de l\'Eau', impact: 'Accès universel à l\'eau potable' },
      { name: 'Orsted A/S', ticker: 'ORSTED', weight_pct: 4.4, sector: 'Énergie Propre', impact: 'Décarbonation intégrale' },
      { name: 'Novozymes A/S', ticker: 'NZYM', weight_pct: 4.1, sector: 'Biosolutions Vertes', impact: 'Agriculture régénérative' }
    ],
    key_info: {
      aum: '285.0 M€',
      ter_pct: 0.75,
      domicile: 'Luxembourg',
      inception: '22/05/2018',
      distribution: 'Capitalisation & Partage Pastoral',
      benchmark: 'MSCI World Laudato Si SRI Index',
      dividend_yield_pct: 2.80,
      payment_frequency: 'Annuelle (Mai)',
      payout_ratio_pct: 42,
      catholic_income_note: 'Dividendes stables issus d\'entreprises dédiées à la transition écologique juste et à la protection des plus vulnérables.'
    },
    dividend_history: [
      { year: 2021, payout: 2.40, growth_pct: 6.2, charity_share: 0.24 },
      { year: 2022, payout: 2.60, growth_pct: 8.3, charity_share: 0.26 },
      { year: 2023, payout: 2.80, growth_pct: 7.6, charity_share: 0.28 },
      { year: 2024, payout: 2.95, growth_pct: 5.4, charity_share: 0.30 },
      { year: 2025, payout: 3.15, growth_pct: 6.8, charity_share: 0.32 }
    ],
    impact_description: 'Stratégie inspirée de l\'encyclique papale Laudato si\'. Exclusion stricte des énergies fossiles, des armes, des paradis fiscaux et de toute pratique contraire au respect sacré de la vie.',
    source_url: 'https://www.humandevelopment.va',
    chart_data: generateChartData(112.40, { '1j': 0.65, '1sem': 1.85, '1m': 3.40, '3m': 7.10, '6m': 11.50, 'ytd': 9.80, '1an': 18.40 })
  },

  'FR0010315775': {
    isin: 'FR0010315775',
    ticker: 'ECOFI',
    name: 'Ecofi Agir Pour Le Climat C',
    asset_type: 'Fonds d\'Action Solidaire & Climat (CEF)',
    status: 'compatible',
    current_price: 182.30,
    currency: '€',
    change_1d_pct: 0.45,
    change_1d_val: 0.82,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': 0.45, '1sem': 1.30, '1m': 2.90, '3m': 6.80, '6m': 10.40, 'ytd': 8.50, '1an': 16.20 },
    risk: { sri_level: 4, volatility_pct: 11.20, sharpe_ratio: 1.35, max_drawdown_pct: -8.50, beta: 0.88 },
    catholic: {
      dse_score: 93,
      laudato_si_alignment: 'Excellent',
      bioethics_compliant: true,
      human_dignity_score: 91,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Homologué comités de gestion éthique chrétienne',
      carbon_intensity_tco2e: 45.0,
      labels: ['Label Finansol', 'Label Greenfin', 'ISR Partage'],
      pillars: { bioethics: 94, environmental: 96, social_solidarity: 92, governance: 90 }
    },
    holdings: [
      { name: 'Air Liquide SA', ticker: 'AI', weight_pct: 5.4, sector: 'Transition Énergétique', impact: 'Hydrogène vert et décarbonation' },
      { name: 'Schneider Electric', ticker: 'SU', weight_pct: 4.8, sector: 'Gestion Électrique', impact: 'Économie d\'énergie' }
    ],
    key_info: {
      aum: '340.0 M€',
      ter_pct: 0.90,
      domicile: 'France',
      inception: '12/06/2006',
      distribution: 'Partage associatif solidaire',
      benchmark: 'Euro Stoxx Climate Transition',
      dividend_yield_pct: 2.90,
      payment_frequency: 'Annuelle (Avril)',
      payout_ratio_pct: 45,
      catholic_income_note: 'Fonds pionnier du partage solidaire, reversement annuel garanti.'
    },
    dividend_history: [
      { year: 2023, payout: 4.80, growth_pct: 5.5, charity_share: 0.50 },
      { year: 2024, payout: 5.10, growth_pct: 6.2, charity_share: 0.55 },
      { year: 2025, payout: 5.45, growth_pct: 6.8, charity_share: 0.60 }
    ],
    impact_description: 'Fonds solidaire pionnier en France, alliant décarbonation et solidarité avec reversement d\'une part des frais au Secours Catholique et à Habitat & Humanisme.',
    source_url: 'https://www.ecofi.fr',
    chart_data: generateChartData(182.30, { '1j': 0.45, '1sem': 1.30, '1m': 2.90, '3m': 6.80, '6m': 10.40, 'ytd': 8.50, '1an': 16.20 })
  },

  // --- 2. ACTIONS MAJEURES CAC 40 & EUROPÉENNES AUDITÉES DSE ---
  'FR0000120321': {
    isin: 'FR0000120321',
    ticker: 'OR',
    name: 'L\'Oréal SA',
    asset_type: 'Action Internationale (CAC 40)',
    status: 'compatible',
    current_price: 388.50,
    currency: '€',
    change_1d_pct: 1.15,
    change_1d_val: 4.40,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': 1.15, '1sem': 2.40, '1m': 5.20, '3m': 8.90, '6m': 12.10, 'ytd': 9.40, '1an': 19.50 },
    risk: { sri_level: 3, volatility_pct: 12.50, sharpe_ratio: 1.42, max_drawdown_pct: -8.00, beta: 0.78 },
    catholic: {
      dse_score: 84,
      laudato_si_alignment: 'Conforme',
      bioethics_compliant: true,
      human_dignity_score: 86,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Filtre moral validé (Zéro expérimentation animale, traçabilité éthique)',
      carbon_intensity_tco2e: 28.0,
      labels: ['CDP Triple A (Climat, Forêts, Eau)', 'Label ISR'],
      pillars: { bioethics: 88, environmental: 85, social_solidarity: 82, governance: 81 }
    },
    holdings: [],
    key_info: {
      aum: '208 Mds €',
      ter_pct: 0,
      domicile: 'France',
      inception: '1909',
      distribution: 'Dividende ordinaire + Majoration fidélité (+10%)',
      benchmark: 'CAC 40 / Euro Stoxx 50',
      dividend_yield_pct: 1.85,
      payment_frequency: 'Annuelle (Mai)',
      payout_ratio_pct: 54,
      catholic_income_note: 'Dividende pérenne et croissant depuis plus de 30 ans consécutifs.'
    },
    dividend_history: [
      { year: 2021, payout: 4.80, growth_pct: 20.0 },
      { year: 2022, payout: 6.00, growth_pct: 25.0 },
      { year: 2023, payout: 6.60, growth_pct: 10.0 },
      { year: 2024, payout: 7.00, growth_pct: 6.0 },
      { year: 2025, payout: 7.50, growth_pct: 7.1 }
    ],
    impact_description: 'Leader mondial de la beauté, reconnu pour son programme "L\'Oréal pour le Futur" (neutralité carbone de ses sites, traçabilité des ingrédients naturels, soutien à l\'insertion des femmes vulnérables).',
    source_url: 'https://www.loreal.com',
    chart_data: generateChartData(388.50, { '1j': 1.15, '1sem': 2.40, '1m': 5.20, '3m': 8.90, '6m': 12.10, 'ytd': 9.40, '1an': 19.50 })
  },

  'FR0000121972': {
    isin: 'FR0000121972',
    ticker: 'SU',
    name: 'Schneider Electric SE',
    asset_type: 'Action Industrielle (CAC 40)',
    status: 'compatible',
    current_price: 236.40,
    currency: '€',
    change_1d_pct: 0.95,
    change_1d_val: 2.20,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': 0.95, '1sem': 3.10, '1m': 6.80, '3m': 14.50, '6m': 22.10, 'ytd': 18.20, '1an': 36.40 },
    risk: { sri_level: 4, volatility_pct: 14.10, sharpe_ratio: 1.85, max_drawdown_pct: -9.50, beta: 0.95 },
    catholic: {
      dse_score: 92,
      laudato_si_alignment: 'Excellent',
      bioethics_compliant: true,
      human_dignity_score: 90,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Pilier d\'excellence dans les portefeuilles diocésains et congrégations',
      carbon_intensity_tco2e: 22.5,
      labels: ['Clean200 Leader mondial', 'Label ISR'],
      pillars: { bioethics: 92, environmental: 96, social_solidarity: 90, governance: 90 }
    },
    holdings: [],
    key_info: {
      aum: '132 Mds €',
      ter_pct: 0,
      domicile: 'France',
      inception: '1836',
      distribution: 'Dividende progressif',
      benchmark: 'CAC 40',
      dividend_yield_pct: 2.15,
      payment_frequency: 'Annuelle (Mai)',
      payout_ratio_pct: 46,
      catholic_income_note: 'Dividende en hausse continue, modèle industriel vertueux aligné avec Laudato Si\'.'
    },
    dividend_history: [
      { year: 2021, payout: 2.90, growth_pct: 11.5 },
      { year: 2022, payout: 3.15, growth_pct: 8.6 },
      { year: 2023, payout: 3.50, growth_pct: 11.1 },
      { year: 2024, payout: 3.90, growth_pct: 11.4 },
      { year: 2025, payout: 4.25, growth_pct: 9.0 }
    ],
    impact_description: 'Entreprise de référence pour la transition énergétique mondiale. Ses équipements permettent d\'économiser des dizaines de millions de tonnes de CO2 à travers le monde.',
    source_url: 'https://www.se.com',
    chart_data: generateChartData(236.40, { '1j': 0.95, '1sem': 3.10, '1m': 6.80, '3m': 14.50, '6m': 22.10, 'ytd': 18.20, '1an': 36.40 })
  },

  'FR0000120073': {
    isin: 'FR0000120073',
    ticker: 'AI',
    name: 'Air Liquide SA',
    asset_type: 'Action Industrielle & Santé (CAC 40)',
    status: 'compatible',
    current_price: 172.80,
    currency: '€',
    change_1d_pct: 0.60,
    change_1d_val: 1.05,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': 0.60, '1sem': 1.80, '1m': 3.90, '3m': 7.50, '6m': 11.80, 'ytd': 9.10, '1an': 19.80 },
    risk: { sri_level: 3, volatility_pct: 10.20, sharpe_ratio: 1.55, max_drawdown_pct: -6.50, beta: 0.72 },
    catholic: {
      dse_score: 91,
      laudato_si_alignment: 'Excellent',
      bioethics_compliant: true,
      human_dignity_score: 92,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Action patrimoniale chrétienne de référence (santé hospitalière & hydrogène)',
      carbon_intensity_tco2e: 48.0,
      labels: ['Label ISR', 'Pacte Mondial ONU'],
      pillars: { bioethics: 95, environmental: 88, social_solidarity: 90, governance: 91 }
    },
    holdings: [],
    key_info: {
      aum: '91 Mds €',
      ter_pct: 0,
      domicile: 'France',
      inception: '1902',
      distribution: 'Dividende régulier + Action gratuite (1 pour 10 tous les 2 ans)',
      benchmark: 'CAC 40',
      dividend_yield_pct: 2.25,
      payment_frequency: 'Annuelle (Mai)',
      payout_ratio_pct: 52,
      catholic_income_note: '30 ans d\'augmentation consécutive du dividende. Idéal pour transmission familiale.'
    },
    dividend_history: [
      { year: 2021, payout: 2.90, growth_pct: 5.4 },
      { year: 2022, payout: 3.12, growth_pct: 7.6 },
      { year: 2023, payout: 3.40, growth_pct: 9.0 },
      { year: 2024, payout: 3.70, growth_pct: 8.8 },
      { year: 2025, payout: 4.05, growth_pct: 9.5 }
    ],
    impact_description: 'Leader des gaz industriels et médicaux (fourniture vitale d\'oxygène médical à des millions de patients dans les hôpitaux) et pionnier de l\'hydrogène vert bas carbone.',
    source_url: 'https://www.airliquide.com',
    chart_data: generateChartData(172.80, { '1j': 0.60, '1sem': 1.80, '1m': 3.90, '3m': 7.50, '6m': 11.80, 'ytd': 9.10, '1an': 19.80 })
  },

  'FR0000120578': {
    isin: 'FR0000120578',
    ticker: 'SAN',
    name: 'Sanofi SA',
    asset_type: 'Action Pharmaceutique (CAC 40)',
    status: 'warning',
    current_price: 94.20,
    currency: '€',
    change_1d_pct: -0.30,
    change_1d_val: -0.28,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': -0.30, '1sem': 0.80, '1m': 1.50, '3m': 4.20, '6m': 6.90, 'ytd': 5.10, '1an': 8.40 },
    risk: { sri_level: 3, volatility_pct: 12.00, sharpe_ratio: 0.95, max_drawdown_pct: -11.00, beta: 0.65 },
    catholic: {
      dse_score: 72,
      laudato_si_alignment: 'Conforme',
      bioethics_compliant: false, // Attention bioéthique : veille active sur les chaînes de recherche embryonnaire
      human_dignity_score: 84,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Sous vigilance pastorale (USCCB & CEF : dialogue actionnarial requis)',
      carbon_intensity_tco2e: 32.0,
      labels: ['Label ISR'],
      pillars: { bioethics: 60, environmental: 82, social_solidarity: 78, governance: 68 }
    },
    holdings: [],
    key_info: {
      aum: '118 Mds €',
      ter_pct: 0,
      domicile: 'France',
      inception: '1973',
      distribution: 'Dividende aristocrate (30 ans de hausse)',
      benchmark: 'CAC 40',
      dividend_yield_pct: 4.10,
      payment_frequency: 'Annuelle (Mai)',
      payout_ratio_pct: 58,
      catholic_income_note: 'Dividende élevé et protecteur, mais nécessite vigilance sur les comités d\'éthique biomédicale.'
    },
    dividend_history: [
      { year: 2021, payout: 3.33, growth_pct: 4.1 },
      { year: 2022, payout: 3.56, growth_pct: 6.9 },
      { year: 2023, payout: 3.76, growth_pct: 5.6 },
      { year: 2024, payout: 3.96, growth_pct: 5.3 },
      { year: 2025, payout: 4.18, growth_pct: 5.6 }
    ],
    impact_description: 'Groupe pharmaceutique mondial. Rôle capital dans les vaccins et l\'accès aux traitements dans les pays en développement, mais faisant l\'objet d\'une vigilance des comités épiscopaux concernant les protocoles de bioéthique.',
    source_url: 'https://www.sanofi.com',
    chart_data: generateChartData(94.20, { '1j': -0.30, '1sem': 0.80, '1m': 1.50, '3m': 4.20, '6m': 6.90, 'ytd': 5.10, '1an': 8.40 })
  },

  'FR0000120271': {
    isin: 'FR0000120271',
    ticker: 'TTE',
    name: 'TotalEnergies SE',
    asset_type: 'Action Énergie Fossile (CAC 40)',
    status: 'non_compatible',
    current_price: 58.40,
    currency: '€',
    change_1d_pct: -0.42,
    change_1d_val: -0.25,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': -0.42, '1sem': -1.20, '1m': 0.80, '3m': 2.10, '6m': 4.50, 'ytd': 3.10, '1an': 7.20 },
    risk: { sri_level: 5, volatility_pct: 18.50, sharpe_ratio: 0.65, max_drawdown_pct: -18.20, beta: 1.15 },
    catholic: {
      dse_score: 34,
      laudato_si_alignment: 'Non Conforme',
      bioethics_compliant: true,
      human_dignity_score: 48,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Incompatible avec l\'encyclique Laudato si\' (Appel au désengagement fossile)',
      carbon_intensity_tco2e: 345.0,
      labels: [],
      pillars: { bioethics: 80, environmental: 24, social_solidarity: 55, governance: 50 }
    },
    holdings: [],
    key_info: {
      aum: '142 Mds €',
      ter_pct: 0,
      domicile: 'France',
      inception: '1924',
      distribution: 'Dividende trimestriel',
      benchmark: 'CAC 40',
      dividend_yield_pct: 5.60,
      payment_frequency: 'Trimestrielle',
      payout_ratio_pct: 38,
      catholic_income_note: 'Rendement élevé issu de rentes fossiles en contradiction avec les directives écologiques du Saint-Siège.'
    },
    dividend_history: [
      { year: 2021, payout: 2.64, growth_pct: 0 },
      { year: 2022, payout: 3.81, growth_pct: 44.3 },
      { year: 2023, payout: 3.01, growth_pct: -21.0 },
      { year: 2024, payout: 3.22, growth_pct: 7.0 },
      { year: 2025, payout: 3.45, growth_pct: 7.1 }
    ],
    impact_description: 'Major pétrolière et gazière. Bien qu\'investissant dans l\'électricité renouvelable, la poursuite de projets de forages neufs (ex: EACOP en Afrique de l\'Est) la rend incompatible avec les directives du Vatican sur le désinvestissement fossile.',
    source_url: 'https://www.totalenergies.com',
    chart_data: generateChartData(58.40, { '1j': -0.42, '1sem': -1.20, '1m': 0.80, '3m': 2.10, '6m': 4.50, 'ytd': 3.10, '1an': 7.20 })
  },

  'FR0000121329': {
    isin: 'FR0000121329',
    ticker: 'HO',
    name: 'Thales SA',
    asset_type: 'Action Défense & Sécurité (CAC 40)',
    status: 'non_compatible',
    current_price: 154.20,
    currency: '€',
    change_1d_pct: 1.80,
    change_1d_val: 2.70,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': 1.80, '1sem': 3.40, '1m': 8.10, '3m': 16.50, '6m': 25.40, 'ytd': 21.00, '1an': 42.00 },
    risk: { sri_level: 4, volatility_pct: 16.80, sharpe_ratio: 1.70, max_drawdown_pct: -12.40, beta: 0.85 },
    catholic: {
      dse_score: 28,
      laudato_si_alignment: 'Non Conforme',
      bioethics_compliant: false, // Exclusion armement controversé
      human_dignity_score: 35,
      weapons_excluded: false, // Matériel de guerre & défense
      vices_excluded: true,
      episcopal_guidelines: 'Exclusion formelle : armement incompatible avec la Doctrine Sociale de la Paix',
      carbon_intensity_tco2e: 85.0,
      labels: [],
      pillars: { bioethics: 20, environmental: 45, social_solidarity: 40, governance: 55 }
    },
    holdings: [],
    key_info: {
      aum: '32 Mds €',
      ter_pct: 0,
      domicile: 'France',
      inception: '1893',
      distribution: 'Dividende semestriel',
      benchmark: 'CAC 40',
      dividend_yield_pct: 2.30,
      payment_frequency: 'Semestrielle',
      payout_ratio_pct: 40,
      catholic_income_note: 'Bénéfices provenant en part significative de contrats militaires et systèmes d\'armes, exclus des fonds chrétiens.'
    },
    dividend_history: [
      { year: 2021, payout: 2.56, growth_pct: 45.0 },
      { year: 2022, payout: 2.95, growth_pct: 15.2 },
      { year: 2023, payout: 3.40, growth_pct: 15.3 },
      { year: 2024, payout: 3.85, growth_pct: 13.2 },
      { year: 2025, payout: 4.20, growth_pct: 9.1 }
    ],
    impact_description: 'Groupe d\'électronique de défense et de sécurité aérospatiale. Impliqué dans la production de radars de tir, missiles et systèmes militaires, ce qui entraîne une exclusion stricte selon le critère de la Paix chrétienne.',
    source_url: 'https://www.thalesgroup.com',
    chart_data: generateChartData(154.20, { '1j': 1.80, '1sem': 3.40, '1m': 8.10, '3m': 16.50, '6m': 25.40, 'ytd': 21.00, '1an': 42.00 })
  },

  'US0378331005': {
    isin: 'US0378331005',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    asset_type: 'Action Technologie (NASDAQ / S&P 500)',
    status: 'compatible',
    current_price: 228.50,
    currency: '$',
    change_1d_pct: 0.75,
    change_1d_val: 1.70,
    market_hours: { exchange: 'NASDAQ (New York)', open: '09:30', close: '16:00', timezone: 'America/New_York (EST)', is_open: true, next_event: 'Ferme à 16:00 EST' },
    returns: { '1j': 0.75, '1sem': 2.10, '1m': 4.50, '3m': 12.80, '6m': 19.50, 'ytd': 15.20, '1an': 28.90 },
    risk: { sri_level: 4, volatility_pct: 15.20, sharpe_ratio: 1.60, max_drawdown_pct: -12.50, beta: 1.02 },
    catholic: {
      dse_score: 81,
      laudato_si_alignment: 'Conforme',
      bioethics_compliant: true,
      human_dignity_score: 78,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Conforme USCCB Socially Responsible Investment Guidelines',
      carbon_intensity_tco2e: 18.0,
      labels: ['100% Énergie Renouvelable sur les sites'],
      pillars: { bioethics: 90, environmental: 86, social_solidarity: 74, governance: 82 }
    },
    holdings: [],
    key_info: {
      aum: '3 450 Mds $',
      ter_pct: 0,
      domicile: 'États-Unis',
      inception: '1976',
      distribution: 'Dividende trimestriel + Rachat d\'actions',
      benchmark: 'S&P 500 / Nasdaq 100',
      dividend_yield_pct: 0.55,
      payment_frequency: 'Trimestrielle',
      payout_ratio_pct: 15,
      catholic_income_note: 'Dividende modeste mais sécurité patrimoniale élevée et zéro dette nette.'
    },
    dividend_history: [
      { year: 2021, payout: 0.88, growth_pct: 7.3 },
      { year: 2022, payout: 0.92, growth_pct: 4.5 },
      { year: 2023, payout: 0.96, growth_pct: 4.3 },
      { year: 2024, payout: 1.00, growth_pct: 4.2 },
      { year: 2025, payout: 1.05, growth_pct: 5.0 }
    ],
    impact_description: 'Géant mondial de la technologie grand public. Sites alimentés à 100% par des énergies renouvelables et politique stricte sur la confidentialité des données personnelles. Dialogue en cours sur les conditions de travail des sous-traitants en Asie.',
    source_url: 'https://www.apple.com',
    chart_data: generateChartData(228.50, { '1j': 0.75, '1sem': 2.10, '1m': 4.50, '3m': 12.80, '6m': 19.50, 'ytd': 15.20, '1an': 28.90 })
  },

  'US5949181045': {
    isin: 'US5949181045',
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    asset_type: 'Action Technologie & Cloud (NASDAQ / S&P 500)',
    status: 'compatible',
    current_price: 432.10,
    currency: '$',
    change_1d_pct: 0.90,
    change_1d_val: 3.85,
    market_hours: { exchange: 'NASDAQ (New York)', open: '09:30', close: '16:00', timezone: 'America/New_York (EST)', is_open: true, next_event: 'Ferme à 16:00 EST' },
    returns: { '1j': 0.90, '1sem': 2.50, '1m': 5.80, '3m': 11.20, '6m': 18.40, 'ytd': 14.90, '1an': 31.50 },
    risk: { sri_level: 4, volatility_pct: 14.80, sharpe_ratio: 1.75, max_drawdown_pct: -11.00, beta: 0.98 },
    catholic: {
      dse_score: 84,
      laudato_si_alignment: 'Excellent',
      bioethics_compliant: true,
      human_dignity_score: 85,
      weapons_excluded: true,
      vices_excluded: true,
      episcopal_guidelines: 'Conforme USCCB & Principes de Rome sur l\'Éthique de l\'IA (Vatican)',
      carbon_intensity_tco2e: 14.5,
      labels: ['Signataire Rome Call for AI Ethics', 'Objectif Carbone Négatif 2030'],
      pillars: { bioethics: 88, environmental: 92, social_solidarity: 80, governance: 86 }
    },
    holdings: [],
    key_info: {
      aum: '3 210 Mds $',
      ter_pct: 0,
      domicile: 'États-Unis',
      inception: '1975',
      distribution: 'Dividende trimestriel',
      benchmark: 'S&P 500',
      dividend_yield_pct: 0.75,
      payment_frequency: 'Trimestrielle',
      payout_ratio_pct: 25,
      catholic_income_note: 'Entreprise co-signataire de la charte vaticane sur l\'éthique de l\'intelligence artificielle (Rome Call for AI Ethics).'
    },
    dividend_history: [
      { year: 2021, payout: 2.48, growth_pct: 9.7 },
      { year: 2022, payout: 2.72, growth_pct: 9.7 },
      { year: 2023, payout: 3.00, growth_pct: 10.3 },
      { year: 2024, payout: 3.30, growth_pct: 10.0 },
      { year: 2025, payout: 3.65, growth_pct: 10.6 }
    ],
    impact_description: 'Leader mondial des logiciels et de l\'informatique en nuage. Signataire fondateur de l\'Appel de Rome pour une éthique de l\'IA avec l\'Académie Pontificale pour la Vie.',
    source_url: 'https://www.microsoft.com',
    chart_data: generateChartData(432.10, { '1j': 0.90, '1sem': 2.50, '1m': 5.80, '3m': 11.20, '6m': 18.40, 'ytd': 14.90, '1an': 31.50 })
  },

  'NL0000235190': {
    isin: 'NL0000235190',
    ticker: 'AIR',
    name: 'Airbus SE',
    asset_type: 'Action Aérospatiale (CAC 40 / DAX)',
    status: 'warning',
    current_price: 161.40,
    currency: '€',
    change_1d_pct: 0.35,
    change_1d_val: 0.55,
    market_hours: { exchange: 'Euronext Paris', open: '09:00', close: '17:30', timezone: 'Europe/Paris (CET)', is_open: true, next_event: 'Ferme à 17:30 CET' },
    returns: { '1j': 0.35, '1sem': 1.90, '1m': 3.20, '3m': 9.80, '6m': 15.60, 'ytd': 12.40, '1an': 24.50 },
    risk: { sri_level: 4, volatility_pct: 16.50, sharpe_ratio: 1.15, max_drawdown_pct: -15.20, beta: 1.10 },
    catholic: {
      dse_score: 52,
      laudato_si_alignment: 'Mitigé',
      bioethics_compliant: false, // Présence division Défense & Espace
      human_dignity_score: 75,
      weapons_excluded: false, // ~18% des revenus dans l'armement et la défense
      vices_excluded: true,
      episcopal_guidelines: 'Sous surveillance pastorale (Division Défense & Espace)',
      carbon_intensity_tco2e: 140.0,
      labels: ['Pionnier Hydrogène ZEROe'],
      pillars: { bioethics: 40, environmental: 62, social_solidarity: 68, governance: 65 }
    },
    holdings: [],
    key_info: {
      aum: '125 Mds €',
      ter_pct: 0,
      domicile: 'Pays-Bas / France',
      inception: '1970',
      distribution: 'Dividende annuel',
      benchmark: 'CAC 40',
      dividend_yield_pct: 1.75,
      payment_frequency: 'Annuelle (Avril)',
      payout_ratio_pct: 35,
      catholic_income_note: 'Activité civile prédominante et investissement massif dans l\'avion à hydrogène, mais sous vigilance pour ses activités de défense.'
    },
    dividend_history: [
      { year: 2021, payout: 1.50, growth_pct: 0 },
      { year: 2022, payout: 1.80, growth_pct: 20.0 },
      { year: 2023, payout: 1.80, growth_pct: 0 },
      { year: 2024, payout: 2.80, growth_pct: 55.5 },
      { year: 2025, payout: 3.10, growth_pct: 10.7 }
    ],
    impact_description: 'Constructeur aéronautique européen. Pionnier de l\'aviation décarbonée (programme d\'avion à hydrogène ZEROe), mais soumis à la vigilance chrétienne en raison de sa branche Défense & Espace.',
    source_url: 'https://www.airbus.com',
    chart_data: generateChartData(161.40, { '1j': 0.35, '1sem': 1.90, '1m': 3.20, '3m': 9.80, '6m': 15.60, 'ytd': 12.40, '1an': 24.50 })
  },

  'LU0123456789': {
    isin: 'LU0123456789',
    ticker: 'NS50',
    name: 'Nouvelle Stratégie 50 Euro',
    asset_type: 'Fonds Mixte Conventionnel',
    status: 'warning',
    current_price: 88.20,
    currency: '€',
    change_1d_pct: -0.15,
    change_1d_val: -0.13,
    market_hours: { exchange: 'Bourse de Luxembourg', open: '09:00', close: '17:35', timezone: 'Europe/Luxembourg (CET)', is_open: true, next_event: 'Ferme à 17:35 CET' },
    returns: { '1j': -0.15, '1sem': 0.40, '1m': 1.10, '3m': 3.20, '6m': 5.80, 'ytd': 4.10, '1an': 7.60 },
    risk: { sri_level: 3, volatility_pct: 8.50, sharpe_ratio: 0.88, max_drawdown_pct: -6.40, beta: 0.75 },
    catholic: {
      dse_score: 58,
      laudato_si_alignment: 'Mitigé',
      bioethics_compliant: false,
      human_dignity_score: 65,
      weapons_excluded: true,
      vices_excluded: false,
      episcopal_guidelines: 'Non audité par les comités épiscopaux',
      carbon_intensity_tco2e: 128.4,
      labels: ['ISR Généraliste'],
      pillars: { bioethics: 50, environmental: 58, social_solidarity: 62, governance: 65 }
    },
    holdings: [
      { name: 'BNP Paribas', ticker: 'BNP', weight_pct: 4.8, sector: 'Banque', impact: 'Exposition résiduelle énergies fossiles' },
      { name: 'Sanofi', ticker: 'SAN', weight_pct: 4.2, sector: 'Santé', impact: 'Recherche pharmaceutique non auditée' }
    ],
    key_info: {
      aum: '154.0 M€',
      ter_pct: 1.45,
      domicile: 'Luxembourg',
      inception: '05/03/2012',
      distribution: 'Capitalisation standard',
      benchmark: 'Euro Stoxx 50',
      dividend_yield_pct: 2.10,
      payment_frequency: 'Annuelle',
      payout_ratio_pct: 35,
      catholic_income_note: 'Frais de gestion élevés (1.45%) sans partage aux œuvres catholiques ni engagement de transparence.'
    },
    dividend_history: [
      { year: 2022, payout: 1.70, growth_pct: 3.0 },
      { year: 2023, payout: 1.75, growth_pct: 2.9 },
      { year: 2024, payout: 1.82, growth_pct: 4.0 },
      { year: 2025, payout: 1.88, growth_pct: 3.3 }
    ],
    impact_description: 'Fonds d\'investissement conventionnel généraliste. N\'intègre aucun filtre d\'exclusion bioéthique chrétien ni d\'engagement sur l\'encyclique Laudato si\'. Éligible à la substitution 1-clic.',
    source_url: 'https://www.bourse.lu',
    chart_data: generateChartData(88.20, { '1j': -0.15, '1sem': 0.40, '1m': 1.10, '3m': 3.20, '6m': 5.80, 'ytd': 4.10, '1an': 7.60 })
  }
};

function normalizeForSearch(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Moteur de recherche rapide et insensible aux accents/ponctuation
export function searchIsinDatabase(query: string): Asset[] {
  const rawQ = query.trim().toLowerCase();
  const normQ = normalizeForSearch(query);
  if (!rawQ && !normQ) return [];

  return Object.values(COMPREHENSIVE_ISIN_DB).filter(asset => {
    const rawMatches =
      asset.isin.toLowerCase().includes(rawQ) ||
      asset.ticker.toLowerCase().includes(rawQ) ||
      asset.name.toLowerCase().includes(rawQ) ||
      asset.asset_type.toLowerCase().includes(rawQ);

    if (rawMatches) return true;

    if (!normQ) return false;

    return (
      normalizeForSearch(asset.isin).includes(normQ) ||
      normalizeForSearch(asset.ticker).includes(normQ) ||
      normalizeForSearch(asset.name).includes(normQ) ||
      normalizeForSearch(asset.asset_type).includes(normQ)
    );
  });
}
