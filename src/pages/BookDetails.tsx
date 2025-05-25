
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Star, ShoppingCart } from 'lucide-react';
import { mockBooks } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Book } from '@/components/BookCard';

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const book = mockBooks.find((b: Book) => b.id === id);

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-8">The book you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')} className="bg-amber-600 hover:bg-amber-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${book.title} has been added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      {/* Book Details */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Cover */}
            <div className="flex justify-center">
              <div className="relative">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full max-w-md h-auto rounded-lg shadow-lg"
                />
                {!book.inStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Out of Stock
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Book Information */}
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-3 bg-amber-100 text-amber-800">
                  {book.category}
                </Badge>
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  {book.title}
                </h1>
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                    <span className="text-lg font-medium text-gray-700">{book.rating}</span>
                    <span className="text-gray-500 ml-1">/ 5</span>
                  </div>
                  <div className="text-3xl font-bold text-amber-600">
                    ${book.price}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <p className="text-gray-800">{book.category}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Availability</span>
                    <p className={book.inStock ? "text-green-600" : "text-red-600"}>
                      {book.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 text-lg"
                  size="lg"
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {book.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Book Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Rating</h4>
              <div className="flex items-center justify-center">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-lg font-bold text-gray-700">{book.rating}</span>
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Price</h4>
              <span className="text-2xl font-bold text-amber-600">${book.price}</span>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-2">Status</h4>
              <span className={`font-medium ${book.inStock ? "text-green-600" : "text-red-600"}`}>
                {book.inStock ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
