-- ==========================================
-- SCRIPT DE CONFIGURACIÓN DE SUPABASE
-- Para la aplicación ListaCompra
-- ==========================================

-- Ejecuta este script en el SQL Editor de Supabase
-- Dashboard -> SQL Editor -> New Query

-- ==========================================
-- 1. CREAR TABLAS
-- ==========================================

-- Tabla de listas de compra
CREATE TABLE IF NOT EXISTS shopping_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    access_code VARCHAR(6) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de productos/items
CREATE TABLE IF NOT EXISTS shopping_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    category TEXT DEFAULT 'Otros',
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de historial de compras (para estadísticas)
CREATE TABLE IF NOT EXISTS purchase_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    category TEXT DEFAULT 'Otros',
    action TEXT NOT NULL, -- 'added', 'purchased', 'deleted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 2. CREAR ÍNDICES PARA MEJOR RENDIMIENTO
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_shopping_items_list_id ON shopping_items(list_id);
CREATE INDEX IF NOT EXISTS idx_shopping_items_completed ON shopping_items(completed);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_access_code ON shopping_lists(access_code);
CREATE INDEX IF NOT EXISTS idx_purchase_history_list_id ON purchase_history(list_id);
CREATE INDEX IF NOT EXISTS idx_purchase_history_action ON purchase_history(action);
CREATE INDEX IF NOT EXISTS idx_purchase_history_created_at ON purchase_history(created_at);

-- ==========================================
-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- ==========================================

ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_history ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. CREAR POLÍTICAS DE ACCESO PÚBLICO
-- (Para la app sin autenticación)
-- ==========================================

-- Políticas para shopping_lists
CREATE POLICY "Permitir lectura pública de listas" ON shopping_lists
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserción pública de listas" ON shopping_lists
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de listas" ON shopping_lists
    FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación pública de listas" ON shopping_lists
    FOR DELETE USING (true);

-- Políticas para shopping_items
CREATE POLICY "Permitir lectura pública de items" ON shopping_items
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserción pública de items" ON shopping_items
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir actualización pública de items" ON shopping_items
    FOR UPDATE USING (true);

CREATE POLICY "Permitir eliminación pública de items" ON shopping_items
    FOR DELETE USING (true);

-- Políticas para purchase_history
CREATE POLICY "Permitir lectura pública de historial" ON purchase_history
    FOR SELECT USING (true);

CREATE POLICY "Permitir inserción pública de historial" ON purchase_history
    FOR INSERT WITH CHECK (true);

-- ==========================================
-- 5. HABILITAR REALTIME
-- ==========================================

-- Habilitar publicación de cambios en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_items;
ALTER PUBLICATION supabase_realtime ADD TABLE shopping_lists;

-- ==========================================
-- 6. FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
-- ==========================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar timestamps automáticamente
DROP TRIGGER IF EXISTS update_shopping_lists_updated_at ON shopping_lists;
CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_shopping_items_updated_at ON shopping_items;
CREATE TRIGGER update_shopping_items_updated_at
    BEFORE UPDATE ON shopping_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 7. FUNCIÓN PARA LIMPIAR LISTAS ANTIGUAS (OPCIONAL)
-- ==========================================

-- Esta función elimina listas que no se han usado en 30 días
CREATE OR REPLACE FUNCTION cleanup_old_lists()
RETURNS void AS $$
BEGIN
    DELETE FROM shopping_lists
    WHERE updated_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- VERIFICACIÓN
-- ==========================================

-- Ejecuta estas consultas para verificar que todo está configurado:

-- SELECT * FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ==========================================
-- ¡LISTO! Tu base de datos está configurada
-- ==========================================
