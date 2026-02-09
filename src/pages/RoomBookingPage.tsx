import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Star, CheckCircle, X, Bed, AlertCircle, Loader, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Room {
  room_id?: number;
  id?: number;
  room_name?: string;
  name?: string;
  room_type?: string;
  type?: string;
  capacity: number;
  price_per_day?: number;
  price?: number;
  originalPrice?: number;
  image?: string;
  amenities: string[];
  is_available?: boolean;
  isAvailable?: boolean;
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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [bookingId, setBookingId] = useState<number | null>(null);

  // Fetch rooms from database
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/rooms/all');
        if (!response.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const data = await response.json();
        setRooms(data);
        setError('');
      } catch (err) {
        setError('Failed to load rooms. Please try again later.');
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    const name = (room.room_name || room.name || '').toLowerCase();
    const type = (room.room_type || room.type || '').toLowerCase();
    return (
      name.includes(searchQuery.toLowerCase()) ||
      type.includes(searchQuery.toLowerCase())
    );
  });

  const handleBookRoom = (room: Room) => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first to book a cabin');
      window.location.href = '/login';
      return;
    }
    
    console.log('Booking room:', room);
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedDate) {
      alert('Please select an admission date');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login first');
      return;
    }

    const roomId = selectedRoom?.room_id !== undefined ? selectedRoom.room_id : selectedRoom?.id;
    console.log('Selected Room:', selectedRoom);
    console.log('Room ID:', roomId);
    
    if (roomId === undefined || roomId === null) {
      alert('Invalid room selected');
      return;
    }

    try {
      setBookingLoading(true);
      const response = await fetch('http://localhost:5000/api/rooms/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          roomId: roomId,
          admissionDate: selectedDate,
          durationDays: parseInt(selectedDuration)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Booking failed');
      }

      setBookingId(data.bookingId);
      setBookingMessage(`Cabin booked successfully! Booking ID: ${data.bookingId}`);
    } catch (err) {
      alert('Booking failed: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Booking error:', err);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!bookingId) return;
    window.location.href = `http://localhost:5000/api/rooms/${bookingId}/receipt`;
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
    setBookingMessage('');
    setBookingId(null);
    setSelectedDate('');
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

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader className="h-10 w-10 animate-spin text-primary mx-auto mb-2" />
              <p className="text-gray-600">Loading rooms...</p>
            </div>
          </div>
        ) : (
          <>
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
              {filteredRooms.length > 0 ? (
                filteredRooms.map((room, index) => {
                  const roomId = room.room_id || room.id || index;
                  const roomName = room.room_name || room.name || '';
                  const roomType = room.room_type || room.type || '';
                  const price = room.price_per_day || room.price || 0;
                  const isAvailable = room.is_available !== false && room.isAvailable !== false;

                  return (
                    <div key={`room-${roomId}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                      {/* Room Image */}
                      <div className="h-48 bg-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Bed className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">{roomName}</p>
                        </div>
                      </div>

                      {/* Room Info */}
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">{roomName}</h3>
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            {roomType}
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
                            <span className="text-2xl font-bold text-primary">
                              ৳ {price}
                            </span>
                            <p className="text-sm text-gray-500">per day</p>
                          </div>
                          <div className="flex items-center">
                            {isAvailable ? (
                              <>
                                <CheckCircle className="h-5 w-5 text-green-500 mr-1" />
                                <span className="text-sm text-green-600">Available</span>
                              </>
                            ) : (
                              <span className="text-sm text-red-600">Unavailable</span>
                            )}
                          </div>
                        </div>

                        {/* Book Button */}
                        <button
                          onClick={() => handleBookRoom(room)}
                          disabled={!isAvailable}
                          className={`w-full py-2 px-4 rounded-md transition-colors ${
                            isAvailable
                              ? 'bg-primary text-white hover:bg-primary-dark'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isAvailable ? 'Book Cabin' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-600 text-lg">No rooms found matching your search</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Confirm Cabin Booking</h3>
                <button
                  onClick={() => setShowBookingModal(false)}
                  disabled={bookingLoading}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {bookingMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                  {bookingMessage}
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-semibold text-lg mb-2">
                  {selectedRoom.room_name || selectedRoom.name}
                </h4>
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
                    <span className="font-medium">৳ {selectedRoom.price_per_day || selectedRoom.price}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-primary">
                      ৳ {((selectedRoom.price_per_day || selectedRoom.price) || 0) * parseInt(selectedDuration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeBookingModal}
                  disabled={bookingLoading}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors disabled:opacity-50"
                >
                  {bookingId ? 'Close' : 'Cancel'}
                </button>
                {bookingId ? (
                  <button
                    onClick={handleDownloadReceipt}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Receipt
                  </button>
                ) : (
                  <button
                    onClick={handleConfirmBooking}
                    disabled={bookingLoading}
                    className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {bookingLoading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomBookingPage; 