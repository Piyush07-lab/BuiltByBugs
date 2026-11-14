import { useState } from 'react';

export default function ProposalCard({ proposal, onAccept }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!proposal) return null;

  const {
    proposalId,
    clientName,
    projectName,
    summary,
    recommendedStack = [],
    deliverables = [],
    timelineWeeks,
    totalEstimatedCost,
    currency = 'USD',
    billingType = 'Milestone-Based',
    milestones = [],
    terms = [],
  } = proposal;

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return (
    <div className="w-full my-3 rounded-lg border border-brand-turquoise/40 bg-brand-surface/95 p-4 shadow-xl backdrop-blur-md text-zinc-200">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-brand-border pb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider text-brand-turquoise uppercase">
            {proposalId}
          </span>
          <h3 className="text-sm font-bold text-white mt-0.5">{projectName}</h3>
          <p className="text-[11px] text-zinc-400">Client: {clientName}</p>
        </div>
        <div className="text-right">
          <div className="text-base font-extrabold text-brand-turquoise">
            {currencySymbol}
            {totalEstimatedCost?.toLocaleString()} {currency}
          </div>
          <span className="inline-block rounded bg-brand-turquoise/10 px-2 py-0.5 text-[10px] font-medium text-brand-turquoise border border-brand-turquoise/30">
            {billingType}
          </span>
        </div>
      </div>

      {/* Meta Bar */}
      <div className="my-2.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-300">
        <span className="rounded bg-brand-bg px-2 py-1 border border-brand-border-subtle">
          ⏱️ {timelineWeeks} {timelineWeeks === 1 ? 'Week' : 'Weeks'}
        </span>
        {recommendedStack.map((tech, idx) => (
          <span
            key={idx}
            className="rounded bg-brand-violet/20 px-2 py-1 text-[10px] font-mono text-brand-violet border border-brand-violet/40"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Summary */}
      <p className="text-[11px] leading-relaxed text-zinc-300 mb-3">{summary}</p>

      {/* Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="w-full text-left py-1 text-[11px] font-semibold text-brand-turquoise hover:underline flex items-center justify-between"
      >
        <span>
          {isExpanded
            ? 'Hide Deliverables & Milestones ▲'
            : 'View Deliverables & Milestones ▼'}
        </span>
        <span className="text-zinc-500 text-[10px]">
          {deliverables.length} Deliverables
        </span>
      </button>

      {/* Collapsible Details */}
      {isExpanded && (
        <div className="mt-3 space-y-3 pt-2 border-t border-brand-border-subtle">
          {/* Deliverables */}
          <div>
            <h4 className="text-[11px] font-bold text-zinc-200 mb-1.5 uppercase tracking-wide">
              Itemized Deliverables
            </h4>
            <div className="space-y-1.5">
              {deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded bg-brand-bg/60 p-2 border border-brand-border-subtle text-[11px]"
                >
                  <div className="flex justify-between font-medium text-white">
                    <span>{item.title}</span>
                    <span className="text-zinc-400 font-mono text-[10px]">
                      ~{item.estimatedDays} days
                    </span>
                  </div>
                  <p className="text-zinc-400 text-[10px] mt-0.5">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Milestones */}
          {milestones.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold text-zinc-200 mb-1.5 uppercase tracking-wide">
                Milestone Schedule
              </h4>
              <div className="space-y-1">
                {milestones.map((m, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-[11px] py-1 px-2 rounded bg-brand-bg/40 border border-brand-border-subtle"
                  >
                    <span className="text-zinc-300">{m.phase}</span>
                    <div className="font-mono text-zinc-200 font-semibold text-right">
                      <span className="text-zinc-400 mr-2 text-[10px]">
                        ({m.percentage}%)
                      </span>
                      <span>
                        {currencySymbol}
                        {m.amount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms */}
          {terms.length > 0 && (
            <div className="text-[10px] text-zinc-400 space-y-1 pt-1">
              {terms.map((t, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <span className="text-brand-turquoise">•</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      {onAccept && (
        <div className="mt-4 pt-3 border-t border-brand-border flex gap-2">
          <button
            type="button"
            onClick={() => onAccept(proposal)}
            className="w-full py-2 bg-gradient-to-r from-brand-violet to-brand-turquoise text-white text-xs font-semibold rounded hover:brightness-110 shadow-glow-turquoise/20 transition-all cursor-pointer"
          >
            Confirm & Request SOW Submission
          </button>
        </div>
      )}
    </div>
  );
}
