
import { Book } from '@/components/BookCard';

// Database utility functions for JSON file operations
export class JSONDatabase {
  private static async loadData<T>(fileName: string): Promise<T[]> {
    try {
      const response = await fetch(`/src/data/database/${fileName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${fileName}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Error loading ${fileName}:`, error);
      return [];
    }
  }

  private static async saveData<T>(fileName: string, data: T[]): Promise<void> {
    try {
      // In a real application, this would save to a server
      // For demo purposes, we'll store in localStorage
      localStorage.setItem(`${fileName}_data`, JSON.stringify(data));
      console.log(`Saved ${fileName} data to localStorage`);
    } catch (error) {
      console.error(`Error saving ${fileName}:`, error);
    }
  }

  private static getLocalData<T>(fileName: string, fallback: T[]): T[] {
    try {
      const data = localStorage.getItem(`${fileName}_data`);
      return data ? JSON.parse(data) : fallback;
    } catch (error) {
      console.error(`Error getting local ${fileName}:`, error);
      return fallback;
    }
  }

  // Books operations
  static async getBooks(): Promise<Book[]> {
    const localBooks = this.getLocalData<Book>('books', []);
    if (localBooks.length > 0) {
      return localBooks;
    }
    
    try {
      const response = await import('../data/database/books.json');
      const books = response.default as Book[];
      this.saveData('books', books);
      return books;
    } catch (error) {
      console.error('Error loading books:', error);
      return [];
    }
  }

  static async saveBooks(books: Book[]): Promise<void> {
    await this.saveData('books', books);
  }

  static async addBook(book: Book): Promise<void> {
    const books = await this.getBooks();
    books.push(book);
    await this.saveBooks(books);
  }

  static async updateBook(updatedBook: Book): Promise<void> {
    const books = await this.getBooks();
    const index = books.findIndex(book => book.id === updatedBook.id);
    if (index !== -1) {
      books[index] = updatedBook;
      await this.saveBooks(books);
    }
  }

  static async deleteBook(bookId: string): Promise<void> {
    const books = await this.getBooks();
    const filteredBooks = books.filter(book => book.id !== bookId);
    await this.saveBooks(filteredBooks);
  }

  // Categories operations
  static async getCategories(): Promise<string[]> {
    const localCategories = this.getLocalData<string>('categories', []);
    if (localCategories.length > 0) {
      return localCategories;
    }
    
    try {
      const response = await import('../data/database/categories.json');
      const categories = response.default as string[];
      this.saveData('categories', categories);
      return categories;
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  static async saveCategories(categories: string[]): Promise<void> {
    await this.saveData('categories', categories);
  }

  static async addCategory(category: string): Promise<void> {
    const categories = await this.getCategories();
    if (!categories.includes(category)) {
      categories.push(category);
      await this.saveCategories(categories);
    }
  }

  static async updateCategory(oldName: string, newName: string): Promise<void> {
    const categories = await this.getCategories();
    const index = categories.findIndex(cat => cat === oldName);
    if (index !== -1) {
      categories[index] = newName;
      await this.saveCategories(categories);
      
      // Update books with the new category name
      const books = await this.getBooks();
      const updatedBooks = books.map(book => 
        book.category === oldName ? { ...book, category: newName } : book
      );
      await this.saveBooks(updatedBooks);
    }
  }

  static async deleteCategory(category: string): Promise<void> {
    const categories = await this.getCategories();
    const filteredCategories = categories.filter(cat => cat !== category);
    await this.saveCategories(filteredCategories);
  }

  // Users operations
  static async getUsers(): Promise<any[]> {
    const localUsers = this.getLocalData<any>('users', []);
    if (localUsers.length > 0) {
      return localUsers;
    }
    
    try {
      const response = await import('../data/database/users.json');
      const users = response.default as any[];
      this.saveData('users', users);
      return users;
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  static async saveUsers(users: any[]): Promise<void> {
    await this.saveData('users', users);
  }

  static async addUser(user: any): Promise<void> {
    const users = await this.getUsers();
    users.push(user);
    await this.saveUsers(users);
  }

  // Orders operations
  static async getOrders(): Promise<any[]> {
    const localOrders = this.getLocalData<any>('orders', []);
    if (localOrders.length > 0) {
      return localOrders;
    }
    
    try {
      const response = await import('../data/database/orders.json');
      const orders = response.default as any[];
      this.saveData('orders', orders);
      return orders;
    } catch (error) {
      console.error('Error loading orders:', error);
      return [];
    }
  }

  static async saveOrders(orders: any[]): Promise<void> {
    await this.saveData('orders', orders);
  }

  static async addOrder(order: any): Promise<void> {
    const orders = await this.getOrders();
    orders.unshift(order); // Add to beginning of array
    await this.saveOrders(orders);
  }

  static async updateOrderStatus(orderId: string, status: string): Promise<void> {
    const orders = await this.getOrders();
    const index = orders.findIndex(order => order.id === orderId);
    if (index !== -1) {
      orders[index].status = status;
      await this.saveOrders(orders);
    }
  }
}
