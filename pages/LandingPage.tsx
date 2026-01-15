
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
                {[1, 2, 3, 4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-white" />)}
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
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Flexible Pricing Plans</h2>
            <p className="text-gray-600">Choose the best plan for your business needs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">

            {/* Monthly Plan */}
            <div className="bg-white p-8 rounded-3xl border-2 border-green-50 shadow-xl hover:border-green-200 transition-all relative">
              <div className="absolute top-0 right-0 bg-green-100 text-green-700 px-4 py-1 rounded-bl-2xl rounded-tr-2xl text-xs font-bold uppercase tracking-wide">
                Best for Starters
              </div>
              <p className="text-gray-500 font-medium uppercase tracking-widest text-xs mb-4">Monthly Plan</p>
              <div className="flex items-baseline mb-2">
                <h3 className="text-4xl font-black">₹399</h3>
                <span className="text-gray-500 ml-2 font-medium">One-time Setup</span>
              </div>
              <p className="text-green-600 font-bold text-sm mb-6 flex items-center">
                <span className="bg-green-100 p-1 rounded mr-2">🎁</span>
                1st Month Subscription WAIVED!
              </p>

              <ul className="space-y-4 mb-8 text-sm text-gray-600">
                <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span> Setup Charge: <strong className="ml-1 text-gray-900">₹399</strong> (Single Time)</li>
                <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span> Monthly Subscription: <strong className="ml-1 text-gray-900">₹299/mo</strong></li>
                <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span> Subscription payable from <strong className="ml-1 text-gray-900">2nd Month</strong></li>
                <li className="flex items-center"><span className="text-green-500 mr-2 text-lg">✓</span> Unlimited Products & Orders</li>
              </ul>
              <Link to="/register" className="block w-full bg-white border-2 border-green-600 text-green-600 py-3 rounded-xl font-bold hover:bg-green-50 transition-all text-center">
                Start Monthly
              </Link>
            </div>

            {/* Yearly Plan */}
            <div className="bg-green-900 p-8 rounded-3xl text-white shadow-2xl relative transform md:-translate-y-4 border-4 border-green-400">
              <div className="absolute top-0 right-0 bg-yellow-400 text-black px-4 py-1 rounded-bl-2xl rounded-tr-2xl text-xs font-bold uppercase tracking-wide">
                Best Value
              </div>
              <p className="text-green-200 font-medium uppercase tracking-widest text-xs mb-4">Yearly Plan</p>
              <div className="flex items-baseline mb-2">
                <h3 className="text-5xl font-black">₹2399</h3>
                <span className="text-green-200 ml-2 font-medium">/year</span>
              </div>
              <p className="text-yellow-400 font-bold text-sm mb-6 flex items-center">
                <span className="bg-white/10 p-1 rounded mr-2">🚀</span>
                Setup Charge (₹399) WAIVED!
              </p>

              <ul className="space-y-4 mb-8 text-sm text-green-100">
                <li className="flex items-center"><span className="text-yellow-400 mr-2 text-lg">✓</span> <span className="line-through opacity-60 mr-2">Setup Charge: ₹399</span> <strong>FREE</strong></li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2 text-lg">✓</span> Pay only <strong className="ml-1 text-white">₹2399/year</strong></li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2 text-lg">✓</span> Save <strong className="ml-1 text-white">₹1500+</strong> annually</li>
                <li className="flex items-center"><span className="text-yellow-400 mr-2 text-lg">✓</span> Priority Support</li>
              </ul>
              <Link to="/register" className="block w-full bg-green-500 text-white py-4 rounded-xl font-bold hover:bg-green-400 transition-all shadow-lg hover:shadow-green-500/50 text-center">
                Get Yearly Deal
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
