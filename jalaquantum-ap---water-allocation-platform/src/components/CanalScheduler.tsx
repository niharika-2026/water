import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CanalNetwork, SluiceGateOrder } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Waves, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Send, 
  X, 
  Filter, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

export const CanalScheduler: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [canals, setCanals] = useState<CanalNetwork[]>([]);
  const [orders, setOrders] = useState<SluiceGateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [basinFilter, setBasinFilter] = useState<'All' | 'Krishna' | 'Godavari'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // New order modal
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedCanalId, setSelectedCanalId] = useState('');
  const [targetDischarge, setTargetDischarge] = useState<number>(5000);
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const fetchData = async () => {
    try {
      const [canalRes, orderRes] = await Promise.all([
        api.getCanals(),
        api.getDispatchOrders(),
      ]);
      setCanals(canalRes.canals);
      setOrders(orderRes.orders);
      if (canalRes.canals.length > 0 && !selectedCanalId) {
        setSelectedCanalId(canalRes.canals[0].id);
      }
    } catch (err) {
      console.error('Failed to load canal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateDispatchStatus(orderId, newStatus, 'Status verified from field canal gauge.');
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus as any } : o))
      );
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingOrder(true);
    try {
      const canalObj = canals.find((c) => c.id === selectedCanalId);
      await api.createDispatchOrder({
        canalId: selectedCanalId,
        reservoirName: canalObj?.reservoirSource || 'Nagarjuna Sagar Dam',
        targetDischargeCusecs: targetDischarge,
        scheduledTime: scheduledTime || new Date(Date.now() + 3600000 * 2).toISOString(),
        executionNotes: notes || 'Dispatched via field canal scheduler.',
      });
      await fetchData();
      setShowOrderModal(false);
      setNotes('');
    } catch (err) {
      console.error('Failed to create order:', err);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const filteredCanals = canals.filter((c) => {
    const matchesBasin = basinFilter === 'All' || c.basin === basinFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.reservoirSource.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBasin && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              Sluice Gate & Canal Ops
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Canal Release & Sluice Gate Dispatch</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Command area distributary discharge, tail-end delivery equity tracking, and official dispatch orders.
          </p>
        </div>

        {hasRole(['Chief Hydrologist', 'Superintendent Engineer', 'Canal Gate Controller']) && (
          <button
            onClick={() => setShowOrderModal(true)}
            className="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Issue Sluice Gate Order</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search canals or reservoir..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 w-full sm:w-auto">
          {(['All', 'Krishna', 'Godavari'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBasinFilter(b)}
              className={`flex-1 sm:flex-none px-3 py-1 text-xs font-medium rounded transition-colors ${
                basinFilter === b
                  ? 'bg-cyan-500/10 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {b} Basin
            </button>
          ))}
        </div>
      </div>

      {/* Canal Network Cards & Equity Metrics */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Waves className="w-4 h-4 text-cyan-400" />
            <span>Active Command Area Canals & Tail-End Equity</span>
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            {filteredCanals.length} Networks Monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Canal System</th>
                <th className="py-3 px-3">Reservoir Source</th>
                <th className="py-3 px-3 text-right">Design Discharge</th>
                <th className="py-3 px-3 text-right">Current Discharge</th>
                <th className="py-3 px-3">Tail-End Delivery</th>
                <th className="py-3 px-3 text-right">Command Area</th>
                <th className="py-3 px-3">Primary Crops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredCanals.map((c) => {
                const equity = c.tailEndDeliveryPercentage;
                return (
                  <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-white">
                      <div>
                        <span>{c.name}</span>
                        <span className="text-[10px] text-slate-500 block">
                          Length: {c.lengthKm} km · {c.basin} Basin
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {c.reservoirSource}
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400">
                      {c.designDischargeCusecs.toLocaleString('en-IN')} cfs
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-cyan-300">
                      {c.currentDischargeCusecs.toLocaleString('en-IN')} cfs
                    </td>
                    <td className="py-3 px-3">
                      <div className="w-32">
                        <div className="flex justify-between text-[11px] mb-1">
                          <span className={`font-semibold ${
                            equity >= 80 ? 'text-emerald-400' : equity >= 70 ? 'text-amber-400' : 'text-rose-400'
                          }`}>
                            {equity}%
                          </span>
                          <span className="text-slate-500 text-[10px]">
                            {equity >= 80 ? 'Satisfied' : equity >= 70 ? 'Stressed' : 'Deficit'}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              equity >= 80 ? 'bg-emerald-400' : equity >= 70 ? 'bg-amber-400' : 'bg-rose-500'
                            }`}
                            style={{ width: `${equity}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-300">
                      {(c.commandAcres / 100000).toFixed(2)} Lakh acres
                    </td>
                    <td className="py-3 px-3 text-slate-400 max-w-[150px] truncate" title={c.primaryCrops.join(', ')}>
                      {c.primaryCrops.join(', ')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sluice Gate Dispatch Orders Trail */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Official Sluice Gate Dispatch Orders (AP Government Trail)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized release schedules dispatched to barrage engineers and head regulators
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-cyan-400">
                    {ord.orderNumber}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    ord.status === 'Executed'
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                      : ord.status === 'Dispatched'
                      ? 'bg-sky-950/60 border-sky-800 text-sky-300'
                      : 'bg-amber-950/60 border-amber-800 text-amber-300'
                  }`}>
                    {ord.status}
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  <strong className="text-white">{ord.reservoirName}</strong> &rarr; Target Discharge:{' '}
                  <span className="font-mono tabular-nums text-emerald-400 font-bold">
                    {ord.targetDischargeCusecs.toLocaleString('en-IN')} cusecs
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Authorized by: {ord.authorizedBy} · Notes: {ord.executionNotes || 'Standard pulse release'}
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                {ord.status !== 'Executed' && hasRole(['Chief Hydrologist', 'Superintendent Engineer', 'Canal Gate Controller']) && (
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'Executed')}
                    className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Gate Execution</span>
                  </button>
                )}
                {ord.status === 'Pending' && (
                  <button
                    onClick={() => handleUpdateOrderStatus(ord.id, 'Dispatched')}
                    className="px-3 py-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-medium transition-colors"
                  >
                    Transmit to Radio
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Order Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Issue Official Sluice Gate Order</h3>
              <button
                onClick={() => setShowOrderModal(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Target Canal System</label>
                <select
                  value={selectedCanalId}
                  onChange={(e) => setSelectedCanalId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {canals.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.reservoirSource})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Target Discharge Rate (cusecs)</label>
                <input
                  type="number"
                  min="500"
                  max="25000"
                  step="100"
                  value={targetDischarge}
                  onChange={(e) => setTargetDischarge(Number(e.target.value))}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Authorization Instructions / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Maintain 18-hour rotational flow to protect tail-end Kharif crop."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                Authorizing Official: <strong className="text-white">{user?.name}</strong> ({user?.role}).
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingOrder}
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Sign & Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
