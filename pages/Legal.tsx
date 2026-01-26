import React, { useEffect } from 'react';

export const Terms: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black mb-6">Terms & Conditions</h1>
            <p className="text-gray-600 mb-4">
                Welcome to WS-Store. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
                By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">2. Use of Service</h2>
            <p className="text-gray-600 mb-4">
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">3. Content and Conduct</h2>
            <p className="text-gray-600 mb-4">
                You must not use the Service for any illegal or unauthorized purpose. You must not, in the use of the Service, violate any laws in your jurisdiction.
            </p>
        </div>
    );
};

export const Disclaimer: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black mb-6">Disclaimer</h1>
            <p className="text-gray-600 mb-4">
                The information provided by WS-Store ("we," "us," or "our") on this website and our mobile application is for general informational purposes only.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">1. No Warranty</h2>
            <p className="text-gray-600 mb-4">
                All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">2. External Links</h2>
            <p className="text-gray-600 mb-4">
                The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
            </p>
        </div>
    );
};

export const Privacy: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-black mb-6">Privacy Policy</h1>
            <p className="text-gray-600 mb-4">
                Your privacy is important to us. It is WS-Store's policy to respect your privacy regarding any information we may collect from you across our website.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
                We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.
            </p>
            <h2 className="text-xl font-bold mt-8 mb-2">2. Data Retention</h2>
            <p className="text-gray-600 mb-4">
                We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we’ll protect within commercially acceptable means to prevent loss and theft.
            </p>
        </div>
    );
};
