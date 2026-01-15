
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { UserRole } from '../types';
import { slugify } from '../constants';

const AuthLayout: React.FC<{ children: React.ReactNode, title: string, subtitle: string }> = ({ children, title, subtitle }) => (
  <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
    <div className="hidden md:flex md:w-1/2 bg-green-600 p-12 flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-500 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400 rounded-full -ml-48 -mb-48 blur-3xl opacity-30" />
      <div className="relative z-10">
        <Link to="/" className="text-3xl font-black text-white flex items-center mb-12">
          <svg className="w-10 h-10 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.29-4.143c1.589.943 3.141 1.419 4.767 1.42 5.405.002 9.803-4.392 9.805-9.797.001-2.618-1.02-5.08-2.873-6.932-1.854-1.853-4.316-2.873-6.936-2.873-5.404 0-9.801 4.394-9.803 9.799-.001 1.848.513 3.65 1.486 5.223l-.971 3.548 3.525-.925zm11.238-7.791c-.309-.154-1.829-.902-2.112-1.005-.282-.103-.488-.154-.693.154-.206.309-.796.902-1.002 1.133-.206.232-.412.258-.721.103-.309-.154-1.307-.482-2.489-1.536-.919-.82-1.539-1.832-1.719-2.141-.18-.309-.019-.475.136-.628.14-.138.309-.36.463-.541.154-.18.206-.309.309-.515.103-.206.052-.386-.026-.541-.077-.154-.693-1.673-.951-2.291-.251-.602-.506-.52-.693-.53l-.592-.01c-.206 0-.541.077-.824.386-.282.309-1.08 1.056-1.08 2.574 0 1.518 1.107 2.986 1.261 3.192.154.206 2.179 3.328 5.278 4.664.737.318 1.312.507 1.758.648.74.235 1.414.201 1.947.122.593-.088 1.829-.747 2.086-1.468.257-.721.257-1.34.18-1.468-.077-.128-.282-.206-.591-.36z" /></svg>
          WS-Store
        </Link>
        <h2 className="text-5xl font-black text-white leading-tight mb-6">
          Start your business in under <span className="underline decoration-yellow-400 underline-offset-8">5 minutes.</span>
        </h2>
        <p className="text-green-50 text-xl font-medium max-w-lg mb-12">
          Join 5,000+ Indian sellers who moved their business to WhatsApp.
        </p>
      </div>
    </div>

    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/50 relative">
      <div className="max-w-md w-full">
        <div className="mb-10">
          <h3 className="text-3xl font-black text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 font-medium">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  </div>
);

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = mockDb.getUsers();
    const user = users.find(u => u.email === email);

    if (user && user.password === password) {
      mockDb.setCurrentUser(user);
      if (user.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert('Invalid email or password.');
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to manage your store.">
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Email Address</label>
          <input type="email" required className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-black uppercase text-gray-400 mb-2 tracking-widest">Password</label>
          <input type="password" required className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-medium" value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-green-700 shadow-xl transition-all">
          Sign In
        </button>
      </form>
      <p className="mt-8 text-center text-sm font-medium text-gray-500">
        New here? <Link to="/register" className="text-green-600 font-black">Create a store</Link>
      </p>
    </AuthLayout>
  );
};


export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    storeName: '',
    address: '',
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = mockDb.getUsers();
    if (users.some(u => u.email === form.email)) {
      alert('Email already registered');
      return;
    }

    const storeSlug = slugify(form.storeName);

    if (users.some(u => u.storeSlug === storeSlug)) {
      alert('This store name is already taken. Please choose another.');
      return;
    }

    // Get plan from URL
    const searchParams = new URLSearchParams(location.search);
    const selectedPlan = searchParams.get('plan') || 'monthly';

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...form,
      storeSlug,
      role: UserRole.USER,
      selectedPlan,
      createdAt: new Date().toISOString()
    };

    mockDb.saveUser(newUser as any);
    mockDb.setCurrentUser(newUser as any);
    navigate('/setup');
  };


  return (
    <AuthLayout title="Create Account" subtitle="Start your selling journey.">
      <form onSubmit={handleRegister} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Full Name</label>
            <input required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Rahul S." />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase mb-2">Store Name</label>
            <input required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none" value={form.storeName} onChange={e => setForm({ ...form, storeName: e.target.value })} placeholder="Classic Wear" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Email Address</label>
          <input type="email" required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2">WhatsApp No.</label>
          <input required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none" value={form.whatsappNumber} onChange={e => setForm({ ...form, whatsappNumber: e.target.value })} placeholder="91XXXXXXXXXX" />
        </div>
        <div>
          <label className="block text-xs font-black text-gray-400 uppercase mb-2">Set Password</label>
          <input type="password" required className="w-full p-3.5 bg-white border border-gray-200 rounded-xl outline-none" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-4 mt-2 rounded-xl font-black text-lg hover:bg-green-700 shadow-lg">
          Create My Store
        </button>
      </form>
      <p className="mt-8 text-center text-sm font-medium text-gray-500">
        Already have a store? <Link to="/login" className="text-green-600 font-black">Login here</Link>
      </p>
    </AuthLayout>
  );
};
