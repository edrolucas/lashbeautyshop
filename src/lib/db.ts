import { supabase } from './supabase';

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  description: string;
  image_url: string;
  category_id: string;
  badge?: 'destaque' | 'mais_vendido' | 'promocao' | null;
  featured?: boolean;
  featured_order?: number;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock' | null;
}

export interface Order {
  id: string;
  customer_name: string;
  products: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }[];
  total_price: number;
  status: 'pending' | 'confirmed' | 'deleted';
  created_at: string;
}

export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.warn('getCategories Error:', error);
      return [] as Category[];
    }
    return data as Category[];
  } catch (err) {
    console.error('getCategories Exception:', err);
    return [] as Category[];
  }
}

export async function getProducts(categoryId?: string, searchTerm?: string) {
  try {
    let query = supabase.from('products').select('*');
    
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.warn('getProducts Error:', error);
      return [] as Product[];
    }
    return data as Product[];
  } catch (err) {
    console.error('getProducts Exception:', err);
    return [] as Product[];
  }
}

export async function getFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .order('featured_order', { ascending: true });

    if (error) {
      // If columns don't exist yet (migration not run), return empty array
      console.warn('getFeaturedProducts:', error.message);
      return [] as Product[];
    }
    return data as Product[];
  } catch {
    return [] as Product[];
  }
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function createOrder(order: Omit<Order, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select()
    .single();
  
  if (error) throw error;
  return data as Order;
}

// Admin Functions
export async function createCategory(name: string) {
  const { data, error } = await supabase
    .from('categories')
    .insert([{ name }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, name: string) {
  const { data, error } = await supabase
    .from('categories')
    .update({ name })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string) {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function createProduct(product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function uploadProductImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `products/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file);

  if (uploadError) {
    if (uploadError.message.includes('Bucket not found')) {
      throw new Error('O bucket "product-images" não foi encontrado no Supabase Storage. Certifique-se de criá-lo no painel do Supabase antes de fazer o upload.');
    }
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('product-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function updateProduct(id: string, product: Omit<Product, 'id'>) {
  const { data, error } = await supabase
    .from('products')
    .update(product)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProductFeatured(
  id: string,
  featured: boolean,
  badge: Product['badge'],
  featured_order: number,
  sale_price?: number | null
) {
  const { data, error } = await supabase
    .from('products')
    .update({ featured, badge, featured_order, sale_price })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string) {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

export async function getOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Order[];
}

export async function updateOrderStatus(id: string, status: Order['status']) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteOrder(id: string) {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
export async function getDashboardStats() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_price, status, created_at');

  if (error) throw error;

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    totalSales: 0,           // Approved sales all time
    monthlyApprovedSales: 0, // Approved sales this month
    pendingOrders: 0,
    confirmedOrders: 0,
    totalOrders: orders.length
  };

  orders.forEach(order => {
    const orderDate = new Date(order.created_at);
    
    if (order.status === 'confirmed') {
      stats.totalSales += Number(order.total_price);
      stats.confirmedOrders += 1;
      
      if (orderDate >= startOfMonth) {
        stats.monthlyApprovedSales += Number(order.total_price);
      }
    } else if (order.status === 'pending') {
      stats.pendingOrders += 1;
    }
  });

  return stats;
}

export async function resetDashboardData() {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('status', 'confirmed');
  
  if (error) throw error;
}
