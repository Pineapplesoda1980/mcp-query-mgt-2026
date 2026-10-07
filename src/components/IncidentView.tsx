import React, { useState } from 'react';
import { Incident, PriorityLevel, IncidentStatus } from '../types';
import { PriorityBadge } from './PriorityBadge';
import {
  Clock,
  User,
  ShieldAlert,
  ArrowRight,
  Send,
  Play,
  CheckCircle,
  ExternalLink,
  Zap,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

interface IncidentViewProps {
  incidents: Incident[];
  selectedIncident: Incident;
  onSelectIncident: (inc: Incident) => void;
  onUpdateIncidentStatus: (id: string, status: IncidentStatus) => void;
  onAddTimelineEntry: (id: string, message: string, type: 'alert' | 'mitigation' | 'investigation' | 'communication') => void;
  onOpenRunbook: (runbookId: string) => void;
  onQueryRagForIncident: (incident: Incident) => void;
}

export const IncidentView: React.FC<IncidentViewProps> = ({
  incidents,
  selectedIncident,
  onSelectIncident,
  onUpdateIncidentStatus,
  onAddTimelineEntry,
  onOpenRunbook,
  onQueryRagForIncident,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'runbooks' | 'blast'>('timeline');
  const [newUpdateMessage, setNewUpdateMessage] = useState('');
  const [newUpdateType, setNewUpdateType] = useState<'mitigation' | 'investigation' | 'communication'>('mitigation');

  const handlePostUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUpdateMessage.trim()) return;
    onAddTimelineEntry(selectedIncident.id, newUpdateMessage.trim(), newUpdateType);
    setNewUpdateMessage('');
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Upper Half / Main List: High-Density Incident Matrix Table */}
      <div className="h-64 shrink-0 border-b border-[#CBD5E1] bg-[#FFFFFF] flex flex-col">
        {/* Table Control Header */}
        <div className="px-4 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#45474C]">
              Active Incident Matrix
            </h2>
            <span className="text-xs text-[#64748B]">·</span>
            <span className="text-xs text-[#64748B] tabular-nums font-mono">
              {incidents.length} Records Loaded
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#64748B]">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
              <span>1 Blocker (P0)</span>
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              <span>1 Critical (P1)</span>
            </span>
          </div>
        </div>

        {/* Dense Table Scroll Container */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-[#F8FAFC] border-b border-[#CBD5E1] z-10 text-[10px] font-mono font-semibold uppercase text-[#64748B] tracking-wider">
              <tr>
                <th className="py-2 px-3">ID</th>
                <th className="py-2 px-3">Severity</th>
                <th className="py-2 px-3">Incident Summary</th>
                <th className="py-2 px-3">Lifecycle</th>
                <th className="py-2 px-3">Commander</th>
                <th className="py-2 px-3">Region</th>
                <th className="py-2 px-3">Duration</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9] text-xs">
              {incidents.map((inc) => {
                const isSelected = inc.id === selectedIncident.id;
                return (
                  <tr
                    key={inc.id}
                    onClick={() => onSelectIncident(inc)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#EEF2FF] border-l-2 border-[#4338CA]'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-2 px-3 font-mono font-semibold text-[#0B1C30]">
                      {inc.id}
                    </td>
                    <td className="py-2 px-3">
                      <PriorityBadge priority={inc.priority} />
                    </td>
                    <td className="py-2 px-3">
                      <div className="font-medium text-[#1E293B] max-w-md truncate">
                        {inc.title}
                      </div>
                      <div className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                        {inc.services.map((svc, i) => (
                          <span key={svc}>
                            {svc}
                            {i < inc.services.length - 1 ? ' · ' : ''}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${
                          inc.status === 'Active'
                            ? 'bg-[#FEF2F2] text-[#991B1B] border border-[#FCA5A5]'
                            : inc.status === 'Mitigated'
                            ? 'bg-[#FEFCE8] text-[#854D0E] border border-[#FDE047]'
                            : 'bg-[#F0FDF4] text-[#166534] border border-[#BBF7D0]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inc.status === 'Active'
                              ? 'bg-red-600 animate-pulse'
                              : inc.status === 'Mitigated'
                              ? 'bg-yellow-600'
                              : 'bg-emerald-600'
                          }`}
                        />
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-[#45474C] font-mono text-[11px]">
                      {inc.commander.name}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-[#64748B]">
                      {inc.region}
                    </td>
                    <td className="py-2 px-3 font-mono text-[11px] text-[#64748B] tabular-nums">
                      {inc.durationMin}m
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIncident(inc);
                        }}
                        className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#4338CA] text-white'
                            : 'text-[#4338CA] hover:bg-[#EEF2FF]'
                        }`}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower Half: Active War Room Stage for Selected Incident */}
      <div className="flex-1 flex flex-col min-h-0 bg-[#FFFFFF]">
        {/* War Room Banner Header */}
        <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#4338CA]">
                  {selectedIncident.id}
                </span>
                <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                <PriorityBadge priority={selectedIncident.priority} />
                <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                <span className="font-mono text-xs text-[#64748B]">
                  Region: {selectedIncident.region}
                </span>
                <span className="text-[#CBD5E1]" aria-hidden="true">·</span>
                <span className="text-xs text-[#64748B] tabular-nums font-mono">
                  Started: {selectedIncident.startedAt}
                </span>
              </div>
              <h1 className="text-base font-bold text-[#0B1C30] tracking-tight">
                {selectedIncident.title}
              </h1>
              <p className="text-xs text-[#45474C] mt-1 max-w-3xl leading-relaxed">
                {selectedIncident.description}
              </p>
            </div>

            {/* War Room Lifecycle Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onQueryRagForIncident(selectedIncident)}
                className="h-8 px-2.5 rounded bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Synthesize mitigation guidance via RAG"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>RAG Triage Advice</span>
              </button>

              {/* Status Switcher */}
              <div className="inline-flex rounded border border-[#CBD5E1] bg-[#FFFFFF] p-0.5">
                {(['Active', 'Mitigated', 'Resolved'] as IncidentStatus[]).map((st) => (
                  <button
                    key={st}
                    onClick={() => onUpdateIncidentStatus(selectedIncident.id, st)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      selectedIncident.status === st
                        ? 'bg-[#1E293B] text-white shadow-xs'
                        : 'text-[#64748B] hover:text-[#0B1C30]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Key Metrics Strip (Blast Radius & SLO Impact) */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            <div className="p-2 rounded bg-[#FFFFFF] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase">Blast Radius</span>
              <div className="font-mono text-[#1E293B] text-[11px] font-medium mt-0.5 truncate">
                {selectedIncident.blastRadius}
              </div>
            </div>
            <div className="p-2 rounded bg-[#FFFFFF] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase">SLO Error Impact</span>
              <div className="font-mono text-[#991B1B] text-[11px] font-medium mt-0.5 truncate">
                {selectedIncident.sloImpact}
              </div>
            </div>
            <div className="p-2 rounded bg-[#FFFFFF] border border-[#E2E8F0]">
              <span className="text-[10px] font-mono text-[#64748B] uppercase">Incident Commander</span>
              <div className="font-mono text-[#1E293B] text-[11px] font-medium mt-0.5 flex items-center justify-between">
                <span>{selectedIncident.commander.name}</span>
                <span className="text-[10px] text-[#64748B]">{selectedIncident.commander.role}</span>
              </div>
            </div>
          </div>

          {/* War Room Navigation Tabs */}
          <div className="mt-3 flex items-center gap-4 border-b border-[#E2E8F0] pt-1">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`pb-1.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'timeline'
                  ? 'border-[#4338CA] text-[#4338CA]'
                  : 'border-transparent text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              Mitigation Timeline ({selectedIncident.timeline.length})
            </button>
            <button
              onClick={() => setActiveTab('runbooks')}
              className={`pb-1.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'runbooks'
                  ? 'border-[#4338CA] text-[#4338CA]'
                  : 'border-transparent text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              Linked Runbooks ({selectedIncident.runbooks.length})
            </button>
            <button
              onClick={() => setActiveTab('blast')}
              className={`pb-1.5 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'blast'
                  ? 'border-[#4338CA] text-[#4338CA]'
                  : 'border-transparent text-[#64748B] hover:text-[#0B1C30]'
              }`}
            >
              Affected Services ({selectedIncident.services.length})
            </button>
          </div>
        </div>

        {/* Tab Content Stage */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#FFFFFF]">
          {/* TIMELINE TAB */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 max-w-4xl">
              {/* Chronological Timeline */}
              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E2E8F0]">
                {selectedIncident.timeline.map((entry) => {
                  return (
                    <div key={entry.id} className="relative pl-8">
                      {/* Node Dot */}
                      <span
                        className={`absolute left-2 top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-white ${
                          entry.type === 'alert'
                            ? 'bg-red-500'
                            : entry.type === 'mitigation'
                            ? 'bg-emerald-600'
                            : entry.type === 'communication'
                            ? 'bg-blue-600'
                            : 'bg-purple-600'
                        }`}
                      />

                      <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded hover:border-[#CBD5E1] transition-colors">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#1E293B]">
                              {entry.author}
                            </span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border bg-[#FFFFFF] text-[#64748B]">
                              {entry.type}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] text-[#64748B]">
                            {entry.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#0B1C30] leading-relaxed">
                          {entry.message}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Commander Note / Mitigation Form */}
              <form
                onSubmit={handlePostUpdate}
                className="mt-4 p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-semibold text-[#1E293B]">
                    Post Commander Update
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(['mitigation', 'investigation', 'communication'] as const).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => setNewUpdateType(t)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                          newUpdateType === t
                            ? 'bg-[#1E293B] text-white'
                            : 'bg-white text-[#64748B] border border-[#CBD5E1]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newUpdateMessage}
                    onChange={(e) => setNewUpdateMessage(e.target.value)}
                    placeholder="Enter mitigation update, runbook outcome, or executive brief note..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#1E293B] focus:border-[#4338CA] focus:outline-none focus:ring-1 focus:ring-[#4338CA]/20"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-medium rounded flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* RUNBOOKS TAB */}
          {activeTab === 'runbooks' && (
            <div className="space-y-3 max-w-4xl">
              <p className="text-xs text-[#45474C] mb-2">
                The following runbooks are automatically bound to this incident category based on vector topology scoring.
              </p>

              {selectedIncident.runbooks.map((rbId) => (
                <div
                  key={rbId}
                  className="p-3.5 border border-[#E2E8F0] rounded hover:border-[#CBD5E1] bg-[#F8FAFC] flex items-center justify-between transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#4338CA]">
                        {rbId}
                      </span>
                      <span className="text-xs font-semibold text-[#0B1C30]">
                        {rbId === 'RUN-104'
                          ? 'Kafka Consumer Lag Shedding & Partition Rebalance Isolation'
                          : rbId === 'RUN-088'
                          ? 'Payment Ledger PostgreSQL Cross-Region Read Replica Promotion'
                          : 'Emergency Recovery Protocol'}
                      </span>
                    </div>
                    <div className="text-xs text-[#64748B]">
                      Est. Execution: 4–8 min · Verified in Production · Automated Probes Enabled
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenRunbook(rbId)}
                    className="px-3 py-1.5 bg-[#4338CA] hover:bg-[#3730A3] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Open & Execute</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* BLAST RADIUS TAB */}
          {activeTab === 'blast' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-4xl">
              {selectedIncident.services.map((svc) => (
                <div key={svc} className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-semibold text-[#0B1C30]">
                      {svc}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="text-[11px] text-[#64748B] space-y-1 font-mono">
                    <div>Status: Latency Elevated</div>
                    <div>Region: {selectedIncident.region}</div>
                    <div>Traffic Isolation: Inflight</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
