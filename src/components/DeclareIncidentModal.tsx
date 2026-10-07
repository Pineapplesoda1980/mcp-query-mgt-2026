import React, { useState } from 'react';
import { PriorityLevel, Incident } from '../types';
import { PRIORITY_CONFIG } from '../data/mockData';
import { PriorityBadge } from './PriorityBadge';
import { X, AlertOctagon, Check } from 'lucide-react';

interface DeclareIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeclareIncident: (newInc: Incident) => void;
}

export const DeclareIncidentModal: React.FC<DeclareIncidentModalProps> = ({
  isOpen,
  onClose,
  onDeclareIncident,
}) => {
  const [priority, setPriority] = useState<PriorityLevel>('P1');
  const [title, setTitle] = useState('');
  const [service, setService] = useState('payment-ledger');
  const [region, setRegion] = useState('us-east-prod');
  const [blastRadius, setBlastRadius] = useState('');
  const [description, setDescription] = useState('');
  const [commanderName, setCommanderName] = useState('Dr. Evelyn Vance');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newInc: Incident = {
      id: `INC-${Math.floor(8830 + Math.random() * 50)}`,
      title: title.trim(),
      priority,
      priorityLabel: PRIORITY_CONFIG[priority].label,
      status: 'Active',
      commander: {
        name: commanderName,
        role: 'Incident Commander',
      },
      services: [service],
      region,
      startedAt: 'Just now (0 min ago)',
      durationMin: 1,
      blastRadius: blastRadius.trim() || 'Regional Cluster Degradation',
      description: description.trim() || 'Immediate investigation opened by Incident Commander.',
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: 'Just now',
          author: commanderName,
          message: `Incident formally declared as ${priority}. War room opened.`,
          type: 'alert',
        },
      ],
      runbooks: priority === 'P0' ? ['RUN-104', 'RUN-088'] : ['RUN-104'],
      sloImpact: priority === 'P0' ? 'Critical SLA impact (-1.4%)' : 'Nominal monitoring',
    };

    onDeclareIncident(newInc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#FFFFFF] border border-[#CBD5E1] rounded shadow-xl overflow-hidden animate-fadeIn text-xs">
        {/* Modal Header */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-red-100 border border-red-300 flex items-center justify-center text-red-700">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B1C30]">
                Declare Operational Incident
              </h2>
              <p className="text-[11px] text-[#64748B]">
                Broadcasts notification to Slack #exec-war-room and pages on-call engineering leads.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F1F5F9] rounded cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Priority Matrix Selector */}
          <div>
            <label className="block text-[11px] font-mono uppercase font-semibold text-[#64748B] mb-1.5">
              Select Incident Severity (P0–P5)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['P0', 'P1', 'P2', 'P3', 'P4', 'P5'] as PriorityLevel[]).map((lvl) => {
                const cfg = PRIORITY_CONFIG[lvl];
                const isSelected = priority === lvl;

                return (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setPriority(lvl)}
                    className={`p-2 rounded border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-[#4338CA] shadow-xs'
                        : 'hover:bg-slate-50'
                    }`}
                    style={{
                      backgroundColor: isSelected ? cfg.bg : '#FFFFFF',
                      borderColor: isSelected ? cfg.border : '#E2E8F0',
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: cfg.dot }}
                      />
                      <span className="font-mono text-xs font-bold" style={{ color: cfg.text }}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B] mt-1 line-clamp-1">
                      {lvl === 'P0' ? 'Blocker / Catastrophic' : lvl === 'P1' ? 'Critical SLA' : lvl === 'P2' ? 'Major Degradation' : 'Standard Priority'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Incident Title */}
          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1">
              Incident Summary Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Stripe Webhook Timeout Cascading to Checkout Buffer"
              className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0B1C30] focus:border-[#4338CA] focus:outline-none focus:ring-1 focus:ring-[#4338CA]/20"
            />
          </div>

          {/* Service and Region */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                Primary Microservice
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0B1C30] focus:border-[#4338CA] focus:outline-none"
              >
                <option value="payment-ledger">payment-ledger (Tier-0)</option>
                <option value="kafka-cluster-east">kafka-cluster-east (Tier-0)</option>
                <option value="vector-mesh-qdrant">vector-mesh-qdrant (Tier-1)</option>
                <option value="auth-service-v3">auth-service-v3 (Tier-0)</option>
                <option value="checkout-v2">checkout-v2 (Tier-0)</option>
                <option value="ingress-mesh-envoy">ingress-mesh-envoy (Tier-0)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                Cluster Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0B1C30] focus:border-[#4338CA] focus:outline-none"
              >
                <option value="us-east-prod">us-east-prod</option>
                <option value="eu-west-core">eu-west-core</option>
                <option value="global-anycast">global-anycast</option>
                <option value="ap-northeast-prod">ap-northeast-prod</option>
              </select>
            </div>
          </div>

          {/* Blast radius */}
          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1">
              Estimated Customer Blast Radius
            </label>
            <input
              type="text"
              value={blastRadius}
              onChange={(e) => setBlastRadius(e.target.value)}
              placeholder="e.g. EU Region Checkout · 12,000 inflight transactions affected"
              className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0B1C30] focus:border-[#4338CA] focus:outline-none"
            />
          </div>

          {/* Technical Description */}
          <div>
            <label className="block text-[11px] font-mono text-[#64748B] mb-1">
              Initial Symptoms & Observability Data
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail error codes (503/504), Prometheus alert metrics, JVM heap trends..."
              className="w-full p-2.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0B1C30] focus:border-[#4338CA] focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#CBD5E1] text-[#45474C] hover:bg-slate-50 rounded font-medium text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded font-medium text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>Broadcast & Open War Room</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
