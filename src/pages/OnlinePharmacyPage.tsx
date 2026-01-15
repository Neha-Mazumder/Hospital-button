import { useState } from 'react';
import { ShoppingCart, Plus, Minus, CreditCard, Package, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Medicine {
  id: number;
  name: string;
  genericName: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  dosage: string;
  manufacturer: string;
  inStock: boolean;
  image: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

const OnlinePharmacyPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const medicines: Medicine[] = [
    {
      id: 1,
      name: "Napa 500mg",
      genericName: "Paracetamol",
      category: "Pain Relief",
      price: 5,
      originalPrice: 8,
      description: "Effective pain reliever and fever reducer",
      dosage: "1-2 tablets every 4-6 hours",
      manufacturer: "Beximco Pharmaceuticals",
      inStock: true,
      image: "/img/medicine-1.jpg"
    },
    {
      id: 2,
      name: "Amoxicillin 500mg",
      genericName: "Amoxicillin",
      category: "Antibiotics",
      price: 15,
      description: "Broad-spectrum antibiotic for bacterial infections",
      dosage: "1 capsule 3 times daily",
      manufacturer: "Square Pharmaceuticals",
      inStock: true,
      image: "/img/medicine-2.jpg"
    },
    {
      id: 3,
      name: "Omeprazole 20mg",
      genericName: "Omeprazole",
      category: "Gastrointestinal",
      price: 12,
      description: "Proton pump inhibitor for acid reflux and ulcers",
      dosage: "1 capsule daily before breakfast",
      manufacturer: "Incepta Pharmaceuticals",
      inStock: true,
      image: "/img/medicine-3.jpg"
    },
    {
      id: 4,
      name: "Cetirizine 10mg",
      genericName: "Cetirizine",
      category: "Allergy",
      price: 8,
      description: "Antihistamine for allergy relief",
      dosage: "1 tablet daily",
      manufacturer: "Renata Limited",
      inStock: true,
      image: "/img/medicine-4.jpg"
    },
    {
      id: 5,
      name: "Vitamin C 1000mg",
      genericName: "Ascorbic Acid",
      category: "Vitamins",
      price: 6,
      description: "Immune system support and antioxidant",
      dosage: "1 tablet daily",
      manufacturer: "ACI Pharmaceuticals",
      inStock: true,
      image: "/img/medicine-5.jpg"
    },
    {
      id: 6,
      name: "Ibuprofen 400mg",
      genericName: "Ibuprofen",
      category: "Pain Relief",
      price: 7,
      description: "Anti-inflammatory pain reliever",
      dosage: "1-2 tablets every 6-8 hours",
      manufacturer: "Beximco Pharmaceuticals",
      inStock: true,
      image: "/img/medicine-6.jpg"
    }
  ];

  const categories = ['all', 'Pain Relief', 'Antibiotics', 'Gastrointestinal', 'Allergy', 'Vitamins'];

  const filteredMedicines = medicines.filter(medicine =>
    (selectedCategory === 'all' || medicine.category === selectedCategory) &&
    (medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const addToCart = (medicine: Medicine) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...medicine, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (medicineId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(medicineId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === medicineId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowPayment(true);
  };

  const handlePayment = () => {
    alert('Payment successful! Your order will be delivered soon.');
    setShowPayment(false);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Online Pharmacy</h1>
          <p className="text-gray-600 text-lg">
            Order your prescribed medicines online with secure payment and fast delivery
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cart Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowCart(true)}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors flex items-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Cart ({cart.reduce((total, item) => total + item.quantity, 0)})
          </button>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMedicines.map((medicine) => (
            <div key={medicine.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Medicine Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <Package className="h-12 w-12 text-gray-400" />
              </div>

              {/* Medicine Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{medicine.name}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {medicine.category}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">{medicine.genericName}</p>
                <p className="text-sm text-gray-600 mb-4">{medicine.description}</p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Dosage: {medicine.dosage}</p>
                  <p className="text-xs text-gray-500">Manufacturer: {medicine.manufacturer}</p>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {medicine.originalPrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">
                          ৳{medicine.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          ৳{medicine.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-primary">
                        ৳{medicine.price}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-green-600">In Stock</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={() => addToCart(medicine)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Modal */}
        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Shopping Cart</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.genericName}</p>
                          <p className="text-sm font-medium text-primary">৳{item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold">Total:</span>
                      <span className="font-semibold text-primary">৳{getTotalPrice()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Payment</h3>
                <button
                  onClick={() => setShowPayment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-gray-600 mb-4">Total Amount: ৳{getTotalPrice()}</p>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input type="radio" name="payment" value="card" className="mr-2" defaultChecked />
                    Credit/Debit Card
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payment" value="mobile" className="mr-2" />
                    Mobile Banking
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="payment" value="cash" className="mr-2" />
                    Cash on Delivery
                  </label>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnlinePharmacyPage; 