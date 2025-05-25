
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Book } from './BookCard';

export interface CartItem {
  book: Book;
  quantity: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (bookId: string, quantity: number) => void;
  onRemoveItem: (bookId: string) => void;
  onCheckout: () => void;
  isLoggedIn: boolean;
  onLoginPrompt: () => void;
}

const ShoppingCart = ({ 
  items, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout, 
  isLoggedIn,
  onLoginPrompt 
}: ShoppingCartProps) => {
  const total = items.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  if (items.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <p className="text-sm text-gray-400">Add some books to get started!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Shopping Cart
          <Badge variant="secondary">{itemCount} items</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.book.id} className="flex items-center space-x-3">
            <img
              src={item.book.cover}
              alt={item.book.title}
              className="w-12 h-16 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.book.title}
              </p>
              <p className="text-sm text-gray-500">${item.book.price}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.book.id, Math.max(0, item.quantity - 1))}
                className="h-8 w-8 p-0"
              >
                -
              </Button>
              <span className="text-sm font-medium w-8 text-center">
                {item.quantity}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onUpdateQuantity(item.book.id, item.quantity + 1)}
                className="h-8 w-8 p-0"
              >
                +
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.book.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({itemCount} items)</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-amber-600">${total.toFixed(2)}</span>
          </div>
        </div>
        
        {isLoggedIn ? (
          <Button 
            onClick={onCheckout}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white"
          >
            Proceed to Checkout
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">
              Please log in to complete your purchase
            </p>
            <Button 
              onClick={onLoginPrompt}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Login to Checkout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ShoppingCart;
