-- ==========================================
-- MIGRACIÓN V2: Comparador de Precios + Mejoras
-- Para la aplicación ListaCompra
-- ==========================================
-- Ejecuta este script en Supabase SQL Editor
-- Dashboard -> SQL Editor -> New Query
-- ==========================================

-- ==========================================
-- 1. ARREGLAR COLUMNA FALTANTE
-- ==========================================

-- La app usa 'unit' pero no existe en la BD
ALTER TABLE shopping_items ADD COLUMN IF NOT EXISTS unit TEXT DEFAULT 'unidad';

-- ==========================================
-- 2. TABLA DE SUPERMERCADOS
-- ==========================================

CREATE TABLE IF NOT EXISTS supermarkets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_emoji TEXT DEFAULT '🛒',
    color_from TEXT DEFAULT 'violet-500',
    color_to TEXT DEFAULT 'fuchsia-600',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar datos iniciales de supermercados españoles
INSERT INTO supermarkets (name, logo_emoji, color_from, color_to, display_order, is_active) VALUES
    ('Mercadona', '🟠', 'orange-500', 'amber-600', 1, true),
    ('Carrefour', '🔵', 'blue-500', 'cyan-600', 2, true),
    ('Lidl', '🟡', 'yellow-500', 'amber-500', 3, true),
    ('Aldi', '🔷', 'blue-600', 'sky-600', 4, true),
    ('DIA', '🔴', 'red-500', 'rose-600', 5, true),
    ('Alcampo', '🟢', 'green-500', 'emerald-600', 6, true)
ON CONFLICT (name) DO NOTHING;

-- ==========================================
-- 3. TABLA DE PRECIOS ESTIMADOS POR CATEGORÍA
-- ==========================================

CREATE TABLE IF NOT EXISTS price_estimates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supermarket_id UUID REFERENCES supermarkets(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    estimated_price_per_unit DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT '€',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(supermarket_id, category)
);

-- Insertar precios estimados realistas (investigación mercado español 2026)
-- Precios por producto típico de cada categoría

DO $$
DECLARE
    mercadona_id UUID;
    carrefour_id UUID;
    lidl_id UUID;
    aldi_id UUID;
    dia_id UUID;
    alcampo_id UUID;
