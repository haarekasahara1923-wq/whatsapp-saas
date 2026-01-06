
import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6">
            Sell More on <span className="text-green-600">WhatsApp</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Launch your digital store in 5 minutes. No coding, no complex checkout. 
            Directly connect with your buyers on their favorite messaging app.
          </p>
          <div className="flex justify-center">
            <Link to="/register" className="bg-green-600 text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-green-700 transition-all shadow-2xl shadow-green-200 hover:-translate-y-1">
              Create Your Store
            </Link>
          </div>
          <div className="mt-20 relative">
            <img src="https://picsum.photos/seed/dashboard/1200/600" alt="Dashboard Preview" className="rounded-2xl shadow-2xl border border-gray-200" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white p-6 rounded-xl shadow-xl border border-gray-100 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white" />)}
              </div>
              <p className="text-sm font-medium text-gray-600">Joined by 2,000+ Indian Sellers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Scale</h2>
            <p className="text-gray-600">Simple tools for serious business owners</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="8 Niche Templates" 
              desc="Pre-designed templates for Fashion, Tech, Jewelry and more."
              icon="🎨"
            />
            <FeatureCard 
              title="Direct WA Links" 
              desc="Buyers land straight in your WhatsApp inbox with product details."
              icon="📱"
            />
            <FeatureCard 
              title="Variant System" 
              desc="Manage sizes, colors, and materials with ease."
              icon="📐"
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-green-900 rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Transparent Pricing</h2>
              <p className="text-green-100">Setup your store today for just ₹399</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center"><span className="mr-2">✓</span> Includes 1st Month Free</li>
                <li className="flex items-center"><span className="mr-2">✓</span> Unlimited Products</li>
                <li className="flex items-center"><span className="mr-2">✓</span> WhatsApp Integration</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl text-gray-900 w-full md:w-96 text-center">
              <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Recommended</p>
              <h3 className="text-4xl font-black mt-2">₹199<span className="text-lg font-normal text-gray-500">/mo</span></h3>
              <p className="text-sm text-gray-500 mt-2">After 1st month free</p>
              <Link to="/register" className="block w-full bg-green-600 text-white mt-8 py-3 rounded-lg font-bold hover:bg-green-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon }: { title: string, desc: string, icon: string }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

export default LandingPage;
