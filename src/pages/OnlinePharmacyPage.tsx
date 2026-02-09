import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, Pill, AlertCircle, Loader, Download } from 'lucide-react';

interface Medicine {
  medicine_id: number;
  name: string;
  generic_name: string;
  category: string;
  price: number;
  original_price?: number;
  manufacturer: string;
  stock: number;
  description?: string;
}

interface CartItem extends Medicine {
  quantity: number;
}

const OnlinePharmacyPage = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderMessage, setOrderMessage] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch medicines from database
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/pharmacy/medicines');
        if (!response.ok) {
          throw new Error('Failed to fetch medicines');
        }
        const data = await response.json();
        setMedicines(data);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(data.map((m: Medicine) => m.category))];
        setCategories(uniqueCategories);
        setError('');
      } catch (err) {
        setError('Failed to load medicines. Please try again later.');
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (medicine: Medicine) => {
    if (medicine.stock <= 0) {
      alert('Medicine is out of stock');
      return;
    }

    const existingItem = cart.find(item => item.medicine_id === medicine.medicine_id);
    if (existingItem) {
      if (existingItem.quantity < medicine.stock) {
        setCart(cart.map(item =>
          item.medicine_id === medicine.medicine_id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        alert('Cannot add more. Limited stock available.');
      }
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const removeFromCart = (medicineId: number) => {
    setCart(cart.filter(item => item.medicine_id !== medicineId));
  };

  const updateQuantity = (medicineId: number, quantity: number) => {
    const medicine = medicines.find(m => m.medicine_id === medicineId);
    if (!medicine) return;

    if (quantity <= 0) {
      removeFromCart(medicineId);
    } else if (quantity <= medicine.stock) {
      setCart(cart.map(item =>
        item.medicine_id === medicineId ? { ...item, quantity } : item
      ));
    } else {
      alert('Cannot exceed available stock');
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first to place an order');
      window.location.href = '/login';
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      setCheckoutLoading(true);
      const response = await fetch('http://localhost:5000/api/pharmacy/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          items: cart.map(item => ({
            medicine_id: item.medicine_id,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cartTotal,
          deliveryAddress: localStorage.getItem('address') || 'Default Address'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Order failed');
      }

      setOrderId(data.orderId);
      setOrderMessage(`Order placed successfully! Order ID: ${data.orderId}`);
      setCart([]);
    } catch (err) {
      alert('Checkout failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Checkout error:', err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!orderId) return;
    // Generate invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Order Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 3px solid #007bff; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { color: #007bff; margin: 0; font-size: 28px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #007bff; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
          .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .label { color: #666; font-weight: bold; }
          .value { color: #333; }
          .total-row { display: flex; justify-content: space-between; padding: 12px 0; border-top: 2px solid #007bff; border-bottom: 2px solid #007bff; font-weight: bold; font-size: 16px; color: #007bff; margin: 15px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
          .order-id { background-color: #f0f0f0; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; color: #007bff; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💊 Online Pharmacy Order Invoice</h1>
            <p>Order Confirmation</p>
          </div>

          <div class="order-id">
            Order ID: ${orderId}
          </div>

          <div class="section">
            <div class="section-title">Order Summary</div>
            ${cart.map(item => `
              <div class="row">
                <span class="label">${item.name} x${item.quantity}</span>
                <span class="value">$${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>

          <div class="section">
            <div class="total-row">
              <span>Total Amount:</span>
              <span>$${cartTotal.toFixed(2)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your order!</p>
            <p style="margin-top: 15px; font-size: 10px;">Expected delivery within 24-48 hours</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${orderId}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-10 w-10 animate-spin text-primary mx-auto mb-2" />
          <p className="text-gray-600">Loading medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Online Pharmacy</h1>
          <p className="text-gray-600 text-lg">Medicines delivered to your doorstep</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search medicine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMedicines.map(medicine => (
                <div key={medicine.medicine_id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <Pill className="h-8 w-8 text-primary" />
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      medicine.stock > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {medicine.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-1">{medicine.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{medicine.generic_name}</p>
                  <p className="text-xs text-gray-500 mb-4">{medicine.manufacturer}</p>

                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">${medicine.price}</span>
                        {medicine.original_price && (
                          <span className="text-sm text-gray-500 line-through ml-2">${medicine.original_price}</span>
                        )}
                      </div>
                      {medicine.original_price && (
                        <span className="text-xs text-green-600 font-medium">
                          {Math.round(((medicine.original_price - medicine.price) / medicine.original_price) * 100)}% Off
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(medicine)}
                    disabled={medicine.stock <= 0}
                    className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      medicine.stock > 0
                        ? 'bg-primary text-white hover:bg-secondary'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              ))}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="text-center py-12">
                <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No medicines found</p>
              </div>
            )}
          </div>

          {/* Cart Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
                <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                  {cartCount}
                </span>
              </div>

              {orderId ? (
                <div className="text-center py-8 space-y-4">
                  <div className="text-green-600">
                    <p className="font-bold text-lg mb-2">Order Placed Successfully!</p>
                    <p className="text-sm">Order ID: {orderId}</p>
                  </div>
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Invoice
                  </button>
                  <button
                    onClick={() => {
                      setOrderId(null);
                      setOrderMessage('');
                    }}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                    {cart.map(item => (
                      <div key={item.medicine_id} className="border-b pb-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                            <p className="text-sm text-primary">${item.price}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.medicine_id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="flex items-center space-x-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item.medicine_id, item.quantity - 1)}
                            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.medicine_id, item.quantity + 1)}
                            className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600">Total:</span>
                      <span className="text-2xl font-bold text-primary">${cartTotal.toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleCheckout}
                      disabled={checkoutLoading || cart.length === 0}
                      className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-secondary transition-colors font-medium mb-2 disabled:opacity-50 flex items-center justify-center"
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Checkout'
                      )}
                    </button>

                    <button
                      onClick={() => setCart([])}
                      className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
                    <p className="font-semibold mb-1">Free Delivery</p>
                    <p>Free Home Delivery on orders $50+</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnlinePharmacyPage;