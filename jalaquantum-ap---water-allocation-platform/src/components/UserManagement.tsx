import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  UserPlus, 
  Search, 
  Shield, 
  ShieldAlert, 
  CheckCircle, 
  X, 
  Trash2, 
  Edit3, 
  Phone, 
  Mail, 
  Building, 
  MapPin, 
  Lock,
  RefreshCw,
  Check
} from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { user: currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('Canal Gate Controller');
  const [newDept, setNewDept] = useState('AP Water Resources Department');
  const [newCommandArea, setNewCommandArea] = useState('Krishna Delta Basin');
  const [newPhone, setNewPhone] = useState('+91 866-2480000');
  const [newPass, setNewPass] = useState('apwater2026');

  const fetchUsers = async () => {
    try {
      const res = await api.getUsers();
      setUsers(res.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createUser({
        name: newName,
        email: newEmail,
        role: newRole,
        department: newDept,
        commandArea: newCommandArea,
        phone: newPhone,
        temporaryPassword: newPass,
      });
      await fetchUsers();
      setShowAddModal(false);
      resetNewForm();
    } catch (err: any) {
      alert(err.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  const resetNewForm = () => {
    setNewName('');
    setNewEmail('');
    setNewRole('Canal Gate Controller');
    setNewDept('AP Water Resources Department');
    setNewCommandArea('Krishna Delta Basin');
    setNewPhone('+91 866-2480000');
    setNewPass('apwater2026');
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    try {
      await api.updateUser(editingUser.id, {
        role: editingUser.role,
        department: editingUser.department,
        commandArea: editingUser.commandArea,
        phone: editingUser.phone,
        status: editingUser.status,
      });
      await fetchUsers();
      setEditingUser(null);
    } catch (err: any) {
      alert(err.message || 'Failed to update user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (userToToggle: User) => {
    const nextStatus = userToToggle.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await api.updateUser(userToToggle.id, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userToToggle.id ? { ...u, status: nextStatus } : u))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteConfirmId(null);
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.commandArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              Secure Data Dashboard
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Water Authority Personnel & User Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage authenticated engineers, CWC/KGBO liaisons, and field gate controllers with command jurisdictions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true);
              fetchUsers();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="Refresh Directory"
            aria-label="Refresh user directory"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 shadow"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Official</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or jurisdiction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 whitespace-nowrap">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            <option value="All">All Roles</option>
            <option value="Chief Hydrologist">Chief Hydrologist</option>
            <option value="Superintendent Engineer">Superintendent Engineer</option>
            <option value="Canal Gate Controller">Canal Gate Controller</option>
            <option value="CWC/KGBO Liaison">CWC/KGBO Liaison</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Registered Hydrological Personnel</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredUsers.length} Officials Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Official / Engineer</th>
                <th className="py-3 px-3">Role & Clearance</th>
                <th className="py-3 px-3">Department & Command Jurisdiction</th>
                <th className="py-3 px-3">Contact</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-700"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-white block">{u.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-950 border border-slate-800 text-cyan-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div>
                      <span className="text-slate-200 block">{u.commandArea}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[200px]">
                        {u.department}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-mono text-slate-400 tabular-nums">
                    {u.phone}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors ${
                        u.status === 'Active'
                          ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60'
                          : 'bg-rose-950/60 border-rose-800 text-rose-300 hover:bg-rose-900/60'
                      }`}
                      title="Click to toggle status"
                    >
                      {u.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingUser({ ...u })}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                        title="Edit User Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Revoke Access"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Permission Matrix Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span>Security Clearance & Operational Jurisdiction Matrix</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">Chief Hydrologist</span>
            <p className="text-[11px] text-slate-400">
              Full multi-basin authorization. Can initiate quantum optimization, push dispatch orders to field gates, and manage personnel credentials.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">Superintendent Engineer</span>
            <p className="text-[11px] text-slate-400">
              Circle-level authority (e.g. NSP Circle). Can adjust reservoir gates, propose pulse releases, and monitor canal delivery equity.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">Canal Gate Controller</span>
            <p className="text-[11px] text-slate-400">
              Field operational clearance. Confirms sluice gate executions, logs discharge rates, and reports tail-end delivery alerts.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
            <span className="font-semibold text-cyan-400 block mb-1">CWC/KGBO Liaison</span>
            <p className="text-[11px] text-slate-400">
              Inter-state quota oversight. Audits Srisailam-Tungabhadra and Polavaram compliance records and historical run logs.
            </p>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Enroll Water Authority Official</h3>
                <p className="text-xs text-slate-400">Create authenticated account for hydrological operations</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Full Official Name</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    placeholder="Er. Suresh Kumar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Official Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    placeholder="suresh.k@ap.gov.in"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Official Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  >
                    <option value="Chief Hydrologist">Chief Hydrologist</option>
                    <option value="Superintendent Engineer">Superintendent Engineer</option>
                    <option value="Canal Gate Controller">Canal Gate Controller</option>
                    <option value="CWC/KGBO Liaison">CWC/KGBO Liaison</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Phone / Radio Dispatch</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Department / Organization</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Command Area Jurisdiction</label>
                <input
                  type="text"
                  value={newCommandArea}
                  onChange={(e) => setNewCommandArea(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Temporary Initial Password</label>
                <input
                  type="text"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                >
                  {submitting ? 'Enrolling...' : 'Enroll Official'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Edit Official Credentials</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Official Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as UserRole })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Chief Hydrologist">Chief Hydrologist</option>
                  <option value="Superintendent Engineer">Superintendent Engineer</option>
                  <option value="Canal Gate Controller">Canal Gate Controller</option>
                  <option value="CWC/KGBO Liaison">CWC/KGBO Liaison</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Command Area Jurisdiction</label>
                <input
                  type="text"
                  value={editingUser.commandArea}
                  onChange={(e) => setEditingUser({ ...editingUser, commandArea: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Status</label>
                <select
                  value={editingUser.status}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold"
                >
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <ShieldAlert className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">Revoke Official Access?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to revoke this officer's security clearance? They will no longer be able to log in or issue sluice gate dispatches.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirmId)}
                className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs"
              >
                Revoke Credentials
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
