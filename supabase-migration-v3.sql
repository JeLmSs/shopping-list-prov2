-- ==========================================
-- MIGRACIÓN V3: Precios Reales + Amazon Fresh + URLs
-- Para la aplicación ListaCompra
-- ==========================================
-- Ejecuta este script DESPUÉS de supabase-migration-v2.sql
-- Dashboard -> SQL Editor -> New Query
-- ==========================================

-- ==========================================
-- 1. AÑADIR AMAZON FRESH
-- ==========================================

INSERT INTO supermarkets (name, logo_emoji, color_from, color_to, display_order, is_active) VALUES
    ('Amazon Fresh', '📦', 'sky-500', 'blue-600', 7, true)
ON CONFLICT (name) DO NOTHING;

-- Añadir precios estimados para Amazon Fresh
DO $$
DECLARE
    amazon_id UUID;
BEGIN
    SELECT id INTO amazon_id FROM supermarkets WHERE name = 'Amazon Fresh';

    IF amazon_id IS NOT NULL THEN
        -- Precios competitivos (similar a Alcampo/Carrefour)
        INSERT INTO price_estimates (supermarket_id, category, estimated_price_per_unit) VALUES
            (amazon_id, 'Frutas y Verduras', 2.58),
            (amazon_id, 'Carnes', 8.70),
            (amazon_id, 'Pescados y Mariscos', 12.30),
            (amazon_id, 'Lácteos', 2.78),
            (amazon_id, 'Panadería', 1.52),
            (amazon_id, 'Bebidas', 1.80),
            (amazon_id, 'Despensa', 3.28),
            (amazon_id, 'Congelados', 4.58),
            (amazon_id, 'Limpieza', 2.50),
            (amazon_id, 'Higiene Personal', 3.08),
            (amazon_id, 'Snacks y Dulces', 2.28),
            (amazon_id, 'Mascotas', 15.30),
            (amazon_id, 'Otros', 5.15)
        ON CONFLICT (supermarket_id, category) DO NOTHING;
    END IF;
END $$;

-- ==========================================
-- 2. AÑADIR CAMPO URL A PRODUCTOS
-- ==========================================

ALTER TABLE shopping_items ADD COLUMN IF NOT EXISTS product_url TEXT;

-- Índice para búsquedas rápidas por URL
CREATE INDEX IF NOT EXISTS idx_shopping_items_product_url ON shopping_items(product_url) WHERE product_url IS NOT NULL;

-- ==========================================
-- 3. MEJORAR TABLA DE PRECIOS
-- ==========================================

-- Añadir campos para distinguir precios estimados vs reales
ALTER TABLE item_prices ADD COLUMN IF NOT EXISTS is_real_price BOOLEAN DEFAULT FALSE;
ALTER TABLE item_prices ADD COLUMN IF NOT EXISTS source TEXT; -- 'manual', 'api', 'scraping', etc.
ALTER TABLE item_prices ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE;

-- Renombrar columna para claridad
ALTER TABLE item_prices RENAME COLUMN custom_price TO price;

-- Comentarios para documentación
COMMENT ON COLUMN item_prices.price IS 'Precio del producto en este supermercado (puede ser estimado o real)';
COMMENT ON COLUMN item_prices.is_real_price IS 'TRUE si es precio real verificado, FALSE si es estimado/manual';
COMMENT ON COLUMN item_prices.source IS 'Origen del precio: manual, api, scraping, estimated';
COMMENT ON COLUMN item_prices.last_verified_at IS 'Última vez que se verificó este precio';

-- ==========================================
-- 4. TABLA DE ENLACES DE CARRITO
-- ==========================================

-- Para almacenar URLs de "añadir al carrito" de cada supermercado
CREATE TABLE IF NOT EXISTS cart_urls (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID REFERENCES shopping_items(id) ON DELETE CASCADE,
    supermarket_id UUID REFERENCES supermarkets(id) ON DELETE CASCADE,
    cart_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(item_id, supermarket_id)
);

-- Índices para cart_urls
CREATE INDEX IF NOT EXISTS idx_cart_urls_item ON cart_urls(item_id);
CREATE INDEX IF NOT EXISTS idx_cart_urls_supermarket ON cart_urls(supermarket_id);