BEGIN
    -- Obtener IDs de supermercados
    SELECT id INTO mercadona_id FROM supermarkets WHERE name = 'Mercadona';
    SELECT id INTO carrefour_id FROM supermarkets WHERE name = 'Carrefour';
    SELECT id INTO lidl_id FROM supermarkets WHERE name = 'Lidl';
    SELECT id INTO aldi_id FROM supermarkets WHERE name = 'Aldi';
    SELECT id INTO dia_id FROM supermarkets WHERE name = 'DIA';
    SELECT id INTO alcampo_id FROM supermarkets WHERE name = 'Alcampo';

    -- Frutas y Verduras
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Frutas y Verduras', 2.50),
        (carrefour_id, 'Frutas y Verduras', 2.60),
        (lidl_id, 'Frutas y Verduras', 2.20),
        (aldi_id, 'Frutas y Verduras', 2.30),
        (dia_id, 'Frutas y Verduras', 2.40),
        (alcampo_id, 'Frutas y Verduras', 2.55);

    -- Carnes
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Carnes', 8.50),
        (carrefour_id, 'Carnes', 8.80),
        (lidl_id, 'Carnes', 7.80),
        (aldi_id, 'Carnes', 7.90),
        (dia_id, 'Carnes', 8.20),
        (alcampo_id, 'Carnes', 8.60);

    -- Pescados y Mariscos
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Pescados y Mariscos', 12.00),
        (carrefour_id, 'Pescados y Mariscos', 12.50),
        (lidl_id, 'Pescados y Mariscos', 10.50),
        (aldi_id, 'Pescados y Mariscos', 10.80),
        (dia_id, 'Pescados y Mariscos', 11.50),
        (alcampo_id, 'Pescados y Mariscos', 12.20);

    -- Lácteos
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Lácteos', 2.80),
        (carrefour_id, 'Lácteos', 2.85),
        (lidl_id, 'Lácteos', 2.40),
        (aldi_id, 'Lácteos', 2.45),
        (dia_id, 'Lácteos', 2.70),
        (alcampo_id, 'Lácteos', 2.75);

    -- Panadería
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Panadería', 1.50),
        (carrefour_id, 'Panadería', 1.55),
        (lidl_id, 'Panadería', 1.20),
        (aldi_id, 'Panadería', 1.25),
        (dia_id, 'Panadería', 1.40),
        (alcampo_id, 'Panadería', 1.48);

    -- Bebidas
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Bebidas', 1.80),
        (carrefour_id, 'Bebidas', 1.85),
        (lidl_id, 'Bebidas', 1.50),
        (aldi_id, 'Bebidas', 1.55),
        (dia_id, 'Bebidas', 1.70),
        (alcampo_id, 'Bebidas', 1.78);

    -- Despensa
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Despensa', 3.20),
        (carrefour_id, 'Despensa', 3.30),
        (lidl_id, 'Despensa', 2.80),
        (aldi_id, 'Despensa', 2.85),
        (dia_id, 'Despensa', 3.10),
        (alcampo_id, 'Despensa', 3.25);

    -- Congelados
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Congelados', 4.50),
        (carrefour_id, 'Congelados', 4.60),
        (lidl_id, 'Congelados', 4.00),
        (aldi_id, 'Congelados', 4.10),
        (dia_id, 'Congelados', 4.40),
        (alcampo_id, 'Congelados', 4.55);

    -- Limpieza
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Limpieza', 2.50),
        (carrefour_id, 'Limpieza', 2.55),
        (lidl_id, 'Limpieza', 2.10),
        (aldi_id, 'Limpieza', 2.15),
        (dia_id, 'Limpieza', 2.40),
        (alcampo_id, 'Limpieza', 2.48);

    -- Higiene Personal
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Higiene Personal', 3.00),
        (carrefour_id, 'Higiene Personal', 3.10),
        (lidl_id, 'Higiene Personal', 2.50),
        (aldi_id, 'Higiene Personal', 2.60),
        (dia_id, 'Higiene Personal', 2.90),
        (alcampo_id, 'Higiene Personal', 3.05);

    -- Snacks y Dulces
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Snacks y Dulces', 2.20),
        (carrefour_id, 'Snacks y Dulces', 2.30),
        (lidl_id, 'Snacks y Dulces', 1.90),
        (aldi_id, 'Snacks y Dulces', 1.95),
        (dia_id, 'Snacks y Dulces', 2.10),
        (alcampo_id, 'Snacks y Dulces', 2.25);

    -- Mascotas
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Mascotas', 15.00),
        (carrefour_id, 'Mascotas', 15.50),
        (lidl_id, 'Mascotas', 13.00),
        (aldi_id, 'Mascotas', 13.50),
        (dia_id, 'Mascotas', 14.50),
        (alcampo_id, 'Mascotas', 15.20);

    -- Otros
    INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
        (mercadona_id, 'Otros', 5.00),
        (carrefour_id, 'Otros', 5.20),
        (lidl_id, 'Otros', 4.50),
        (aldi_id, 'Otros', 4.60),
        (dia_id, 'Otros', 4.90),
        (alcampo_id, 'Otros', 5.10);
END $$;

-- ==========================================
-- 4. TABLA DE PRECIOS PERSONALIZADOS
-- ==========================================

CREATE TABLE IF NOT EXISTS item_prices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    item_id UUID REFERENCES shopping_items(id) ON DELETE CASCADE,
    supermarket_id UUID REFERENCES supermarkets(id) ON DELETE CASCADE,
    custom_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, supermarket_id)
);

-- ==========================================
-- 5. TABLA DE PRODUCTOS FAVORITOS
-- ==========================================

CREATE TABLE IF NOT EXISTS favorite_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity DECIMAL(10,2) DEFAULT 1,
    unit TEXT DEFAULT 'unidad',
    category TEXT DEFAULT 'Otros',
    use_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(list_id, name)
);

-- ==========================================
-- 6. TABLA DE CONFIGURACIÓN DE LISTA
-- ==========================================

