export type PriorityLevel = 'P0' | 'P1' | 'P2' | 'P3' | 'P4' | 'P5';

export type IncidentStatus = 'Active' | 'Mitigated' | 'Resolved' | 'Post-Mortem';

export interface Incident {
  id: string; // e.g. INC-8821
  title: string;
  priority: PriorityLevel;
  priorityLabel: string;
  status: IncidentStatus;
  commander: {
    name: string;
    role: string;
    avatar?: string;
  };
  services: string[];
  region: string;
  startedAt: string;
  durationMin: number;
  blastRadius: string;
  description: string;
  timeline: Array<{
    id: string;
    timestamp: string;
    author: string;
    message: string;
    type: 'alert' | 'mitigation' | 'investigation' | 'communication';
  }>;
  runbooks: string[];
  sloImpact: string;
}

export interface ServiceNode {
  id: string;
  name: string;
  tier: 'Tier-0' | 'Tier-1' | 'Tier-2';
  status: 'nominal' | 'degraded' | 'critical' | 'maintenance';
  p99LatencyMs: number;
  errorRate: number; // e.g. 0.04%
  throughputRps: number;
  replicas: {
    active: number;
    desired: number;
  };
  region: string;
  dependencies: string[];
  ownerTeam: string;
}

export interface RunbookStep {
  id: string;
  number: number;
  title: string;
  command?: string;
  description: string;
  automated: boolean;
  status: 'pending' | 'executing' | 'passed' | 'failed';
  output?: string;
}

export interface Runbook {
  id: string; // e.g. RUN-104
  title: string;
  service: string;
  category: 'Failover' | 'Recovery' | 'Drain' | 'Rollback' | 'Diagnostics';
  estimatedDuration: string;
  verifiedDate: string;
  author: string;
  steps: RunbookStep[];
  citations: string[];
}

export interface KnowledgeDocument {
  id: string; // e.g. DOC-104, RFC-214
  title: string;
  type: 'Runbook' | 'Post-Mortem' | 'Architecture RFC' | 'DR Protocol' | 'Compliance';
  service: string;
  lastUpdated: string;
  vectorSimilarity?: number;
  summary: string;
  content: string;
  tags: string[];
  citationsLinked: string[];
}

export interface RagCitation {
  id: string;
  code: string; // e.g. DOC-104
  title: string;
  sourceDocId: string;
  excerpt: string;
  confidence: number;
  category: string;
}

export interface RagResponse {
  query: string;
  synthesizedAnswer: string;
  citations: RagCitation[];
  recommendedActions?: string[];
  timestamp: string;
}

export interface SloMetric {
  service: string;
  target: number; // e.g. 99.99
  current: number; // e.g. 99.94
  budgetRemainingPercent: number; // e.g. 18%
  burnRateMultiplier: number; // e.g. 4.2x
  trend: 'stable' | 'burning' | 'critical';
}
