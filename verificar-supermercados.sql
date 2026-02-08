-- ==========================================
-- SCRIPT DE VERIFICACIÓN Y CORRECCIÓN
-- Ejecutar en Supabase SQL Editor
-- ==========================================

-- 1. Ver estado actual de supermercados
SELECT
    name,
    logo_emoji,
    display_order,
    is_active,
    CASE
        WHEN is_active THEN '✅ Activo'
        ELSE '❌ Inactivo'
    END as estado
FROM supermarkets
ORDER BY display_order;

-- 2. Activar TODOS los supermercados
UPDATE supermarkets SET is_active = true;

-- 3. Asegurar que Amazon Fresh existe
INSERT INTO supermarkets (name, logo_emoji, color_from, color_to, display_order, is_active)
VALUES ('Amazon Fresh', '📦', 'sky-500', 'blue-600', 7, true)
ON CONFLICT (name) DO UPDATE
SET is_active = true, display_order = 7;

-- 4. Verificar que todos tienen precios estimados
SELECT
    s.name as supermercado,
    COUNT(pe.id) as num_categorias,
    CASE
        WHEN COUNT(pe.id) >= 13 THEN '✅ Completo'
        ELSE '⚠️ Faltan categorías'
    END as estado_precios
FROM supermarkets s
LEFT JOIN price_estimates pe ON s.id = pe.supermarket_id
GROUP BY s.name
ORDER BY num_categorias DESC;

-- 5. Añadir precios faltantes para Amazon Fresh (si es necesario)
DO $$
DECLARE
    amazon_id UUID;
BEGIN
    SELECT id INTO amazon_id FROM supermarkets WHERE name = 'Amazon Fresh';

    IF amazon_id IS NOT NULL THEN
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

-- 6. Resultado final - Debe mostrar 7 supermercados activos
SELECT
    COUNT(*) as total_supermercados,
    SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as activos
FROM supermarkets;

-- Debería mostrar: total_supermercados: 7, activos: 7
