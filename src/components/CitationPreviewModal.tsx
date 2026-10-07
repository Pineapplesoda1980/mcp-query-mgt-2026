import React from 'react';
import { KNOWLEDGE_DOCUMENTS, INITIAL_RUNBOOKS } from '../data/mockData';
import { X, ExternalLink, Play, BookOpen, ShieldCheck, Sparkles } from 'lucide-react';

interface CitationPreviewModalProps {
  citationCode: string | null;
  onClose: () => void;
  onExecuteRunbook: (runbookId: string) => void;
  onAskRag: (query: string) => void;
}

export const CitationPreviewModal: React.FC<CitationPreviewModalProps> = ({
  citationCode,
  onClose,
  onExecuteRunbook,
  onAskRag,
}) => {
  if (!citationCode) return null;

  const doc = KNOWLEDGE_DOCUMENTS.find((d) => d.id === citationCode || d.citationsLinked.includes(citationCode));
  const runbook = INITIAL_RUNBOOKS.find((r) => r.id === citationCode || r.citations.includes(citationCode));

  const title = doc?.title || runbook?.title || `Knowledge Document ${citationCode}`;
  const summary = doc?.summary || `Official operational runbook for ${runbook?.service || 'Tier-0 infrastructure'}. Verified in production.`;
  const content = doc?.content || `Formal specification for ${citationCode}. Adheres to zero-loss failover protocols and multi-region replication boundaries.`;

  return (
    <div className="fixed inset-0 z-50 bg-[#091426]/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#FFFFFF] border border-[#CBD5E1] rounded shadow-2xl overflow-hidden animate-fadeIn text-xs">
        {/* Header */}
        <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-[22px] px-2 bg-[#CCFBF1] border border-[#5EEAD4] text-[#0F766E] font-mono text-[11px] font-semibold rounded flex items-center">
              [{citationCode}]
            </span>
            <span className="text-sm font-bold text-[#0B1C30]">
              Citation Spec & Verified Invariant
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0B1C30] hover:bg-[#F1F5F9] rounded cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-[#64748B] font-mono mb-1">
              <span>SOURCE REGISTRY: vector-mesh-knowledge</span>
              <span>·</span>
              <span className="text-[#0D9488]">CONFIRMED AUDITED</span>
            </div>
            <h3 className="text-base font-bold text-[#0B1C30]">
              {title}
            </h3>
            <p className="text-xs text-[#45474C] mt-2 leading-relaxed bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
              {summary}
            </p>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0]">
            <span className="text-[10px] font-mono uppercase font-bold text-[#64748B] block mb-2">
              Formal Document Extract & Rules
            </span>
            <div className="p-4 bg-[#091426] text-[#E2E8F0] font-mono text-xs rounded leading-relaxed whitespace-pre-line border border-[#1E293B]">
              {content}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={() => {
                onAskRag(`Explain all invariants and steps in citation [${citationCode}]`);
                onClose();
              }}
              className="px-3 py-1.5 bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4] rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask RAG About [{citationCode}]</span>
            </button>

            {runbook && (
              <button
                onClick={() => {
                  onExecuteRunbook(runbook.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-[#4338CA] hover:bg-[#3730A3] text-white rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Jump to Runbook {runbook.id}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
