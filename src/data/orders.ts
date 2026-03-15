import { Order } from '../types';
import { products } from './products';

export const mockOrders: Order[] = [
  {
    id: 'ord-001',
    userId: 'user-1',
    items: [
      { product: products[0], quantity: 1, priceAtPurchase: 249.99 },
      { product: products[2], quantity: 1, priceAtPurchase: 399.0 },
    ],
    total: 648.99,
    status: 'delivered',
    createdAt: '2026-02-10T14:22:00Z',
    estimatedDelivery: '2026-02-15T00:00:00Z',
    shippingAddress: '42 Maple Street, London, SW1A 1AA',
  },
  {
    id: 'ord-002',
    userId: 'user-1',
    items: [
      { product: products[4], quantity: 2, priceAtPurchase: 89.99 },
      { product: products[6], quantity: 1, priceAtPurchase: 139.99 },
    ],
    total: 319.97,
    status: 'shipped',
    createdAt: '2026-03-01T09:15:00Z',
    estimatedDelivery: '2026-03-10T00:00:00Z',
    shippingAddress: '42 Maple Street, London, SW1A 1AA',
  },
  {
    id: 'ord-003',
    userId: 'user-1',
    items: [
      { product: products[8], quantity: 1, priceAtPurchase: 549.0 },
    ],
    total: 549.0,
    status: 'processing',
    createdAt: '2026-03-14T18:42:00Z',
    estimatedDelivery: '2026-03-22T00:00:00Z',
    shippingAddress: '42 Maple Street, London, SW1A 1AA',
  },
  {
    id: 'ord-004',
    userId: 'user-1',
    items: [
      { product: products[14], quantity: 1, priceAtPurchase: 18.99 },
      { product: products[15], quantity: 1, priceAtPurchase: 22.5 },
      { product: products[16], quantity: 2, priceAtPurchase: 48.0 },
    ],
    total: 137.49,
    status: 'delivered',
    createdAt: '2026-01-22T11:00:00Z',
    estimatedDelivery: '2026-01-28T00:00:00Z',
    shippingAddress: '42 Maple Street, London, SW1A 1AA',
  },
];
