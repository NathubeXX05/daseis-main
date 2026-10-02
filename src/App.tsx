import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';
import {
  Loader2,
  Plus,
  ArrowRight,
  ShieldCheck,
  PieChart,
  HeartHandshake,
  Leaf,
  Newspaper,
  Cross,
  CheckCircle2,
  ChevronRight,
  Shield,
  Gift,
  FileText,
  RefreshCw,
  Compass,
  Users,
  Sparkles,
  Award,
  AlertTriangle,
  Home,
  User,
  LogIn,
  Church,
  ExternalLink,
  Database,
  Search,
  Bell,
  BellRing,
  Coins,
  TrendingUp,
  Wallet,
  Receipt
} from 'lucide-react';
import {
  addAssetToPortfolio,
  removeAssetFromPortfolio,
  getUserPortfolio,
  PortfolioItem,
  Asset,
  ALL_NEWS,
  AssetNews,
  searchIsinOnline,
  checkIsinDbStatus,
  fetchWallet,
  fetchBrokerOrders,
  UserWallet,
  BrokerOrder
} from './actions';
import { AssetCard } from './components/AssetCard';
import { AssetDetailDrawer } from './components/AssetDetailDrawer';
import { LeadDrawer } from './components/LeadDrawer';
import { PortfolioPillarsRadar } from './components/PortfolioPillarsRadar';
import { DimeSimulatorModal } from './components/DimeSimulatorModal';
import { ReallocationModal } from './components/ReallocationModal';
import { CertificateModal } from './components/CertificateModal';
import { HomeLanding } from './components/HomeLanding';
import { TopDividendsRanking } from './components/TopDividendsRanking';
import { PerformanceComparator } from './components/PerformanceComparator';
import { AuthModal, UserSession } from './components/AuthModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { BrokerOrderModal } from './components/BrokerOrderModal';
import { BrokerOrdersList } from './components/BrokerOrdersList';
import { BrokerDepositModal } from './components/BrokerDepositModal';
import { PriceAlert } from './types/alerts';
import { loadPriceAlerts, savePriceAlerts, evaluatePriceAlerts } from './utils/alertsStorage';
import clsx from 'clsx';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isinInput, setIsinInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('homonobus_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Pastoral Guide & Investor Profile (Features 4 & 5)
  const [pastoralGuide, setPastoralGuide] = useState<'CEF' | 'USCCB' | 'VATICAN'>('CEF');
  const [investorProfile, setInvestorProfile] = useState<'famille' | 'congregation' | 'fondation'>('famille');
  
  // Modals / Drawers
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [leadDrawerOpen, setLeadDrawerOpen] = useState(false);

  // New Modals (Features 1, 2, 3)
  const [dimeModalOpen, setDimeModalOpen] = useState(false);
  const [certificateModalOpen, setCertificateModalOpen] = useState(false);
  const [reallocationModalOpen, setReallocationModalOpen] = useState(false);
  const [reallocationTargetAsset, setReallocationTargetAsset] = useState<Asset | null>(null);

  // Price Alerts (Alertes de seuil) State
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(loadPriceAlerts);
  const [alertsModalOpen, setAlertsModalOpen] = useState(false);
  const [alertTargetAsset, setAlertTargetAsset] = useState<Asset | null>(null);

  // Connected ISIN Database states
  const [suggestions, setSuggestions] = useState<Asset[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dbStats, setDbStats] = useState<{ connected: boolean; count: number; type?: string }>({ connected: true, count: 50, type: 'sqlite' });
  const [dashboardTab, setDashboardTab] = useState<'portfolio' | 'dividends' | 'comparator' | 'broker_orders'>('portfolio');

  // Broker & Cash Wallet State
  const [wallet, setWallet] = useState<UserWallet>({
    user_id: 'default_user',
    cash_balance: 15000.0,
    currency: 'EUR',
    updated_at: new Date().toISOString()
  });
  const [brokerOrders, setBrokerOrders] = useState<BrokerOrder[]>([]);
  const [tradeModalAsset, setTradeModalAsset] = useState<Asset | null>(null);
  const [depositModalOpen, setDepositModalOpen] = useState(false);

  useEffect(() => {
    loadPortfolio();
    checkIsinDbStatus().then(setDbStats).catch(() => {});
    fetchWallet().then(setWallet).catch(() => {});
    fetchBrokerOrders().then(setBrokerOrders).catch(() => {});
  }, []);

  const handleOpenTrade = (asset: Asset) => {
    setTradeModalAsset(asset);
  };

  const handleOrderExecuted = (newWallet: UserWallet) => {
    setWallet(newWallet);
    loadPortfolio();
    fetchBrokerOrders().then(setBrokerOrders).catch(() => {});
    toast.success('Ordre de bourse exécuté et inscrit au registre !');
  };

  const handleDepositSuccess = (newWallet: UserWallet) => {
    setWallet(newWallet);
    toast.success('Compte de négociation broker crédité avec succès !');
  };

  // Continuous background threshold evaluation against current prices
  useEffect(() => {
    if (portfolio.length === 0 || priceAlerts.length === 0) return;

    const { updatedAlerts, newlyTriggered } = evaluatePriceAlerts(priceAlerts, portfolio);

    if (newlyTriggered.length > 0) {
      setPriceAlerts(updatedAlerts);
      savePriceAlerts(updatedAlerts);

      newlyTriggered.forEach(({ alert, currentPrice }) => {
        toast(
          `🔔 Seuil de cours atteint : ${alert.assetName} (${alert.ticker}) !`,
          {
            description: `Le cours actuel a touché ${currentPrice.toFixed(2)} ${alert.currency} (${alert.direction === 'above' ? '≥' : '≤'} cible de ${alert.targetPrice.toFixed(2)} ${alert.currency}). ${alert.note ? `Note : "${alert.note}"` : ''}`,
            action: {
              label: "Gérer l'alerte",
              onClick: () => {
                const target = portfolio.find(p => p.isin === alert.isin);
                setAlertTargetAsset(target || null);
                setAlertsModalOpen(true);
              }
            },
            duration: 9000
          }
        );
      });
    }
  }, [portfolio, priceAlerts]);

  const handleOpenAlertModal = (asset?: Asset) => {
    setAlertTargetAsset(asset || null);
    setAlertsModalOpen(true);
  };

  const handleAddPriceAlert = (
    newAlertData: Omit<PriceAlert, 'id' | 'createdAt' | 'triggered'>
  ) => {
    const newAlert: PriceAlert = {
      ...newAlertData,
      id: `alt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      triggered: false
    };

    // Check if it already hits current price immediately
    const asset = portfolio.find(a => a.isin === newAlert.isin);
    if (asset) {
      const isMet =
        newAlert.direction === 'above'
          ? asset.current_price >= newAlert.targetPrice
          : asset.current_price <= newAlert.targetPrice;

      if (isMet) {
        newAlert.triggered = true;
        newAlert.triggeredAt = new Date().toISOString();
        toast(
          `🔔 Seuil immédiatement atteint : ${newAlert.assetName} (${newAlert.ticker}) !`,
          {
            description: `Cours actuel : ${asset.current_price.toFixed(2)} ${newAlert.currency} (${newAlert.direction === 'above' ? '≥' : '≤'} cible de ${newAlert.targetPrice.toFixed(2)} ${newAlert.currency})`,
            duration: 8000
          }
        );
      }
    }

    const updated = [newAlert, ...priceAlerts];
    setPriceAlerts(updated);
    savePriceAlerts(updated);

    if (!newAlert.triggered) {
      toast.success(
        `Alerte enregistrée : ${newAlert.assetName} (${newAlert.direction === 'above' ? '≥' : '≤'} ${newAlert.targetPrice.toFixed(2)} ${newAlert.currency})`
      );
    }
  };

  const handleDeletePriceAlert = (alertId: string) => {
    const updated = priceAlerts.filter(a => a.id !== alertId);
    setPriceAlerts(updated);
    savePriceAlerts(updated);
    toast.info('Alerte supprimée');
  };

  const handleResetPriceAlert = (alertId: string) => {
    const updated = priceAlerts.map(a =>
      a.id === alertId ? { ...a, triggered: false, triggeredAt: undefined } : a
    );
    setPriceAlerts(updated);
    savePriceAlerts(updated);
    toast.success('Alerte réarmée et active');
  };

  const handleSimulateTrigger = (alertId: string) => {
    const target = priceAlerts.find(a => a.id === alertId);
    if (!target) return;

    const updated = priceAlerts.map(a =>
      a.id === alertId
        ? { ...a, triggered: true, triggeredAt: new Date().toISOString() }
        : a
    );
    setPriceAlerts(updated);
    savePriceAlerts(updated);

    const asset = portfolio.find(p => p.isin === target.isin);
    const displayPrice = asset ? asset.current_price : target.targetPrice;

    toast(
      `🔔 Seuil atteint : ${target.assetName} (${target.ticker}) !`,
      {
        description: `Cours simulé : ${displayPrice.toFixed(2)} ${target.currency} (${target.direction === 'above' ? '≥' : '≤'} cible de ${target.targetPrice.toFixed(2)} ${target.currency}). ${target.note ? `Note : "${target.note}"` : ''}`,
        action: {
          label: "Voir l'actif",
          onClick: () => {
            if (asset) openAssetDetail(asset);
          }
        },
        duration: 9000
      }
    );
  };

  const loadPortfolio = async () => {
    try {
      const data = await getUserPortfolio();
      setPortfolio(data);
    } catch {
      toast.error('Impossible de charger le portefeuille');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user: UserSession) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('homonobus_user', JSON.stringify(user));
    } catch {}

    if (user.role) {
      setInvestorProfile(user.role === 'diocèse' ? 'fondation' : user.role);
    }
    toast.success(`Bienvenue, ${user.name}`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('homonobus_user');
    } catch {}
    toast.info('Session terminée.');
  };

  const handleInputChange = async (val: string) => {
    setIsinInput(val);
    const clean = val.trim();
    if (clean.length >= 2) {
      try {
        const results = await searchIsinOnline(clean);
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (asset: Asset) => {
    setIsinInput(asset.isin);
    setShowSuggestions(false);
    handleAddAsset(undefined, asset.isin);
  };

  const handleAddAsset = async (e?: React.FormEvent, directIsin?: string) => {
    if (e) e.preventDefault();
    setShowSuggestions(false);
    const targetIsin = (directIsin || isinInput).trim().toUpperCase();

    if (!targetIsin) {
      toast.error('Veuillez renseigner un code ISIN ou le nom d\'une entreprise.');
      return;
    }

    setIsAdding(true);
    try {
      const res = await addAssetToPortfolio(targetIsin);
      if (res.success && res.asset) {
        toast.success(`Actif ajouté : ${res.asset.name} (${res.asset.isin})`);
        setPortfolio(prev => [res.asset!, ...prev.filter(item => item.isin !== res.asset!.isin)]);
        setIsinInput('');
      } else {
        toast.error(res.error || 'ISIN introuvable dans la base de données.');
      }
    } catch {
      toast.error('Erreur réseau lors de l\'interrogation de la base ISIN.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveAsset = async (isin: string) => {
    try {
      await removeAssetFromPortfolio(isin);
      setPortfolio(prev => prev.filter(item => item.isin !== isin));
      toast.success('Actif retiré du portefeuille');
    } catch {
      toast.error('Erreur lors de la suppression.');
    }
  };

  const openAssetDetail = (asset: Asset) => {
    setSelectedAsset(asset);
    setDetailDrawerOpen(true);
  };

  const handleOpenReallocate = (asset: Asset) => {
    setReallocationTargetAsset(asset);
    setReallocationModalOpen(true);
  };

  const handleConfirmReallocation = async (oldIsin: string, newIsin: string) => {
    try {
      await removeAssetFromPortfolio(oldIsin);
      const res = await addAssetToPortfolio(newIsin);
      if (res.success && res.asset) {
        setPortfolio(prev => [res.asset!, ...prev.filter(item => item.isin !== oldIsin && item.isin !== newIsin)]);
        toast.success(`Substitution réussie : réalloué vers ${res.asset.name}`);
      }
    } catch {
      toast.error('Erreur lors de la réallocation.');
    }
  };

  // Computations
  const portfolioMetrics = useMemo(() => {
    if (portfolio.length === 0) {
      return {
        dseScore: 0,
        grade: 'N/A',
        totalVal: 0,
        dayPnLVal: 0,
        dayPnLPct: 0,
        avgDivYield: 0,
        annualDividends: 0,
        bioethicsCompliantAll: true,
        laudatoSiAlignedCount: 0,
        compatibleCount: 0,
        warningCount: 0,
        nonCompatibleCount: 0,
        pillars: {
          bioethics: 0,
          environmental: 0,
          social_solidarity: 0,
          governance: 0
        }
      };
    }

    let totalVal = 0;
    let totalDayValChange = 0;
    let totalDividends = 0;
    let bioethicsCompliantAll = true;
    let laudatoSiAlignedCount = 0;
    let compatibleCount = 0;
    let warningCount = 0;
    let nonCompatibleCount = 0;

    let bioethicsWeighted = 0;
    let envWeighted = 0;
    let socialWeighted = 0;
    let govWeighted = 0;

    // Weightings based on selected Pastoral Guide (Feature 4)
    let wBio = 1.0;
    let wEnv = 1.0;
    let wSoc = 1.0;
    let wGov = 1.0;

    if (pastoralGuide === 'USCCB') {
      wBio = 1.5;
      wEnv = 0.8;
      wSoc = 1.0;
      wGov = 0.9;
    } else if (pastoralGuide === 'CEF') {
      wBio = 1.1;
      wEnv = 1.4;
      wSoc = 1.3;
      wGov = 1.0;
    } else {
      wBio = 1.2;
      wEnv = 1.2;
      wSoc = 1.2;
      wGov = 1.2;
    }

    portfolio.forEach(item => {
      totalVal += item.total_value;
      totalDayValChange += (item.total_value * item.change_1d_pct) / 100;
      totalDividends += (item.total_value * (item.key_info.dividend_yield_pct || 0)) / 100;

      const p = item.catholic.pillars || {
        bioethics: item.catholic.bioethics_compliant ? 95 : 50,
        environmental: item.catholic.laudato_si_alignment === 'Excellent' ? 95 : item.catholic.laudato_si_alignment === 'Conforme' ? 85 : 40,
        social_solidarity: item.catholic.human_dignity_score || 80,
        governance: item.catholic.vices_excluded ? 90 : 60
      };

      bioethicsWeighted += p.bioethics * item.total_value;
      envWeighted += p.environmental * item.total_value;
      socialWeighted += p.social_solidarity * item.total_value;
      govWeighted += p.governance * item.total_value;
      
      if (!item.catholic.bioethics_compliant) {
        bioethicsCompliantAll = false;
      }
      if (item.catholic.laudato_si_alignment === 'Excellent' || item.catholic.laudato_si_alignment === 'Conforme') {
        laudatoSiAlignedCount++;
      }

      if (item.status === 'compatible') compatibleCount++;
      else if (item.status === 'warning') warningCount++;
      else nonCompatibleCount++;
    });

    const pillars = {
      bioethics: totalVal > 0 ? Math.round(bioethicsWeighted / totalVal) : 0,
      environmental: totalVal > 0 ? Math.round(envWeighted / totalVal) : 0,
      social_solidarity: totalVal > 0 ? Math.round(socialWeighted / totalVal) : 0,
      governance: totalVal > 0 ? Math.round(govWeighted / totalVal) : 0
    };

    const totalWeights = wBio + wEnv + wSoc + wGov;
    const dseScore = Math.round(
      (pillars.bioethics * wBio +
        pillars.environmental * wEnv +
        pillars.social_solidarity * wSoc +
        pillars.governance * wGov) /
        totalWeights
    );

    const dayPnLPct = totalVal > 0 ? (totalDayValChange / totalVal) * 100 : 0;
    const avgDivYield = totalVal > 0 ? (totalDividends / totalVal) * 100 : 0;

    let grade = 'C';
    if (dseScore >= 85) grade = 'A+ (Exemplaire)';
    else if (dseScore >= 70) grade = 'A (Conforme)';
    else if (dseScore >= 55) grade = 'B (Vigilance)';
    else grade = 'C (Non Conforme)';

    return {
      dseScore,
      grade,
      totalVal,
      dayPnLVal: totalDayValChange,
      dayPnLPct,
      avgDivYield,
      annualDividends: totalDividends,
      bioethicsCompliantAll,
      laudatoSiAlignedCount,
      compatibleCount,
      warningCount,
      nonCompatibleCount,
      pillars
    };
  }, [portfolio, pastoralGuide]);

  const portfolioNews: AssetNews[] = useMemo(() => {
    const isinSet = new Set(portfolio.map(p => p.isin));
    return ALL_NEWS.filter(n => isinSet.has(n.isin));
  }, [portfolio]);

  const quickSamples = [
    { isin: 'FR0010531553', label: 'Proclero CEF', category: 'Fonds Catholique', type: 'green' },
    { isin: 'LU1861134382', label: 'Laudato Si\' Global', category: 'Vatican Hub', type: 'green' },
    { isin: 'FR0010315775', label: 'Ecofi Climat', category: 'Partage Solidaire', type: 'green' },
    { isin: 'FR0000121972', label: 'Schneider (SU)', category: 'CAC 40', type: 'green' },
    { isin: 'FR0000120073', label: 'Air Liquide (AI)', category: 'Santé DSE', type: 'green' },
    { isin: 'FR0000120321', label: 'L\'Oréal (OR)', category: 'CAC 40', type: 'green' },
    { isin: 'US0378331005', label: 'Apple (AAPL)', category: 'Tech US', type: 'green' },
    { isin: 'US5949181045', label: 'Microsoft (MSFT)', category: 'Rome AI Call', type: 'green' },
    { isin: 'FR0000120578', label: 'Sanofi (SAN)', category: 'Vigilance Bioéthique', type: 'amber' },
    { isin: 'FR0000120271', label: 'TotalEnergies (TTE)', category: 'Non-Laudato Si', type: 'red' },
    { isin: 'FR0000121329', label: 'Thales (HO)', category: 'Exclusion Armes', type: 'red' }
  ];

  const hasIssues = portfolioMetrics.warningCount > 0 || portfolioMetrics.nonCompatibleCount > 0;
  const firstIssueAsset = portfolio.find(p => p.status !== 'compatible');

  return (
    <div className="min-h-screen bg-canvas text-slate-800 font-sans selection:bg-blue-500/30 selection:text-blue-700 pb-20 sm:pb-0">
      <Toaster
        theme="light"
        position="top-center"
        toastOptions={{
          style: {
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            color: '#1e293b',
            fontFamily: 'IBM Plex Sans, sans-serif',
            borderRadius: '0px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }
        }}
      />

      {/* Main Top Navigation Bar - Professional Institutional Design */}
      <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-sm border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Monogram */}
          <div
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-accent border border-accent-hover flex items-center justify-center text-white font-serif font-semibold text-base rounded-sm">
              H
            </div>
            <div>
              <span className="font-semibold text-base text-slate-900 block leading-none font-sans">
                HOMONOBUS
              </span>
              <span className="text-xs text-blue-600 font-bold font-mono">
                Catholic Financial Analysis
              </span>
            </div>
          </div>

          {/* Navigation View Switcher - Professional tabs */}
          <div className="hidden sm:flex items-center bg-panel border border-gray-200 text-xs font-semibold rounded-md">
            <button
              onClick={() => setCurrentView('home')}
              className={clsx(
                'px-4 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-l-md',
                currentView === 'home'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
              )}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Accueil</span>
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className={clsx(
                'px-4 py-1.5 flex items-center gap-1.5 transition-all cursor-pointer rounded-r-md',
                currentView === 'dashboard'
                  ? 'bg-white text-slate-900 font-bold shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
              )}
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Portefeuille DSE</span>
            </button>
          </div>

          {/* User Profile / Action Button */}
          <div className="flex items-center gap-2">
            {/* Broker Cash Balance Badge */}
            <div className="flex items-center bg-panel border border-gray-200 text-xs font-mono px-2.5 py-1 rounded-md">
              <Wallet className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
              <span className="text-slate-600 text-xs hidden sm:inline mr-1">Cash:</span>
              <span className="font-bold text-slate-900">
                {wallet.cash_balance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
              </span>
              <button
                type="button"
                onClick={() => setDepositModalOpen(true)}
                className="ml-2 px-1.5 py-0.5 bg-accent-secondary hover:bg-accent-secondary-hover text-white text-xs font-bold transition rounded-sm"
                title="Déposer des fonds"
              >
                + Deposit
              </button>
            </div>

            {/* Price Alerts Button */}
            <button
              onClick={() => handleOpenAlertModal()}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border transition-all cursor-pointer rounded-md font-mono shadow-sm',
                priceAlerts.some(a => a.triggered)
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 '
                  : priceAlerts.length > 0
                  ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
                  : 'bg-white hover:bg-gray-50 text-slate-600 border-gray-200'
              )}
              title="Gérer les alertes de seuil"
            >
              <Bell className={clsx('w-3.5 h-3.5', priceAlerts.some(a => a.triggered) ? 'text-amber-600' : 'text-blue-600')} />
              <span className="hidden sm:inline">Alertes</span>
              {priceAlerts.some(a => a.triggered) ? (
                <span className="px-1.5 py-0.2 bg-amber-600 text-white font-bold text-xs rounded">
                  {priceAlerts.filter(a => a.triggered).length}
                </span>
              ) : priceAlerts.filter(a => !a.triggered).length > 0 ? (
                <span className="px-1.5 py-0.2 bg-blue-600 text-white text-xs rounded">
                  {priceAlerts.filter(a => !a.triggered).length}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setCertificateModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-slate-700 text-xs font-semibold border border-gray-200 transition-all cursor-pointer rounded-md font-mono shadow-sm"
              title="Attestation Pastorale PDF"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Certificate</span>
            </button>

            {currentUser ? (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-accent hover:bg-accent-hover border border-accent-hover text-xs font-semibold text-white transition-all cursor-pointer rounded-md shadow-sm"
                title="Mon Espace Homonobus"
              >
                <span className="hidden sm:inline text-xs font-bold max-w-[120px] truncate text-slate-100">
                  {currentUser.name}
                </span>
                <span className="px-1.5 py-0.5 bg-blue-700 text-white font-mono font-bold text-xs rounded">
                  {currentUser.initials}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-accent hover:bg-accent-hover text-on-accent text-xs font-bold tracking-tight transition-all cursor-pointer rounded-md shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar: Pastoral Framework & Investor Profile Selectors */}
        {currentView === 'dashboard' && (
          <div className="max-w-6xl mx-auto mt-2.5 pt-2 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Feature 4: Pastoral Guide Selector */}
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-slate-600 text-xs font-mono">FRAMEWORK:</span>
              <div className="flex bg-panel border border-gray-200 rounded-md">
                <button
                  onClick={() => setPastoralGuide('CEF')}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer rounded-l-md font-mono',
                    pastoralGuide === 'CEF' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                  )}
                  title="Conférence des Évêques de France (Priorité Laudato Si')"
                >
                  CEF (France)
                </button>
                <button
                  onClick={() => setPastoralGuide('USCCB')}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer border-l border-gray-200 rounded-none font-mono',
                    pastoralGuide === 'USCCB' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                  )}
                  title="US Catholic Bishops (Priorité Bioéthique)"
                >
                  USCCB (USA)
                </button>
                <button
                  onClick={() => setPastoralGuide('VATICAN')}
                  className={clsx(
                    'px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer rounded-r-md border-l border-gray-200 font-mono',
                    pastoralGuide === 'VATICAN' ? 'bg-white text-slate-900 font-bold shadow-sm' : 'text-slate-600 hover:text-slate-900 hover:bg-gray-50'
                  )}
                  title="Académie Pontificale (Bien Commun Universel)"
                >
                  Vatican
                </button>
              </div>
            </div>

            {/* Feature 5: Investor Profile Selector */}
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 text-xs font-mono">PROFILE:</span>
              <select
                value={investorProfile}
                onChange={(e) => setInvestorProfile(e.target.value as any)}
                className="bg-panel border border-gray-200 text-slate-700 font-semibold text-xs py-1 px-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="famille">Christian Family</option>
                <option value="congregation">Congregation / Diocese</option>
                <option value="fondation">Foundation & Institute</option>
              </select>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-24">
        {/* VIEW 1: HOME & MISSION */}
        {currentView === 'home' && (
          <HomeLanding
            onGoToDashboard={() => setCurrentView('dashboard')}
            onOpenDimeSimulator={() => setDimeModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onSelectAsset={(isin) => {
              const a = portfolio.find(p => p.isin === isin);
              if (a) openAssetDetail(a);
            }}
            onAddAsset={(isin) => {
              handleAddAsset(undefined, isin);
              setCurrentView('dashboard');
            }}
          />
        )}

        {/* VIEW 2: PORTFOLIO & AUDIT DASHBOARD */}
        {currentView === 'dashboard' && (
          <div className="space-y-8">
            {/* Animated Score & Hero Section */}
            <section className="flex flex-col items-center justify-center pt-2">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', bounce: 0.35, duration: 0.7 }}
                className="relative w-40 h-40 flex items-center justify-center mb-3"
              >
                {/* SVG Circle Progress */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="5"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={
                      portfolioMetrics.dseScore >= 85
                        ? '#065f46'
                        : portfolioMetrics.dseScore >= 70
                        ? '#10b981'
                        : portfolioMetrics.dseScore >= 55
                        ? '#d97706'
                        : '#dc2626'
                    }
                    strokeWidth="5"
                    strokeDasharray={264}
                    initial={{ strokeDashoffset: 264 }}
                    animate={{
                      strokeDashoffset: 264 - (264 * portfolioMetrics.dseScore) / 100
                    }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>

                <div className="flex flex-col items-center justify-center z-10 text-center">
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    SCORE DSE
                  </span>
                  <span className="text-3xl font-semibold font-mono tracking-tight text-slate-900 leading-none my-1">
                    {portfolioMetrics.dseScore}
                    <span className="text-sm font-sans font-normal text-slate-500">/100</span>
                  </span>
                  <span className="inline-block text-xs font-bold px-2 py-0.5 bg-emerald-700 text-white border border-emerald-600 font-mono rounded">
                    {portfolioMetrics.grade}
                  </span>
                </div>
              </motion.div>

              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 text-center mb-1">
                Portefeuille Institutionnel DSE
              </h1>
              <p className="text-xs text-slate-500 text-center max-w-md">
                Audit permanent selon la Doctrine Sociale de l'Église et le référentiel {pastoralGuide}.
              </p>

              {/* Quick Metrics Bar - Professional cards */}
              {portfolio.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-6 card p-4"
                >
                  {/* Portefeuille Value */}
                  <div className="text-center">
                    <span className="text-xs font-mono text-slate-500 block mb-1">
                      Valeur Portefeuille
                    </span>
                    <span className="text-base font-bold font-mono text-slate-900">
                      {portfolioMetrics.totalVal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-mono font-semibold block mt-0.5',
                        portfolioMetrics.dayPnLPct >= 0 ? 'text-emerald-600' : 'text-rose-600'
                      )}
                    >
                      {portfolioMetrics.dayPnLPct >= 0 ? '+' : ''}{portfolioMetrics.dayPnLPct.toFixed(2)}% (1D)
                    </span>
                  </div>

                  {/* Dividend Yield */}
                  <div className="text-center sm:border-l border-gray-200">
                    <span className="text-xs font-mono text-slate-500 block mb-1">
                      Rendement Dividende
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-600">
                      {portfolioMetrics.avgDivYield.toFixed(2)}%
                    </span>
                    <span className="text-xs text-slate-500 font-mono block mt-0.5">
                      {portfolioMetrics.annualDividends.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € / an
                    </span>
                  </div>

                  {/* Bioethics Filter */}
                  <div className="text-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                    <span className="text-xs font-mono text-slate-500 block mb-1">
                      Filtre Bioéthique
                    </span>
                    <span
                      className={clsx(
                        'text-xs font-bold font-mono inline-block',
                        portfolioMetrics.bioethicsCompliantAll ? 'text-emerald-600' : 'text-amber-600'
                      )}
                    >
                      {portfolioMetrics.bioethicsCompliantAll ? '✓ 100% Conforme' : 'À purger'}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5 font-mono">Respect vie humaine</span>
                  </div>

                  {/* Laudato Si' Alignment */}
                  <div className="text-center border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
                    <span className="text-xs font-mono text-slate-500 block mb-1">
                      Laudato Si'
                    </span>
                    <span className="text-base font-bold font-mono text-emerald-600">
                      {portfolioMetrics.laudatoSiAlignedCount} / {portfolio.length}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5 font-mono">Lignes alignées</span>
                  </div>
                </motion.div>
              )}

              {/* Quick Action Tools Bar - Professional buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4 w-full">
                <button
                  onClick={() => setDimeModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold border border-emerald-600 transition-all cursor-pointer rounded-md font-mono shadow-sm"
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>Simulateur de Dîme & Dons</span>
                </button>

                <button
                  onClick={() => setCertificateModalOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-hover text-white text-xs font-semibold border border-accent-hover transition-all cursor-pointer rounded-md font-mono shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Exporter l'Attestation (PDF)</span>
                </button>
              </div>
            </section>

            {/* Feature 2: Warning Banner if non-compliant assets exist */}
            {hasIssues && firstIssueAsset && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-amber-700 font-mono">
                      {investorProfile === 'congregation' ? 'Alerte Évêché : Risque moral détecté' : 'Lignes non conformes détectées'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {firstIssueAsset.name} est incompatible avec l'encyclique <em>Laudato si'</em> ou la bioéthique.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleOpenReallocate(firstIssueAsset)}
                  className="py-2 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer rounded-md shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Purger en 1-clic
                </button>
              </motion.div>
            )}

            {/* Dashboard Sub-navigation Tabs - Professional */}
            <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
              <button
                onClick={() => setDashboardTab('portfolio')}
                className={clsx(
                  'px-4 py-2 text-xs font-mono font-bold border transition-all cursor-pointer rounded-t-md flex items-center gap-2',
                  dashboardTab === 'portfolio'
                    ? 'bg-white text-slate-900 border-b-2 border-blue-500 '
                    : 'bg-panel text-slate-600 border-b-2 border-transparent hover:text-slate-900 hover:bg-gray-50'
                )}
              >
                <PieChart className="w-3.5 h-3.5" />
                <span>Mon Portefeuille ({portfolio.length})</span>
              </button>

              <button
                onClick={() => setDashboardTab('dividends')}
                className={clsx(
                  'px-4 py-2 text-xs font-mono font-bold border transition-all cursor-pointer rounded-t-md flex items-center gap-2',
                  dashboardTab === 'dividends'
                    ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500 '
                    : 'bg-panel text-slate-600 border-b-2 border-transparent hover:text-amber-700 hover:bg-amber-50'
                )}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Top Rendement Dividendes</span>
              </button>

              <button
                onClick={() => setDashboardTab('comparator')}
                className={clsx(
                  'px-4 py-2 text-xs font-mono font-bold border transition-all cursor-pointer rounded-t-md flex items-center gap-2',
                  dashboardTab === 'comparator'
                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500 '
                    : 'bg-panel text-slate-600 border-b-2 border-transparent hover:text-emerald-700 hover:bg-emerald-50'
                )}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>DSE vs Livret A / CAC 40</span>
              </button>

              <button
                onClick={() => setDashboardTab('broker_orders')}
                className={clsx(
                  'px-4 py-2 text-xs font-mono font-bold border transition-all cursor-pointer rounded-t-md flex items-center gap-2',
                  dashboardTab === 'broker_orders'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500 font-extrabold'
                    : 'bg-panel text-slate-600 border-b-2 border-transparent hover:text-blue-700 hover:bg-blue-50'
                )}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Carnet d'Ordres ({brokerOrders.length})</span>
              </button>
            </div>

            {dashboardTab === 'dividends' && (
              <TopDividendsRanking onAddAsset={(isin) => handleAddAsset(undefined, isin)} />
            )}

            {dashboardTab === 'comparator' && (
              <PerformanceComparator onExplorePortfolio={() => setDashboardTab('portfolio')} />
            )}

            {dashboardTab === 'broker_orders' && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 card">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-amber-600" />
                      <span>Compte Espèces & Exécutions</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">
                      Mode démonstration : les exécutions sont simulées.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <div className="text-right">
                      <span className="text-xs text-slate-500 block">Solde Liquide</span>
                      <span className="text-base font-bold text-amber-700">
                        {wallet.cash_balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                    <button
                      onClick={() => setDepositModalOpen(true)}
                      className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition rounded-md shadow-sm"
                    >
                      + Approvisionner
                    </button>
                  </div>
                </div>

                <BrokerOrdersList orders={brokerOrders} onRefresh={() => fetchBrokerOrders().then(setBrokerOrders)} />
              </div>
            )}

            {dashboardTab === 'portfolio' && (
              <>
                {/* Input Form for ISIN Connected to Database */}
                <section className="relative">
              {/* DB Status Bar */}
              <div className="flex items-center justify-between mb-2 px-1 text-xs">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="w-2 h-2 bg-emerald-600 inline-block rounded-full" />
                  <span className="text-emerald-600 font-bold">
                    {dbStats.type === 'supabase' ? 'DATABASE SUPABASE' : 'DATABASE SQLITE'} CONNECTED
                  </span>
                  <span className="text-slate-500 hidden sm:inline">·</span>
                  <span className="text-blue-600 hidden sm:inline font-semibold">
                    LIVE FEED (OpenFIGI · Yahoo Finance · Global Markets)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500 bg-panel px-2 py-0.5 border border-gray-200 rounded">
                  <Database className="w-3 h-3 text-emerald-600" />
                  <span>{dbStats.count} assets in database</span>
                </div>
              </div>

              <form onSubmit={handleAddAsset} className="relative z-20">
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-slate-500 pointer-events-none">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={isinInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search for a company (ex: Air Liquide, L'Oréal, Total, Apple...) or ISIN code"
                    className="w-full bg-panel pl-10 pr-28 py-3.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 font-mono text-xs sm:text-sm transition-all rounded-md"
                    disabled={isAdding}
                  />
                  <div className="absolute right-2 flex items-center gap-1">
                    {isinInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsinInput('');
                          setSuggestions([]);
                          setShowSuggestions(false);
                        }}
                        className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs font-mono cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isAdding || !isinInput.trim()}
                      className="px-3 py-2 bg-accent hover:bg-accent-hover text-on-accent font-bold active:scale-[0.98] transition-all disabled:opacity-40 disabled:active:scale-100 flex items-center justify-center cursor-pointer rounded-md text-xs font-mono shadow-sm"
                      title="Audit and add to portfolio"
                    >
                      {isAdding ? (
                        <div className="flex items-center gap-1">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span className="hidden sm:inline">Audit...</span>
                        </div>
                      ) : (
                        <span>+ Audit & Add</span>
                      )}
                    </button>
                  </div>
                </div>
              </form>

              {/* Autocomplete Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-panel border border-blue-200 z-30 divide-y divide-gray-200 rounded-md shadow-lg">
                  <div className="px-3 py-1.5 bg-blue-50 text-xs font-mono text-blue-700 flex items-center justify-between border-b border-gray-200">
                    <span>DATABASE RESULTS ({suggestions.length})</span>
                    <span className="text-slate-500">Click to audit and add</span>
                  </div>
                  {suggestions.map((asset) => (
                    <button
                      key={asset.isin}
                      type="button"
                      onClick={() => handleSelectSuggestion(asset)}
                      className="w-full p-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-mono font-bold text-slate-900 text-xs group-hover:text-blue-600">
                            {asset.name}
                          </span>
                          <span className="text-xs font-mono px-1.5 py-0.2 bg-gray-100 text-slate-600 border border-gray-200 rounded">
                            {asset.ticker}
                          </span>
                          <span className="text-xs font-mono text-slate-500">
                            {asset.isin}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 block font-sans">
                          {asset.asset_type} · {asset.current_price.toFixed(2)} {asset.currency} · Div: {asset.key_info.dividend_yield_pct}%
                        </span>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <div>
                          <span className="text-xs font-mono text-slate-500 block">Score DSE</span>
                          <span className="text-xs font-mono font-bold text-emerald-600">{asset.catholic.dse_score}/100</span>
                        </div>
                        <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 font-mono">
                          + Add
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Click Samples */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3 px-1">
                <span className="text-xs text-slate-500 font-mono mr-1">
                  Quick Access:
                </span>
                {quickSamples.map((sample) => (
                  <button
                    key={sample.isin}
                    onClick={() => handleAddAsset(undefined, sample.isin)}
                    disabled={isAdding}
                    title={`${sample.category} (${sample.isin})`}
                    className={clsx(
                      'text-xs font-mono px-2 py-0.5 border transition-all cursor-pointer rounded',
                      sample.type === 'green'
                        ? 'bg-emerald-700 text-white border-emerald-600 hover:bg-emerald-800'
                        : sample.type === 'amber'
                        ? 'bg-amber-700 text-white border-amber-600 hover:bg-amber-800'
                        : 'bg-rose-700 text-white border-rose-600 hover:bg-rose-800'
                    )}
                  >
                    + {sample.label}
                  </button>
                ))}
              </div>
            </section>

            {/* Radar Chart des 4 Piliers Catholiques */}
            {portfolio.length > 0 && (
              <section>
                <PortfolioPillarsRadar pillars={portfolioMetrics.pillars} />
              </section>
            )}

            {/* Portfolio Assets List */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1 pb-2 border-b border-gray-200">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xs font-mono font-bold text-slate-600">
                    Actifs en Portefeuille
                  </h2>
                  <span className="text-xs font-mono font-bold text-white bg-emerald-600 px-2 py-0.5 border border-emerald-500 rounded">
                    {portfolio.length}
                  </span>
                </div>

                {portfolio.length > 0 && (
                  <span className="text-xs text-slate-500 font-mono">
                    Sélectionnez un actif pour les métriques détaillées
                  </span>
                )}
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : portfolio.length === 0 ? (
                <div className="text-center py-16 bg-panel border border-dashed border-gray-200 px-6 rounded-lg">
                  <div className="w-10 h-10 bg-gray-100 flex items-center justify-center mx-auto mb-3 text-slate-500 rounded-full">
                    <PieChart className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    Votre portefeuille est vide
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                    Saisissez un code ISIN ci-dessus pour auditer sa conformité morale et écologique.
                  </p>
                </div>
              ) : (
                <><div className="hidden md:grid md:grid-cols-[minmax(0,2.4fr)_1.1fr_0.7fr_0.8fr_1.1fr_12rem] gap-4 px-1 py-2 border-b border-gray-200 text-xs font-medium text-slate-500"><span>Actif</span><span>Cours</span><span>Score DSE</span><span>Dividende</span><span>Verdict</span><span /></div><ul className="relative">
                  <AnimatePresence mode="popLayout">
                    {portfolio.map(asset => (
                      <AssetCard
                        key={asset.isin}
                        asset={asset}
                        onSelect={openAssetDetail}
                        onTrade={handleOpenTrade}
                        onReallocate={handleOpenReallocate}
                        onRemove={handleRemoveAsset}
                        alerts={priceAlerts}
                        onOpenAlertModal={handleOpenAlertModal}
                      />
                    ))}
                  </AnimatePresence>
                </ul></>
              )}
            </section>

            {/* Portfolio News & Apostolic Insights */}
            {portfolioNews.length > 0 && (
              <section className="pt-2">
                <div className="flex items-center gap-2 mb-4 px-1 pb-2 border-b border-gray-200">
                  <Newspaper className="w-4 h-4 text-emerald-600" />
                  <h2 className="text-xs font-mono font-bold text-slate-600">
                    Actualités Magistère & Entreprises en Portefeuille
                  </h2>
                </div>

                <div className="space-y-3">
                  {portfolioNews.map(news => (
                    <a
                      key={news.id}
                      href={news.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-5 bg-panel border border-gray-200 hover:border-gray-300 transition-all group rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{news.source}</span>
                          <span className="text-slate-500 font-mono">· {news.published_at}</span>
                        </div>
                        <span
                          className={clsx(
                            'text-xs font-bold px-2 py-0.5 font-mono rounded',
                            news.sentiment === 'positive'
                              ? 'bg-emerald-700 text-white border border-emerald-600'
                              : news.sentiment === 'warning'
                              ? 'bg-rose-700 text-white border border-rose-600'
                              : 'bg-gray-200 text-slate-700'
                          )}
                        >
                          {news.category}
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-900 text-sm group-hover:text-blue-600 transition-colors mb-1.5 leading-snug">
                        {news.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {news.summary}
                      </p>
                    </a>
                  ))}
                </div>
              </section>
            )}
            </>
            )}

            {/* Bottom Action Button */}
            {portfolio.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center pt-4"
              >
                <button
                  onClick={() => setLeadDrawerOpen(true)}
                  className="inline-flex items-center gap-2.5 px-8 py-4 bg-accent hover:bg-accent-hover text-on-accent font-bold tracking-tight transition-all cursor-pointer text-sm rounded-md shadow-lg"
                >
                  <HeartHandshake className="w-5 h-5" />
                  <span>Aligner mon portefeuille avec un conseiller spécialisé</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              </motion.div>
            )}

            {/* Legal Disclaimer Footer */}
            <footer className="mt-16 pt-8 pb-20 sm:pb-8 border-t border-gray-200 text-center text-slate-500 text-xs leading-relaxed max-w-6xl mx-auto px-4 font-sans">
              <p className="mb-1 font-mono text-slate-600 font-semibold">
                HOMONOBUS · OBSERVATOIRE DE LA FINANCE ÉTHIQUE & DSE
              </p>
              <p>
                Avertissement : Les informations présentées constituent un outil d'aide à la décision extra-financière et ne sont pas des conseils en investissement personnalisé (articles L. 321-1 et D. 321-1 du CMF).
              </p>
            </footer>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Navigation Bar - Professional */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-panel border-t border-gray-200 px-4 py-2.5 flex items-center justify-around text-slate-600 shadow-lg">
        <button
          onClick={() => setCurrentView('home')}
          className={clsx(
            'flex flex-col items-center gap-1 text-xs font-semibold cursor-pointer transition-colors',
            currentView === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <Home className="w-4 h-4" />
          <span>Accueil</span>
        </button>

        <button
          onClick={() => setCurrentView('dashboard')}
          className={clsx(
            'flex flex-col items-center gap-1 text-xs font-semibold cursor-pointer transition-colors',
            currentView === 'dashboard' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-700'
          )}
        >
          <PieChart className="w-4 h-4" />
          <span>Portefeuille</span>
        </button>

        <button
          onClick={() => setDimeModalOpen(true)}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
        >
          <Gift className="w-4 h-4 text-emerald-600" />
          <span>Dîme</span>
        </button>

        <button
          onClick={() => {
            setAlertTargetAsset(null);
            setAlertsModalOpen(true);
          }}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer relative transition-colors"
        >
          <Bell className={clsx("w-4 h-4", priceAlerts.some(a => a.triggered) ? "text-amber-600" : "text-emerald-600")} />
          <span>Alertes</span>
          {priceAlerts.some(a => a.triggered) ? (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-600 rounded-full" />
          ) : priceAlerts.filter(a => !a.triggered).length > 0 ? (
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-600 rounded-full" />
          ) : null}
        </button>

        <button
          onClick={() => setCertificateModalOpen(true)}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
        >
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Certificat</span>
        </button>

        <button
          onClick={() => setAuthModalOpen(true)}
          className="flex flex-col items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer transition-colors"
        >
          <User className="w-4 h-4 text-blue-600" />
          <span>{currentUser ? currentUser.initials : 'Compte'}</span>
        </button>
      </nav>

      {/* Asset Detail Drawer */}
      <AssetDetailDrawer
        asset={selectedAsset}
        open={detailDrawerOpen}
        onOpenChange={setDetailDrawerOpen}
        onTrade={handleOpenTrade}
        onRemove={handleRemoveAsset}
        onOpenAlertModal={handleOpenAlertModal}
      />

      {/* Lead Capture Drawer (Vaul) */}
      <LeadDrawer
        open={leadDrawerOpen}
        onOpenChange={setLeadDrawerOpen}
      />

      {/* Feature 1: Simulateur de Dîme Éthique */}
      <DimeSimulatorModal
        open={dimeModalOpen}
        onClose={() => setDimeModalOpen(false)}
        annualDividends={portfolioMetrics.annualDividends}
        totalVal={portfolioMetrics.totalVal}
      />

      {/* Feature 2: Modal de Substitution Éthique en 1-Clic */}
      <ReallocationModal
        open={reallocationModalOpen}
        onClose={() => setReallocationModalOpen(false)}
        targetAsset={reallocationTargetAsset}
        onConfirmReallocation={handleConfirmReallocation}
      />

      {/* Feature 3: Attestation Pastorale & Rapport PDF */}
      <CertificateModal
        open={certificateModalOpen}
        onClose={() => setCertificateModalOpen(false)}
        portfolio={portfolio}
        dseScore={portfolioMetrics.dseScore}
        grade={portfolioMetrics.grade}
        totalVal={portfolioMetrics.totalVal}
        pillars={portfolioMetrics.pillars}
        pastoralGuide={pastoralGuide}
        investorProfile={investorProfile}
      />

      {/* Auth / Connection Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Feature: Alertes de Seuil de Cours */}
      <PriceAlertsModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        portfolio={portfolio}
        alerts={priceAlerts}
        preselectedAsset={alertTargetAsset}
        onAddAlert={handleAddPriceAlert}
        onDeleteAlert={handleDeletePriceAlert}
        onResetAlert={handleResetPriceAlert}
        onSimulateTrigger={handleSimulateTrigger}
      />

      {/* Feature: Ticket de Négociation Broker Direct */}
      {tradeModalAsset && (
        <BrokerOrderModal
          asset={tradeModalAsset}
          userWallet={wallet}
          currentHoldingQuantity={portfolio.find(p => p.isin === tradeModalAsset.isin)?.quantity || 0}
          isOpen={Boolean(tradeModalAsset)}
          onClose={() => setTradeModalAsset(null)}
          onOrderExecuted={handleOrderExecuted}
        />
      )}

      {/* Feature: Dépôt et Approvisionnement Espèces Broker */}
      <BrokerDepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        wallet={wallet}
        onDepositSuccess={handleDepositSuccess}
      />
    </div>
  );
}
