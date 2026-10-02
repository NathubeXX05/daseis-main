-- ====================================================================
-- ARCHITECTURE DE LA BASE DE DONNÉES (PostgreSQL / Supabase)
-- PWA Fintech Catholique & Éthique "Fides" - Strict RLS & Schéma Institutionnel
-- Conforme à la Doctrine Sociale de l'Église (DSE) et Laudato si'
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum des statuts de compatibilité éthique catholique
DO $$ BEGIN
  CREATE TYPE asset_status AS ENUM ('compatible', 'warning', 'non_compatible');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE market_status_enum AS ENUM ('open', 'closed', 'pre_market', 'post_market');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 1. Table Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_number TEXT,
  lead_status BOOLEAN DEFAULT false,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_insert_own" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

-- 2. Table Assets Dictionary (Dictionnaire enrichi avec DSE, bioéthique, cours, risques, rendements)
CREATE TABLE IF NOT EXISTS assets_dictionary (
  isin TEXT PRIMARY KEY,
  ticker TEXT NOT NULL,
  name TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  status asset_status NOT NULL DEFAULT 'compatible',
  
  -- Cours & Marché en direct
  current_price NUMERIC(12, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  change_percent_1d NUMERIC(6, 2) NOT NULL,
  market_status market_status_enum NOT NULL DEFAULT 'closed',
  exchange_name TEXT NOT NULL,
  market_hours_open TIME NOT NULL DEFAULT '09:00:00',
  market_hours_close TIME NOT NULL DEFAULT '17:30:00',
  market_timezone TEXT NOT NULL DEFAULT 'Europe/Paris',
  
  -- Taux de rendement (%)
  return_1d NUMERIC(6, 2) NOT NULL,
  return_1w NUMERIC(6, 2) NOT NULL,
  return_1m NUMERIC(6, 2) NOT NULL,
  return_3m NUMERIC(6, 2) NOT NULL,
  return_6m NUMERIC(6, 2) NOT NULL,
  return_ytd NUMERIC(6, 2) NOT NULL,
  return_1y NUMERIC(6, 2) NOT NULL,
  
  -- Risque & Rendement
  sri_risk_level INTEGER CHECK (sri_risk_level BETWEEN 1 AND 7) NOT NULL,
  volatility_1y_pct NUMERIC(6, 2) NOT NULL,
  sharpe_ratio NUMERIC(5, 2) NOT NULL,
  max_drawdown_pct NUMERIC(6, 2) NOT NULL,
  beta NUMERIC(5, 2) NOT NULL DEFAULT 1.0,
  
  -- Critères Éthiques Catholiques & Doctrine Sociale de l'Église (DSE)
  dse_score INTEGER CHECK (dse_score BETWEEN 0 AND 100) NOT NULL,
  laudato_si_alignment TEXT NOT NULL, -- 'Excellent', 'Conforme', 'Mitigé', 'Non Conforme'
  bioethics_compliant BOOLEAN NOT NULL DEFAULT true, -- Respect de la vie naissante et fin de vie
  human_dignity_score INTEGER CHECK (human_dignity_score BETWEEN 0 AND 100) NOT NULL,
  weapons_excluded BOOLEAN NOT NULL DEFAULT true, -- Exclusion armement de guerre
  vices_excluded BOOLEAN NOT NULL DEFAULT true, -- Exclusion jeux d'argent, tabac, pornographie
  episcopal_guidelines TEXT NOT NULL, -- Ex: 'Conforme CEF & USCCB'
  carbon_intensity_tco2e NUMERIC(8, 2) NOT NULL,
  labels TEXT[] DEFAULT '{}',
  
  -- Informations Clés & Synthèse
  aum_millions NUMERIC(12, 2) NOT NULL,
  expense_ratio_ter_pct NUMERIC(5, 2) NOT NULL,
  fund_domicile TEXT NOT NULL,
  inception_date DATE NOT NULL,
  distribution_policy TEXT NOT NULL DEFAULT 'Partage',
  
  -- Revenus & Dividendes (Prisme Catholique & DSE)
  dividend_yield_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
  payment_frequency TEXT NOT NULL DEFAULT 'Annuelle',
  payout_ratio_pct NUMERIC(5, 2) DEFAULT 40.0,
  catholic_income_note TEXT,
  
  -- Holdings majeurs (JSONB)
  top_holdings JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  impact_description TEXT NOT NULL,
  source_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE assets_dictionary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assets_dictionary_public_read" 
ON assets_dictionary FOR SELECT 
USING (true);

-- 3. Table des actualités dédiées aux ISINs et finance chrétienne
CREATE TABLE IF NOT EXISTS asset_news (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  isin TEXT REFERENCES assets_dictionary(isin) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  source_name TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  news_url TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('positive', 'neutral', 'warning')),
  category TEXT NOT NULL -- 'Doctrine Sociale', 'Laudato Si', 'Bioéthique', 'Performance'
);

ALTER TABLE asset_news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asset_news_public_read" 
ON asset_news FOR SELECT 
USING (true);

-- 4. Table User Portfolios
CREATE TABLE IF NOT EXISTS user_portfolios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  isin TEXT REFERENCES assets_dictionary(isin) ON DELETE CASCADE NOT NULL,
  quantity NUMERIC(12, 4) DEFAULT 1.0 NOT NULL,
  average_entry_price NUMERIC(12, 2),
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, isin)
);

ALTER TABLE user_portfolios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_portfolios_select_own" 
ON user_portfolios FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "user_portfolios_insert_own" 
ON user_portfolios FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_portfolios_delete_own" 
ON user_portfolios FOR DELETE 
TO authenticated 
USING (auth.uid() = user_id);
