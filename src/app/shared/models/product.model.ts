export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  cost: number;
  quantity: number;
  lowStockThreshold: number;
  image: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: Date;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  productCount: number;
  icon: string;
  color: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  type: 'sale' | 'purchase';
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: Date;
  customer?: string;
  supplier?: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface StockAlert {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  currentStock: number;
  threshold: number;
  severity: 'warning' | 'critical';
  date: Date;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockCount: number;
  totalOrders: number;
  monthlySales: number;
  topCategories: { name: string; count: number }[];
  recentActivity: ActivityItem[];
  salesData: { month: string; sales: number; purchases: number }[];
}

export interface ActivityItem {
  id: number;
  action: string;
  product: string;
  quantity: number;
  date: Date;
  type: 'in' | 'out' | 'alert' | 'order';
}

export interface PageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}
