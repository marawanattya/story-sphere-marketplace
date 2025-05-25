
import { Book } from '../components/BookCard';

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Silent Observer',
    author: 'Sarah Mitchell',
    price: 24.99,
    category: 'Mystery',
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    description: 'A gripping mystery that will keep you guessing until the very last page. Detective Sarah Chen investigates a series of seemingly unconnected disappearances.',
    rating: 4.5,
    inStock: true
  },
  {
    id: '2',
    title: 'Digital Horizons',
    author: 'Michael Chen',
    price: 19.99,
    category: 'Science Fiction',
    cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
    description: 'A thought-provoking sci-fi novel about the future of artificial intelligence and human consciousness in a digital world.',
    rating: 4.8,
    inStock: true
  },
  {
    id: '3',
    title: 'Hearts in Harmony',
    author: 'Emma Rodriguez',
    price: 16.99,
    category: 'Romance',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    description: 'A heartwarming romance about two musicians who find love through their shared passion for music.',
    rating: 4.2,
    inStock: true
  },
  {
    id: '4',
    title: 'The Last Kingdom',
    author: 'Robert Blackwood',
    price: 22.99,
    category: 'Fantasy',
    cover: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
    description: 'An epic fantasy adventure following a young prince as he fights to reclaim his rightful throne.',
    rating: 4.6,
    inStock: false
  },
  {
    id: '5',
    title: 'Mindful Living',
    author: 'Dr. Amanda Walsh',
    price: 18.99,
    category: 'Self-Help',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop',
    description: 'A practical guide to incorporating mindfulness into your daily routine for better mental health and productivity.',
    rating: 4.4,
    inStock: true
  },
  {
    id: '6',
    title: 'The Art of Innovation',
    author: 'James Parker',
    price: 27.99,
    category: 'Business',
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=400&fit=crop',
    description: 'Learn the strategies and mindset needed to drive innovation in any organization or industry.',
    rating: 4.3,
    inStock: true
  },
  {
    id: '7',
    title: 'Cooking with Passion',
    author: 'Chef Maria Santos',
    price: 29.99,
    category: 'Cooking',
    cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    description: 'A collection of authentic recipes and cooking techniques from around the world, perfect for home chefs.',
    rating: 4.7,
    inStock: true
  },
  {
    id: '8',
    title: 'Ancient Civilizations',
    author: 'Dr. Elizabeth Turner',
    price: 32.99,
    category: 'History',
    cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
    description: 'Explore the rise and fall of great civilizations and their lasting impact on the modern world.',
    rating: 4.5,
    inStock: true
  }
];

export const mockCategories = [
  'Fiction',
  'Romance',
  'Mystery',
  'Fantasy',
  'Science Fiction',
  'Self-Help',
  'Business',
  'History',
  'Cooking',
  'Biography',
  'Travel',
  'Art'
];

export const mockUsers = [
  {
    id: '1',
    email: 'marawan.attallah@ejust.edu.eg',
    password: '123456789',
    name: 'Marawan Attallah',
    role: 'admin'
  },
  {
    id: '2',
    email: 'Marawanatya0112@gmail.com',
    password: '987654321',
    name: 'Marawan User',
    role: 'user'
  }
];
