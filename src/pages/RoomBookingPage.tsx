import { useState } from 'react';
import { Calendar, Clock, Users, Star, CheckCircle, X, Bed } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Room {
  id: number;
  name: string;
  type: string;
  capacity: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  isAvailable: boolean;
  rating: number;
  reviews: number;
  description: string;
}

const RoomBookingPage = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const rooms: Room[] = [
    {
      id: 1,
      name: "General Cabin",
      type: "Cabin",
      capacity: 1,
      price: 1500,
      originalPrice: 2000,
      image: "/img/Private-Cabin-1.jpeg",
      amenities: ["AC", "TV", "Private Bathroom", "Nursing Care", "24/7 Monitoring"],
      isAvailable: true,
      rating: 4.8,
      reviews: 156,
      description: "Comfortable single cabin with basic medical amenities and nursing care"
    },
    {
      id: 2,
      name: "Deluxe Cabin",
      type: "Cabin",
      capacity: 2,
      price: 2500,
      image: "/img/cabin-2.jpg",
      amenities: ["AC", "TV", "Private Bathroom", "Nursing Care", "24/7 Monitoring", "Mini Fridge"],
      isAvailable: true,
      rating: 4.9,
      reviews: 234,
      description: "Spacious cabin with premium and dedicated nursing care"
    },
    {
      id: 3,
      name: "ICU Cabin",
      type: "ICU",
      capacity: 1,
      price: 8000,
      image: "/img/cabin-3.jpg",
      amenities: ["24/7 Monitoring", "Medical Equipment", "Private Nurse", "Emergency Support", "Ventilator"],
      isAvailable: true,
      rating: 5.0,
      reviews: 67,
      description: "Intensive care unit with advanced medical monitoring and life support"
    },
    {
      id: 4,
      name: "Semi-Private Ward",
      type: "Ward",
      capacity: 2,
      price: 1200,
      image: "/img/cabin-4.jpg",
      amenities: ["AC", "Shared Bathroom", "Nursing Care", "Medical Monitoring"],
      isAvailable: true,
      rating: 4.5,
      reviews: 312,
      description: "Shared ward with basic medical amenities and nursing care"
    },
    {
      id: 5,
      name: "General Ward",
      type: "Ward",
      capacity: 6,
      price: 800,
      image: "/img/cabin-5.jpg",
      amenities: ["AC", "Shared Bathroom", "Nursing Care", "Basic Monitoring"],
      isAvailable: true,
      rating: 4.3,
      reviews: 445,
      description: "Shared ward with basic amenities and nursing care for multiple patients"
    }
  ];

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    alert('Cabin booked successfully!');
    setShowBookingModal(false);
    setSelectedRoom(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Hospital Cabin Booking</h1>
          <p className="text-gray-600 text-lg">
            Choose from our comfortable and well-equipped hospital cabins for your treatment
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Admission Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="7">1 Week</option>
                <option value="14">2 Weeks</option>
                <option value="30">1 Month</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Cabins</label>
              <input
                type="text"
                placeholder="Search by cabin name or type"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Room Image */}
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <Bed className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">{room.name}</p>
                </div>
              </div>

              {/* Room Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {room.type}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{room.description}</p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium text-gray-900">
                    {room.rating}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">
                    ({room.reviews} reviews)
                  </span>
                </div>

                {/* Capacity */}
                <div className="flex items-center mb-4">
                  <Users className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    Capacity: {room.capacity} patient{room.capacity > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Medical Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                      >
                        {amenity}
                      </span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        +{room.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    {room.originalPrice ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-primary">
                          {room.price}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {room.originalPrice}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {room.price}
                      </span>
                    )}
                    <p className="text-sm text-gray-500">per day</p>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">Available</span>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBookRoom(room)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Book Cabin
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {showBookingModal && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Confirm Cabin Booking</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2">{selectedRoom.name}</h4>
                <p className="text-gray-600 mb-4">{selectedRoom.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Admission Date:</span>
                    <span className="font-medium">{selectedDate || 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">{selectedDuration} day(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per day:</span>
                    <span className="font-medium">{selectedRoom.price}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-primary">
                      {selectedRoom.price * parseInt(selectedDuration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomBookingPage; 