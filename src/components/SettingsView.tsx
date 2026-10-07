import React, { useState } from 'react';
import {
  Sliders,
  Shield,
  Key,
  Radio,
  Bell,
  CheckCircle2,
  Database,
  Lock,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto p-4 space-y-4">
      <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded shadow-xs">
        <h1 className="text-base font-bold text-[#0B1C30] tracking-tight">
          Executive Operations & Knowledge Mesh Control Plane
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure real-time vector embeddings, telemetry ingestion quorums, and enterprise RBAC policies.
        </p>
      </div>

      {savedNotification && (
        <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded text-xs text-[#166534] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Control plane configurations persisted across all mesh nodes.</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vector Engine Config */}
        <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
            <Database className="w-4 h-4 text-[#0D9488]" />
            <h3 className="text-xs font-mono font-semibold uppercase text-[#1E293B]">
              Vector Indexing & Embedding Engine
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                Vector Cluster Endpoint
              </label>
              <input
                type="text"
                readOnly
                value="https://qdrant-mesh.internal.enterprise:6333"
                className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded font-mono text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                Embedding Model Topology
              </label>
              <input
                type="text"
                readOnly
                value="text-embedding-3-large (1536 Dimensions · Cosine Metric)"
                className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded font-mono text-xs text-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#64748B] mb-1">
                Live Re-indexing Schedule
              </label>
              <input
                type="text"
                readOnly
                value="Continuous Write-Ahead Log Compaction (Every 30s)"
                className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded font-mono text-xs text-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Escalation Webhooks */}
        <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded space-y-3">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-2">
            <Bell className="w-4 h-4 text-[#4338CA]" />
            <h3 className="text-xs font-mono font-semibold uppercase text-[#1E293B]">
              Incident Escalation & Webhook Integrations
            </h3>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0B1C30]">Slack #exec-war-room</div>
                <div className="text-[11px] text-[#64748B]">Automated P0 & P1 alert broadcasting</div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0B1C30]">PagerDuty Live Call Bridge</div>
                <div className="text-[11px] text-[#64748B]">Tier-0 Incident Commander auto-page</div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Active
              </span>
            </div>

            <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-between">
              <div>
                <div className="font-semibold text-[#0B1C30]">Enterprise Status Page</div>
                <div className="text-[11px] text-[#64748B]">External customer notification gateway</div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Synced
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-medium rounded transition-colors cursor-pointer"
        >
          Save & Broadcast Mesh Configuration
        </button>
      </div>
    </div>
  );
};
