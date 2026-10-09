import React, { useState } from 'react';
import { Reservoir, CanalNetwork } from '../types';
import { 
  Waves, 
  MapPin, 
  Info, 
  ArrowRight, 
  Maximize2, 
  Minimize2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface BasinNetworkMapProps {
  reservoirs?: Reservoir[];
  canals?: CanalNetwork[];
}

export const BasinNetworkMap: React.FC<BasinNetworkMapProps> = ({ reservoirs = [], canals = [] }) => {
  const [selectedNode, setSelectedNode] = useState<{
    id: string;
    title: string;
    type: 'Reservoir' | 'Barrage' | 'Interlink' | 'Delta Canal';
    basin: string;
    inflow: string;
    outflow: string;
    storage: string;
    description: string;
    status: string;
  }>({
    id: 'res-srisailam',
    title: 'Srisailam Dam',
    type: 'Reservoir',
    basin: 'Krishna Basin',
    inflow: '48,500 cusecs',
    outflow: '34,200 cusecs',
    storage: '179.6 / 215.8 TMC (878.4 ft)',
    description: 'Major reservoir governing downstream flows to Nagarjuna Sagar and Rayalaseema transfers via Pothireddypadu Head Regulator.',
    status: 'Normal Operation',
  });

  const nodes = [
    {
      id: 'res-srisailam',
      title: 'Srisailam Dam',
      type: 'Reservoir' as const,
      basin: 'Krishna Basin',
      x: 160,
      y: 110,
      inflow: '48,500 cusecs',
      outflow: '34,200 cusecs',
      storage: '179.6 TMC',
      description: 'Major reservoir on the Krishna river. Feeds Nagarjuna Sagar, SRBC, and Telugu Ganga.',
      status: 'Normal',
    },
    {
      id: 'res-nsp',
      title: 'Nagarjuna Sagar Dam',
      type: 'Reservoir' as const,
      basin: 'Krishna Basin',
      x: 270,
      y: 160,
      inflow: '32,000 cusecs',
      outflow: '28,500 cusecs',
      storage: '248.5 TMC',
      description: 'One of the largest masonry dams. Supplies Jawahar (Right) and Lal Bahadur (Left) canals covering 2.1M acres.',
      status: 'Normal',
    },
    {
      id: 'res-prakasam',
      title: 'Prakasam Barrage',
      type: 'Barrage' as const,
      basin: 'Krishna Delta',
      x: 420,
      y: 230,
      inflow: '24,500 cusecs',
      outflow: '24,100 cusecs',
      storage: '2.92 TMC',
      description: 'Historic barrage at Vijayawada regulating Krishna Eastern and Western delta canals.',
      status: 'Normal',
    },
    {
      id: 'res-polavaram',
      title: 'Polavaram (Indira Sagar)',
      type: 'Reservoir' as const,
      basin: 'Godavari Basin',
      x: 430,
      y: 70,
      inflow: '86,400 cusecs',
      outflow: '78,000 cusecs',
      storage: '162.3 TMC',
      description: 'Multi-purpose national irrigation project linking Godavari surplus water with Krishna Basin via Right Main Canal.',
      status: 'Alert (High Inflow)',
    },
    {
      id: 'res-dowleswaram',
      title: 'Sir Arthur Cotton Barrage',
      type: 'Barrage' as const,
      basin: 'Godavari Delta',
      x: 550,
      y: 130,
      inflow: '76,000 cusecs',
      outflow: '74,200 cusecs',
      storage: '4.88 TMC',
      description: 'Legendary barrage at Rajahmundry feeding Godavari Eastern, Western, and Central delta canals.',
      status: 'Normal',
    },
    {
      id: 'node-interlink',
      title: 'Polavaram-Krishna Link',
      type: 'Interlink' as const,
      basin: 'Inter-Basin Canal',
      x: 350,
      y: 195,
      inflow: '14,200 cusecs',
      outflow: '14,200 cusecs',
      storage: 'Active Transfer',
      description: 'Right Main Canal gravity feeder transferring Godavari flood water into Budameru and Prakasam Barrage pond.',
      status: 'Active Diversion',
    },
    {
      id: 'node-srbc',
      title: 'Srisailam Right Branch (SRBC)',
      type: 'Delta Canal' as const,
      basin: 'Rayalaseema Feed',
      x: 140,
      y: 220,
      inflow: '2,800 cusecs',
      outflow: '2,800 cusecs',
      storage: '141 km Reach',
      description: 'Pothireddypadu off-take serving drought-prone mandals in Kurnool and Nandyal districts.',
      status: 'Tail-End Watch',
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 px-2 py-0.5 rounded">
              Topology & Hydraulics
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Andhra Pradesh River Basin Network</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Krishna and Godavari river flow schematics, inter-basin diversions, and barrage networks.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Reservoir Node</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>Barrage / Delta</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
            <span>Interlink Diversion</span>
          </div>
        </div>
      </div>

      {/* Schematic Map & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SVG Interactive Canvas */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="absolute top-4 left-4 z-10 text-xs font-semibold text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
            Click any hydrological node to inspect live discharge & capacity
          </div>

          <div className="w-full h-80 sm:h-96 relative mt-6">
            <svg className="w-full h-full" viewBox="0 0 650 300">
              <defs>
                {/* River Krishna Gradient */}
                <linearGradient id="krishnaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                </linearGradient>

                {/* River Godavari Gradient */}
                <linearGradient id="godavariGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                </linearGradient>

                {/* Inter-basin transfer pulse */}
                <linearGradient id="interlinkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Bay of Bengal Coastline Representation */}
              <path
                d="M 620,0 Q 560,150 590,300"
                fill="none"
                stroke="#1e293b"
                strokeWidth="8"
                strokeDasharray="4 4"
              />
              <text x="610" y="280" className="text-[10px] fill-slate-600 font-bold uppercase tracking-widest" transform="rotate(-90 610,280)">
                Bay of Bengal
              </text>

              {/* Krishna River Main Stem */}
              <path
                d="M 50,60 Q 120,90 160,110 T 270,160 T 360,200 T 420,230 Q 500,260 590,270"
                fill="none"
                stroke="url(#krishnaGrad)"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <text x="70" y="55" className="text-[11px] fill-cyan-400 font-semibold">
                River Krishna (from Almatti/Jurala)
              </text>

              {/* Godavari River Main Stem */}
              <path
                d="M 320,30 Q 380,50 430,70 T 550,130 Q 580,160 610,180"
                fill="none"
                stroke="url(#godavariGrad)"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <text x="310" y="22" className="text-[11px] fill-emerald-400 font-semibold">
                River Godavari (from Bhadrachalam)
              </text>

              {/* Inter-Basin Polavaram Right Link Canal */}
              <path
                d="M 430,70 C 400,120 370,160 420,230"
                fill="none"
                stroke="url(#interlinkGrad)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
              />

              {/* Rayalaseema Pothireddypadu / SRBC canal */}
              <path
                d="M 160,110 Q 150,170 140,220 T 110,280"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="3 3"
              />

              {/* Krishna Delta Western & Eastern Branches */}
              <path d="M 420,230 L 480,210" stroke="#06b6d4" strokeWidth="2.5" />
              <path d="M 420,230 L 490,250" stroke="#06b6d4" strokeWidth="2.5" />

              {/* Godavari Delta 3 Canals */}
              <path d="M 550,130 L 590,110" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 550,130 L 600,140" stroke="#10b981" strokeWidth="2.5" />
              <path d="M 550,130 L 585,160" stroke="#10b981" strokeWidth="2.5" />

              {/* Interactive Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const nodeColor =
                  node.type === 'Reservoir'
                    ? '#0284c7'
                    : node.type === 'Barrage'
                    ? '#10b981'
                    : node.type === 'Interlink'
                    ? '#6366f1'
                    : '#38bdf8';

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedNode(node)}
                  >
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isSelected ? 11 : 8}
                      fill={nodeColor}
                      stroke="#ffffff"
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-all"
                    />
                    {isSelected && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="16"
                        fill="none"
                        stroke={nodeColor}
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                    )}
                    <text
                      x={node.x}
                      y={node.y - 14}
                      textAnchor="middle"
                      className={`text-[11px] font-semibold transition-colors ${
                        isSelected ? 'fill-cyan-200' : 'fill-slate-300'
                      }`}
                    >
                      {node.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Selected Node Details Card */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider block">
                {selectedNode.basin} · {selectedNode.type}
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">{selectedNode.title}</h3>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
              selectedNode.status.includes('Alert')
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-300'
            }`}>
              {selectedNode.status}
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedNode.description}
          </p>

          <div className="space-y-2 pt-2">
            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Current Inflow</span>
              <span className="font-mono tabular-nums font-bold text-emerald-400">
                {selectedNode.inflow}
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Discharge / Release</span>
              <span className="font-mono tabular-nums font-bold text-slate-200">
                {selectedNode.outflow}
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-400">Storage / Capacity</span>
              <span className="font-mono tabular-nums font-bold text-cyan-300">
                {selectedNode.storage}
              </span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800">
            <span>Integrated with CWC KGBO hydro-telemetry network (Govt. of AP).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
