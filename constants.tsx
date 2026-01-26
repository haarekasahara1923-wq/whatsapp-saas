
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
  },
  {
    id: 'organic-fresh',
    name: 'Organic Grocery',
    niche: 'Grocery',
    description: 'Clean, green, and list-based design for fresh produce.',
    thumbnail: 'https://picsum.photos/seed/grocery/400/300',
    config: { fontFamily: 'font-sans', borderRadius: 'rounded-2xl', primaryColor: '#16a34a', layout: 'list' }
  },
  {
    id: 'watch-luxury',
    name: 'Luxury Watches',
    niche: 'Accessories',
    description: 'Dark mode inspired, premium design for timepieces.',
    thumbnail: 'https://picsum.photos/seed/watch/400/300',
    config: { fontFamily: 'font-serif', borderRadius: 'rounded-none', primaryColor: '#c0a062', layout: 'grid' }
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

export const SOCIAL_PLATFORMS = [
  { id: 'whatsapp', name: 'WhatsApp', color: '#25D366', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg> },
  { id: 'instagram', name: 'Instagram', color: '#E4405F', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.78-2.618 6.981-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.353-2.612-6.78-6.981-6.981C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg> },
  { id: 'facebook', name: 'Facebook', color: '#1877F2', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg> },
  { id: 'youtube', name: 'YouTube', color: '#FF0000', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
  { id: 'telegram', name: 'Telegram', color: '#24A1DE', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0C5.346 0 0 5.346 0 11.944c0 6.598 5.346 11.944 11.944 11.944 6.598 0 11.944-5.346 11.944-11.944C23.888 5.346 18.542 0 11.944 0zm5.203 8.32l-1.761 8.303c-.13.585-.477.728-.967.453l-2.684-1.979-1.295 1.246c-.143.143-.263.263-.538.263l.192-2.73 4.97-4.492c.216-.192-.047-.3-.332-.11l-6.142 3.867-2.645-.826c-.575-.18-.585-.575.12-.852l10.332-3.98c.477-.18.895.105.748.83z" /></svg> },
  { id: 'snapchat', name: 'Snapchat', color: '#FFFC00', textColor: '#000', icon: <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24"><path d="M11.99 0C5.372 0 0 5.373 0 12c0 6.627 5.372 12 11.99 12 6.628 0 12-5.373 12-12 0-6.627-5.372-12-12-12zM12 18.25c-.24 0-.46-.01-.67-.04-1.11-.13-1.63-.48-1.96-1.3-.06-.15-.1-.31-.1-.47 0-.39.15-.76.42-1.04l.21-.21c-.42-.18-.84-.42-1.22-.72-.34-.26-.63-.57-.86-.91-.32-.47-.46-.98-.4-1.51.05-.4.18-.75.4-1.05.28-.39.69-.64 1.15-.7.21-.03.41-.01.61.05.02-.12.04-.24.08-.36.16-.48.43-.9.79-1.23.43-.39.95-.59 1.54-.59s1.11.2 1.54.59c.36.33.63.75.79 1.23.04.12.06.24.08.36.2-.06.4-.08.61-.05.46.06.87.31 1.15.7.22.3.35.65.4 1.05.06.53-.08 1.04-.4 1.51-.23.34-.52.65-.86.91-.38.3-.8.54-1.22.72l.21.21c.27.28.42.65.42 1.04 0 .16-.04.32-.1.47-.33.82-.85 1.17-1.96 1.3-.21.03-.43.04-.67.04z" /></svg> },
  { id: 'tiktok', name: 'TikTok', color: '#000000', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31 0 2.591.215 3.793.63V4.96c-.799-.24-1.642-.365-2.503-.365-2.91 0-5.27 2.36-5.27 5.27v2.487c0 2.91 2.36 5.27 5.27 5.27s5.27-2.36 5.27-5.27V0h4.41c.209 2.115 1.258 4.02 2.894 5.342v4.41c-2.455 0-4.693-.934-6.393-2.463v8.196c0 5.234-4.244 9.478-9.478 9.478s-9.478-4.244-9.478-9.478c0-5.127 4.062-9.303 9.155-9.472V4.41C4.418 4.58 0 8.784 0 13.985c0 5.485 4.446 9.931 9.931 9.931s9.931-4.446 9.931-9.931V5.21c1.474.928 3.208 1.468 5.069 1.468v-4.41c-2.193 0-4.161-1.01-5.46-2.585l.004-.004v-.004c.148-.182.28-.376.395-.579h-4.41a9.922 9.922 0 01-2.935.441z" /></svg> },
  { id: 'x', name: 'X', color: '#000000', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg> },
  { id: 'threads', name: 'Threads', color: '#000000', icon: <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.5c-3.59 0-6.5-2.91-6.5-6.5s2.91-6.5 6.5-6.5 6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm0-11c-2.481 0-4.5 2.019-4.5 4.5s2.019 4.5 4.5 4.5 4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5z" /></svg> },
];
