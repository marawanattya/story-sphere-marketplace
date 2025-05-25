
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import BookCard, { Book } from './BookCard';

interface HomePageProps {
  featuredBooks: Book[];
  categories: string[];
  onAddToCart: (book: Book) => void;
  onViewDetails: (book: Book) => void;
  onCategoryClick: (category: string) => void;
}

const HomePage = ({ 
  featuredBooks, 
  categories, 
  onAddToCart, 
  onViewDetails,
  onCategoryClick 
}: HomePageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-amber-600">StorySphere</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover your next favorite book from our carefully curated collection of stories that inspire, educate, and entertain.
          </p>
          <Button 
            size="lg"
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg"
          >
            Browse Books
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Explore Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={category}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                onClick={() => onCategoryClick(category)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">
                    {['📚', '💝', '🕵️', '🎭', '🔬', '⚔️'][index % 6]}
                  </div>
                  <h3 className="font-semibold text-gray-800">{category}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-amber-800 bg-amber-100">
              Editor's Choice
            </Badge>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Books
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hand-picked selections from our expert curators, featuring the latest releases and timeless classics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onAddToCart={onAddToCart}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Stay Updated
          </h2>
          <p className="text-gray-600 mb-8">
            Get notified about new releases, special offers, and reading recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
