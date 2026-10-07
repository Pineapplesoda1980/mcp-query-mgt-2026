import React from 'react';
import { SloMetric } from '../types';
import {
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  Activity,
  Clock,
  ShieldCheck,
  BarChart2,
} from 'lucide-react';

interface AnalyticsViewProps {
  sloMetrics: SloMetric[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ sloMetrics }) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-y-auto p-4 space-y-4">
      {/* Analytics Overview Header */}
      <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-[#0B1C30] tracking-tight">
              SLO Error Budget & MTTR Telemetry Engine
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Multi-window rolling 30-day error budget depletion rate with automated circuit-breaker thresholds.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="px-2.5 py-1 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] font-bold rounded">
              1 SLO Exhausted (payment-ledger)
            </span>
            <span className="px-2.5 py-1 bg-[#F0FDF4] border border-[#86EFAC] text-[#166534] font-bold rounded">
              4 SLOs Nominal
            </span>
          </div>
        </div>
      </div>

      {/* Grid: SLO Burn Cards */}
      <div className="space-y-3">
        <div className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider">
          Critical Tier-0 Service Level Objectives (SLOs)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {sloMetrics.map((slo) => {
            const isExhausted = slo.budgetRemainingPercent <= 0;
            const isBurning = slo.trend === 'burning';

            return (
              <div
                key={slo.service}
                className={`p-3.5 bg-[#FFFFFF] border rounded transition-all shadow-xs ${
                  isExhausted
                    ? 'border-red-300 ring-1 ring-red-200'
                    : isBurning
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : 'border-[#E2E8F0]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-[#0B1C30]">
                    {slo.service}
                  </span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isExhausted
                        ? 'bg-red-100 text-red-800'
                        : isBurning
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {slo.trend}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mb-1.5 font-mono">
                  <span className="text-xs text-[#64748B]">Current Availability:</span>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      slo.current < slo.target ? 'text-red-600' : 'text-emerald-700'
                    }`}
                  >
                    {slo.current}%
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-[#64748B] mb-2">
                  <span>Target: {slo.target}%</span>
                  <span>Burn Rate: {slo.burnRateMultiplier}x</span>
                </div>

                {/* Remaining Budget Bar */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-[#64748B]">Error Budget Remaining</span>
                    <span className="font-bold text-[#1E293B] tabular-nums">
                      {slo.budgetRemainingPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden border border-[#E2E8F0]">
                    <div
                      className={`h-full transition-all ${
                        isExhausted
                          ? 'bg-red-500'
                          : isBurning
                          ? 'bg-amber-500'
                          : 'bg-[#4338CA]'
                      }`}
                      style={{ width: `${Math.max(slo.budgetRemainingPercent, 4)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MTTR & Historical Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MTTR Benchmarks by Priority */}
        <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B]">
              Mean Time to Resolution (MTTR) by Severity
            </h3>
            <span className="text-xs font-mono text-[#4338CA]">Rolling 90 Days</span>
          </div>

          <div className="space-y-2.5">
            {[
              { pri: 'P0 Catastrophic', mttr: '18 min', target: '< 20 min', color: 'bg-red-500' },
              { pri: 'P1 Critical', mttr: '34 min', target: '< 45 min', color: 'bg-orange-500' },
              { pri: 'P2 Major', mttr: '1.4 hr', target: '< 2 hr', color: 'bg-amber-500' },
              { pri: 'P3 Moderate', mttr: '4.8 hr', target: '< 8 hr', color: 'bg-blue-500' },
              { pri: 'P4 Low', mttr: '24 hr', target: '< 48 hr', color: 'bg-slate-500' },
            ].map((row) => (
              <div key={row.pri} className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${row.color}`} />
                  <span className="text-[#0B1C30] font-medium">{row.pri}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#64748B]">Target: {row.target}</span>
                  <span className="font-bold text-[#1E293B] tabular-nums">{row.mttr}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Incident Velocity Matrix */}
        <div className="p-4 bg-[#FFFFFF] border border-[#CBD5E1] rounded space-y-3">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
            <h3 className="text-xs font-mono font-semibold uppercase text-[#64748B]">
              Incident Frequency & MTBF (Mean Time Between Failures)
            </h3>
            <span className="text-xs font-mono text-emerald-700 font-bold">+18.4% Reliability</span>
          </div>

          <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">MTBF (Tier-0 Fleet):</span>
              <span className="font-bold text-[#0B1C30]">312 Operating Hours</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">Automated Runbook Resolution Rate:</span>
              <span className="font-bold text-[#0D9488]">74.2% Auto-Healed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748B]">P0 Blocker Frequency:</span>
              <span className="font-bold text-[#0B1C30]">0.4 incidents / month</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
