
import { User, Store, Product, UserRole, SubscriptionPlan, StoreStatus } from '../types';
import { supabase } from './supabaseClient';

const DB_KEYS = {
  USERS: 'ws_users',
  STORES: 'ws_stores',
  PRODUCTS: 'ws_products',
  CURRENT_USER: 'ws_current_user'
};

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
    users.push(user);
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));

    // Cloud Sync
    if (supabase) {
      await supabase.from('users').upsert(user);
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
      await supabase.from('stores').upsert(store);
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
        const { data: userData, error: userError } = await supabase.from('users').select('*').eq('store_slug', targetSlug).single();

        if (userError || !userData) {
          console.error('[MockDB] Supabase User Fetch Error:', userError);
          return null;
        }

        const { data: storeData, error: storeError } = await supabase.from('stores').select('*').eq('user_id', userData.id).single();

        if (storeError || !storeData) {
          console.error('[MockDB] Supabase Store Fetch Error:', storeError);
          return null;
        }

        const { data: productsData } = await supabase.from('products').select('*').eq('store_id', storeData.id);

        return {
          store: storeData as Store,
          user: userData as User,
          products: (productsData || []) as Product[]
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
      await supabase.from('products').upsert(product);
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

      // 1. Sync Users
      const { data: users } = await supabase.from('users').select('*');
      if (users) {
        // Ensure Admin exists in the synced list
        if (!users.find((u: any) => u.email === 'wsstore1923@gmail.com')) {
          const adminUser = {
            id: 'admin-primary',
            name: 'Primary Admin',
            email: 'wsstore1923@gmail.com',
            password: 'Nami@1971',
            whatsappNumber: '9999999999',
            storeName: 'WS Admin Control',
            address: 'System HQ',
            role: UserRole.ADMIN,
            createdAt: new Date().toISOString()
          };
          users.push(adminUser);
          // Try to upsert Admin to Supabase so it persists for next time
          await supabase.from('users').upsert(adminUser);
        }
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
      }

      // 2. Sync Stores
      const { data: stores } = await supabase.from('stores').select('*');
      if (stores) localStorage.setItem(DB_KEYS.STORES, JSON.stringify(stores));

      // 3. Sync Products
      const { data: products } = await supabase.from('products').select('*');
      if (products) localStorage.setItem(DB_KEYS.PRODUCTS, JSON.stringify(products));

      console.log('[MockDB] Sync Complete.');
    } catch (e) {
      console.error('[MockDB] Sync Failed:', e);
    }
  }
};
