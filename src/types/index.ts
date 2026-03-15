export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: [string, string, string, string];
  rating: number;
  reviewCount: number;
  inStock: boolean;
  tags: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  estimatedDelivery: string;
  shippingAddress: string;
}