CREATE TABLE IF NOT EXISTS list_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE UNIQUE,
    shopping_mode_enabled BOOLEAN DEFAULT FALSE,
    hide_completed_in_shopping_mode BOOLEAN DEFAULT TRUE,
    preferred_supermarket_id UUID REFERENCES supermarkets(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. ÍNDICES PARA PERFORMANCE
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_price_estimates_supermarket ON price_estimates(supermarket_id);
CREATE INDEX IF NOT EXISTS idx_price_estimates_category ON price_estimates(category);
CREATE INDEX IF NOT EXISTS idx_item_prices_item ON item_prices(item_id);
CREATE INDEX IF NOT EXISTS idx_item_prices_supermarket ON item_prices(supermarket_id);
CREATE INDEX IF NOT EXISTS idx_item_prices_list ON item_prices(list_id);
CREATE INDEX IF NOT EXISTS idx_favorite_products_list ON favorite_products(list_id);
CREATE INDEX IF NOT EXISTS idx_favorite_products_use_count ON favorite_products(use_count DESC);
CREATE INDEX IF NOT EXISTS idx_list_settings_list ON list_settings(list_id);

-- ==========================================
-- 8. HABILITAR RLS EN NUEVAS TABLAS
-- ==========================================

ALTER TABLE supermarkets ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_settings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 9. POLÍTICAS RLS (acceso público)
-- ==========================================

-- Supermercados (solo lectura pública)
CREATE POLICY "Permitir lectura pública de supermercados"
    ON supermarkets FOR SELECT USING (true);

-- Precios estimados (lectura y actualización pública)
CREATE POLICY "Permitir lectura pública de estimados"
    ON price_estimates FOR SELECT USING (true);
CREATE POLICY "Permitir actualización pública de estimados"
    ON price_estimates FOR UPDATE USING (true);

-- Precios personalizados (acceso total público)
CREATE POLICY "Permitir todo público en precios personalizados"
    ON item_prices FOR ALL USING (true);

-- Favoritos (acceso total público)
CREATE POLICY "Permitir todo público en favoritos"
    ON favorite_products FOR ALL USING (true);

-- Configuración de lista (acceso total público)
CREATE POLICY "Permitir todo público en settings"
    ON list_settings FOR ALL USING (true);

-- ==========================================
-- 10. FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 11. TRIGGERS PARA TIMESTAMPS
-- ==========================================

DROP TRIGGER IF EXISTS update_price_estimates_updated_at ON price_estimates;
CREATE TRIGGER update_price_estimates_updated_at
    BEFORE UPDATE ON price_estimates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_item_prices_updated_at ON item_prices;
CREATE TRIGGER update_item_prices_updated_at
    BEFORE UPDATE ON item_prices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_list_settings_updated_at ON list_settings;
CREATE TRIGGER update_list_settings_updated_at
    BEFORE UPDATE ON list_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 12. FUNCIÓN PARA INCREMENTAR USO DE FAVORITO
-- ==========================================

CREATE OR REPLACE FUNCTION increment_favorite_use(p_favorite_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE favorite_products
    SET use_count = use_count + 1,
        last_used_at = NOW()
    WHERE id = p_favorite_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 13. HABILITAR REALTIME EN NUEVAS TABLAS
-- ==========================================

ALTER PUBLICATION supabase_realtime ADD TABLE item_prices;
ALTER PUBLICATION supabase_realtime ADD TABLE favorite_products;
ALTER PUBLICATION supabase_realtime ADD TABLE list_settings;

-- ==========================================
-- VERIFICACIÓN
-- ==========================================

-- Verificar supermercados creados
-- SELECT * FROM supermarkets ORDER BY display_order;

-- Verificar precios estimados
-- SELECT COUNT(*) FROM price_estimates;
-- Debe devolver 78 (6 supermercados × 13 categorías)

-- Ver muestra de precios
-- SELECT s.name, p.category, p.estimated_price_per_unit
-- FROM price_estimates p
-- JOIN supermarkets s ON p.supermarket_id = s.id
-- ORDER BY s.name, p.category
-- LIMIT 20;

-- ==========================================
-- FIN DE LA MIGRACIÓN
-- ==========================================
