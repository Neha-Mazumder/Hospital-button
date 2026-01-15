import { Star, ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface Doctor {
  id: number;
  name: string;
  image: string;
  qualifications: string;
  specialty: string[];
  rating: number;
  reviews: number;
  experience: string;
  consultationFee: number;
  originalFee?: number;
  isAvailable: boolean;
}

const ConsultantsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const doctors: Doctor[] = [
    {
      id: 1,
      name: "Dr. Masrun Mostafa",
      image: "/img/dr.jpg",
      qualifications: "MBBS, DDV (Dermatology)",
      specialty: ["Dermatologist"],
      rating: 4.9,
      reviews: 1617,
      experience: "11+ Years",
      consultationFee: 800,
      isAvailable: true
    },
    {
      id: 2,
      name: "Dr. Shafiul Quadry",
      image: "/img/dr.jpg",
      qualifications: "MBBS, BCS (Health), MRCP (Internal Medicine) (UK), MD (Pulmonology)",
      specialty: ["Medicine Specialist", "Pulmonologist"],
      rating: 5.0,
      reviews: 914,
      experience: "10+ Years",
      consultationFee: 850,
      isAvailable: true
    },
    {
      id: 3,
      name: "Dr. Ismat Zerin",
      image: "/img/dr2.webp",
      qualifications: "BSc (Nutrition & Food Science), MSc (Nutrition & Food Science)",
      specialty: ["Nutritionist"],
      rating: 5.0,
      reviews: 634,
      experience: "10+ Years",
      consultationFee: 700,
      isAvailable: true
    },
    {
      id: 4,
      name: "Dr. Rezowana Afrin",
      image: "/img/image.png",
      qualifications: "MBBS, BCS (Health), MRCOG (Gynae & Obs) (UK), MCPS (Gynae & Obs), FCPS (Gynae & Obs)",
      specialty: ["Gynecologist & Obstetrician"],
      rating: 5.0,
      reviews: 802,
      experience: "12+ Years",
      consultationFee: 800,
      isAvailable: true
    },
    {
      id: 8,
      name: "Dr. James Wilson",
      image: "/img/doctor-8.jpg",
      qualifications: "MBBS, MS (Orthopedics), Fellowship in Sports Medicine",
      specialty: ["Orthopedic Surgeon"],
      rating: 4.7,
      reviews: 734,
      experience: "14+ Years",
      consultationFee: 2000,
      isAvailable: true
    }
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const doctorsPerPage = 4;
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const startIndex = currentPage * doctorsPerPage;
  const endIndex = startIndex + doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-4">Meet Our Consultants</h1>
          <p className="text-gray-600 text-lg">
            Expert medical professionals dedicated to providing the best healthcare services
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by doctor name or department"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-6 w-6 text-primary" />
          </button>

          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-6 w-6 text-primary" />
          </button>

          {/* Doctors Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {currentDoctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start space-x-4">
                  {/* Doctor Image */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img 
                        src={doctor.image} 
                        alt={doctor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full flex items-center justify-center bg-gray-200" style={{ display: 'none' }}>
                        <span className="text-2xl font-bold text-gray-500">
                          {doctor.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {doctor.qualifications}
                    </p>
                    
                    {/* Specialty Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {doctor.specialty.map((spec, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium text-gray-900">
                        {doctor.rating}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({doctor.reviews})
                      </span>
                    </div>

                    {/* Experience */}
                    <p className="text-sm text-gray-600 mb-3">
                      {doctor.experience} Experience
                    </p>

                    {/* Consultation Fee */}
                    <div className="flex items-center justify-between">
                      <div>
                        {doctor.originalFee ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-primary">
                              {doctor.consultationFee}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {doctor.originalFee}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-primary">
                            {doctor.consultationFee}
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link
                        to="/appointment"
                        className="inline-flex items-center text-primary hover:text-primary-dark font-medium text-sm"
                      >
                        See Doctor
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Info */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredDoctors.length)} of {filteredDoctors.length} doctors
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Can't find the right specialist? Contact us for personalized recommendations.
          </p>
          <Link
            to="/appointment"
            className="inline-block bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsultantsPage; 