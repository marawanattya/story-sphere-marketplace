
import React from 'react';
import { ShoppingCart, User, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  cartItemCount: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  onCartClick: () => void;
  onSearchChange: (query: string) => void;
}

const Navbar = ({ 
  cartItemCount, 
  isLoggedIn, 
  isAdmin, 
  onLoginClick, 
  onCartClick,
  onSearchChange 
}: NavbarProps) => {
  return (
    <nav className="bg-white shadow-md border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-amber-600" />
            <span className="text-2xl font-bold text-gray-800">StorySphere</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search books, authors, or categories..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Button 
                variant="ghost" 
                className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                Admin Panel
              </Button>
            )}
            
            <Button
              variant="ghost"
              className="relative p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={onLoginClick}
              className="flex items-center space-x-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50"
            >
              <User className="h-5 w-5" />
              <span>{isLoggedIn ? 'Profile' : 'Login'}</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
