
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDb } from '../services/mockDb';
import { User, Store, UserRole, StoreStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = mockDb.getCurrentUser();
  const [users, setUsers] = useState<User[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.ADMIN) {
      navigate('/');
      return;
    }
    setUsers(mockDb.getUsers());
    setStores(mockDb.getStores());
  }, [currentUser, navigate]);

  const toggleStoreStatus = (storeId: string, currentStatus: StoreStatus) => {
    const newStatus = currentStatus === StoreStatus.ACTIVE ? StoreStatus.BLOCKED : StoreStatus.ACTIVE;
    mockDb.updateStoreStatus(storeId, newStatus);
    setStores(mockDb.getStores());
  };

  const handleMarkPaid = (storeId: string) => {
    mockDb.markSetupPaid(storeId);
    setStores(mockDb.getStores());
    alert('Store Setup marked as PAID manually.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold">Admin Command Center</h1>
        <p className="text-gray-500">Monitor and moderate all WS-Stores in real-time.</p>
      </header>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-sm text-gray-600">User / Store Name</th>
              <th className="px-6 py-4 font-bold text-sm text-gray-600">Contact</th>
              <th className="px-6 py-4 font-bold text-sm text-gray-600">Setup Status</th>
              <th className="px-6 py-4 font-bold text-sm text-gray-600">Store Status</th>
              <th className="px-6 py-4 font-bold text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.filter(u => u.role !== UserRole.ADMIN).map(user => {
              const store = stores.find(s => s.userId === user.id);
              return (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.storeName}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm">{user.email}</p>
                    {/* Fix: Updated phone to whatsappNumber to match User interface */}
                    <p className="text-xs text-gray-400">{user.whatsappNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    {store ? (
                      store.setupPaid ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">PAID</span>
                      ) : (
                        <button onClick={() => handleMarkPaid(store.id)} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold hover:bg-blue-100">
                          MARK PAID
                        </button>
                      )
                    ) : (
                      <span className="text-gray-400 text-xs italic">In Setup...</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {store ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${store.status === StoreStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {store.status}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 space-x-2">
                    {store && (
                      <button 
                        onClick={() => toggleStoreStatus(store.id, store.status)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all ${store.status === StoreStatus.ACTIVE ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                      >
                        {store.status === StoreStatus.ACTIVE ? 'BLOCK' : 'UNBLOCK'}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length <= 1 && <div className="p-10 text-center text-gray-400">No stores registered yet.</div>}
      </div>
    </div>
  );
};

export default AdminDashboard;
