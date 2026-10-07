/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Incident,
  ServiceNode,
  Runbook,
  KnowledgeDocument,
  SloMetric,
  PriorityLevel,
  IncidentStatus,
} from './types';
import {
  INITIAL_INCIDENTS,
  INITIAL_SERVICES,
  INITIAL_RUNBOOKS,
  KNOWLEDGE_DOCUMENTS,
  INITIAL_SLO_METRICS,
} from './data/mockData';
import { GlobalRail, MainNavModule } from './components/GlobalRail';
import { ContextDrawer } from './components/ContextDrawer';
import { TopBar } from './components/TopBar';
import { IncidentView } from './components/IncidentView';
import { OperationsView } from './components/OperationsView';
import { KnowledgeMeshView } from './components/KnowledgeMeshView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { RagAssistant } from './components/RagAssistant';
import { DeclareIncidentModal } from './components/DeclareIncidentModal';
import { CitationPreviewModal } from './components/CitationPreviewModal';

export default function App() {
  // Navigation & Layout State
  const [activeModule, setActiveModule] = useState<MainNavModule>('incidents');
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const [isRagOpen, setIsRagOpen] = useState(true);

  // Core Data State
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident>(INITIAL_INCIDENTS[0]);
  const [services, setServices] = useState<ServiceNode[]>(INITIAL_SERVICES);
  const [runbooks, setRunbooks] = useState<Runbook[]>(INITIAL_RUNBOOKS);
  const [activeRunbookId, setActiveRunbookId] = useState<string | null>('RUN-104');
  const [documents] = useState<KnowledgeDocument[]>(KNOWLEDGE_DOCUMENTS);
  const [sloMetrics] = useState<SloMetric[]>(INITIAL_SLO_METRICS);

  // Filters State
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'ALL'>('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [docCategoryFilter, setDocCategoryFilter] = useState('ALL');

  // Modals & Flyouts
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [previewCitationCode, setPreviewCitationCode] = useState<string | null>(null);
  const [ragInitialQuery, setRagInitialQuery] = useState('');
  const [isChaosSimulating, setIsChaosSimulating] = useState(false);

  // Global Keyboard Shortcuts (Cmd+K / Cmd+J for RAG Assistant)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'j')) {
        e.preventDefault();
        setIsRagOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (regionFilter !== 'ALL' && inc.region !== regionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = inc.title.toLowerCase().includes(q);
      const matchId = inc.id.toLowerCase().includes(q);
      const matchSvc = inc.services.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchId && !matchSvc) return false;
    }
    return true;
  });

  // Filtered Services
  const filteredServices = services.filter((svc) => {
    if (tierFilter !== 'ALL' && svc.tier !== tierFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!svc.name.toLowerCase().includes(q) && !svc.region.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Filtered Documents
  const filteredDocs = documents.filter((doc) => {
    if (docCategoryFilter !== 'ALL' && doc.type !== docCategoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!doc.title.toLowerCase().includes(q) && !doc.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Actions
  const handleDeclareIncident = (newInc: Incident) => {
    setIncidents([newInc, ...incidents]);
    setSelectedIncident(newInc);
    setActiveModule('incidents');
  };

  const handleUpdateIncidentStatus = (id: string, newStatus: IncidentStatus) => {
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, status: newStatus } : inc))
    );
    if (selectedIncident.id === id) {
      setSelectedIncident((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleAddTimelineEntry = (
    id: string,
    message: string,
    type: 'alert' | 'mitigation' | 'investigation' | 'communication'
  ) => {
    const entry = {
      id: `tl-${Date.now()}`,
      timestamp: 'Just now',
      author: 'Dr. Evelyn Vance (SRE Commander)',
      message,
      type,
    };

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === id
          ? {
              ...inc,
              timeline: [...inc.timeline, entry],
            }
          : inc
      )
    );

    if (selectedIncident.id === id) {
      setSelectedIncident((prev) => ({
        ...prev,
        timeline: [...prev.timeline, entry],
      }));
    }
  };

  const handleScaleService = (serviceId: string, delta: number) => {
    setServices((prev) =>
      prev.map((svc) => {
        if (svc.id === serviceId) {
          const nextActive = Math.max(2, svc.replicas.active + delta);
          return {
            ...svc,
            replicas: { ...svc.replicas, active: nextActive },
            p99LatencyMs: Math.max(4.2, Number((svc.p99LatencyMs * 0.85).toFixed(1))),
          };
        }
        return svc;
      })
    );
  };

  const handleProbeService = (serviceId: string) => {
    setServices((prev) =>
      prev.map((svc) =>
        svc.id === serviceId
          ? {
              ...svc,
              p99LatencyMs: Number((svc.p99LatencyMs * 0.92).toFixed(1)),
              errorRate: Math.max(0.001, Number((svc.errorRate * 0.5).toFixed(3))),
            }
          : svc
      )
    );
  };

  const handleExecuteRunbookStep = (runbookId: string, stepId: string) => {
    setRunbooks((prev) =>
      prev.map((rb) => {
        if (rb.id === runbookId) {
          return {
            ...rb,
            steps: rb.steps.map((st) =>
              st.id === stepId
                ? {
                    ...st,
                    status: 'passed',
                    output: `Execution probe verified at ${new Date().toLocaleTimeString()}. Exit code 0 (Success). Invariants satisfied.`,
                  }
                : st
            ),
          };
        }
        return rb;
      })
    );
  };

  const handleExecuteAllSteps = (runbookId: string) => {
    setRunbooks((prev) =>
      prev.map((rb) => {
        if (rb.id === runbookId) {
          return {
            ...rb,
            steps: rb.steps.map((st) => ({
              ...st,
              status: 'passed',
              output: `Automated probe confirmed. Exit code 0. Node healthy.`,
            })),
          };
        }
        return rb;
      })
    );
  };

  const handleTriggerChaosSimulation = () => {
    setIsChaosSimulating(true);
    // Simulate latency elevation in checkout-v2 and payment-ledger
    setTimeout(() => {
      setServices((prev) =>
        prev.map((svc) => {
          if (svc.id === 'svc-checkout-v2') {
            return {
              ...svc,
              status: 'critical',
              p99LatencyMs: 388.2,
              errorRate: 2.45,
            };
          }
          return svc;
        })
      );
      setIsChaosSimulating(false);
    }, 1200);
  };

  const handleOpenRunbook = (rbId: string) => {
    setActiveRunbookId(rbId);
    setActiveModule('knowledge');
  };

  const handleQueryRagForIncident = (inc: Incident) => {
    setRagInitialQuery(`What are the recommended mitigation steps for ${inc.title}?`);
    setIsRagOpen(true);
  };

  const handleAppendTimelineFromRag = (text: string) => {
    if (selectedIncident) {
      handleAddTimelineEntry(
        selectedIncident.id,
        `[RAG Ingestion] Applied synthesized guidance: ${text.slice(0, 160)}...`,
        'mitigation'
      );
    }
  };

  const activeIncidentCount = incidents.filter(
    (i) => i.status === 'Active' && (i.priority === 'P0' || i.priority === 'P1')
  ).length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] text-[#0B1C30] font-sans">
      {/* 1. Global Left Icon Rail (64px) */}
      <GlobalRail
        activeModule={activeModule}
        onSelectModule={(mod) => {
          setActiveModule(mod);
          setSearchQuery('');
        }}
        activeIncidentCount={activeIncidentCount}
        isRagOpen={isRagOpen}
        onToggleRag={() => setIsRagOpen(!isRagOpen)}
        isDrawerCollapsed={isDrawerCollapsed}
        onToggleDrawer={() => setIsDrawerCollapsed(!isDrawerCollapsed)}
      />

      {/* 2. Contextual Sub-navigation Drawer (260px) */}
      <ContextDrawer
        activeModule={activeModule}
        isCollapsed={isDrawerCollapsed}
        priorityFilter={priorityFilter}
        onSelectPriorityFilter={setPriorityFilter}
        statusFilter={statusFilter}
        onSelectStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tierFilter={tierFilter}
        onSelectTierFilter={setTierFilter}
        selectedDocCategory={docCategoryFilter}
        onSelectDocCategory={setDocCategoryFilter}
        selectedRegion={regionFilter}
        onSelectRegion={setRegionFilter}
      />

      {/* 3. Core Operations Stage (Fluid Flex-grow) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Bar with 3-zone contract */}
        <TopBar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          onOpenDeclareModal={() => setIsDeclareModalOpen(true)}
          onTriggerChaosSimulation={handleTriggerChaosSimulation}
          isRagOpen={isRagOpen}
          onToggleRag={() => setIsRagOpen(!isRagOpen)}
          activeWarRoomId={selectedIncident.id}
          isChaosSimulating={isChaosSimulating}
        />

        {/* Dynamic Operational Content View */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {activeModule === 'incidents' && (
            <IncidentView
              incidents={filteredIncidents}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncident}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
              onAddTimelineEntry={handleAddTimelineEntry}
              onOpenRunbook={handleOpenRunbook}
              onQueryRagForIncident={handleQueryRagForIncident}
            />
          )}

          {activeModule === 'operations' && (
            <OperationsView
              services={filteredServices}
              onScaleService={handleScaleService}
              onProbeService={handleProbeService}
              onOpenRagQuery={(q) => {
                setRagInitialQuery(q);
                setIsRagOpen(true);
              }}
            />
          )}

          {activeModule === 'knowledge' && (
            <KnowledgeMeshView
              runbooks={runbooks}
              documents={filteredDocs}
              activeRunbookId={activeRunbookId}
              onExecuteRunbookStep={handleExecuteRunbookStep}
              onExecuteAllSteps={handleExecuteAllSteps}
              onSelectRunbook={(id) => setActiveRunbookId(id)}
              onSelectDocument={(doc) => {}}
              onOpenCitation={(code) => setPreviewCitationCode(code)}
              onAskRag={(query) => {
                setRagInitialQuery(query);
                setIsRagOpen(true);
              }}
            />
          )}

          {activeModule === 'analytics' && <AnalyticsView sloMetrics={sloMetrics} />}

          {activeModule === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* 4. RAG Knowledge Assistant Dock (380px) */}
      <RagAssistant
        isOpen={isRagOpen}
        onClose={() => setIsRagOpen(false)}
        onOpenCitation={(code) => setPreviewCitationCode(code)}
        onExecuteRunbookFromRag={(rbId) => handleOpenRunbook(rbId)}
        onAppendTimelineFromRag={handleAppendTimelineFromRag}
        initialQuery={ragInitialQuery}
      />

      {/* Declare Incident Modal */}
      <DeclareIncidentModal
        isOpen={isDeclareModalOpen}
        onClose={() => setIsDeclareModalOpen(false)}
        onDeclareIncident={handleDeclareIncident}
      />

      {/* Citation Deep Inspection Modal */}
      <CitationPreviewModal
        citationCode={previewCitationCode}
        onClose={() => setPreviewCitationCode(null)}
        onExecuteRunbook={(rbId) => handleOpenRunbook(rbId)}
        onAskRag={(q) => {
          setRagInitialQuery(q);
          setIsRagOpen(true);
        }}
      />
    </div>
  );
}
