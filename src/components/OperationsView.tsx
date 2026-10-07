import React, { useState } from 'react';
import { ServiceNode } from '../types';
import {
  Activity,
  Server,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Shield,
  Layers,
  HardDrive,
  Cpu,
} from 'lucide-react';

interface OperationsViewProps {
  services: ServiceNode[];
  onScaleService: (serviceId: string, delta: number) => void;
  onProbeService: (serviceId: string) => void;
  onOpenRagQuery: (query: string) => void;
}

export const OperationsView: React.FC<OperationsViewProps> = ({
  services,
  onScaleService,
  onProbeService,
  onOpenRagQuery,
}) => {
  const [selectedService, setSelectedService] = useState<ServiceNode>(services[0]);
  const [probeResult, setProbeResult] = useState<string | null>(null);

  const handleRunProbe = (service: ServiceNode) => {
    onProbeService(service.id);
    setProbeResult(`Synthetic health probe dispatched to ${service.name} (${service.region}). All 12 ingress endpoints responded within 28ms.`);
    setTimeout(() => {
      setProbeResult(null);
    }, 6000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto">
      {/* Top Telemetry Summary Header */}
      <div className="p-4 bg-[#FFFFFF] border-b border-[#CBD5E1]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-[#0B1C30] tracking-tight">
              Enterprise Service Mesh & Live Topology
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Multi-region distributed microservice fleet with active Envoy ingress telemetry and quorum monitoring.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <span className="text-[#64748B]">Global Mesh RPS: </span>
              <span className="font-bold text-[#0B1C30]">320.1k rps</span>
            </div>
            <div className="px-3 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded">
              <span className="text-[#64748B]">Mesh P99: </span>
              <span className="font-bold text-[#4338CA]">14.8 ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Split Grid */}
      <div className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Left 2 Cols: High-Density Service Matrix */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">
            <span>Registered Service Nodes ({services.length})</span>
            <span>Real-time Telemetry (1s interval)</span>
          </div>

          {probeResult && (
            <div className="p-3 bg-[#F0FDF4] border border-[#86EFAC] rounded text-xs text-[#166534] flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{probeResult}</span>
              </div>
              <button
                onClick={() => setProbeResult(null)}
                className="text-xs font-mono underline hover:text-emerald-800"
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="space-y-2">
            {services.map((svc) => {
              const isSelected = selectedService.id === svc.id;
              const isUnhealthy = svc.status === 'critical' || svc.status === 'degraded';

              return (
                <div
                  key={svc.id}
                  onClick={() => setSelectedService(svc)}
                  className={`p-3.5 rounded border transition-all cursor-pointer bg-[#FFFFFF] ${
                    isSelected
                      ? 'border-[#4338CA] ring-1 ring-[#4338CA]/20 shadow-xs'
                      : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          svc.status === 'nominal'
                            ? 'bg-emerald-500'
                            : svc.status === 'degraded'
                            ? 'bg-amber-500 animate-pulse'
                            : 'bg-red-500 animate-pulse'
                        }`}
                      />

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#0B1C30]">
                            {svc.name}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border bg-[#F8FAFC] text-[#64748B]">
                            {svc.tier}
                          </span>
                        </div>
                        <div className="text-xs text-[#64748B] flex items-center gap-2 mt-0.5">
                          <span>{svc.ownerTeam}</span>
                          <span>·</span>
                          <span className="font-mono text-[11px]">{svc.region}</span>
                        </div>
                      </div>
                    </div>

                    {/* Numeric Telemetry Indicators (JetBrains Mono tabular figures) */}
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-[#64748B] block">P99 Latency</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            svc.p99LatencyMs > 100
                              ? 'text-red-600'
                              : svc.p99LatencyMs > 50
                              ? 'text-amber-600'
                              : 'text-emerald-700'
                          }`}
                        >
                          {svc.p99LatencyMs}ms
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#64748B] block">Error Rate</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            svc.errorRate > 0.5
                              ? 'text-red-600'
                              : svc.errorRate > 0.05
                              ? 'text-amber-600'
                              : 'text-slate-700'
                          }`}
                        >
                          {svc.errorRate}%
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#64748B] block">Replicas</span>
                        <span className="text-[#0B1C30] font-semibold tabular-nums">
                          {svc.replicas.active}/{svc.replicas.desired}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] text-[#64748B] block">Load</span>
                        <span className="text-[#0B1C30] font-semibold tabular-nums">
                          {(svc.throughputRps / 1000).toFixed(1)}k rps
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep Inspection & Control Card for Selected Node */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-semibold text-[#64748B] uppercase tracking-wider">
            Node Control Plane
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded space-y-4 shadow-xs">
            {/* Header info */}
            <div className="border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs font-bold text-[#4338CA]">
                  {selectedService.name}
                </span>
                <span
                  className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded ${
                    selectedService.status === 'nominal'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {selectedService.status.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-[#64748B] font-mono">
                Region: {selectedService.region} · Tier: {selectedService.tier}
              </div>
            </div>

            {/* Scale Replicas Controls */}
            <div>
              <span className="text-xs font-mono font-semibold text-[#1E293B] block mb-2">
                Worker Pool Scaling
              </span>
              <div className="flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded text-xs font-mono">
                <div>
                  <span className="text-[#64748B]">Active Pods: </span>
                  <span className="font-bold text-[#0B1C30]">
                    {selectedService.replicas.active}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onScaleService(selectedService.id, -2)}
                    disabled={selectedService.replicas.active <= 2}
                    className="w-7 h-7 rounded border border-[#CBD5E1] bg-white text-xs font-bold hover:bg-slate-50 flex items-center justify-center cursor-pointer disabled:opacity-40"
                    title="Scale Down (-2 Replicas)"
                  >
                    -2
                  </button>
                  <button
                    onClick={() => onScaleService(selectedService.id, 2)}
                    className="w-7 h-7 rounded border border-[#CBD5E1] bg-white text-xs font-bold hover:bg-slate-50 flex items-center justify-center cursor-pointer"
                    title="Scale Up (+2 Replicas)"
                  >
                    +2
                  </button>
                  <button
                    onClick={() => onScaleService(selectedService.id, 8)}
                    className="px-2 h-7 rounded border border-[#CBD5E1] bg-[#1E293B] text-white text-[11px] font-bold hover:bg-[#0F172A] flex items-center justify-center cursor-pointer"
                    title="Burst Scale (+8 Replicas)"
                  >
                    +8 Burst
                  </button>
                </div>
              </div>
            </div>

            {/* Upstream / Downstream Mesh Dependencies */}
            <div>
              <span className="text-xs font-mono font-semibold text-[#1E293B] block mb-2">
                Mesh Dependencies
              </span>
              <div className="space-y-1.5">
                {selectedService.dependencies.map((dep) => (
                  <div
                    key={dep}
                    className="px-2.5 py-1.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-[#0B1C30]">{dep}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Healthy</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Operational Actions */}
            <div className="pt-2 border-t border-[#E2E8F0] space-y-2">
              <button
                onClick={() => handleRunProbe(selectedService)}
                className="w-full h-8 rounded bg-[#1E293B] hover:bg-[#0F172A] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Run Synthetic Diagnostic Probe</span>
              </button>

              <button
                onClick={() => onOpenRagQuery(`What are the recovery steps and dependencies for ${selectedService.name}?`)}
                className="w-full h-8 rounded bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ask RAG for {selectedService.name} SOP</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
