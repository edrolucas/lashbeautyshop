-- ========================================
-- SCHEMA INICIAL
-- ========================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  badge TEXT CHECK (badge IN ('destaque', 'mais_vendido', 'promocao')),
  featured BOOLEAN DEFAULT FALSE,
  featured_order INTEGER DEFAULT 0
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  products JSONB NOT NULL,
  total_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'deleted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Optional, for production you should set up proper policies)
-- ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- ========================================
-- MIGRAÇÃO — Execute se a tabela products já existir
-- ========================================
-- ALTER TABLE products
--   ADD COLUMN IF NOT EXISTS badge TEXT CHECK (badge IN ('destaque', 'mais_vendido', 'promocao')),
--   ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
--   ADD COLUMN IF NOT EXISTS featured_order INTEGER DEFAULT 0;

-- Sample Data (Optional)
-- INSERT INTO categories (name) VALUES ('Cílios'), ('Sobrancelhas'), ('Acessórios'), ('Tratamentos'), ('Depilação');
