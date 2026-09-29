import { useState } from 'react';

function ArticleCard({ article }) {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <article className="flex flex-col rounded-2xl border border-[#9eaedb]/16 bg-[#11172a]/78 p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)] transition-all">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-accent">{article.date}</span>
                <div className="flex gap-2">
                    {article.tags.map(tag => (
                        <span key={tag} className="rounded border border-[#9eaedb]/20 bg-[#0d111f]/50 px-2 py-0.5 text-[0.7rem] text-muted">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
            
            <h2 className="mb-3 text-[1.2rem] font-bold text-white leading-snug">{article.title}</h2>
            
            {!isExpanded ? (
                <>
                    <p className="text-[0.9rem] leading-relaxed text-muted mb-4">{article.abstract}</p>
                    <button 
                        onClick={() => setIsExpanded(true)}
                        className="mt-auto self-start text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        Read Article &rarr;
                    </button>
                </>
            ) : (
                <div className="mt-4 border-t border-[#9eaedb]/12 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <pre className="whitespace-pre-wrap font-sans text-[0.9rem] leading-relaxed text-muted">
                        {article.content.trim()}
                    </pre>
                    <button 
                        onClick={() => setIsExpanded(false)}
                        className="mt-6 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                        &larr; Collapse Article
                    </button>
                </div>
            )}
        </article>
    );
}

export default ArticleCard;
