
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

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
  onAddToCart: (book: Book, quantity: number) => void;
  onViewDetails: (book: Book) => void;
}

const BookCard = ({ book, onAddToCart, onViewDetails }: BookCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value) || 1;
    setQuantity(Math.max(1, numValue));
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  };

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
        
        {book.inStock && (
          <div className="flex items-center space-x-2 w-full">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="sm"
                onClick={decrementQuantity}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                className="w-16 h-8 text-center border-0 px-2"
                min="1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={incrementQuantity}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
            </div>
            <Button
              onClick={() => onAddToCart(book, quantity)}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
            >
              Add to Cart
            </Button>
          </div>
        )}
        
        {!book.inStock && (
          <Button
            disabled
            className="w-full bg-gray-400 text-white cursor-not-allowed"
          >
            Out of Stock
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default BookCard;
