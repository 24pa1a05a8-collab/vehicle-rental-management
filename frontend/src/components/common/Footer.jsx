import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Mail, Phone, MapPin, ShieldCheck, Clock, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md">
                <Car className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">VRMS</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your premier self-drive vehicle rental destination. We provide pristine, fully insured
              cars and SUVs with 24/7 concierge assistance and transparent pricing across India.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Insured</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-brand-400" />
                <span>24/7 Roadside</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Sanitized Fleet</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white hover:underline transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-white hover:underline transition-colors">
                  Browse Fleet
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white hover:underline transition-colors">
                  About VRMS
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white hover:underline transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white hover:underline transition-colors">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          {/* Vehicle Categories */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vehicles?category=Luxury%20Sedan" className="hover:text-white transition-colors">
                  Luxury Sedans
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Premium%20SUV" className="hover:text-white transition-colors">
                  Premium SUVs
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Electric%20Vehicles" className="hover:text-white transition-colors">
                  Electric Vehicles (EV)
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Sports%20%26%20Performance" className="hover:text-white transition-colors">
                  Sports Cars
                </Link>
              </li>
              <li>
                <Link to="/vehicles?category=Passenger%20Van" className="hover:text-white transition-colors">
                  Passenger Vans
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">Headquarters</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-1 shrink-0" />
                <span>Level 4, Cyber City Hub, Outer Ring Road, Bengaluru, India</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 1800-425-VRMS (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@vrms-rentals.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Academic Project Notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Vehicle Rental Management System (VRMS). All rights reserved.</p>
          <p className="px-3 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">
            Full Stack Development (FSD) Capstone Project • MERN Stack
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