-- ==========================================
-- 5. HABILITAR RLS EN NUEVAS TABLAS
-- ==========================================

ALTER TABLE cart_urls ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. POLÍTICAS RLS
-- ==========================================

CREATE POLICY "Permitir todo público en cart_urls"
    ON cart_urls FOR ALL USING (true);

-- ==========================================
-- 7. TRIGGERS PARA TIMESTAMPS
-- ==========================================

DROP TRIGGER IF EXISTS update_cart_urls_updated_at ON cart_urls;
CREATE TRIGGER update_cart_urls_updated_at
    BEFORE UPDATE ON cart_urls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 8. FUNCIÓN PARA ACTUALIZAR PRECIO REAL
-- ==========================================

CREATE OR REPLACE FUNCTION update_real_price(
    p_item_id UUID,
    p_supermarket_id UUID,
    p_price DECIMAL(10,2),
    p_source TEXT DEFAULT 'manual',
    p_product_url TEXT DEFAULT NULL,
    p_cart_url TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    -- Actualizar o insertar precio
    INSERT INTO item_prices (item_id, supermarket_id, price, is_real_price, source, last_verified_at)
    VALUES (p_item_id, p_supermarket_id, p_price, true, p_source, NOW())
    ON CONFLICT (item_id, supermarket_id)
    DO UPDATE SET
        price = p_price,
        is_real_price = true,
        source = p_source,
        last_verified_at = NOW();

    -- Si hay URL del producto, actualizarla
    IF p_product_url IS NOT NULL THEN
        UPDATE shopping_items
        SET product_url = p_product_url
        WHERE id = p_item_id;
    END IF;

    -- Si hay URL del carrito, guardarla
    IF p_cart_url IS NOT NULL THEN
        INSERT INTO cart_urls (item_id, supermarket_id, cart_url, is_verified)
        VALUES (p_item_id, p_supermarket_id, p_cart_url, true)
        ON CONFLICT (item_id, supermarket_id)
        DO UPDATE SET
            cart_url = p_cart_url,
            is_verified = true,
            updated_at = NOW();
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 9. FUNCIÓN PARA GENERAR ENLACE DE LISTA
-- ==========================================

-- Genera un enlace compartible con todos los productos de la lista
-- para cada supermercado (si soportan deep linking)
CREATE OR REPLACE FUNCTION get_shopping_cart_link(
    p_list_id UUID,
    p_supermarket_id UUID
)
RETURNS TEXT AS $$
DECLARE
    supermarket_name TEXT;
    base_url TEXT;
    items_json TEXT;
BEGIN
    -- Obtener nombre del supermercado
    SELECT name INTO supermarket_name FROM supermarkets WHERE id = p_supermarket_id;

    -- URLs base de cada supermercado (pueden necesitar ajustes según API real)
    CASE supermarket_name
        WHEN 'Amazon Fresh' THEN
            base_url := 'https://www.amazon.es/gp/aws/cart/add.html?';
        WHEN 'Carrefour' THEN
            base_url := 'https://www.carrefour.es/cart?';
        ELSE
            base_url := NULL;
    END CASE;

    -- Si no hay URL base, retornar NULL
    IF base_url IS NULL THEN
        RETURN NULL;
    END IF;

    -- Por ahora, retornar la URL base
    -- En una implementación real, aquí se construiría la URL con los productos
    RETURN base_url;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- 10. HABILITAR REALTIME
-- ==========================================

ALTER PUBLICATION supabase_realtime ADD TABLE cart_urls;

-- ==========================================
-- VERIFICACIÓN
-- ==========================================

-- Verificar que Amazon Fresh se añadió
-- SELECT * FROM supermarkets WHERE name = 'Amazon Fresh';

-- Verificar precios de Amazon Fresh
-- SELECT category, estimated_price_per_unit
-- FROM price_estimates pe
-- JOIN supermarkets s ON pe.supermarket_id = s.id
-- WHERE s.name = 'Amazon Fresh'
-- ORDER BY category;

-- Verificar que la columna product_url existe
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'shopping_items' AND column_name = 'product_url';

-- ==========================================
-- FIN DE LA MIGRACIÓN V3
-- ==========================================
