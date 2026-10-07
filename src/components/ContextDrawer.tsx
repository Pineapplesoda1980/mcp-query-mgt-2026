import React from 'react';
import { MainNavModule } from './GlobalRail';
import { PriorityLevel, IncidentStatus } from '../types';
import { PRIORITY_CONFIG } from '../data/mockData';
import {
  Filter,
  Search,
  ShieldAlert,
  Server,
  BookOpen,
  Sliders,
  TrendingDown,
  Compass,
  CheckCircle2,
  Clock,
  Radio,
} from 'lucide-react';

interface ContextDrawerProps {
  activeModule: MainNavModule;
  isCollapsed: boolean;
  priorityFilter: PriorityLevel | 'ALL';
  onSelectPriorityFilter: (p: PriorityLevel | 'ALL') => void;
  statusFilter: IncidentStatus | 'ALL';
  onSelectStatusFilter: (s: IncidentStatus | 'ALL') => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tierFilter: string;
  onSelectTierFilter: (tier: string) => void;
  selectedDocCategory: string;
  onSelectDocCategory: (cat: string) => void;
  selectedRegion: string;
  onSelectRegion: (reg: string) => void;
}

export const ContextDrawer: React.FC<ContextDrawerProps> = ({
  activeModule,
  isCollapsed,
  priorityFilter,
  onSelectPriorityFilter,
  statusFilter,
  onSelectStatusFilter,
  searchQuery,
  onSearchChange,
  tierFilter,
  onSelectTierFilter,
  selectedDocCategory,
  onSelectDocCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  if (isCollapsed) return null;

  return (
    <aside className="w-[260px] shrink-0 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col h-full text-xs overflow-y-auto select-none">
      {/* Drawer Header */}
      <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-[11px] font-semibold text-[#45474C] uppercase tracking-wider">
            {activeModule === 'incidents' && 'Incident Navigator'}
            {activeModule === 'operations' && 'Mesh Topology'}
            {activeModule === 'knowledge' && 'Knowledge Directory'}
            {activeModule === 'analytics' && 'Telemetry Scopes'}
            {activeModule === 'settings' && 'Control Plane'}
          </span>
          <span className="w-2 h-2 rounded-full bg-[#0D9488]" title="Live Feed Connected" />
        </div>

        {/* Universal Sub-Nav Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={
              activeModule === 'incidents'
                ? 'Filter incidents...'
                : activeModule === 'operations'
                ? 'Filter services...'
                : activeModule === 'knowledge'
                ? 'Search vectors & docs...'
                : 'Filter scopes...'
            }
            className="w-full pl-8 pr-2 py-1.5 bg-[#FFFFFF] border border-[#CBD5E1] rounded text-xs text-[#1E293B] placeholder-[#94A3B8] focus:border-[#4338CA] focus:outline-none focus:ring-1 focus:ring-[#4338CA]/20 transition-all"
          />
        </div>
      </div>

      {/* Module Specific Filters */}
      <div className="flex-1 p-3 space-y-4">
        {/* INCIDENTS DRAWER */}
        {activeModule === 'incidents' && (
          <>
            {/* Priority Matrix Slices */}
            <div>
              <div className="flex items-center justify-between mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                <span>Severity Matrix</span>
                <span>P0–P5</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => onSelectPriorityFilter('ALL')}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors text-left ${
                    priorityFilter === 'ALL'
                      ? 'bg-[#EEF2FF] text-[#4338CA] font-medium'
                      : 'text-[#45474C] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5" />
                    <span>All Severities</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#64748B]">6</span>
                </button>

                {(['P0', 'P1', 'P2', 'P3', 'P4', 'P5'] as PriorityLevel[]).map((p) => {
                  const cfg = PRIORITY_CONFIG[p];
                  const isSelected = priorityFilter === p;
                  return (
                    <button
                      key={p}
                      onClick={() => onSelectPriorityFilter(p)}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
                        isSelected
                          ? 'bg-[#EEF2FF] text-[#4338CA] font-medium'
                          : 'text-[#45474C] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: cfg.dot }}
                        />
                        <span className="font-mono text-[11px]">{cfg.label}</span>
                      </div>
                      <span className="text-[10px] text-[#64748B]">
                        {p === 'P0' ? '1' : p === 'P1' ? '1' : p === 'P2' ? '1' : p === 'P3' ? '1' : p === 'P4' ? '1' : '1'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lifecycle Status */}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Lifecycle State
              </div>
              <div className="space-y-1">
                {(['ALL', 'Active', 'Mitigated', 'Resolved'] as const).map((st) => {
                  const isSelected = statusFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => onSelectStatusFilter(st)}
                      className={`w-full flex items-center justify-between px-2 py-1 rounded transition-colors text-left ${
                        isSelected
                          ? 'bg-[#EEF2FF] text-[#4338CA] font-medium'
                          : 'text-[#45474C] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {st === 'Active' && <Radio className="w-3.5 h-3.5 text-red-600 animate-pulse" />}
                        {st === 'Mitigated' && <Clock className="w-3.5 h-3.5 text-amber-600" />}
                        {st === 'Resolved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {st === 'ALL' && <Filter className="w-3.5 h-3.5 text-slate-500" />}
                        <span>{st === 'ALL' ? 'All Lifecycle' : st}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Region Cluster */}
            <div className="pt-2 border-t border-[#E2E8F0]">
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Cluster Regions
              </div>
              <div className="space-y-1">
                {['ALL', 'us-east-prod', 'eu-west-core', 'global-anycast', 'ap-northeast-prod'].map((reg) => (
                  <button
                    key={reg}
                    onClick={() => onSelectRegion(reg)}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded text-left font-mono text-[11px] ${
                      selectedRegion === reg
                        ? 'bg-[#EEF2FF] text-[#4338CA] font-semibold'
                        : 'text-[#45474C] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span>{reg === 'ALL' ? 'All Regions' : reg}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* OPERATIONS DRAWER */}
        {activeModule === 'operations' && (
          <>
            <div>
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Service Tiers
              </div>
              <div className="space-y-1">
                {['ALL', 'Tier-0', 'Tier-1', 'Tier-2'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => onSelectTierFilter(tier)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors text-left ${
                      tierFilter === tier
                        ? 'bg-[#EEF2FF] text-[#4338CA] font-medium'
                        : 'text-[#45474C] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <span>{tier === 'ALL' ? 'All Tiers' : `${tier} Services`}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Mesh Health Status
              </div>
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Degraded Nodes</span>
                  <span className="font-mono text-red-600 font-bold">2 nodes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Active Replicas</span>
                  <span className="font-mono text-[#0B1C30]">304 / 322</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Global RPS</span>
                  <span className="font-mono text-[#0B1C30]">320.1k rps</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* KNOWLEDGE MESH DRAWER */}
        {activeModule === 'knowledge' && (
          <>
            <div>
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Document Types
              </div>
              <div className="space-y-1">
                {['ALL', 'Runbook', 'Architecture RFC', 'DR Protocol', 'Post-Mortem'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => onSelectDocCategory(cat)}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition-colors text-left ${
                      selectedDocCategory === cat
                        ? 'bg-[#EEF2FF] text-[#4338CA] font-medium'
                        : 'text-[#45474C] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{cat === 'ALL' ? 'All Knowledge' : cat}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E8F0]">
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Vector Index Telemetry
              </div>
              <div className="p-2.5 bg-[#F0FDFA] border border-[#99F6E4] rounded space-y-1.5 text-[#0F766E]">
                <div className="flex items-center justify-between">
                  <span>Indexed Vectors</span>
                  <span className="font-mono font-bold">14,820</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dimension Size</span>
                  <span className="font-mono font-bold">1536 (Ada-002)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Retrieval P95</span>
                  <span className="font-mono font-bold">0.89 ms</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ANALYTICS DRAWER */}
        {activeModule === 'analytics' && (
          <div className="space-y-3">
            <div>
              <div className="mb-2 text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
                Telemetry Scopes
              </div>
              <div className="space-y-1">
                {['SLO Error Budgets', 'P99 Latency Drift', 'MTTR / MTBF Recovery', 'Traffic Blast Radius'].map(
                  (item, idx) => (
                    <div
                      key={item}
                      className={`px-2 py-1.5 rounded cursor-pointer ${
                        idx === 0 ? 'bg-[#EEF2FF] text-[#4338CA] font-medium' : 'text-[#45474C] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {item}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS DRAWER */}
        {activeModule === 'settings' && (
          <div className="space-y-3">
            <div className="text-[#64748B] font-mono text-[10px] uppercase tracking-wider font-semibold">
              Control Planes
            </div>
            <div className="space-y-1">
              {['Vector Ingestion Rules', 'RBAC & Command Quorum', 'Webhook Escalation Paths', 'Audit Vault Keys'].map(
                (item, idx) => (
                  <div
                    key={item}
                    className={`px-2 py-1.5 rounded cursor-pointer ${
                      idx === 0 ? 'bg-[#EEF2FF] text-[#4338CA] font-medium' : 'text-[#45474C] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* Drawer Footer Stamp */}
      <div className="p-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[11px] text-[#64748B]">
        <span className="font-mono">US-EAST-1D</span>
        <span className="font-mono text-emerald-700 font-medium">99.991% SLO</span>
      </div>
    </aside>
  );
};
