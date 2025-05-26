
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  category: string;
  cover: string;
  description: string;
  rating: number;
  inStock: boolean;
}

interface BookCardProps {
  book: Book;
  onAddToCart: (book: Book) => void;
  onViewDetails: (book: Book) => void;
}

const BookCard = ({ book, onAddToCart, onViewDetails }: BookCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-200">
      <div className="relative overflow-hidden">
        <img
          src={book.cover}
          alt={book.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            {book.category}
          </Badge>
        </div>
        {!book.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Badge variant="destructive">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-2xl font-bold text-amber-600">${book.price}</span>
          <div className="flex items-center">
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600 ml-1">{book.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm line-clamp-3">{book.description}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 space-y-2">
        <Button
          onClick={() => onViewDetails(book)}
          variant="outline"
          className="w-full border-amber-600 text-amber-600 hover:bg-amber-50"
        >
          View Details
        </Button>
        <Button
          onClick={() => onAddToCart(book)}
          disabled={!book.inStock}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          {book.inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
