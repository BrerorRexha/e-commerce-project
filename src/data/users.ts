import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  },
  {
    id: 'user-2',
    name: 'Sam Rivera',
    email: 'sam@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  },
];

// Demo credentials: alex@example.com / password123
export const DEMO_PASSWORD = 'password123';
