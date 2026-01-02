export default function FooterWhite() {
  return (
    <footer className="bg-white text-gray-900 border-t border-gray-200">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Lakshaya Counselling</h3>
            <p className="text-gray-600 mb-6 text-sm">
              Providing the guidance & counselling that takes your career to the next level.
            </p>
            <div>
              <h4 className="text-lg font-semibold mb-2">Spread the word</h4>
              <div className="flex gap-4">
                <a href="#" className="text-primary-500 hover:text-primary-600 text-2xl">in</a>
                <a href="#" className="text-primary-500 hover:text-primary-600 text-2xl">f</a>
              </div>
            </div>
          </div>
          
          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Information</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="/register" className="hover:text-black transition-colors">Register</a></li>
              <li><a href="/login" className="hover:text-black transition-colors">Login</a></li>
              <li><a href="/contact-us" className="hover:text-black transition-colors">Contact Us</a></li>
              <li><a href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-and-conditions" className="hover:text-black transition-colors">Terms and Conditions</a></li>
            </ul>
          </div>
          
          {/* Tests Design For */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tests Design For</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="/high-school-students" className="hover:text-black transition-colors">High School Students</a></li>
              <li><a href="/senior-school-students" className="hover:text-black transition-colors">Senior School Students</a></li>
              <li><a href="/college-student" className="hover:text-black transition-colors">College Students</a></li>
              <li><a href="/corporate-professional" className="hover:text-black transition-colors">Corporate Professionals</a></li>
            </ul>
          </div>
          
          {/* Organizational Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Organizational Service</h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li><a href="/for-academic-insitutions" className="hover:text-black transition-colors">For Academic Institutions</a></li>
              <li><a href="/for-corporates" className="hover:text-black transition-colors">For Corporates and Organizations</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} Lakshaya Counselling. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

