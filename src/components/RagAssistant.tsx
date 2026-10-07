import React, { useState } from 'react';
import { RagResponse, RagCitation, KnowledgeDocument } from '../types';
import { PRECONFIGURED_RAG_ANSWERS, KNOWLEDGE_DOCUMENTS } from '../data/mockData';
import {
  Sparkles,
  Search,
  X,
  ExternalLink,
  Check,
  Copy,
  ArrowRight,
  Database,
  Layers,
  Terminal,
  Zap,
} from 'lucide-react';

interface RagAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCitation: (code: string) => void;
  onExecuteRunbookFromRag: (runbookId: string) => void;
  onAppendTimelineFromRag: (text: string) => void;
  initialQuery?: string;
}

export const RagAssistant: React.FC<RagAssistantProps> = ({
  isOpen,
  onClose,
  onOpenCitation,
  onExecuteRunbookFromRag,
  onAppendTimelineFromRag,
  initialQuery = '',
}) => {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [activeResponse, setActiveResponse] = useState<RagResponse>(PRECONFIGURED_RAG_ANSWERS.kafka);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [hoveredCitation, setHoveredCitation] = useState<RagCitation | null>(null);

  if (!isOpen) return null;

  const handleRunQuery = (queryString: string) => {
    setQueryInput(queryString);
    setIsSearching(true);

    setTimeout(() => {
      const lower = queryString.toLowerCase();
      let matchedResponse: RagResponse = PRECONFIGURED_RAG_ANSWERS.kafka;

      if (lower.includes('kafka') || lower.includes('lag') || lower.includes('partition') || lower.includes('8821')) {
        matchedResponse = PRECONFIGURED_RAG_ANSWERS.kafka;
      } else if (lower.includes('failover') || lower.includes('ledger') || lower.includes('postgres') || lower.includes('database')) {
        matchedResponse = PRECONFIGURED_RAG_ANSWERS.failover;
      } else if (lower.includes('escalat') || lower.includes('p0') || lower.includes('sop') || lower.includes('war room')) {
        matchedResponse = PRECONFIGURED_RAG_ANSWERS.escalation;
      } else if (lower.includes('vector') || lower.includes('qdrant') || lower.includes('compaction') || lower.includes('hnsw')) {
        matchedResponse = PRECONFIGURED_RAG_ANSWERS.vector;
      } else {
        // Dynamic synthesis across documents
        const matchedDocs = KNOWLEDGE_DOCUMENTS.filter(
          (d) =>
            d.title.toLowerCase().includes(lower) ||
            d.content.toLowerCase().includes(lower) ||
            d.tags.some((t) => t.includes(lower))
        );

        const primaryDoc = matchedDocs[0] || KNOWLEDGE_DOCUMENTS[0];
        matchedResponse = {
          query: queryString,
          synthesizedAnswer: `Semantic retrieval from Knowledge Mesh index matched [${primaryDoc.id}]: ${primaryDoc.summary} Follow operational invariants specified in [${primaryDoc.citationsLinked[0] || primaryDoc.id}] to ensure zero-regression state.`,
          citations: [
            {
              id: `cit-dyn-1`,
              code: primaryDoc.id,
              title: primaryDoc.title,
              sourceDocId: primaryDoc.id,
              excerpt: primaryDoc.summary,
              confidence: 0.94,
              category: primaryDoc.type,
            },
          ],
          recommendedActions: [
            `Inspect ${primaryDoc.id} Invariant Checklist`,
            'Verify Cross-Region Service Heartbeats',
          ],
          timestamp: 'Just now',
        };
      }

      setActiveResponse(matchedResponse);
      setIsSearching(false);
    }, 450);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeResponse.synthesizedAnswer);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <aside
      className="w-[380px] shrink-0 border-l border-[#E2E8F0] bg-[#FFFFFF] flex flex-col h-full text-xs select-none z-20 shadow-lg"
      aria-label="RAG Knowledge Assistant"
    >
      {/* Top Header */}
      <div className="p-3 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-[#0D9488]/10 border border-[#0D9488]/30 flex items-center justify-center text-[#0D9488]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="font-mono text-xs font-bold text-[#0B1C30]">
              Vector Knowledge Mesh
            </h2>
            <div className="flex items-center gap-1.5 text-[10px] text-[#0D9488] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488]" />
              <span>0.89ms Semantic Lookup · 1536-dim</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F1F5F9] rounded transition-colors cursor-pointer"
          title="Close RAG Panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-b border-[#E2E8F0] bg-[#FFFFFF] space-y-1.5">
        <span className="text-[10px] font-mono uppercase font-semibold text-[#64748B]">
          Quick Operational Queries
        </span>
        <div className="flex flex-col gap-1">
          {[
            { label: 'Kafka consumer lag & partition triage', key: 'kafka' },
            { label: 'Payment ledger database failover SOP', key: 'failover' },
            { label: 'Executive P0 escalation thresholds', key: 'escalation' },
            { label: 'EMEA vector replica compaction fix', key: 'vector' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleRunQuery(item.label)}
              className="text-left px-2 py-1 bg-[#F8FAFC] hover:bg-[#EEF2FF] hover:text-[#4338CA] border border-[#E2E8F0] rounded text-[11px] text-[#45474C] transition-colors truncate cursor-pointer flex items-center justify-between group"
            >
              <span className="truncate">{item.label}</span>
              <ArrowRight className="w-3 h-3 text-[#94A3B8] group-hover:text-[#4338CA] shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Query Input Panel */}
      <div className="p-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
        <div className="relative">
          <textarea
            rows={2}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (queryInput.trim()) handleRunQuery(queryInput.trim());
              }
            }}
            placeholder="Ask knowledge mesh (e.g., 'How to failover payment ledger?')..."
            className="w-full p-2.5 bg-white border border-[#CBD5E1] rounded text-xs text-[#0B1C30] placeholder-[#94A3B8] focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]/20 focus:outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-[#64748B]">
            <span className="flex items-center gap-1 text-[#0D9488]">
              <Database className="w-3 h-3" />
              <span>Vector Indexed</span>
            </span>

            <button
              onClick={() => queryInput.trim() && handleRunQuery(queryInput.trim())}
              disabled={isSearching || !queryInput.trim()}
              className="px-2.5 py-1 bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-40 text-white rounded text-[11px] font-medium flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isSearching ? 'Synthesizing...' : 'Search RAG'}
            </button>
          </div>
        </div>
      </div>

      {/* Answer & Synthesized Knowledge Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FFFFFF]">
        <div className="flex items-center justify-between text-[10px] font-mono text-[#64748B] uppercase tracking-wider font-semibold">
          <span>Synthesized Answer</span>
          <span className="text-[#0D9488] font-bold">Confidence 96.8%</span>
        </div>

        {/* Synthesized Teal Answer Box (per design spec) */}
        <div className="p-3 bg-[#F0FDFA] border border-[#99F6E4] rounded space-y-2 text-xs leading-relaxed text-[#0F172A] relative">
          <p className="font-normal leading-relaxed text-[#0F172A]">
            {activeResponse.synthesizedAnswer}
          </p>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1 border-t border-[#CCFBF1] text-[11px]">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[#0D9488] hover:text-[#0F766E] font-medium cursor-pointer"
            >
              {copiedAnswer ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              onClick={() => onAppendTimelineFromRag(activeResponse.synthesizedAnswer)}
              className="text-[#4338CA] hover:underline font-medium cursor-pointer"
            >
              + Add to Incident Timeline
            </button>
          </div>
        </div>

        {/* Verified Citation Badges */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-mono uppercase text-[#64748B] font-semibold">
            Verified Knowledge Citations ({activeResponse.citations.length})
          </div>

          <div className="space-y-1.5">
            {activeResponse.citations.map((cit) => (
              <div
                key={cit.id}
                onMouseEnter={() => setHoveredCitation(cit)}
                onMouseLeave={() => setHoveredCitation(null)}
                className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#5EEAD4] rounded transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  {/* Citation Badge (Height 18px, bg #CCFBF1, border #5EEAD4, text #0F766E, label-mono-xs) */}
                  <button
                    onClick={() => onOpenCitation(cit.code)}
                    className="h-[18px] px-1.5 bg-[#CCFBF1] border border-[#5EEAD4] text-[#0F766E] font-mono text-[10px] font-semibold rounded flex items-center gap-1 hover:bg-[#99F6E4] cursor-pointer transition-colors"
                  >
                    <span>[{cit.code}]</span>
                  </button>

                  <span className="font-mono text-[10px] text-[#64748B]">
                    Match {(cit.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#1E293B] mb-0.5">
                  {cit.title}
                </div>
                <div className="text-[11px] text-[#64748B] line-clamp-2 leading-relaxed">
                  "{cit.excerpt}"
                </div>

                <div className="mt-1 flex items-center justify-between text-[10px] text-[#4338CA]">
                  <span className="font-mono text-[#64748B]">{cit.category}</span>
                  <button
                    onClick={() => {
                      if (cit.code.startsWith('RUN-')) {
                        onExecuteRunbookFromRag(cit.code);
                      } else {
                        onOpenCitation(cit.code);
                      }
                    }}
                    className="hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <span>{cit.code.startsWith('RUN-') ? 'Open Runbook' : 'Inspect RFC'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Suggestions */}
        {activeResponse.recommendedActions && activeResponse.recommendedActions.length > 0 && (
          <div className="p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded space-y-1.5">
            <div className="text-[10px] font-mono uppercase text-[#64748B] font-semibold">
              Actionable Directives
            </div>
            <div className="space-y-1">
              {activeResponse.recommendedActions.map((act) => (
                <div
                  key={act}
                  className="flex items-center gap-2 text-xs text-[#0B1C30]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D9488] shrink-0" />
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RAG Footer */}
      <div className="p-2.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between text-[10px] font-mono text-[#64748B]">
        <span>INDEX: prod-vectors-v2</span>
        <span className="text-[#0D9488]">RAG ACTIVE</span>
      </div>
    </aside>
  );
};
