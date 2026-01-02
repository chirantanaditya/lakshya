interface FooterGreenProps {
  showPrivacyTerms?: boolean;
}

export default function FooterGreen({ showPrivacyTerms = true }: FooterGreenProps) {
  return (
    <footer className="bg-primary-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-6">Your journey awaits</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
            <a 
              href="https://tidycal.com/suresh1/about-lakshya-counselling" 
              className="px-8 py-4 bg-primary-500 text-primary-600 rounded-4xl hover:bg-primary-400 transition-colors font-medium text-lg"
            >
              Speak with us
            </a>
            <span className="text-white text-xl hidden sm:inline">or</span>
            <a 
              href="/contact-us" 
              className="px-8 py-4 bg-primary-500 text-primary-600 rounded-4xl hover:bg-primary-400 transition-colors font-medium text-lg"
            >
              Write to us
            </a>
          </div>
          
          <h3 className="text-2xl font-semibold mb-6">Spread the word</h3>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <a href="#" className="text-primary-500 hover:text-primary-400 text-3xl">in</a>
            <a href="#" className="text-primary-500 hover:text-primary-400 text-3xl">f</a>
          </div>
          
          {showPrivacyTerms && (
            <div className="flex items-center justify-center gap-6 text-primary-500 text-lg">
              <a href="/privacy-policy" className="hover:text-primary-400">Privacy Policy</a>
              <span className="text-white">or</span>
              <a href="/terms-and-conditions" className="hover:text-primary-400">Terms and Conditions</a>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}

