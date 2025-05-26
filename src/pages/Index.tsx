
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import HomePage from '@/components/HomePage';
import BookCard, { Book } from '@/components/BookCard';
import ShoppingCart, { CartItem } from '@/components/ShoppingCart';
import AuthModal from '@/components/AuthModal';
import { mockBooks, mockCategories, mockUsers } from '@/data/mockData';

// Order interface
interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

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
  const [categories, setCategories] = useState<string[]>(mockCategories);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '001',
      customerId: '1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: [
        { book: mockBooks[0], quantity: 1 },
        { book: mockBooks[1], quantity: 1 }
      ],
      total: 45.98,
      status: 'delivered',
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '002',
      customerId: '2',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      items: [
        { book: mockBooks[2], quantity: 1 }
      ],
      total: 24.99,
      status: 'processing',
      createdAt: '2024-01-16T14:20:00Z'
    },
    {
      id: '003',
      customerId: '3',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      items: [
        { book: mockBooks[3], quantity: 2 }
      ],
      total: 59.98,
      status: 'pending',
      createdAt: '2024-01-17T09:15:00Z'
    }
  ]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

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
    if (!isLoggedIn || !currentUser) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to complete checkout",
        variant: "destructive"
      });
      return;
    }

    const total = cartItems.reduce((sum, item) => sum + (item.book.price * item.quantity), 0);
    
    // Create new order
    const newOrder: Order = {
      id: String(orders.length + 1).padStart(3, '0'),
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: [...cartItems],
      total: total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Add order to orders list
    setOrders(prevOrders => [newOrder, ...prevOrders]);

    toast({
      title: "Order placed!",
      description: `Thank you for your order! Order #${newOrder.id} - Total: $${total.toFixed(2)}`,
    });
    
    setCartItems([]);
  };

  const handleViewDetails = (book: Book) => {
    window.location.href = `/book/${book.id}`;
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

  // Category management handlers
  const handleAddCategory = (categoryName: string) => {
    if (categories.includes(categoryName)) {
      toast({
        title: "Category already exists",
        description: "This category already exists in the system",
        variant: "destructive"
      });
      return;
    }
    setCategories(prev => [...prev, categoryName]);
    toast({
      title: "Category added",
      description: `${categoryName} has been added to categories`,
    });
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    if (categories.includes(newName) && newName !== oldName) {
      toast({
        title: "Category already exists",
        description: "This category name already exists",
        variant: "destructive"
      });
      return;
    }
    
    setCategories(prev => prev.map(cat => cat === oldName ? newName : cat));
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.category === oldName ? { ...book, category: newName } : book
      )
    );
    setEditingCategory(null);
    toast({
      title: "Category updated",
      description: `Category has been renamed to ${newName}`,
    });
  };

  const handleDeleteCategory = (categoryName: string) => {
    const booksInCategory = books.filter(book => book.category === categoryName);
    if (booksInCategory.length > 0) {
      toast({
        title: "Cannot delete category",
        description: `This category contains ${booksInCategory.length} books. Please reassign or delete the books first.`,
        variant: "destructive"
      });
      return;
    }
    
    setCategories(prev => prev.filter(cat => cat !== categoryName));
    toast({
      title: "Category deleted",
      description: `${categoryName} has been removed from categories`,
    });
  };

  // Order management handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    toast({
      title: "Order status updated",
      description: `Order #${orderId} status updated to ${newStatus}`,
    });
  };

  const handleViewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  // Render different views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            featuredBooks={featuredBooks}
            categories={categories}
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
                          {categories.map(category => (
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
                        {categories.map(category => (
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
              
              <div className="space-y-6">
                {/* Add New Category Form */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const categoryName = formData.get('categoryName') as string;
                    if (categoryName.trim()) {
                      handleAddCategory(categoryName.trim());
                      e.currentTarget.reset();
                    }
                  }} className="flex gap-4">
                    <input
                      type="text"
                      name="categoryName"
                      placeholder="Enter category name"
                      required
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                    />
                    <button
                      type="submit"
                      className="bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors"
                    >
                      Add Category
                    </button>
                  </form>
                </div>

                {/* Current Categories */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Categories</h3>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border">
                        {editingCategory === category ? (
                          <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const newName = formData.get('newCategoryName') as string;
                            if (newName.trim()) {
                              handleEditCategory(category, newName.trim());
                            }
                          }} className="flex gap-2 flex-1">
                            <input
                              type="text"
                              name="newCategoryName"
                              defaultValue={category}
                              required
                              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                            <button
                              type="submit"
                              className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingCategory(null)}
                              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <>
                            <span className="text-sm font-medium text-amber-800">{category}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingCategory(category)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(category)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'view-orders':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-amber-600 hover:text-amber-700 underline"
                >
                  ← Back to Admin Panel
                </button>
              </div>
              
              {selectedOrder ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Order Details - #{selectedOrder.id}</h3>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-amber-600 hover:text-amber-700 underline"
                    >
                      ← Back to Orders List
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-2">Customer Information</h4>
                      <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                      <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
                      <p><strong>Order Date:</strong> {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Status</h4>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['status'])}
                        className="border border-gray-300 rounded px-3 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                          <img 
                            src={item.book.cover} 
                            alt={item.book.title}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h5 className="font-medium">{item.book.title}</h5>
                            <p className="text-sm text-gray-600">by {item.book.author}</p>
                          </div>
                          <div className="text-right">
                            <p><strong>Qty:</strong> {item.quantity}</p>
                            <p><strong>Price:</strong> ${item.book.price}</p>
                            <p><strong>Subtotal:</strong> ${(item.book.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-right">
                      <p className="text-xl font-bold">Total: ${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
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
                            <th className="border border-gray-200 px-4 py-2 text-left">Date</th>
                            <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="border border-gray-200 px-4 py-2">#{order.id}</td>
                              <td className="border border-gray-200 px-4 py-2">{order.customerName}</td>
                              <td className="border border-gray-200 px-4 py-2">{order.items.length} items</td>
                              <td className="border border-gray-200 px-4 py-2">${order.total.toFixed(2)}</td>
                              <td className="border border-gray-200 px-4 py-2">
                                <select
                                  value={order.status}
                                  onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                  className={`px-2 py-1 rounded-full text-xs border-0 ${
                                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                                    'bg-red-100 text-red-800'
                                  }`}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="processing">Processing</option>
                                  <option value="shipped">Shipped</option>
                                  <option value="delivered">Delivered</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="border border-gray-200 px-4 py-2">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </td>
                              <td className="border border-gray-200 px-4 py-2">
                                <button
                                  onClick={() => handleViewOrderDetails(order)}
                                  className="bg-amber-600 text-white px-3 py-1 rounded text-sm hover:bg-amber-700"
                                >
                                  View Details
                                </button>
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
                  <p className="text-3xl font-bold text-amber-600">{categories.length}</p>
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
