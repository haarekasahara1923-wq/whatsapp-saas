
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export enum SubscriptionPlan {
  FREE = 'FREE_TRIAL',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  whatsappNumber: string;
  storeName: string;
  storeSlug: string;
  address: string;
  role: UserRole;
  password?: string;
  createdAt: string;
  selectedPlan?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  telegram?: string;
  snapchat?: string;
  tiktok?: string;
  whatsapp?: string;
  x?: string;
  threads?: string;
}

export interface StoreSettings {
  primaryColor: string;
  logoUrl?: string;
  bannerUrl?: string;
  bio?: string;
  category: string;
  templateId: string;
  whatsappNumber: string;
  socialLinks?: SocialLinks;
}

export interface ProductVariant {
  id: string;
  type: 'size' | 'color' | 'material' | 'custom';
  value: string;
  additionalPrice: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  videoUrl?: string; // Added for Veo videos
  category: string;
  stock: number;
  variants: ProductVariant[];
  createdAt: string;
}

export interface StoreTemplate {
  id: string;
  name: string;
  niche: string;
  description: string;
  thumbnail: string;
  config: {
    fontFamily: string;
    borderRadius: string;
    primaryColor: string;
    layout: 'grid' | 'list';
  };
}

export interface Store {
  id: string;
  userId: string;
  templateId: string;
  status: StoreStatus;
  subscriptionType: SubscriptionPlan;
  expiryDate: string;
  setupPaid: boolean;
  settings: StoreSettings;
}
