import React, { useState } from 'react';
import { Runbook, KnowledgeDocument, RunbookStep } from '../types';
import {
  BookOpen,
  FileText,
  Play,
  CheckCircle2,
  AlertCircle,
  Terminal,
  ExternalLink,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  Clock,
} from 'lucide-react';

interface KnowledgeMeshViewProps {
  runbooks: Runbook[];
  documents: KnowledgeDocument[];
  activeRunbookId: string | null;
  onExecuteRunbookStep: (runbookId: string, stepId: string) => void;
  onExecuteAllSteps: (runbookId: string) => void;
  onSelectRunbook: (id: string) => void;
  onSelectDocument: (doc: KnowledgeDocument) => void;
  onOpenCitation: (code: string) => void;
  onAskRag: (query: string) => void;
}

export const KnowledgeMeshView: React.FC<KnowledgeMeshViewProps> = ({
  runbooks,
  documents,
  activeRunbookId,
  onExecuteRunbookStep,
  onExecuteAllSteps,
  onSelectRunbook,
  onSelectDocument,
  onOpenCitation,
  onAskRag,
}) => {
  const [activeTab, setActiveTab] = useState<'runbooks' | 'rfcs'>('runbooks');
  const currentRunbook = runbooks.find((r) => r.id === activeRunbookId) || runbooks[0];
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument>(documents[0]);
  const [runningStepId, setRunningStepId] = useState<string | null>(null);

  const handleStepClick = (stepId: string) => {
    setRunningStepId(stepId);
    setTimeout(() => {
      onExecuteRunbookStep(currentRunbook.id, stepId);
      setRunningStepId(null);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8FAFC] overflow-hidden">
      {/* Header Strip */}
      <div className="p-4 bg-[#FFFFFF] border-b border-[#CBD5E1]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-[#0B1C30] tracking-tight">
              Knowledge Mesh & Executable Runbook Catalog
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Formally verified operational blueprints, disaster recovery invariants, and semantic vector documentation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex rounded border border-[#CBD5E1] bg-[#FFFFFF] p-0.5">
              <button
                onClick={() => setActiveTab('runbooks')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTab === 'runbooks'
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                Executable Runbooks ({runbooks.length})
              </button>
              <button
                onClick={() => setActiveTab('rfcs')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  activeTab === 'rfcs'
                    ? 'bg-[#1E293B] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0B1C30]'
                }`}
              >
                Architecture RFCs & SOPs ({documents.length})
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      {activeTab === 'runbooks' ? (
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          {/* Left Column: Runbook Catalog List */}
          <div className="border-r border-[#E2E8F0] bg-[#FFFFFF] overflow-y-auto p-3 space-y-2">
            <div className="text-[10px] font-mono font-semibold uppercase text-[#64748B] px-1 mb-2">
              Production Verified Runbooks
            </div>

            {runbooks.map((rb) => {
              const isSelected = rb.id === currentRunbook.id;
              const completedCount = rb.steps.filter((s) => s.status === 'passed').length;

              return (
                <div
                  key={rb.id}
                  onClick={() => onSelectRunbook(rb.id)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EEF2FF] border-[#4338CA] shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#4338CA]">
                      {rb.id}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border bg-white text-[#64748B]">
                      {rb.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#0B1C30] leading-snug">
                    {rb.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B] font-mono">
                    <span>Target: {rb.service}</span>
                    <span className="text-[#0D9488]">
                      {completedCount}/{rb.steps.length} steps passed
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right 2 Columns: Selected Runbook Interactive Executor */}
          <div className="lg:col-span-2 flex flex-col bg-[#FFFFFF] overflow-y-auto p-4 space-y-4">
            {/* Runbook Meta Header */}
            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#4338CA]">
                      {currentRunbook.id}
                    </span>
                    <span className="text-xs text-[#64748B]">·</span>
                    <span className="font-mono text-xs text-[#64748B]">
                      Verified: {currentRunbook.verifiedDate}
                    </span>
                    <span className="text-xs text-[#64748B]">·</span>
                    <span className="font-mono text-xs text-[#64748B]">
                      Est. {currentRunbook.estimatedDuration}
                    </span>
                  </div>
                  <h2 className="text-sm font-bold text-[#0B1C30]">
                    {currentRunbook.title}
                  </h2>
                  <div className="text-xs text-[#64748B] mt-1">
                    Service: <span className="font-mono text-[#0B1C30]">{currentRunbook.service}</span> · Author: {currentRunbook.author}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onExecuteAllSteps(currentRunbook.id)}
                    className="px-3 py-1.5 bg-[#1E293B] hover:bg-[#0F172A] text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Run Full Sequence</span>
                  </button>

                  <button
                    onClick={() => onAskRag(`Explain the execution requirements for runbook ${currentRunbook.id}`)}
                    className="px-2.5 py-1.5 bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] rounded text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask RAG</span>
                  </button>
                </div>
              </div>

              {/* Linked Citation Chips */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#E2E8F0] text-xs">
                <span className="text-[#64748B]">Formal Citations:</span>
                {currentRunbook.citations.map((code) => (
                  <button
                    key={code}
                    onClick={() => onOpenCitation(code)}
                    className="h-[18px] px-1.5 bg-[#CCFBF1] hover:bg-[#99F6E4] border border-[#5EEAD4] text-[#0F766E] font-mono text-[10px] rounded flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>[{code}]</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Steps Sequential Flow */}
            <div className="space-y-3">
              <div className="text-xs font-mono font-semibold uppercase text-[#64748B] tracking-wider">
                Execution Steps ({currentRunbook.steps.length})
              </div>

              {currentRunbook.steps.map((step) => {
                const isExecuting = runningStepId === step.id;
                const isPassed = step.status === 'passed';

                return (
                  <div
                    key={step.id}
                    className={`p-3.5 rounded border transition-colors ${
                      isPassed
                        ? 'bg-[#F0FDF4] border-[#86EFAC]'
                        : 'bg-[#FFFFFF] border-[#E2E8F0] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                              isPassed
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#1E293B] text-white'
                            }`}
                          >
                            {step.number}
                          </span>
                          <h4 className="text-xs font-bold text-[#0B1C30]">
                            {step.title}
                          </h4>
                          {isPassed && (
                            <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">
                              PASSED
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#45474C] pl-7">
                          {step.description}
                        </p>
                      </div>

                      <button
                        onClick={() => handleStepClick(step.id)}
                        disabled={isExecuting}
                        className={`shrink-0 px-3 py-1.5 text-xs font-mono rounded font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                          isPassed
                            ? 'bg-white border border-[#CBD5E1] text-[#45474C] hover:bg-slate-50'
                            : 'bg-[#4338CA] hover:bg-[#3730A3] text-white'
                        }`}
                      >
                        {isExecuting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Probing...</span>
                          </>
                        ) : isPassed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Re-run Step</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Execute Step</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Bash Command Snippet */}
                    {step.command && (
                      <div className="mt-2.5 ml-7 p-2 rounded bg-[#091426] text-[#E2E8F0] font-mono text-[11px] overflow-x-auto flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-[#0D9488] shrink-0" />
                        <span className="select-all">{step.command}</span>
                      </div>
                    )}

                    {/* Output log */}
                    {step.output && (
                      <div className="mt-2 ml-7 p-2 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-[11px] font-mono text-[#1E293B]">
                        <span className="text-[#64748B] block text-[10px] uppercase font-bold mb-0.5">Probe Response:</span>
                        {step.output}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* RFCs and Documentation View */
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
          <div className="border-r border-[#E2E8F0] bg-[#FFFFFF] overflow-y-auto p-3 space-y-2">
            <div className="text-[10px] font-mono font-semibold uppercase text-[#64748B] px-1 mb-2">
              Architecture RFCs & Knowledge Docs
            </div>
            {documents.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#EEF2FF] border-[#4338CA] shadow-xs'
                      : 'bg-[#F8FAFC] border-[#E2E8F0] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-[#4338CA]">
                      {doc.id}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded border bg-white text-[#64748B]">
                      {doc.type}
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-[#0B1C30] leading-snug">
                    {doc.title}
                  </h3>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#64748B] font-mono">
                    <span>{doc.service}</span>
                    <span className="text-[#0D9488]">
                      {(doc.vectorSimilarity ? doc.vectorSimilarity * 100 : 92).toFixed(0)}% Match
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-2 bg-[#FFFFFF] overflow-y-auto p-6 space-y-4">
            <div className="border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-[#4338CA]">
                  {selectedDoc.id}
                </span>
                <span className="text-xs text-[#64748B]">·</span>
                <span className="font-mono text-xs text-[#64748B]">
                  Last Updated: {selectedDoc.lastUpdated}
                </span>
                <span className="text-xs text-[#64748B]">·</span>
                <span className="font-mono text-xs text-[#0D9488]">
                  Vector Similarity: {selectedDoc.vectorSimilarity || 0.92}
                </span>
              </div>
              <h1 className="text-lg font-bold text-[#0B1C30]">
                {selectedDoc.title}
              </h1>
              <p className="text-xs text-[#45474C] mt-2 leading-relaxed">
                {selectedDoc.summary}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {selectedDoc.tags.map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#F1F5F9] border border-[#CBD5E1] text-[#45474C]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-xs text-[#1E293B] space-y-3 font-sans leading-relaxed whitespace-pre-line">
              {selectedDoc.content}
            </div>

            <div className="pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={() => onAskRag(`Summarize and extract key invariants from document ${selectedDoc.id} (${selectedDoc.title})`)}
                className="px-3 py-1.5 bg-[#0D9488] hover:bg-[#0F766E] text-white text-xs font-medium rounded flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask RAG Assistant About This Doc</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
