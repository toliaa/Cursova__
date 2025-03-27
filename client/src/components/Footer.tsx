import { Link } from "wouter";
import { FlaskConical } from "lucide-react";
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-neutral-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* University Info */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary-600 flex items-center justify-center rounded-lg mr-3">
                <FlaskConical className="text-white" />
              </div>
              <h3 className="text-white font-bold">University Research</h3>
            </div>
            <p className="text-sm mb-4">
              Our mission is to advance knowledge through innovative research and to educate future leaders in a collaborative and inclusive environment.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <FaTwitter />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <FaFacebookF />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <FaLinkedinIn />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition">
                <FaYoutube />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="hover:text-white transition">About Us</a></Link></li>
              <li><a href="#" className="hover:text-white transition">Research Areas</a></li>
              <li><a href="#" className="hover:text-white transition">Publications</a></li>
              <li><a href="#" className="hover:text-white transition">Faculty & Staff</a></li>
              <li><a href="#" className="hover:text-white transition">Events</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Research Database</a></li>
              <li><a href="#" className="hover:text-white transition">Library Services</a></li>
              <li><a href="#" className="hover:text-white transition">Funding Opportunities</a></li>
              <li><a href="#" className="hover:text-white transition">Student Research</a></li>
              <li><a href="#" className="hover:text-white transition">Academic Calendar</a></li>
              <li><a href="#" className="hover:text-white transition">Support Services</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition">IP Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Ethics Guidelines</a></li>
              <li><a href="#" className="hover:text-white transition">Accessibility</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-6 text-sm text-neutral-400 flex flex-col md:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} University Research Portal. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <a href="#" className="mr-4 hover:text-white transition">Privacy</a>
            <a href="#" className="mr-4 hover:text-white transition">Terms</a>
            <a href="#" className="hover:text-white transition">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
