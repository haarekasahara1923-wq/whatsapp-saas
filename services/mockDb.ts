
import { User, Store, Product, UserRole, SubscriptionPlan, StoreStatus } from '../types';
import { supabase } from './supabaseClient';

const DB_KEYS = {
  USERS: 'ws_users',
  STORES: 'ws_stores',
  PRODUCTS: 'ws_products',
  CURRENT_USER: 'ws_current_user'
};

// --- Mappers for CamelCase (App) <-> SnakeCase (DB) ---

const mapUserToDb = (u: User) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  whatsapp_number: u.whatsappNumber,
  store_name: u.storeName,
  store_slug: u.storeSlug,
  address: u.address,
  role: u.role,
  password: u.password,
  created_at: u.createdAt
});

const mapUserFromDb = (u: any): User => ({
  id: u.id,
  name: u.name,
  email: u.email,
  whatsappNumber: u.whatsapp_number,
  storeName: u.store_name,
  storeSlug: u.store_slug || '',
  address: u.address,
  role: u.role as UserRole,
  password: u.password,
  createdAt: u.created_at
});

const mapStoreToDb = (s: Store) => ({
  id: s.id,
  user_id: s.userId,
  template_id: s.templateId,
  status: s.status,
  subscription_type: s.subscriptionType,
  expiry_date: s.expiryDate,
  setup_paid: s.setupPaid,
  settings: s.settings, // JSONB
  created_at: new Date().toISOString() // stores table has created_at
});

const mapStoreFromDb = (s: any): Store => ({
  id: s.id,
  userId: s.user_id,
  templateId: s.template_id,
  status: s.status as StoreStatus,
  subscriptionType: s.subscription_type as SubscriptionPlan,
  expiryDate: s.expiry_date,
  setupPaid: s.setup_paid,
  settings: s.settings
});

const mapProductToDb = (p: Product) => ({
  id: p.id,
  store_id: p.storeId,
  name: p.name,
  description: p.description,
  price: p.price,
  discount_price: p.discountPrice,
  images: p.images,
  video_url: p.videoUrl,
  category: p.category,
  stock: p.stock,
  variants: p.variants, // JSONB
  created_at: p.createdAt
});

const mapProductFromDb = (p: any): Product => ({
  id: p.id,
  storeId: p.store_id,
  name: p.name,
  description: p.description,
  price: p.price,
  discountPrice: p.discount_price,
  images: p.images || [],
  videoUrl: p.video_url,
  category: p.category,
  stock: p.stock,
  variants: p.variants || [],
  createdAt: p.created_at
});

