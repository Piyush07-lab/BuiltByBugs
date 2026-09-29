import { useState } from 'react';

function ArticleCard({ article }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <article className="flex flex-col rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-6 shadow-paper-depth transition-all duration-300 hover:border-brand-violet/40">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-wider text-brand-turquoise font-semibold">
          {article.date}
        </span>
        <div className="flex gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-brand-border-subtle bg-brand-bg/80 px-2 py-0.5 text-[0.7rem] text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h2 className="mb-3 text-[1.2rem] font-bold text-white leading-snug">
        {article.title}
      </h2>

      {!isExpanded ? (
        <>
          <p className="text-[0.9rem] leading-relaxed text-muted mb-4">
            {article.abstract}
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="mt-auto self-start text-sm font-semibold text-brand-turquoise hover:text-brand-green transition-colors cursor-pointer"
          >
            Read Article &rarr;
          </button>
        </>
      ) : (
        <div className="mt-4 border-t border-brand-border-subtle pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <pre className="whitespace-pre-wrap font-sans text-[0.9rem] leading-relaxed text-zinc-300 bg-brand-bg/40 p-4 rounded-xl border border-brand-border-subtle">
            {article.content.trim()}
          </pre>
          <button
            onClick={() => setIsExpanded(false)}
            className="mt-6 text-sm font-semibold text-brand-turquoise hover:text-brand-green transition-colors cursor-pointer"
          >
            &larr; Collapse Article
          </button>
        </div>
      )}
    </article>
  );
}

export default ArticleCard;
