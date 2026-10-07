import React from 'react';
import { PriorityLevel } from '../types';
import { PRIORITY_CONFIG } from '../data/mockData';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  className?: string;
  showDescriptionTooltip?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  className = '',
}) => {
  const cfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.P4;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 h-[22px] rounded border text-[11px] font-mono font-medium tracking-wider whitespace-nowrap select-none transition-colors ${className}`}
      style={{
        backgroundColor: cfg.bg,
        borderColor: cfg.border,
        color: cfg.text,
      }}
      title={`${cfg.label}: ${cfg.description}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: cfg.dot }}
        aria-hidden="true"
      />
      <span>{cfg.label}</span>
    </span>
  );
};
