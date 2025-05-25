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
  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart' | 'admin' | 'add-book' | 'manage-categories' | 'view-orders' | 'edit-books'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

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

  // Admin handlers
  const handleAddNewBook = () => {
    setCurrentView('add-book');
    toast({
      title: "Add New Book",
      description: "Opening add book form...",
    });
  };

  const handleManageCategories = () => {
    setCurrentView('manage-categories');
    toast({
      title: "Manage Categories",
      description: "Opening category management...",
    });
  };

  const handleViewOrders = () => {
    setCurrentView('view-orders');
    toast({
      title: "View Orders",
      description: "Opening order management...",
    });
  };

  const handleEditBooks = () => {
    setCurrentView('edit-books');
    toast({
      title: "Edit Books",
      description: "Opening book editing interface...",
    });
  };

  const handleAddBook = (newBook: Omit<Book, 'id'>) => {
    const book: Book = {
      ...newBook,
      id: String(books.length + 1)
    };
    setBooks(prevBooks => [...prevBooks, book]);
    toast({
      title: "Book added successfully!",
      description: `${book.title} has been added to the catalog`,
    });
    setCurrentView('admin');
  };

  const handleEditBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    if (book) {
      setEditingBook(book);
    }
  };

  const handleUpdateBook = (updatedBook: Book) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.id === updatedBook.id ? updatedBook : book
      )
    );
    setEditingBook(null);
    toast({
      title: "Book updated successfully!",
      description: `${updatedBook.title} has been updated`,
    });
  };

  const handleDeleteBook = (bookId: string) => {
    const book = books.find(b => b.id === bookId);
    setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
    toast({
      title: "Book deleted",
      description: `${book?.title} has been removed from the catalog`,
    });
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

      case 'edit-books':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Edit Books</h1>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  ← Back to Admin Panel
                </button>
              </div>
              
              {editingBook ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Editing: {editingBook.title}</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const updatedBook: Book = {
                      ...editingBook,
                      title: formData.get('title') as string,
                      author: formData.get('author') as string,
                      price: parseFloat(formData.get('price') as string),
                      category: formData.get('category') as string,
                      cover: formData.get('cover') as string || editingBook.cover,
                      description: formData.get('description') as string,
                    };
                    handleUpdateBook(updatedBook);
                  }} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Book Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          defaultValue={editingBook.title}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                          Author
                        </label>
                        <input
                          type="text"
                          id="author"
                          name="author"
                          defaultValue={editingBook.author}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          step="0.01"
                          defaultValue={editingBook.price}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select
                          id="category"
                          name="category"
                          defaultValue={editingBook.category}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                        >
                          {mockCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image URL
                      </label>
                      <input
                        type="url"
                        id="cover"
                        name="cover"
                        defaultValue={editingBook.cover}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        defaultValue={editingBook.description}
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
                      >
                        Update Book
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingBook(null)}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Book Catalog Management</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-3">Cover</th>
                            <th className="text-left p-3">Title</th>
                            <th className="text-left p-3">Author</th>
                            <th className="text-left p-3">Category</th>
                            <th className="text-left p-3">Price</th>
                            <th className="text-left p-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {books.map((book) => (
                            <tr key={book.id} className="border-b hover:bg-gray-50">
                              <td className="p-3">
                                <img 
                                  src={book.cover} 
                                  alt={book.title}
                                  className="w-12 h-16 object-cover rounded"
                                />
                              </td>
                              <td className="p-3 font-medium">{book.title}</td>
                              <td className="p-3">{book.author}</td>
                              <td className="p-3">{book.category}</td>
                              <td className="p-3">${book.price}</td>
                              <td className="p-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditBook(book.id)}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBook(book.id)}
                                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'add-book':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Add New Book</h1>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  ← Back to Admin Panel
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newBook = {
                    title: formData.get('title') as string,
                    author: formData.get('author') as string,
                    price: parseFloat(formData.get('price') as string),
                    category: formData.get('category') as string,
                    cover: formData.get('cover') as string || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
                    description: formData.get('description') as string,
                    rating: 4.0,
                    inStock: true
                  };
                  handleAddBook(newBook);
                  e.currentTarget.reset();
                }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        Book Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                        Author
                      </label>
                      <input
                        type="text"
                        id="author"
                        name="author"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        {mockCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Image URL (optional)
                    </label>
                    <input
                      type="url"
                      id="cover"
                      name="cover"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-amber-600 text-white py-2 px-4 rounded-md hover:bg-amber-700 transition-colors"
                  >
                    Add Book
                  </button>
                </form>
              </div>
            </div>
          </div>
        );

      case 'manage-categories':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  ← Back to Admin Panel
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Current Categories</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mockCategories.map(category => (
                    <div key={category} className="p-3 bg-amber-50 rounded-lg border">
                      <span className="text-sm font-medium text-amber-800">{category}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    Category management functionality would be implemented here. 
                    In a real application, you would be able to add, edit, and delete categories.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'view-orders':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  ← Back to Admin Panel
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-200">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-2 text-left">Order ID</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Customer</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Items</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Total</th>
                        <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2">#001</td>
                        <td className="border border-gray-200 px-4 py-2">John Doe</td>
                        <td className="border border-gray-200 px-4 py-2">2 books</td>
                        <td className="border border-gray-200 px-4 py-2">$45.98</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Completed</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-200 px-4 py-2">#002</td>
                        <td className="border border-gray-200 px-4 py-2">Jane Smith</td>
                        <td className="border border-gray-200 px-4 py-2">1 book</td>
                        <td className="border border-gray-200 px-4 py-2">$24.99</td>
                        <td className="border border-gray-200 px-4 py-2">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Processing</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    This is mock order data. In a real application, orders would be fetched from a database 
                    and you could update order statuses, view order details, and manage customer information.
                  </p>
                </div>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button 
                    onClick={handleAddNewBook}
                    className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700 transition-colors"
                  >
                    Add New Book
                  </button>
                  <button 
                    onClick={handleEditBooks}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Edit Books
                  </button>
                  <button 
                    onClick={handleManageCategories}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    Manage Categories
                  </button>
                  <button 
                    onClick={handleViewOrders}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
                  >
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
                  ['admin', 'add-book', 'manage-categories', 'view-orders', 'edit-books'].includes(currentView)
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