// Initialize Admin if not exists with provided credentials
const ensureAdmin = () => {
  const users = JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]');
  if (!users.find((u: User) => u.email === 'wsstore1923@gmail.com')) {
    users.push({
      id: 'admin-primary',
      name: 'Primary Admin',
      email: 'wsstore1923@gmail.com',
      password: 'Nami@1971',
      whatsappNumber: '9999999999',
      storeName: 'WS Admin Control',
      address: 'System HQ',
      role: UserRole.ADMIN,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
  }
};
ensureAdmin();

export const mockDb = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(DB_KEYS.USERS) || '[]'),
  getStores: (): Store[] => JSON.parse(localStorage.getItem(DB_KEYS.STORES) || '[]'),
  getProducts: (): Product[] => JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTS) || '[]'),

  saveUser: async (user: User) => {
    const users = mockDb.getUsers();
    // Check if updating existing or adding new
    const idx = users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));

    // Cloud Sync
    if (supabase) {
      const dbUser = mapUserToDb(user);
      await supabase.from('users').upsert(dbUser);
    }
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(DB_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser: (user: User | null) => {
    if (user) localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
    else localStorage.removeItem(DB_KEYS.CURRENT_USER);
  },

  saveStore: async (store: Store) => {
    const stores = mockDb.getStores();
    const index = stores.findIndex(s => s.id === store.id);
    if (index > -1) stores[index] = store;
    else stores.push(store);
    localStorage.setItem(DB_KEYS.STORES, JSON.stringify(stores));

    // Cloud Sync
    if (supabase) {
      const dbStore = mapStoreToDb(store);
      await supabase.from('stores').upsert(dbStore);
    }
  },

  getStoreByUserId: (userId: string): Store | undefined => {
    return mockDb.getStores().find(s => s.userId === userId);
  },

  // New Async method for Public Store viewing to fetch from Cloud
  fetchStoreBySlug: async (slug: string): Promise<{ store: Store, user: User, products: Product[] } | null> => {
    const targetSlug = slug.toLowerCase().trim();
    console.log(`[MockDB] Fetching store for slug: ${targetSlug}`);

    // 1. Try Local first (fastest)
    const localUsers = mockDb.getUsers();
    const localUser = localUsers.find(u => u.storeSlug?.toLowerCase() === targetSlug);

    if (localUser) {
      console.log('[MockDB] Found user locally:', localUser.storeName);
      const localStore = mockDb.getStores().find(s => s.userId === localUser.id);
      if (localStore) {
        console.log('[MockDB] Found store locally');
        const localProducts = mockDb.getProducts().filter(p => p.storeId === localStore.id);
        return { store: localStore, user: localUser, products: localProducts };
      }
    } else {
      console.log('[MockDB] User not found locally, trying cloud...');
    }

    // 2. Try Cloud (Supabase)
    if (supabase) {
      try {
        const { data: userData, error: userError } = await supabase.from('users').select('*').ilike('store_slug', targetSlug).maybeSingle();

        if (userError || !userData) {
          console.error('[MockDB] Supabase User Fetch Error (or not found):', userError);
          return null;
        }

        const { data: storeData, error: storeError } = await supabase.from('stores').select('*').eq('user_id', userData.id).single();

        if (storeError || !storeData) {
          console.error('[MockDB] Supabase Store Fetch Error:', storeError);
          return null;
        }

        const { data: productsData } = await supabase.from('products').select('*').eq('store_id', storeData.id);

        return {
          store: mapStoreFromDb(storeData),
          user: mapUserFromDb(userData),
          products: (productsData || []).map(mapProductFromDb)
        };
      } catch (err) {
        console.error('[MockDB] Critical Supabase Error:', err);
        return null;
      }
    } else {
      console.warn('[MockDB] Supabase is not initialized. Cannot fetch from cloud.');
    }

    return null;
  },

  updateStoreStatus: async (storeId: string, status: StoreStatus) => {
    const stores = mockDb.getStores();
    const index = stores.findIndex(s => s.id === storeId);
    if (index > -1) {
      stores[index].status = status;
      localStorage.setItem(DB_KEYS.STORES, JSON.stringify(stores));

      if (supabase) {
        await supabase.from('stores').update({ status }).eq('id', storeId);
      }
    }
  },

  markSetupPaid: async (storeId: string) => {
    const stores = mockDb.getStores();
    const index = stores.findIndex(s => s.id === storeId);
    if (index > -1) {
      stores[index].setupPaid = true;
      localStorage.setItem(DB_KEYS.STORES, JSON.stringify(stores));

      if (supabase) {
        await supabase.from('stores').update({ setup_paid: true }).eq('id', storeId);
      }
    }
  },

  saveProduct: async (product: Product) => {
    const products = mockDb.getProducts();
    const index = products.findIndex(p => p.id === product.id);
    if (index > -1) products[index] = product;
    else products.push(product);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    // Cloud Sync
    if (supabase) {
      const dbProduct = mapProductToDb(product);
      await supabase.from('products').upsert(dbProduct);
    }
  },

  getProductsByStoreId: (storeId: string): Product[] => {
    return mockDb.getProducts().filter(p => p.storeId === storeId);
  },

  deleteProduct: async (productId: string) => {
    const products = mockDb.getProducts().filter(p => p.id !== productId);
    localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

    if (supabase) {
      await supabase.from('products').delete().eq('id', productId);
    }
  },

  syncWithCloud: async () => {
    if (!supabase) return;
    try {
      console.log('[MockDB] Syncing with Cloud...');

      // 1. Check if Cloud is empty by checking Users count
      const { count } = await supabase.from('users').select('*', { count: 'exact', head: true });
      const isCloudEmpty = count === 0;

      if (isCloudEmpty) {
        // Push Local to Cloud
        console.log('[MockDB] Cloud is empty. Pushing local data...');
        const users = mockDb.getUsers();
        for (const u of users) {
          await supabase.from('users').upsert(mapUserToDb(u));
        }

        const stores = mockDb.getStores();
        for (const s of stores) {
          await supabase.from('stores').upsert(mapStoreToDb(s));
        }

        const products = mockDb.getProducts();
        for (const p of products) {
          await supabase.from('products').upsert(mapProductToDb(p));
        }
        console.log('[MockDB] Push Complete.');

      } else {
        // Pull Cloud to Local
        console.log('[MockDB] Cloud has data. Pulling changes...');

        const { data: users } = await supabase.from('users').select('*');
        if (users) {
          const mappedUsers = users.map(mapUserFromDb);
          // Ensure Admin existence in local if forced
          if (!mappedUsers.find(u => u.email === 'wsstore1923@gmail.com')) {
            const localAdmin = mockDb.getUsers().find(u => u.email === 'wsstore1923@gmail.com');
            if (localAdmin) mappedUsers.push(localAdmin);
          }
          localStorage.setItem(DB_KEYS.USERS, JSON.stringify(mappedUsers));
        }

        const { data: stores } = await supabase.from('stores').select('*');
        if (stores) {
          const mappedStores = stores.map(mapStoreFromDb);
          localStorage.setItem(DB_KEYS.STORES, JSON.stringify(mappedStores));
        }

        const { data: products } = await supabase.from('products').select('*');
        if (products) {
          const mappedProducts = products.map(mapProductFromDb);
          localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(mappedProducts));
        }
        console.log('[MockDB] Pull Complete.');
      }

    } catch (e) {
      console.error('[MockDB] Sync Failed:', e);
    }
  }
};
