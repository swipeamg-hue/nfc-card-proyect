-- ==============================================================================
-- TAPCARD NFC SAAS - SUPABASE DATABASE SCHEMA
-- ==============================================================================

-- 1. Businesses Table (Empresas y Perfiles Digitales)
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT TRUE,
  category TEXT DEFAULT 'Servicios Generales',
  bio TEXT DEFAULT '',
  banner_url TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  theme_color TEXT DEFAULT '#0284c7',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  email TEXT DEFAULT '',
  address TEXT DEFAULT '',
  google_maps_url TEXT DEFAULT '',
  catalog_url TEXT DEFAULT '',
  catalog_title TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  quick_access JSONB DEFAULT '{"enabled": true, "showPhone": true, "showEmail": true, "showMaps": true, "showCatalog": false}'::jsonb,
  plan TEXT DEFAULT 'PRO' CHECK (plan IN ('STARTER', 'PRO', 'ENTERPRISE')),
  account_status TEXT DEFAULT 'ACTIVE' CHECK (account_status IN ('ACTIVE', 'TRIAL', 'PAUSED')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Business Links Table (Enlaces dinámicos del perfil)
CREATE TABLE IF NOT EXISTS public.business_links (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  url TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  highlighted BOOLEAN DEFAULT FALSE,
  custom_color TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. NFC Cards Table (Tarjetas y llaveros NFC físicos vinculados)
CREATE TABLE IF NOT EXISTS public.nfc_cards (
  id TEXT PRIMARY KEY,
  card_code TEXT UNIQUE NOT NULL,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'UNASSIGNED')),
  total_taps INTEGER DEFAULT 0,
  last_tap_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tap Metrics Table (Métricas de toques NFC y escaneos QR en tiempo real)
CREATE TABLE IF NOT EXISTS public.tap_metrics (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  card_code TEXT,
  source TEXT DEFAULT 'DIRECT' CHECK (source IN ('NFC', 'QR', 'DIRECT')),
  device_type TEXT DEFAULT 'MOBILE',
  clicked_item TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. App Users Table (Cuentas de clientes y administradores)
CREATE TABLE IF NOT EXISTS public.app_users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'CLIENT' CHECK (role IN ('SUPER_ADMIN', 'CLIENT')),
  business_id TEXT REFERENCES public.businesses(id) ON DELETE SET NULL,
  business_slug TEXT,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Row Level Security (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tap_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso para API pública / anónima
CREATE POLICY "Public full access to businesses" ON public.businesses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to business_links" ON public.business_links FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to nfc_cards" ON public.nfc_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to tap_metrics" ON public.tap_metrics FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public full access to app_users" ON public.app_users FOR ALL USING (true) WITH CHECK (true);

-- 7. Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses, public.business_links, public.nfc_cards, public.tap_metrics;

-- 8. Storage Bucket para imágenes y logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access To Assets" ON storage.objects 
FOR ALL USING (bucket_id = 'business-assets') 
WITH CHECK (bucket_id = 'business-assets');
