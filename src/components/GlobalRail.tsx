import React from 'react';
import {
  AlertTriangle,
  Cpu,
  Layers,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type MainNavModule = 'operations' | 'incidents' | 'knowledge' | 'analytics' | 'settings';

interface GlobalRailProps {
  activeModule: MainNavModule;
  onSelectModule: (module: MainNavModule) => void;
  activeIncidentCount: number;
  isRagOpen: boolean;
  onToggleRag: () => void;
  isDrawerCollapsed: boolean;
  onToggleDrawer: () => void;
}

export const GlobalRail: React.FC<GlobalRailProps> = ({
  activeModule,
  onSelectModule,
  activeIncidentCount,
  isRagOpen,
  onToggleRag,
  isDrawerCollapsed,
  onToggleDrawer,
}) => {
  const navItems: Array<{
    id: MainNavModule;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }> = [
    {
      id: 'incidents',
      label: 'Incident War Room',
      icon: <AlertTriangle className="w-5 h-5" />,
      badge: activeIncidentCount,
    },
    {
      id: 'operations',
      label: 'Operations & Topology',
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      id: 'knowledge',
      label: 'Knowledge Mesh & RAG',
      icon: <Layers className="w-5 h-5" />,
    },
    {
      id: 'analytics',
      label: 'SLO & Telemetry',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      id: 'settings',
      label: 'Mesh Configuration',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className="w-16 shrink-0 bg-[#091426] text-white flex flex-col items-center py-3 select-none z-30 border-r border-[#1E293B]"
      aria-label="Global Navigation"
    >
      {/* Brand Icon Mark */}
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] flex items-center justify-center text-white font-bold text-sm shadow-sm mb-4 cursor-pointer"
        title="Executive Operations & Knowledge Mesh"
        onClick={() => onSelectModule('incidents')}
      >
        <div className="relative flex items-center justify-center">
          <span className="font-mono text-xs tracking-tighter text-[#E2E8F0]">EX</span>
          <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-[#0D9488] ring-2 ring-[#091426]" />
        </div>
      </div>

      {/* Nav Icon List */}
      <nav className="flex-1 flex flex-col gap-1.5 w-full px-2">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              title={item.label}
              className={`relative w-full h-11 rounded flex items-center justify-center transition-all group ${
                isActive
                  ? 'bg-[#1E293B] text-white shadow-xs border border-[#334155]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1E293B]/50'
              }`}
            >
              {item.icon}

              {/* Active Bar indicator */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-0.5 bg-[#4338CA] rounded-r" />
              )}

              {/* Badge for critical items */}
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-[#DC2626] text-white text-[10px] font-mono font-bold flex items-center justify-center leading-none">
                  {item.badge}
                </span>
              )}

              {/* Tooltip on hover */}
              <span className="fixed left-16 ml-2 px-2.5 py-1 rounded bg-[#0F172A] text-xs text-white whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-md border border-[#334155]">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Action Controls */}
      <div className="flex flex-col items-center gap-2 w-full px-2 pt-2 border-t border-[#1E293B]">
        {/* Toggle Context Drawer */}
        <button
          onClick={onToggleDrawer}
          title={isDrawerCollapsed ? 'Expand Navigation Drawer' : 'Collapse Drawer'}
          className="w-full h-9 rounded flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors"
        >
          {isDrawerCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>

        {/* Toggle RAG Assistant */}
        <button
          onClick={onToggleRag}
          title={isRagOpen ? 'Close RAG Assistant (Cmd+K)' : 'Open RAG Assistant (Cmd+K)'}
          className={`w-full h-10 rounded flex items-center justify-center transition-all relative ${
            isRagOpen
              ? 'bg-[#0D9488]/20 text-[#2DD4BF] border border-[#0D9488]/40'
              : 'text-[#94A3B8] hover:text-[#2DD4BF] hover:bg-[#1E293B]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#0D9488] ring-1 ring-[#091426]" />
        </button>

        {/* System Heartbeat & Node Status */}
        <div
          title="Cluster Mesh: 100% Nominal (14 Nodes)"
          className="w-full flex items-center justify-center py-1 cursor-default"
        >
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* User / Commander Profile */}
        <div
          title="Executive Commander: Dr. Evelyn Vance (SRE Core)"
          className="w-8 h-8 rounded bg-[#1E293B] border border-[#334155] flex items-center justify-center text-xs font-mono font-medium text-[#E2E8F0] cursor-pointer hover:border-[#4338CA] transition-colors"
        >
          EV
        </div>
      </div>
    </aside>
  );
};
