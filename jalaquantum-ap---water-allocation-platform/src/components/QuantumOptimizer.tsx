import React, { useState } from 'react';
import { api } from '../services/api';
import { OptimizationRun, CanalNetwork } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Cpu, 
  Play, 
  CheckCircle, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Send, 
  RotateCcw,
  Scale,
  Droplets,
  Layers
} from 'lucide-react';

interface QuantumOptimizerProps {
  onOrderDispatched?: () => void;
}

export const QuantumOptimizer: React.FC<QuantumOptimizerProps> = ({ onOrderDispatched }) => {
  const { user, hasRole } = useAuth();
  const [scenario, setScenario] = useState<'Deficit (Drought)' | 'Normal Inflow' | 'Excess (Flood Mitigation)'>('Normal Inflow');
  const [weights, setWeights] = useState({
    drinking: 100,
    agriculture: 85,
    tailEndEquity: 92,
    evaporationLoss: 78,
  });
  const [isSolving, setIsSolving] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationRun | null>(null);
  const [aiSynthesis, setAiSynthesis] = useState<{ source: string; analysis: string } | null>(null);
  const [synthesizingAi, setSynthesizingAi] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState<string | null>(null);

  const handleRunOptimization = async () => {
    setIsSolving(true);
    setDispatchSuccessMsg(null);
    try {
      const res = await api.runOptimization({
        scenario,
        priorityWeights: weights,
        quantumSteps: 45,
      });
      setOptimizationResult(res.solution);

      // Auto-trigger hydrological strategic synthesis
      triggerAiSynthesis(scenario);
    } catch (err: any) {
      console.error('Optimization run failed:', err);
    } finally {
      setIsSolving(false);
    }
  };

  const triggerAiSynthesis = async (currentScenario: string) => {
    setSynthesizingAi(true);
    try {
      const res = await api.synthesizeAI({
        scenario: currentScenario,
        customPrompt: `How does the Quantum QAOA allocation benefit tail-end farmers in the Krishna & Godavari delta while protecting storage reserves?`,
      });
      setAiSynthesis(res);
    } catch (err) {
      console.error('AI synthesis failed:', err);
    } finally {
      setSynthesizingAi(false);
    }
  };

  const handlePushDispatchOrders = async () => {
    if (!optimizationResult) return;
    try {
      // Create dispatch order for the first two critical canals
      for (const item of optimizationResult.allocations.slice(0, 3)) {
        await api.createDispatchOrder({
          reservoirId: 'res-nsp',
          canalId: item.canalId,
          targetDischargeCusecs: item.allocatedCusecs,
          executionNotes: `Authorized from Quantum Run #${optimizationResult.id.slice(-6)}. Gate target: ${item.recommendedGateHours} hrs/day.`,
        });
      }
      setDispatchSuccessMsg('Successfully created official Sluice Gate Dispatch Orders. Telemetry synced.');
      if (onOrderDispatched) onOrderDispatched();
    } catch (err: any) {
      console.error('Failed to dispatch:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              Use Case 03 · Quantum AI Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Irrigation & Water-Resource Allocation Optimisation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Combinatorial QAOA & QUBO Simulated Annealing under AP Hydrological Balance Constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunOptimization}
            disabled={isSolving}
            className="py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-cyan-950 flex items-center gap-2 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 fill-current ${isSolving ? 'animate-spin' : ''}`} />
            <span>{isSolving ? 'Annealing QUBO Matrix...' : 'Run Quantum Optimizer'}</span>
          </button>
        </div>
      </div>

      {/* Control Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Optimization Parameters</span>
            </h2>
            <button
              onClick={() => {
                setScenario('Normal Inflow');
                setWeights({ drinking: 100, agriculture: 85, tailEndEquity: 92, evaporationLoss: 78 });
              }}
              className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Scenario Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Hydrological Inflow Scenario
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Deficit (Drought)', 'Normal Inflow', 'Excess (Flood Mitigation)'] as const).map((sc) => (
                <button
                  key={sc}
                  onClick={() => setScenario(sc)}
                  className={`p-2 rounded-lg text-xs font-medium text-center transition-all border ${
                    scenario === sc
                      ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sc.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-cyan-400" />
                  Tail-End Equity Weighting (Gini Penalization)
                </span>
                <span className="font-mono tabular-nums text-cyan-400 font-semibold">{weights.tailEndEquity}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={weights.tailEndEquity}
                onChange={(e) => setWeights({ ...weights, tailEndEquity: Number(e.target.value) })}
                className="w-full accent-cyan-400"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Elevates priority for distal canals in Rayalaseema & West Godavari deltas.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-indigo-400" />
                  Municipal Drinking Water Guarantee
                </span>
                <span className="font-mono tabular-nums text-indigo-400 font-semibold">{weights.drinking}%</span>
              </div>
              <input
                type="range"
                min="80"
                max="100"
                value={weights.drinking}
                onChange={(e) => setWeights({ ...weights, drinking: Number(e.target.value) })}
                className="w-full accent-indigo-400"
              />
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Amaravati, Vijayawada, Visakhapatnam & Rayalaseema drinking allocation.
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Kharif / Rabi Crop Stage Protection
                </span>
                <span className="font-mono tabular-nums text-emerald-400 font-semibold">{weights.agriculture}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={weights.agriculture}
                onChange={(e) => setWeights({ ...weights, agriculture: Number(e.target.value) })}
                className="w-full accent-emerald-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
                  Conveyance Seepage & Evaporative Loss Penalty
                </span>
                <span className="font-mono tabular-nums text-amber-400 font-semibold">{weights.evaporationLoss}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={weights.evaporationLoss}
                onChange={(e) => setWeights({ ...weights, evaporationLoss: Number(e.target.value) })}
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            <strong className="text-slate-200">Mathematical Formulation</strong>: QAOA minimizes the Hamiltonian
            <code className="text-cyan-300 ml-1">H = Σ w_c(D_c - A_c)² + λ·L_conveyance</code> with 24-qubit mapping of canal gate states.
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-7 space-y-5">
          {optimizationResult ? (
            <div className="space-y-5">
              {/* Outcome Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Equity Gini Index</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {optimizationResult.equityGiniIndex}
                    </span>
                    <span className="text-[10px] text-slate-500">(vs 0.42 classical)</span>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-medium">Equitable access</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Water Conserved</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold font-mono text-cyan-400">
                      +{optimizationResult.waterSavingsTMC}
                    </span>
                    <span className="text-xs text-slate-400">TMC</span>
                  </div>
                  <span className="text-[10px] text-cyan-500 font-medium">Reduced conveyance loss</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Crop Protection</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold font-mono text-indigo-400">
                      {optimizationResult.cropStressMitigationPct}%
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-400 font-medium">Across 4.2M acres</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-400 block">Total 7-Day Release</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-bold font-mono text-white">
                      {optimizationResult.totalAllocatedTMC}
                    </span>
                    <span className="text-xs text-slate-400">TMC</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Multi-basin dispatch</span>
                </div>
              </div>

              {/* Convergence Energy Trace (SVG) */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>Hamiltonian Energy Convergence (QAOA Steps)</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Iterations: {optimizationResult.iterations}
                  </span>
                </div>

                <div className="w-full h-24">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 80">
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#1e293b" strokeDasharray="2 2" />
                    {(() => {
                      const pts = optimizationResult.quboConvergenceEnergy;
                      const maxE = Math.max(...pts) * 1.05;
                      const minE = Math.min(...pts) * 0.95;
                      const stepX = 500 / (pts.length - 1);
                      const polyPoints = pts.map((val, i) => {
                        const x = i * stepX;
                        const y = 75 - ((val - minE) / (maxE - minE)) * 70;
                        return `${x},${y}`;
                      });
                      return (
                        <polyline
                          fill="none"
                          stroke="#22d3ee"
                          strokeWidth="2"
                          points={polyPoints.join(' ')}
                        />
                      );
                    })()}
                  </svg>
                </div>
              </div>

              {/* Canal Allocations Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Optimal Canal Release Matrix
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Hydrologically constrained discharge
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Canal System</th>
                        <th className="py-2.5 px-3 text-right">Demanded</th>
                        <th className="py-2.5 px-3 text-right">Quantum Allocated</th>
                        <th className="py-2.5 px-3 text-right">Fulfillment</th>
                        <th className="py-2.5 px-3 text-right">Gate Window</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-200">
                      {optimizationResult.allocations.map((c) => (
                        <tr key={c.canalId} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-3 font-sans font-medium text-white truncate max-w-[180px]">
                            {c.canalName}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400">
                            {c.demandedCusecs.toLocaleString('en-IN')} cfs
                          </td>
                          <td className="py-2.5 px-3 text-right text-cyan-300 font-bold">
                            {c.allocatedCusecs.toLocaleString('en-IN')} cfs
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                              c.equityFulfillmentPct >= 90
                                ? 'text-emerald-400 bg-emerald-950/40'
                                : 'text-amber-400 bg-amber-950/40'
                            }`}>
                              {c.equityFulfillmentPct}%
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-300">
                            {c.recommendedGateHours} hrs/day
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Dispatch Button */}
                <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Ready to transmit to field sluice gates and canal sub-divisions.
                  </div>
                  {hasRole(['Chief Hydrologist', 'Superintendent Engineer']) && (
                    <button
                      onClick={handlePushDispatchOrders}
                      className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 self-start sm:self-auto shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Authorize & Dispatch Field Orders</span>
                    </button>
                  )}
                </div>
              </div>

              {dispatchSuccessMsg && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{dispatchSuccessMsg}</span>
                </div>
              )}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-12 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-400">
                <Cpu className="w-10 h-10 animate-pulse" />
              </div>
              <div className="max-w-md">
                <h3 className="text-base font-bold text-white">Quantum Solver Ready</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Configure hydrological inflow scenarios and priority weights on the left, then click
                  <strong> "Run Quantum Optimizer"</strong> to schedule multi-basin canal releases.
                </p>
              </div>
              <button
                onClick={handleRunOptimization}
                className="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
              >
                Launch Initial Baseline Optimization
              </button>
            </div>
          )}

          {/* AI Hydrological Strategic Advisory Panel */}
          {aiSynthesis && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Strategic Hydro Advisory ({aiSynthesis.source})</span>
                </div>
                <span className="text-[11px] text-slate-500">AP Water Resources Dept</span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line prose-invert">
                {aiSynthesis.analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
