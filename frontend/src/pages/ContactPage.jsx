import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle2, ChevronDown } from 'lucide-react';

const ContactPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      q: 'What documents are required to rent a vehicle?',
      a: 'You will need a valid government-issued Driver’s License (held for at least 1 year) and an Aadhaar card or Passport for identity verification. International drivers need an International Driving Permit (IDP).',
    },
    {
      q: 'Is insurance included in the rental cost?',
      a: 'Yes! Every VRMS rental includes comprehensive third-party and collision damage insurance. Zero security deposit is required for verified accounts.',
    },
    {
      q: 'What is your cancellation and refund policy?',
      a: 'You can cancel any booking free of charge prior to scheduled pickup. Online payments are refunded 100% back to your original payment card or UPI within 2-3 business days.',
    },
    {
      q: 'Can I pick up a car in one city and return it in another?',
      a: 'Yes, we offer convenient one-way interstate rentals across major hub cities (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai) with nominal terminal relocation fees.',
    },
    {
      q: 'What should I do in case of an accident or breakdown?',
      a: 'Contact our 24/7 Roadside Helpline immediately at 1800-425-VRMS. Our nearest field dispatch unit will arrive with towing, battery jump, or an immediate replacement vehicle.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
          We're Here For You 24/7
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Contact Our Concierge Team
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Have questions about luxury car bookings, corporate fleet rentals or roadside assistance?
          Reach out anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Col: Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Telephone Helpline</h4>
              <p className="text-xs text-slate-500 mt-0.5">Toll-free 24/7 Customer Support</p>
              <strong className="text-xs text-brand-600 font-bold block mt-1">
                +91 1800-425-VRMS (8767)
              </strong>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Email Inquiries</h4>
              <p className="text-xs text-slate-500 mt-0.5">Response within 2 hours</p>
              <strong className="text-xs text-emerald-600 font-bold block mt-1">
                support@vrms-rentals.com
              </strong>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Fleet Operations HQ</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Level 4, Cyber City Hub, Outer Ring Road, Bengaluru, Karnataka, India - 560103
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Hours of Dispatch</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Counter Desks: 24 Hours / 7 Days a Week
              </p>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Message Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Send Us an Inquiry</h3>
            <p className="text-xs text-slate-500 mt-1">
              Fill out the form below and an agent will reply promptly.
            </p>
          </div>

          {submitted && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Thank you! Your message has been received. Our team will contact you shortly.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="rahul@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Booking inquiry, corporate rental, feedback..."
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
              <textarea
                rows="4"
                required
                placeholder="Describe your question or requirement..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-7 py-3 rounded-2xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions (Accordion) */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    activeFaq === idx ? 'rotate-180 text-brand-600' : ''
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
