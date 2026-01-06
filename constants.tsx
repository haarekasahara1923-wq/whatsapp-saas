
import React from 'react';
import { StoreTemplate, SubscriptionPlan } from './types';

/**
 * Standardize slug generation for URLs
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')     // Remove non-alphanumeric
    .replace(/\s+/g, '-')             // Replace spaces with -
    .replace(/-+/g, '-');             // Remove duplicate -
};

/**
 * Get the base directory URL of the application.
 */
export const getBaseAppUrl = () => {
  return window.location.href.split('#')[0];
};

export const STORE_TEMPLATES: StoreTemplate[] = [
  {
    id: 'fashion-chic',
    name: 'Fashion Boutique',
    niche: 'Fashion',
    description: 'Elegant, image-focused design for high-end clothing.',
    thumbnail: 'https://picsum.photos/seed/fashion/400/300',
    config: { fontFamily: 'font-serif', borderRadius: 'rounded-none', primaryColor: '#111827', layout: 'grid' }
  },
  {
    id: 'tech-modern',
    name: 'Electronics Hub',
    niche: 'Electronics',
    description: 'Modern, high-tech interface with technical specs focus.',
    thumbnail: 'https://picsum.photos/seed/tech/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-md', primaryColor: '#2563eb', layout: 'grid' }
  },
  {
    id: 'kids-joy',
    name: 'Kids & Toys',
    niche: 'Kids',
    description: 'Colorful, playful and safe for younger audiences.',
    thumbnail: 'https://picsum.photos/seed/toys/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-3xl', primaryColor: '#ec4899', layout: 'grid' }
  },
  {
    id: 'jewelry-glam',
    name: 'Artificial Jewelry',
    niche: 'Jewelry',
    description: 'Glamorous and detailed presentation for accessories.',
    thumbnail: 'https://picsum.photos/seed/jewelry/400/300',
    config: { fontFamily: 'font-serif', borderRadius: 'rounded-full', primaryColor: '#b45309', layout: 'grid' }
  },
  {
    id: 'footwear-pro',
    name: 'Footwear Store',
    niche: 'Footwear',
    description: 'Product-centric bold design for sneakers and formal wear.',
    thumbnail: 'https://picsum.photos/seed/shoes/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-sm', primaryColor: '#000000', layout: 'list' }
  },
  {
    id: 'home-cozy',
    name: 'Home Decor',
    niche: 'Home',
    description: 'Lifestyle oriented with warm tones and spacious layouts.',
    thumbnail: 'https://picsum.photos/seed/home/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-lg', primaryColor: '#78350f', layout: 'grid' }
  },
  {
    id: 'beauty-pure',
    name: 'Beauty Products',
    niche: 'Beauty',
    description: 'Clean, aesthetic minimal design for skincare.',
    thumbnail: 'https://picsum.photos/seed/beauty/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-none', primaryColor: '#db2777', layout: 'grid' }
  },
  {
    id: 'sports-active',
    name: 'Sports Equipment',
    niche: 'Sports',
    description: 'Dynamic, energetic high-contrast design.',
    thumbnail: 'https://picsum.photos/seed/sports/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-md', primaryColor: '#dc2626', layout: 'grid' }
  }
];

export const CATEGORIES = [
  'Fashion', 'Electronics', 'Jewelry', 'Footwear', 'Home Decor', 'Beauty', 'Sports', 'Toys', 'Other'
];

export const PRICING_PLANS = [
  {
    id: SubscriptionPlan.MONTHLY,
    name: 'Monthly',
    price: 199,
    setup: 399,
    description: 'Billed monthly from 2nd month',
    savings: null
  },
  {
    id: SubscriptionPlan.YEARLY,
    name: 'Yearly',
    price: 1499,
    setup: 399,
    description: 'Best value for long-term growth',
    savings: '37%'
  }
];
