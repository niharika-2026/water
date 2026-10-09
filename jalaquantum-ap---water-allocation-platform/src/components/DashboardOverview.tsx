import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Reservoir, InflowForecastPoint, TelemetryAlert } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Waves, 
  ArrowUpRight, 
  ArrowDownRight, 
  Minus, 
  TrendingUp, 
  AlertTriangle, 
  Sliders, 
  RefreshCw, 
  Check, 
  X, 
  Droplets,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

interface DashboardOverviewProps {
  onNavigateToOptimizer: () => void;
  onNavigateToCanals: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  onNavigateToOptimizer,
  onNavigateToCanals,
}) => {
  const { user, hasRole } = useAuth();
  const [reservoirs, setReservoirs] = useState<Reservoir[]>([]);
  const [forecast, setForecast] = useState<InflowForecastPoint[]>([]);
  const [alerts, setAlerts] = useState<TelemetryAlert[]>([]);
  const [liveMetrics, setLiveMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  // Quick gate editing modal
  const [editingReservoir, setEditingReservoir] = useState<Reservoir | null>(null);
  const [newGateCount, setNewGateCount] = useState<number>(0);
  const [newGateStatus, setNewGateStatus] = useState<string>('Normal');
  const [gateSubmitting, setGateSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [resData, predData, alertData] = await Promise.all([
        api.getReservoirs(),
        api.getLivePredictions(),
        api.getAlerts(),
      ]);
      setReservoirs(resData.reservoirs);
      setForecast(predData.forecast);
      setLiveMetrics(predData.liveMetrics);
      setAlerts(alertData.alerts);
    } catch (err: any) {
      console.error('Error fetching dashboard telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Live polling interval for real-time dashboard predictions
    const interval = setInterval(fetchData, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleAcknowledgeAlert = async (id: string) => {
    try {
      await api.acknowledgeAlert(id);
      setAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      );
    } catch (err) {
      console.error('Ack error:', err);
    }
  };

  const openGateModal = (res: Reservoir) => {
    setEditingReservoir(res);
    setNewGateCount(res.gatesOpen);
    setNewGateStatus(res.floodGateStatus);
  };

  const handleSaveGateControl = async () => {
    if (!editingReservoir) return;
    setGateSubmitting(true);
    try {
      await api.updateReservoirGates(editingReservoir.id, newGateCount, newGateStatus);
      await fetchData();
      setEditingReservoir(null);
    } catch (err) {
      console.error('Failed to update gates:', err);
    } finally {
      setGateSubmitting(false);
    }
  };

  const maxForecastInflow = forecast.length > 0
    ? Math.max(...forecast.map((f) => f.upperConfidenceCusecs)) * 1.08
    : 200000;

  const activeAlerts = alerts.filter((a) => !a.acknowledged);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Top Banner / Live Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Krishna-Godavari Hydrological Operations</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry, 7-day predictive inflow forecasts, and quantum release scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono tabular-nums">Telemetry Stream Active</span>
          </div>

          <button
            onClick={() => {
              setLoading(true);
              fetchData();
            }}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            title="Refresh Data"
            aria-label="Refresh telemetry data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Active Alerts Banner if any */}
      {activeAlerts.length > 0 && (
        <div className="space-y-2">
          {activeAlerts.map((alt) => (
            <div
              key={alt.id}
              className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                alt.type === 'Critical'
                  ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${alt.type === 'Critical' ? 'text-rose-400' : 'text-amber-400'}`} />
                <div>
                  <span className="font-semibold mr-2">[{alt.basin} Basin Alert] {alt.title}:</span>
                  <span className="text-slate-300">{alt.description}</span>
                </div>
              </div>
              <button
                onClick={() => handleAcknowledgeAlert(alt.id)}
                className="self-end sm:self-auto px-2.5 py-1 rounded bg-slate-900/80 hover:bg-slate-900 border border-slate-700/60 text-slate-300 text-[11px] whitespace-nowrap transition-colors"
              >
                Acknowledge
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Primary KPI Grid (4-Column) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inflow */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Total Basin Inflow</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {liveMetrics?.totalInflowCusecs ? (liveMetrics.totalInflowCusecs).toLocaleString('en-IN') : '1,98,900'}
            </span>
            <span className="text-xs text-slate-400">cusecs</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+4.2% upstream inflow trend</span>
          </div>
        </div>

        {/* Live Storage */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Combined Storage</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {liveMetrics?.totalStorageTMC ? liveMetrics.totalStorageTMC : '650.1'}
            </span>
            <span className="text-xs text-slate-400">TMC</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <span>{liveMetrics?.overallCapacityPct || '80.4'}% of 808.7 TMC capacity</span>
          </div>
        </div>

        {/* Total Outflow */}
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-4">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Canal & Barrage Outflow</span>
            <Waves className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
              {liveMetrics?.totalOutflowCusecs ? (liveMetrics.totalOutflowCusecs).toLocaleString('en-IN') : '1,75,900'}
            </span>
            <span className="text-xs text-slate-400">cusecs</span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-cyan-400">
            <span>Net impoundment: +{(liveMetrics?.netHydrologicalBalanceCusecs || 23000).toLocaleString('en-IN')} cfs</span>
          </div>
        </div>

        {/* Quantum Dispatch Action Card */}
        <div className="bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-800/50 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Quantum QAOA Engine
            </div>
            <div className="mt-1 text-xs text-slate-300">
              Optimal gate pulse schedule ready for dispatch across 8 command canals.
            </div>
          </div>
          <button
            onClick={onNavigateToOptimizer}
            className="mt-3 w-full py-1.5 px-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow"
          >
            <span>Launch Quantum Solver</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 7-Day Live Predictive Hydro Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <span>Live 7-Day Hydrological Inflow & Quantum Release Predictions</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Machine Learning Inflow Forecast (LSTM + Radar) vs Classical Heuristic vs Quantum QAOA Release Dispatch
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-cyan-400 rounded-full" />
              <span>Predicted Inflow</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-400 rounded-full" />
              <span>Quantum Release</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-rose-400/80 stroke-dashed rounded-full" />
              <span>Classical Baseline</span>
            </div>
          </div>
        </div>

        {/* SVG Forecast Graph */}
        <div className="relative pt-2">
          <div className="w-full h-64 sm:h-72">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 700 240">
              <defs>
                <linearGradient id="inflowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="confidenceBand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.03" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 60, 120, 180, 240].map((y, idx) => (
                <g key={idx}>
                  <line x1="40" y1={y} x2="690" y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                  <text x="35" y={y + 4} textAnchor="end" className="text-[10px] fill-slate-500 font-mono">
                    {Math.round(maxForecastInflow - (y / 240) * maxForecastInflow).toLocaleString('en-IN')}
                  </text>
                </g>
              ))}

              {forecast.length > 0 && (() => {
                const step = 650 / (forecast.length - 1);
                
                // Build Inflow path
                const inflowPoints = forecast.map((f, i) => {
                  const x = 40 + i * step;
                  const y = 240 - (f.predictedInflowCusecs / maxForecastInflow) * 230;
                  return `${x},${y}`;
                });

                // Build Confidence polygon
                const upperPoints = forecast.map((f, i) => {
                  const x = 40 + i * step;
                  const y = 240 - (f.upperConfidenceCusecs / maxForecastInflow) * 230;
                  return `${x},${y}`;
                });
                const lowerPoints = [...forecast].reverse().map((f, i) => {
                  const origIdx = forecast.length - 1 - i;
                  const x = 40 + origIdx * step;
                  const y = 240 - (f.lowerConfidenceCusecs / maxForecastInflow) * 230;
                  return `${x},${y}`;
                });
                const bandPath = `M ${upperPoints.join(' L ')} L ${lowerPoints.join(' L ')} Z`;

                // Build Quantum Release path
                const quantumPoints = forecast.map((f, i) => {
                  const x = 40 + i * step;
                  const y = 240 - (f.quantumOptimizedReleaseCusecs / maxForecastInflow) * 230;
                  return `${x},${y}`;
                });

                // Build Classical Baseline path
                const classicalPoints = forecast.map((f, i) => {
                  const x = 40 + i * step;
                  const y = 240 - (f.classicalBaselineCusecs / maxForecastInflow) * 230;
                  return `${x},${y}`;
                });

                return (
                  <>
                    {/* Confidence Band */}
                    <path d={bandPath} fill="url(#confidenceBand)" />

                    {/* Area under Inflow */}
                    <path
                      d={`M 40,240 L ${inflowPoints.join(' L ')} L ${40 + (forecast.length - 1) * step},240 Z`}
                      fill="url(#inflowGradient)"
                    />

                    {/* Classical Path */}
                    <polyline
                      fill="none"
                      stroke="#f87171"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      points={classicalPoints.join(' ')}
                    />

                    {/* Quantum Release Path */}
                    <polyline
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      points={quantumPoints.join(' ')}
                    />

                    {/* Inflow Path */}
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="3"
                      points={inflowPoints.join(' ')}
                    />

                    {/* Interactive Points */}
                    {forecast.map((f, i) => {
                      const x = 40 + i * step;
                      const yInflow = 240 - (f.predictedInflowCusecs / maxForecastInflow) * 230;
                      const isSelected = selectedDayIndex === i;

                      return (
                        <g
                          key={i}
                          onClick={() => setSelectedDayIndex(i)}
                          className="cursor-pointer group"
                        >
                          <line
                            x1={x}
                            y1="0"
                            x2={x}
                            y2="240"
                            stroke={isSelected ? '#38bdf8' : '#334155'}
                            strokeWidth={isSelected ? '1.5' : '0.5'}
                            strokeDasharray={isSelected ? undefined : '2 2'}
                          />
                          <circle
                            cx={x}
                            cy={yInflow}
                            r={isSelected ? 6 : 4}
                            fill="#0284c7"
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                          <text
                            x={x}
                            y="255"
                            textAnchor="middle"
                            className={`text-[11px] font-mono ${
                              isSelected ? 'fill-cyan-300 font-bold' : 'fill-slate-400'
                            }`}
                          >
                            {f.date.split(',')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Selected Day Telemetry Details Card */}
        {forecast[selectedDayIndex] && (
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Forecast Date</span>
              <span className="font-semibold text-slate-200">
                {forecast[selectedDayIndex].date}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Predicted Inflow</span>
              <span className="font-mono tabular-nums font-semibold text-cyan-400">
                {forecast[selectedDayIndex].predictedInflowCusecs.toLocaleString('en-IN')} cusecs
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Quantum Release Target</span>
              <span className="font-mono tabular-nums font-semibold text-emerald-400">
                {forecast[selectedDayIndex].quantumOptimizedReleaseCusecs.toLocaleString('en-IN')} cusecs
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Projected Total Storage</span>
              <span className="font-mono tabular-nums font-semibold text-indigo-300">
                {forecast[selectedDayIndex].reservoirStorageTMC} TMC
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Reservoir Gauges Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">AP Krishna & Godavari Basin Reservoirs</h2>
            <p className="text-xs text-slate-400">
              Live levels, storage volume (TMC), flood gate status and sluice configurations
            </p>
          </div>
          <button
            onClick={onNavigateToCanals}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
          >
            <span>View Canal Networks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reservoirs.map((res) => {
            const pct = res.liveCapacityPercentage;
            const levelRatio = ((res.currentLevelFt / res.fullReservoirLevelFt) * 100).toFixed(1);

            return (
              <div
                key={res.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wide">
                        {res.basin} Basin · {res.district}
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">{res.name}</h3>
                    </div>

                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                        res.floodGateStatus === 'Alert'
                          ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                          : res.floodGateStatus === 'Critical'
                          ? 'bg-rose-950/60 border-rose-800 text-rose-300'
                          : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
                      }`}
                    >
                      {res.floodGateStatus}
                    </span>
                  </div>

                  {/* Level & Storage Visual Bar */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Level</span>
                      <span className="font-mono tabular-nums text-slate-200">
                        {res.currentLevelFt} ft / {res.fullReservoirLevelFt} ft FRL
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          pct > 85 ? 'bg-cyan-400' : pct > 60 ? 'bg-sky-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Storage: <strong className="text-slate-300 font-mono tabular-nums">{res.currentStorageTMC}</strong> / {res.grossStorageTMC} TMC</span>
                      <span className="font-mono tabular-nums text-cyan-300 font-semibold">{pct}% full</span>
                    </div>
                  </div>

                  {/* Inflow vs Outflow */}
                  <div className="mt-4 grid grid-cols-2 gap-2 p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Inflow</span>
                      <span className="font-mono tabular-nums font-semibold text-emerald-400">
                        {(res.inflowCusecs).toLocaleString('en-IN')} cfs
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Outflow</span>
                      <span className="font-mono tabular-nums font-semibold text-slate-200">
                        {(res.outflowCusecs).toLocaleString('en-IN')} cfs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    <span>Sluice Gates: </span>
                    <strong className="text-slate-200 font-mono tabular-nums">{res.gatesOpen}</strong> / {res.totalGates} Open
                  </div>

                  {hasRole(['Chief Hydrologist', 'Superintendent Engineer', 'Canal Gate Controller']) && (
                    <button
                      onClick={() => openGateModal(res)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-medium transition-colors flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>Adjust Gates</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gate Adjustment Modal */}
      {editingReservoir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Adjust Sluice & Spillway Gates</h3>
                <p className="text-xs text-slate-400">{editingReservoir.name} ({editingReservoir.basin} Basin)</p>
              </div>
              <button
                onClick={() => setEditingReservoir(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">
                  Active Gates Open (Max: {editingReservoir.totalGates})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max={editingReservoir.totalGates}
                    value={newGateCount}
                    onChange={(e) => setNewGateCount(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                  <span className="font-mono tabular-nums text-sm font-bold text-cyan-300 w-8 text-right">
                    {newGateCount}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Flood Regulation Status</label>
                <select
                  value={newGateStatus}
                  onChange={(e) => setNewGateStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Normal">Normal Operation</option>
                  <option value="Alert">Alert (High Inflow Inundation Watch)</option>
                  <option value="Spillway Open">Spillway Open (Flood Discharge)</option>
                  <option value="Critical">Critical Emergency Protocol</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px]">
                Authorized by: <strong className="text-slate-200">{user?.name}</strong> ({user?.role}). Changes are synced immediately with field telemetry.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingReservoir(null)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveGateControl}
                disabled={gateSubmitting}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 disabled:opacity-50"
              >
                {gateSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Authorize & Update</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
