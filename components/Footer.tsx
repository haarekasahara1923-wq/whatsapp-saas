import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* About Us */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-wider text-green-500">About Us</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            WS-Store is your premier solution for launching a digital storefront directly on WhatsApp.
                            We empower small businesses to connect with customers instantly, manage inventory effortlessly,
                            and scale their sales without technical barriers.
                        </p>
                    </div>

                    {/* Legal / Policy */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-wider text-green-500">Legal & Policy</h3>
                        <ul className="space-y-3 text-sm font-medium text-gray-400">
                            <li>
                                <Link to="/terms" className="hover:text-white transition-colors flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/disclaimer" className="hover:text-white transition-colors flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                    Disclaimer
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-white transition-colors flex items-center">
                                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-wider text-green-500">Contact Us</h3>
                        <div className="space-y-3 text-sm text-gray-400">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-3 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Gangotri Vihar, Dehradun (UK)-248001</span>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <a href="mailto:support.ws-store@wapiflow.site" className="hover:text-white transition-colors">support.ws-store@wapiflow.site</a>
                            </div>
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                <span>+91 94574 40300</span>
                            </div>
                        </div>
                    </div>

                    {/* Branding / Power */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-black uppercase tracking-wider text-green-500">WS-Store</h3>
                        <p className="text-gray-500 text-xs">
                            Empowering local businesses with digital tools.
                        </p>
                        <div className="pt-4 border-t border-gray-800">
                            <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Powered by</p>
                            <p className="text-lg font-bold text-white mt-1">Shree Shyam Tech</p>
                        </div>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {new Date().getFullYear()} WS-Store by Shree Shyam Tech. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        {/* Social placeholders if needed */}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
