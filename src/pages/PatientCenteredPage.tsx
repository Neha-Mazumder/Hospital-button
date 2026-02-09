import { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  User, 
  Lock, 
  Calendar,
  Clock,
  Phone,
  MapPin,
  FileText,
  Bell,
  LogOut,
  RefreshCw,
  Pill,
  ShoppingBag,
  CalendarCheck,
  Home,
  CreditCard,
  Package,
  ClipboardList,
  Bed,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

// Types
interface PatientProfile {
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  username: string;
}

interface Appointment {
  appointment_id: number;
  department_name: string;
  appointment_date: string;
  additional_message: string;
  status: string;
}

interface RoomBooking {
  booking_id: number;
  room_name: string;
  room_type: string;
  admission_date: string;
  duration_days: number;
  total_price: number;
  status: string;
  booking_date: string;
}

interface PharmacyOrder {
  order_id: number;
  order_date: string;
  total_amount: number;
  status: string;
  delivery_address: string;
  items: OrderItem[];
}

interface OrderItem {
  medicine_name: string;
  quantity: number;
  price: number;
}

const PatientCenteredPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [roomBookings, setRoomBookings] = useState<RoomBooking[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<PharmacyOrder[]>([]);

  const fetchDashboardData = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/patientcentered/dashboard/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setProfile(data.data.profile);
        setAppointments(data.data.appointments);
        setRoomBookings(data.data.roomBookings);
        setPharmacyOrders(data.data.pharmacyOrders);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Fetch error:', err);
      return false;
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Username ও Password দিন');
      setLoading(false);
      return;
    }

    try {
      const loginResponse = await fetch('http://localhost:5000/api/patientcentered/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });

      const loginData = await loginResponse.json();

      if (!loginData.success) {
        setError(loginData.message || 'লগইন ব্যর্থ');
        setLoading(false);
        return;
      }

      const success = await fetchDashboardData(loginData.userId);
      if (success) {
        setIsLoggedIn(true);
      } else {
        setError('তথ্য লোড করতে ব্যর্থ');
      }
    } catch (err) {
      setError('সার্ভারের সাথে সংযোগ ব্যর্থ। Backend চালু আছে কি?');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!profile) return;
    setRefreshing(true);
    await fetchDashboardData(profile.user_id);
    setRefreshing(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfile(null);
    setAppointments([]);
    setRoomBookings([]);
    setPharmacyOrders([]);
    setUsername('');
    setPassword('');
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Delivered': 'bg-emerald-100 text-emerald-800',
      'Processing': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('bn-BD', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleString('bn-BD', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Quick Stats
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'Pending').length;
  const totalBookings = roomBookings.length;
  const totalOrders = pharmacyOrders.length;
  const totalSpent = pharmacyOrders.reduce((sum, o) => sum + Number(o.total_amount), 0) + 
                     roomBookings.reduce((sum, b) => sum + Number(b.total_price), 0);

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
              <User className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-primary mb-4">Patient-Centered Portal</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              আপনার Account দিয়ে লগইন করুন এবং আপনার সব Appointments, Room Bookings, 
              ও Pharmacy Orders দেখুন
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-6">
                <Lock className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-xl font-semibold">Patient Login</h3>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="আপনার Username দিন"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="আপনার Password দিন"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 rounded-xl hover:bg-secondary transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><RefreshCw className="h-5 w-5 animate-spin" /> লোড হচ্ছে...</>
                  ) : (
                    <><User className="h-5 w-5" /> লগইন করুন</>
                  )}
                </button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-800 mb-2">🔍 ডেমো Credentials:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Username: <code className="bg-blue-100 px-2 py-0.5 rounded">Test@1234</code></li>
                  <li>• Password: <code className="bg-blue-100 px-2 py-0.5 rounded">Test@1234</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile?.full_name}</h1>
                <p className="text-white/80 text-sm">
                  <Phone className="inline h-4 w-4 mr-1" />{profile?.phone}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={handleRefresh} disabled={refreshing}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              <button onClick={handleLogout}
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors">
                <LogOut className="h-4 w-4" /> লগআউট
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <CalendarCheck className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">মোট Appointments</p>
                <p className="text-lg font-bold">{totalAppointments}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-lg font-bold">{pendingAppointments}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <Bed className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-xs text-gray-500">Room Bookings</p>
                <p className="text-lg font-bold">{totalBookings}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
              <Package className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-xs text-gray-500">Pharmacy Orders</p>
                <p className="text-lg font-bold">{totalOrders}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <CreditCard className="h-8 w-8 text-emerald-500" />
              <div>
                <p className="text-xs text-gray-500">Total Spent</p>
                <p className="text-lg font-bold">৳{totalSpent.toFixed(0)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Home },
              { id: 'appointments', label: 'Appointments', icon: CalendarCheck },
              { id: 'bookings', label: 'Room Bookings', icon: Bed },
              { id: 'orders', label: 'Pharmacy Orders', icon: ShoppingBag },
              { id: 'profile', label: 'Profile', icon: User },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}>
                <tab.icon className="h-4 w-4" /> {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Dashboard Overview</h2>
            
            {/* Recent Appointments */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5 text-blue-500" />
                  সাম্প্রতিক Appointments
                </h3>
                <button onClick={() => setActiveTab('appointments')} className="text-primary text-sm hover:underline">
                  সব দেখুন →
                </button>
              </div>
              {appointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">কোনো Appointment নেই</p>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 3).map((apt) => (
                    <div key={apt.appointment_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{apt.department_name}</p>
                        <p className="text-sm text-gray-500">{formatDate(apt.appointment_date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Room Bookings */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Bed className="h-5 w-5 text-green-500" />
                  সাম্প্রতিক Room Bookings
                </h3>
                <button onClick={() => setActiveTab('bookings')} className="text-primary text-sm hover:underline">
                  সব দেখুন →
                </button>
              </div>
              {roomBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">কোনো Room Booking নেই</p>
              ) : (
                <div className="space-y-3">
                  {roomBookings.slice(0, 3).map((booking) => (
                    <div key={booking.booking_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{booking.room_name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.admission_date)} • {booking.duration_days} দিন
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">৳{booking.total_price}</p>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Pharmacy Orders */}
            <div className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-purple-500" />
                  সাম্প্রতিক Pharmacy Orders
                </h3>
                <button onClick={() => setActiveTab('orders')} className="text-primary text-sm hover:underline">
                  সব দেখুন →
                </button>
              </div>
              {pharmacyOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-4">কোনো Pharmacy Order নেই</p>
              ) : (
                <div className="space-y-3">
                  {pharmacyOrders.slice(0, 3).map((order) => (
                    <div key={order.order_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.order_id}</p>
                        <p className="text-sm text-gray-500">{formatDateTime(order.order_date)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">৳{order.total_amount}</p>
                        <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">আপনার Appointments</h2>
            {appointments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <CalendarCheck className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো Appointment নেই</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {appointments.map((apt) => (
                  <div key={apt.appointment_id} className="bg-white rounded-xl p-5 shadow-sm border">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs text-gray-500">ID: #{apt.appointment_id}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">{apt.department_name}</h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {formatDate(apt.appointment_date)}
                    </div>
                    {apt.additional_message && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                        <strong>নোট:</strong> {apt.additional_message}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Room Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">আপনার Room Bookings</h2>
            {roomBookings.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <Bed className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো Room Booking নেই</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {roomBookings.map((booking) => (
                  <div key={booking.booking_id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="bg-green-50 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-green-600" />
                        <span className="font-bold">{booking.room_name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><span className="text-gray-500">Room Type:</span> <span className="font-medium">{booking.room_type}</span></div>
                        <div><span className="text-gray-500">Duration:</span> <span className="font-medium">{booking.duration_days} দিন</span></div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Admission: {formatDate(booking.admission_date)}</span>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t mt-2">
                        <span className="text-gray-500 text-sm">Total Price:</span>
                        <span className="text-xl font-bold text-primary">৳{booking.total_price}</span>
                      </div>
                      <p className="text-xs text-gray-400">Booked: {formatDateTime(booking.booking_date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Pharmacy Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-800">আপনার Pharmacy Orders</h2>
            {pharmacyOrders.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">কোনো Pharmacy Order নেই</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pharmacyOrders.map((order) => (
                  <div key={order.order_id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="bg-purple-50 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-purple-600" />
                        <div>
                          <span className="font-bold">Order #{order.order_id}</span>
                          <p className="text-xs text-gray-500">{formatDateTime(order.order_date)}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="p-4">
                      {order.items && order.items.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-600 mb-2">Items:</h5>
                          <div className="space-y-1">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded">
                                <span>{item.medicine_name}</span>
                                <span className="text-gray-600">x{item.quantity} @ ৳{item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.delivery_address}</span>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-gray-500">Total:</span>
                        <span className="text-xl font-bold text-primary">৳{order.total_amount}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">আপনার Profile</h2>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{profile?.full_name}</h3>
                  <p className="text-gray-500">Patient ID: {profile?.user_id}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium">{profile?.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-medium">{profile?.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Username</p>
                    <p className="font-medium">{profile?.username}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-4">Summary</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{totalAppointments}</p>
                    <p className="text-xs text-gray-500">Appointments</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{totalBookings}</p>
                    <p className="text-xs text-gray-500">Bookings</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{totalOrders}</p>
                    <p className="text-xs text-gray-500">Orders</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCenteredPage;
