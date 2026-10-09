import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, CheckCircle, Shield, Award } from 'lucide-react';

export const ProblemStatementBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border-b border-cyan-900/40 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider shrink-0">
              <CheckCircle className="w-3.5 h-3.5" />
              Selected Problem Statement
            </span>
            <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-300">
              <span className="font-semibold text-slate-200">Team: Entangled Minds</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-400 font-medium">Use Case 03: Irrigation & Water-Resource Allocation Optimisation</span>
              <span className="text-slate-600 hidden md:inline">·</span>
              <span className="text-slate-400 hidden md:inline">AP Krishna-Godavari Command Areas</span>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors self-start sm:self-auto py-1 px-2 rounded hover:bg-slate-800"
          >
            <span>{expanded ? 'Hide Brief Details' : 'View Problem Brief & Scope'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
              <div className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Problem Statement
              </div>
              <p className="text-slate-400 leading-relaxed">
                Allocating limited water across canals, reservoirs and crops under competing demands and variable inflows is a complex combinatorial optimization problem.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
              <div className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                Quantum AI / ML Approach
              </div>
              <p className="text-slate-400 leading-relaxed">
                Quantum and quantum-inspired optimization (QAOA & QUBO simulated annealing) schedule releases and allocations to maximize productive use under hydrological constraints.
              </p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded border border-slate-800">
              <div className="font-semibold text-slate-100 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Mandate & Stakeholders
              </div>
              <p className="text-slate-400 leading-relaxed">
                Applies to: AP Water Resources Dept; CWC / KGBO coordination; Command Area Development irrigation boards. Goal: More equitable water use with reduced tail-end distress and waste.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
