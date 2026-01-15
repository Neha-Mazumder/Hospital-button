import { CheckCircle, Users, Clock, Award, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-primary py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">About Our Hospital</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Providing exceptional healthcare services with compassion, innovation, and excellence since our establishment.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-6">
                To provide accessible, high-quality healthcare for everyone — combining excellence in medical care 
                with the convenience of digital service, without ever compromising on quality. We strive to be 
                the leading healthcare provider in our community, offering comprehensive medical services with 
                compassion and innovation.
              </p>
              <p className="text-gray-600">
                Our commitment extends beyond treating illness to promoting wellness, preventing disease, 
                and improving the overall health of our community through education, research, and patient-centered care.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our Vision</h2>
              <p className="text-gray-600 mb-6">
                To be the most trusted healthcare partner in our region, known for exceptional patient outcomes, 
                innovative medical practices, and unwavering commitment to community health and wellness.
              </p>
              <p className="text-gray-600">
                We envision a future where every individual has access to world-class healthcare services, 
                delivered with the highest standards of medical excellence and personalized care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Heart className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Compassion</h3>
              <p className="text-gray-600">
                We treat every patient with kindness, empathy, and respect, understanding that healthcare is deeply personal.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards of medical practice and continuously strive for improvement in all we do.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Integrity</h3>
              <p className="text-gray-600">
                We conduct ourselves with honesty, transparency, and ethical behavior in all our interactions.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Teamwork</h3>
              <p className="text-gray-600">
                We collaborate effectively across disciplines to provide comprehensive, coordinated care for our patients.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <Clock className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Accessibility</h3>
              <p className="text-gray-600">
                We ensure our services are available to all members of our community, regardless of background or circumstance.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We embrace new technologies and approaches to improve patient care and outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Cardiology</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive cardiac care including diagnostic testing, treatment, and preventive care for heart conditions.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Heart disease diagnosis and treatment</li>
                <li>• Cardiac rehabilitation</li>
                <li>• Preventive cardiology</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Neurology</h3>
              <p className="text-gray-600 mb-4">
                Expert neurological care for disorders of the brain, spine, and nervous system.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Stroke treatment and prevention</li>
                <li>• Neurological disorders management</li>
                <li>• Advanced diagnostic imaging</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Orthopedics</h3>
              <p className="text-gray-600 mb-4">
                Specialized care for musculoskeletal conditions, injuries, and joint problems.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Joint replacement surgery</li>
                <li>• Sports medicine</li>
                <li>• Physical therapy</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Pediatrics</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive healthcare for children from birth through adolescence.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Well-child visits</li>
                <li>• Vaccination services</li>
                <li>• Developmental screening</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Dermatology</h3>
              <p className="text-gray-600 mb-4">
                Expert care for skin conditions, including diagnosis and treatment of various dermatological issues.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Skin cancer screening</li>
                <li>• Acne treatment</li>
                <li>• Cosmetic dermatology</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Emergency Care</h3>
              <p className="text-gray-600 mb-4">
                24/7 emergency medical services with rapid response and critical care capabilities.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Trauma care</li>
                <li>• Emergency surgery</li>
                <li>• Critical care medicine</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-300">Expert Doctors</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gray-300">Happy Patients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-gray-300">Years of Service</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-300">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-6">Ready to Experience Our Care?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust us with their health. 
            Schedule your appointment today and take the first step towards better health.
          </p>
          <Link
            to="/appointment"
            className="inline-block bg-primary text-white px-8 py-3 rounded-full font-medium hover:bg-primary-dark transition-colors"
          >
            Book Your Appointment
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 