export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-16 mt-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* Logo / About */}
        <div>
          <h3 className="text-xl font-bold mb-4">TN TTA</h3>
          <p className="text-sm opacity-80">
            Tamil Nadu Table Tennis Association – 
            Digitizing tournament management and 
            creating transparency in competition.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Home</li>
            <li>Tournaments</li>
            <li>Rankings</li>
            <li>Gallery</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm opacity-80">
            <li>Contact Us</li>
            <li>FAQ</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <p className="text-sm opacity-80">
            Email: info@tntta.org
          </p>
          <p className="text-sm opacity-80">
            Phone: +91 98765 43210
          </p>
        </div>

      </div>

      <div className="border-t border-white/20 mt-12 pt-6 text-center text-sm opacity-70">
        © {new Date().getFullYear()} Tamil Nadu Table Tennis Association. All rights reserved.
      </div>
    </footer>
  );
}