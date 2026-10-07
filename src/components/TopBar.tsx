import React from 'react';
import { MainNavModule } from './GlobalRail';
import { Sparkles, Plus, AlertOctagon, Terminal, RefreshCw } from 'lucide-react';

interface TopBarProps {
  activeModule: MainNavModule;
  onSelectModule: (module: MainNavModule) => void;
  onOpenDeclareModal: () => void;
  onTriggerChaosSimulation: () => void;
  isRagOpen: boolean;
  onToggleRag: () => void;
  activeWarRoomId?: string;
  isChaosSimulating?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeModule,
  onSelectModule,
  onOpenDeclareModal,
  onTriggerChaosSimulation,
  isRagOpen,
  onToggleRag,
  activeWarRoomId,
  isChaosSimulating,
}) => {
  return (
    <header className="h-12 border-b border-[#CBD5E1] bg-[#FFFFFF] px-4 flex items-center justify-between select-none z-20 shrink-0">
      {/* Zone 1: Brand & Operational Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-bold tracking-tight text-[#0B1C30] whitespace-nowrap">
          Executive Operations
        </span>
        <span className="text-[#CBD5E1]" aria-hidden="true">/</span>
        <span className="text-xs font-mono font-medium text-[#45474C] whitespace-nowrap truncate">
          {activeModule === 'incidents' && (activeWarRoomId ? `War Room · ${activeWarRoomId}` : 'War Room')}
          {activeModule === 'operations' && 'Live Service Mesh Topology'}
          {activeModule === 'knowledge' && 'Vector Knowledge Mesh'}
          {activeModule === 'analytics' && 'SLO & Error Budget Telemetry'}
          {activeModule === 'settings' && 'Enterprise Control Plane'}
        </span>
      </div>

      {/* Zone 2: Module View Switcher (Clean Segmented Tabs) */}
      <nav className="hidden lg:flex items-center gap-1 bg-[#F1F5F9] p-0.5 rounded border border-[#E2E8F0]">
        <button
          onClick={() => onSelectModule('incidents')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            activeModule === 'incidents'
              ? 'bg-[#FFFFFF] text-[#0B1C30] shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1C30]'
          }`}
        >
          Incidents & Triage
        </button>
        <button
          onClick={() => onSelectModule('operations')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            activeModule === 'operations'
              ? 'bg-[#FFFFFF] text-[#0B1C30] shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1C30]'
          }`}
        >
          Mesh Topology
        </button>
        <button
          onClick={() => onSelectModule('knowledge')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            activeModule === 'knowledge'
              ? 'bg-[#FFFFFF] text-[#0B1C30] shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1C30]'
          }`}
        >
          Runbooks & RFCs
        </button>
        <button
          onClick={() => onSelectModule('analytics')}
          className={`px-3 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
            activeModule === 'analytics'
              ? 'bg-[#FFFFFF] text-[#0B1C30] shadow-xs'
              : 'text-[#64748B] hover:text-[#0B1C30]'
          }`}
        >
          SLO Telemetry
        </button>
      </nav>

      {/* Zone 3: 1-2 Primary Action Triggers */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Chaos Injection Simulator */}
        <button
          onClick={onTriggerChaosSimulation}
          disabled={isChaosSimulating}
          title="Simulate Ingress Jitter & Buffer Spike"
          className="h-8 px-2.5 text-xs font-mono font-medium rounded border border-[#CBD5E1] bg-[#FFFFFF] hover:bg-[#F8FAFC] text-[#1E293B] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#4338CA] ${isChaosSimulating ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Simulate Chaos</span>
        </button>

        {/* Primary Declare Incident Action */}
        <button
          onClick={onOpenDeclareModal}
          className="h-8 px-3 text-xs font-medium rounded bg-[#1E293B] hover:bg-[#0F172A] text-[#FFFFFF] border border-[#0F172A] flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Declare Incident</span>
        </button>

        {/* RAG Dock Trigger */}
        <button
          onClick={onToggleRag}
          className={`h-8 px-2.5 text-xs font-medium rounded border flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            isRagOpen
              ? 'bg-[#0D9488] text-white border-[#0D9488]'
              : 'bg-[#F0FDFA] text-[#0F766E] border-[#99F6E4] hover:bg-[#CCFBF1]'
          }`}
          title="Toggle RAG Knowledge Assistant (Cmd+K)"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline font-mono text-[11px]">RAG Mesh</span>
          <kbd className="hidden xl:inline text-[10px] opacity-80 font-mono">⌘K</kbd>
        </button>
      </div>
    </header>
  );
};
