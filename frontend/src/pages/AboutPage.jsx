import React from 'react';
import { ShieldCheck, Award, Users, HeartHandshake, Car, Sparkles, CheckCircle2 } from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { label: 'Active Fleet Vehicles', value: '500+' },
    { label: 'Satisfied Renters', value: '25,000+' },
    { label: 'Cities Covered in India', value: '30+' },
    { label: 'Customer Trust Score', value: '4.9 / 5' },
  ];

  const values = [
    {
      title: 'Flawless Fleet Quality',
      desc: 'Every vehicle in our fleet is bought brand new, maintained strictly at authorized dealerships, and checked across 45 safety parameters before delivery.',
      icon: Award,
    },
    {
      title: 'Transparent, Honest Pricing',
      desc: 'No hidden surge pricing, surprise tolls, or opaque deposits. What you see during booking is strictly what you pay.',
      icon: ShieldCheck,
    },
    {
      title: 'Customer-Obsessed Concierge',
      desc: 'Our 24/7 dedicated helpline ensures you are never stranded, whether you need roadside jumpstarts, tire assistance, or itinerary changes.',
      icon: Users,
    },
    {
      title: 'Green Mobility Future',
      desc: 'Over 30% of our active fleet runs on zero-emission electric powertrains, driving sustainable transportation across India.',
      icon: Sparkles,
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-slate-900 text-white py-20 rounded-b-[3rem] text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500/20 text-brand-400 border border-brand-500/30">
            About VRMS Rentals
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
            Redefining the Self-Drive Experience Across India
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Founded with the conviction that car rental should be exhilarating, effortless, and 100%
            transparent. We connect passionate drivers to the finest machines on the road.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 text-center border border-slate-200/80 shadow-sm"
            >
              <h3 className="text-3xl font-black text-brand-600 mb-1">{s.value}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Our Mission & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Our Journey
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              From a Passion for Cars to India's Premier Mobility Platform
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Started in 2022, VRMS was born to eliminate the legacy pain points of vehicle rental:
              outdated car fleets, opaque security deposit lockups, and endless paperwork.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We built an automated, cloud-connected fleet management system powered by the MERN
              stack. Drivers can book in 60 seconds with instant digital key handovers, automated
              invoices, and comprehensive bumper-to-bumper insurance.
            </p>

            <div className="pt-2 space-y-2 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero Hidden Fees or Fuel Surcharges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Unlimited Kilometers on Selected Luxury Sedans & EVs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Free Doorstep Delivery & Airport Terminal Pickup</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 aspect-[4/3] bg-slate-100">
            <img
              src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80"
              alt="Luxury Fleet"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Our Guiding Principles
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
            Built on Trust, Safety & Passion
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{v.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
