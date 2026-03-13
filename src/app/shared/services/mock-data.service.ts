import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Product, Category, Order, StockAlert, DashboardStats, ActivityItem
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class MockDataService {

  private products$ = new BehaviorSubject<Product[]>(this.generateProducts());
  private categories$ = new BehaviorSubject<Category[]>(this.generateCategories());
  private orders$ = new BehaviorSubject<Order[]>(this.generateOrders());

  // --- Products ---
  getProducts(): Observable<Product[]> {
    return this.products$.asObservable();
  }

  getProductById(id: number): Observable<Product | undefined> {
    return this.products$.pipe(map(p => p.find(x => x.id === id)));
  }

  addProduct(product: Partial<Product>): void {
    const current = this.products$.value;
    const newProduct: Product = {
      id: current.length + 1,
      sku: product.sku || `SKU-${String(current.length + 1).padStart(4, '0')}`,
      name: product.name || '',
      category: product.category || '',
      brand: product.brand || '',
      price: product.price || 0,
      cost: product.cost || 0,
      quantity: product.quantity || 0,
      lowStockThreshold: product.lowStockThreshold || 5,
      image: product.image || 'assets/placeholder.png',
      status: this.calcStatus(product.quantity || 0, product.lowStockThreshold || 5),
      lastUpdated: new Date()
    };
    this.products$.next([newProduct, ...current]);
    this.refreshCategories();
  }

  updateProduct(id: number, changes: Partial<Product>): void {
    const current = this.products$.value.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...changes, lastUpdated: new Date() };
        updated.status = this.calcStatus(updated.quantity, updated.lowStockThreshold);
        return updated;
      }
      return p;
    });
    this.products$.next(current);
    this.refreshCategories();
  }

  deleteProduct(id: number): void {
    this.products$.next(this.products$.value.filter(p => p.id !== id));
    this.refreshCategories();
  }

  // --- Categories ---
  getCategories(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  addCategory(cat: Partial<Category>): void {
    const current = this.categories$.value;
    const newCat: Category = {
      id: current.length + 1,
      name: cat.name || '',
      slug: (cat.name || '').toLowerCase().replace(/\s+/g, '-'),
      productCount: 0,
      icon: cat.icon || 'category',
      color: cat.color || '#607D8B'
    };
    this.categories$.next([...current, newCat]);
  }

  deleteCategory(id: number): void {
    this.categories$.next(this.categories$.value.filter(c => c.id !== id));
  }

  // --- Orders ---
  getOrders(): Observable<Order[]> {
    return this.orders$.asObservable();
  }

  // --- Alerts ---
  getAlerts(): Observable<StockAlert[]> {
    return this.products$.pipe(
      map(products => products
        .filter(p => p.status !== 'in_stock')
        .map((p, i) => ({
          id: i + 1,
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          currentStock: p.quantity,
          threshold: p.lowStockThreshold,
          severity: (p.quantity === 0 ? 'critical' : 'warning') as 'critical' | 'warning',
          date: p.lastUpdated
        }))
        .sort((a, b) => a.severity === 'critical' ? -1 : 1)
      )
    );
  }

  // --- Dashboard ---
  getDashboardStats(): Observable<DashboardStats> {
    return this.products$.pipe(
      map(products => {
        const catMap = new Map<string, number>();
        let totalValue = 0;
        let lowStockCount = 0;

        products.forEach(p => {
          totalValue += p.price * p.quantity;
          if (p.status !== 'in_stock') lowStockCount++;
          catMap.set(p.category, (catMap.get(p.category) || 0) + 1);
        });

        const topCategories = Array.from(catMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        return {
          totalProducts: products.length,
          totalValue,
          lowStockCount,
          totalOrders: this.orders$.value.length,
          monthlySales: this.orders$.value
            .filter(o => o.type === 'sale' && o.status === 'completed')
            .reduce((sum, o) => sum + o.total, 0),
          topCategories,
          recentActivity: this.generateActivity(),
          salesData: this.generateSalesData()
        };
      })
    );
  }

  // --- Helpers ---
  private calcStatus(qty: number, threshold: number): Product['status'] {
    if (qty === 0) return 'out_of_stock';
    if (qty <= threshold) return 'low_stock';
    return 'in_stock';
  }

  private refreshCategories(): void {
    const products = this.products$.value;
    const cats = this.categories$.value.map(c => ({
      ...c,
      productCount: products.filter(p => p.category === c.name).length
    }));
    this.categories$.next(cats);
  }

  private generateProducts(): Product[] {
    const items: Partial<Product>[] = [
      { name: 'Element Section Complete 8.0"', category: 'Complete Decks', brand: 'Element', price: 129.99, cost: 72, quantity: 14, sku: 'SKU-0001' },
      { name: 'Baker Brand Logo Deck 8.25"', category: 'Decks', brand: 'Baker', price: 64.99, cost: 35, quantity: 22, sku: 'SKU-0002' },
      { name: 'Girl Rick Howard Deck 8.0"', category: 'Decks', brand: 'Girl', price: 59.99, cost: 32, quantity: 8, sku: 'SKU-0003' },
      { name: 'Independent Stage 11 Trucks 149mm', category: 'Trucks', brand: 'Independent', price: 54.99, cost: 28, quantity: 30, sku: 'SKU-0004' },
      { name: 'Thunder Titanium Lights 148', category: 'Trucks', brand: 'Thunder', price: 64.99, cost: 35, quantity: 18, sku: 'SKU-0005' },
      { name: 'Venture V-Hollow 5.2 High', category: 'Trucks', brand: 'Venture', price: 49.99, cost: 25, quantity: 3, sku: 'SKU-0006' },
      { name: 'Spitfire Formula Four 52mm 99a', category: 'Wheels', brand: 'Spitfire', price: 36.99, cost: 18, quantity: 45, sku: 'SKU-0007' },
      { name: 'Bones STF V5 53mm', category: 'Wheels', brand: 'Bones', price: 34.99, cost: 17, quantity: 38, sku: 'SKU-0008' },
      { name: 'Ricta Clouds 54mm 78a', category: 'Wheels', brand: 'Ricta', price: 32.99, cost: 16, quantity: 2, sku: 'SKU-0009' },
      { name: 'OJ Super Juice 60mm 78a', category: 'Wheels', brand: 'OJ', price: 38.99, cost: 20, quantity: 0, sku: 'SKU-0010' },
      { name: 'Bones Reds Bearings 8-Pack', category: 'Bearings', brand: 'Bones', price: 21.99, cost: 10, quantity: 55, sku: 'SKU-0011' },
      { name: 'Bronson Speed Co G3 Bearings', category: 'Bearings', brand: 'Bronson', price: 29.99, cost: 14, quantity: 25, sku: 'SKU-0012' },
      { name: 'Bones Swiss Ceramics', category: 'Bearings', brand: 'Bones', price: 129.99, cost: 65, quantity: 4, sku: 'SKU-0013' },
      { name: 'Mob Grip Standard Sheet', category: 'Grip Tape', brand: 'Mob', price: 5.99, cost: 2, quantity: 120, sku: 'SKU-0014' },
      { name: 'Jessup Ultra Grip Sheet', category: 'Grip Tape', brand: 'Jessup', price: 4.99, cost: 2, quantity: 85, sku: 'SKU-0015' },
      { name: 'Grizzly Stamp Print Grip', category: 'Grip Tape', brand: 'Grizzly', price: 12.99, cost: 5, quantity: 0, sku: 'SKU-0016' },
      { name: 'Diamond Bolts 1" Allen', category: 'Hardware', brand: 'Diamond', price: 5.99, cost: 2, quantity: 60, sku: 'SKU-0017' },
      { name: 'Shake Junt Phillips 1"', category: 'Hardware', brand: 'Shake Junt', price: 4.99, cost: 2, quantity: 45, sku: 'SKU-0018' },
      { name: 'Independent Cross Bolts 7/8"', category: 'Hardware', brand: 'Independent', price: 6.99, cost: 3, quantity: 1, sku: 'SKU-0019' },
      { name: 'Santa Cruz Classic Dot Complete 8.0"', category: 'Complete Decks', brand: 'Santa Cruz', price: 119.99, cost: 65, quantity: 11, sku: 'SKU-0020' },
      { name: 'Plan B Team Complete 7.75"', category: 'Complete Decks', brand: 'Plan B', price: 109.99, cost: 60, quantity: 7, sku: 'SKU-0021' },
      { name: 'Primitive Nuevo Script 8.125"', category: 'Decks', brand: 'Primitive', price: 54.99, cost: 30, quantity: 16, sku: 'SKU-0022' },
      { name: 'Real Team Oval 8.06"', category: 'Decks', brand: 'Real', price: 57.99, cost: 31, quantity: 19, sku: 'SKU-0023' },
      { name: 'Krux K5 Standard Trucks 8.25"', category: 'Trucks', brand: 'Krux', price: 44.99, cost: 22, quantity: 12, sku: 'SKU-0024' },
      { name: 'Ace AF1 44 Trucks', category: 'Trucks', brand: 'Ace', price: 52.99, cost: 27, quantity: 9, sku: 'SKU-0025' },
      { name: 'Powell Peralta Dragon 56mm 93a', category: 'Wheels', brand: 'Powell Peralta', price: 29.99, cost: 14, quantity: 20, sku: 'SKU-0026' },
      { name: 'Mini Logo A-Cut 52mm 101a', category: 'Wheels', brand: 'Mini Logo', price: 19.99, cost: 9, quantity: 35, sku: 'SKU-0027' },
      { name: 'Shake Junt Abec 5 Bearings', category: 'Bearings', brand: 'Shake Junt', price: 14.99, cost: 6, quantity: 40, sku: 'SKU-0028' },
      { name: 'Andale Swiss Bearings', category: 'Bearings', brand: 'Andale', price: 39.99, cost: 20, quantity: 15, sku: 'SKU-0029' },
      { name: 'Nike SB Dunk Low Pro', category: 'Footwear', brand: 'Nike SB', price: 109.99, cost: 55, quantity: 6, sku: 'SKU-0030' },
      { name: 'Vans Old Skool Pro', category: 'Footwear', brand: 'Vans', price: 74.99, cost: 38, quantity: 10, sku: 'SKU-0031' },
      { name: 'New Balance Numeric 272', category: 'Footwear', brand: 'New Balance', price: 84.99, cost: 42, quantity: 4, sku: 'SKU-0032' },
      { name: 'Thrasher Flame Logo Hoodie', category: 'Apparel', brand: 'Thrasher', price: 59.99, cost: 28, quantity: 20, sku: 'SKU-0033' },
      { name: 'Santa Cruz Screaming Hand Tee', category: 'Apparel', brand: 'Santa Cruz', price: 29.99, cost: 12, quantity: 35, sku: 'SKU-0034' },
      { name: 'HUF Box Logo Beanie', category: 'Apparel', brand: 'HUF', price: 24.99, cost: 10, quantity: 28, sku: 'SKU-0035' },
      { name: 'Independent Truck Co. Cap', category: 'Apparel', brand: 'Independent', price: 27.99, cost: 12, quantity: 15, sku: 'SKU-0036' },
      { name: 'Pro-Tec Classic Helmet Matte Black', category: 'Safety', brand: 'Pro-Tec', price: 49.99, cost: 24, quantity: 8, sku: 'SKU-0037' },
      { name: 'Triple Eight Dual Certified Helmet', category: 'Safety', brand: 'Triple Eight', price: 44.99, cost: 22, quantity: 5, sku: 'SKU-0038' },
      { name: '187 Killer Pads Combo Pack', category: 'Safety', brand: '187 Killer Pads', price: 64.99, cost: 32, quantity: 3, sku: 'SKU-0039' },
      { name: 'Bronson Speed Co Bearing Cleaner Kit', category: 'Accessories', brand: 'Bronson', price: 16.99, cost: 7, quantity: 18, sku: 'SKU-0040' },
      { name: 'Bones Skate Tool', category: 'Accessories', brand: 'Bones', price: 12.99, cost: 5, quantity: 30, sku: 'SKU-0041' },
      { name: 'Independent Genuine Parts Riser Pads', category: 'Accessories', brand: 'Independent', price: 4.99, cost: 2, quantity: 50, sku: 'SKU-0042' },
      { name: 'Element Skate Backpack', category: 'Accessories', brand: 'Element', price: 49.99, cost: 22, quantity: 7, sku: 'SKU-0043' },
      { name: 'Creature Logo Sticker Pack', category: 'Accessories', brand: 'Creature', price: 6.99, cost: 2, quantity: 0, sku: 'SKU-0044' },
      { name: 'Zero American Punk 8.0"', category: 'Decks', brand: 'Zero', price: 54.99, cost: 29, quantity: 13, sku: 'SKU-0045' },
      { name: 'Toy Machine Monster 8.0"', category: 'Decks', brand: 'Toy Machine', price: 52.99, cost: 28, quantity: 11, sku: 'SKU-0046' },
      { name: 'Enjoi Panda Logo 8.0"', category: 'Decks', brand: 'Enjoi', price: 49.99, cost: 26, quantity: 0, sku: 'SKU-0047' },
      { name: 'Almost Color Logo 7.75"', category: 'Decks', brand: 'Almost', price: 48.99, cost: 25, quantity: 17, sku: 'SKU-0048' },
      { name: 'Globe Goodstock Complete 8.0"', category: 'Complete Decks', brand: 'Globe', price: 99.99, cost: 52, quantity: 9, sku: 'SKU-0049' },
      { name: 'Creature Logo Complete 8.0"', category: 'Complete Decks', brand: 'Creature', price: 114.99, cost: 62, quantity: 5, sku: 'SKU-0050' },
    ];

    return items.map((item, i) => ({
      id: i + 1,
      sku: item.sku || `SKU-${String(i + 1).padStart(4, '0')}`,
      name: item.name || '',
      category: item.category || '',
      brand: item.brand || '',
      price: item.price || 0,
      cost: item.cost || 0,
      quantity: item.quantity || 0,
      lowStockThreshold: 5,
      image: `https://placehold.co/80x80/1a1a2e/e94560?text=${encodeURIComponent((item.brand || '')[0] || 'S')}`,
      status: this.calcStatus(item.quantity || 0, 5),
      lastUpdated: new Date(Date.now() - Math.random() * 7 * 86400000)
    }));
  }

  private generateCategories(): Category[] {
    const cats = [
      { name: 'Complete Decks', icon: 'skateboarding', color: '#e94560' },
      { name: 'Decks', icon: 'dashboard', color: '#0f3460' },
      { name: 'Trucks', icon: 'build', color: '#533483' },
      { name: 'Wheels', icon: 'radio_button_checked', color: '#16213e' },
      { name: 'Bearings', icon: 'settings', color: '#e94560' },
      { name: 'Grip Tape', icon: 'layers', color: '#0f3460' },
      { name: 'Hardware', icon: 'handyman', color: '#533483' },
      { name: 'Footwear', icon: 'directions_walk', color: '#16213e' },
      { name: 'Apparel', icon: 'checkroom', color: '#e94560' },
      { name: 'Safety', icon: 'health_and_safety', color: '#0f3460' },
      { name: 'Accessories', icon: 'backpack', color: '#533483' },
    ];

    const products = this.generateProducts();
    return cats.map((c, i) => ({
      id: i + 1,
      name: c.name,
      slug: c.name.toLowerCase().replace(/\s+/g, '-'),
      productCount: products.filter(p => p.category === c.name).length,
      icon: c.icon,
      color: c.color
    }));
  }

  private generateOrders(): Order[] {
    const customers = ['Yamada Taro', 'Suzuki Hanako', 'Tanaka Kenji', 'Sato Yuki', 'Watanabe Rin', 'Nakamura Hiro', 'Ito Mai', 'Kobayashi Ryu'];
    const suppliers = ['Element Distribution JP', 'NHS Fun Factory', 'Dwindle Supply', 'Tum Yeto', 'Deluxe Distribution'];
    const statuses: Order['status'][] = ['completed', 'processing', 'pending', 'completed', 'completed', 'cancelled'];
    const products = this.generateProducts();

    return Array.from({ length: 30 }, (_, i) => {
      const isSale = Math.random() > 0.35;
      const itemCount = Math.floor(Math.random() * 3) + 1;
      const items = Array.from({ length: itemCount }, () => {
        const p = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 3) + 1;
        return { productId: p.id, productName: p.name, quantity: qty, price: p.price };
      });
      return {
        id: i + 1,
        orderNumber: `ORD-${String(2000 + i).padStart(6, '0')}`,
        type: isSale ? 'sale' as const : 'purchase' as const,
        items,
        total: items.reduce((s, it) => s + it.price * it.quantity, 0),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: new Date(Date.now() - Math.random() * 30 * 86400000),
        customer: isSale ? customers[Math.floor(Math.random() * customers.length)] : undefined,
        supplier: !isSale ? suppliers[Math.floor(Math.random() * suppliers.length)] : undefined,
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private generateActivity(): ActivityItem[] {
    const actions = [
      { action: 'Stock received', type: 'in' as const },
      { action: 'Sold', type: 'out' as const },
      { action: 'Low stock alert', type: 'alert' as const },
      { action: 'New order', type: 'order' as const },
    ];
    const products = this.generateProducts();
    return Array.from({ length: 10 }, (_, i) => {
      const a = actions[Math.floor(Math.random() * actions.length)];
      const p = products[Math.floor(Math.random() * products.length)];
      return {
        id: i + 1,
        action: a.action,
        product: p.name,
        quantity: Math.floor(Math.random() * 10) + 1,
        date: new Date(Date.now() - Math.random() * 3 * 86400000),
        type: a.type
      };
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private generateSalesData() {
    return [
      { month: 'Sep', sales: 4200, purchases: 2800 },
      { month: 'Oct', sales: 5100, purchases: 3200 },
      { month: 'Nov', sales: 6800, purchases: 4100 },
      { month: 'Dec', sales: 8200, purchases: 5500 },
      { month: 'Jan', sales: 5400, purchases: 3800 },
      { month: 'Feb', sales: 6100, purchases: 3600 },
      { month: 'Mar', sales: 7300, purchases: 4200 },
    ];
  }
}
