
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import BookCard, { Book } from '@/components/BookCard';
import ShoppingCart, { CartItem } from '@/components/ShoppingCart';
import AuthModal from '@/components/AuthModal';
import { mockBooks, mockCategories, mockUsers } from '@/data/mockData';

const Index = () => {
  const { toast } = useToast();
  
  // State management
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [books, setBooks] = useState<Book[]>(mockBooks);

  // Filter books based on search and category
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredBooks = books.slice(0, 8);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Authentication handlers
  const handleLogin = (email: string, password: string) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (user) {
      setIsLoggedIn(true);
      setCurrentUser(user);
      setShowAuthModal(false);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    }
  };

  const handleRegister = (email: string, password: string, name: string) => {
    // In a real app, this would create a new user
    const newUser = {
      id: String(mockUsers.length + 1),
      email,
      password,
      name,
      role: 'user'
    };
    mockUsers.push(newUser);
    setIsLoggedIn(true);
    setCurrentUser(newUser);
    setShowAuthModal(false);
    toast({
      title: "Account created!",
      description: `Welcome ${name}! Please check your email for verification.`,
    });
  };

  const handleGoogleAuth = () => {
    // Mock Google authentication
    toast({
      title: "Google Auth",
      description: "Google authentication would be implemented with a real auth service",
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCartItems([]);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Cart handlers
  const handleAddToCart = (book: Book) => {
    const existingItem = cartItems.find(item => item.book.id === book.id);
    if (existingItem) {
      setCartItems(items =>
        items.map(item =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems(items => [...items, { book, quantity: 1 }]);
    }
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart`,
    });
  };

  const handleUpdateQuantity = (bookId: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(bookId);
    } else {
      setCartItems(items =>
        items.map(item =>
          item.book.id === bookId
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleRemoveItem = (bookId: string) => {
    setCartItems(items => items.filter(item => item.book.id !== bookId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const handleCheckout = () => {
    // Mock checkout process
    toast({
      title: "Order placed!",
      description: `Thank you for your order! Total: $${cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0).toFixed(2)}`,
    });
    setCartItems([]);
  };

  const handleViewDetails = (book: Book) => {
    toast({
      title: book.title,
      description: `By ${book.author} - ${book.description.slice(0, 100)}...`,
    });
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('catalog');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query && currentView === 'home') {
      setCurrentView('catalog');
    }
  };

  // Render different views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            featuredBooks={featuredBooks}
            categories={mockCategories}
            onAddToCart={handleAddToCart}
            onViewDetails={handleViewDetails}
            onCategoryClick={handleCategoryClick}
          />
        );
        
      case 'catalog':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Book Catalog</h1>
                  <p className="text-gray-600">
                    {filteredBooks.length} books found
                    {selectedCategory && ` in ${selectedCategory}`}
                    {searchQuery && ` matching "${searchQuery}"`}
                  </p>
                </div>
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    Clear category filter
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onAddToCart={handleAddToCart}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
              
              {filteredBooks.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500 text-lg">No books found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('');
                    }}
                    className="mt-4 text-amber-600 hover:text-amber-700 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'cart':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
              <div className="flex justify-center">
                <ShoppingCart
                  items={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                  isLoggedIn={isLoggedIn}
                  onLoginPrompt={() => setShowAuthModal(true)}
                />
              </div>
            </div>
          </div>
        );
        
      case 'admin':
        if (!currentUser || currentUser.role !== 'admin') {
          return (
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h1>
                <p className="text-gray-600">You need admin privileges to access this page.</p>
              </div>
            </div>
          );
        }
        
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Panel</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Total Books</h3>
                  <p className="text-3xl font-bold text-amber-600">{books.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Categories</h3>
                  <p className="text-3xl font-bold text-amber-600">{mockCategories.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-4">Total Users</h3>
                  <p className="text-3xl font-bold text-amber-600">{mockUsers.length}</p>
                </div>
              </div>
              
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 mr-4">
                    Add New Book
                  </button>
                  <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-4">
                    Manage Categories
                  </button>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartItemCount={cartItemCount}
        isLoggedIn={isLoggedIn}
        isAdmin={currentUser?.role === 'admin'}
        onLoginClick={() => {
          if (isLoggedIn) {
            handleLogout();
          } else {
            setShowAuthModal(true);
          }
        }}
        onCartClick={() => setCurrentView('cart')}
        onSearchChange={handleSearchChange}
      />
      
      {/* Navigation tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentView('home')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'home'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => setCurrentView('catalog')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                currentView === 'catalog'
                  ? 'border-amber-600 text-amber-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Browse Books
            </button>
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  currentView === 'admin'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Admin Panel
              </button>
            )}
          </nav>
        </div>
      </div>

      {renderCurrentView()}

      {showAuthModal && (
        <AuthModal
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGoogleAuth={handleGoogleAuth}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </div>
  );
};

export default Index;
