function DocumentCard({ document }) {
    return (
        <article className="flex flex-col rounded-2xl border border-[#9eaedb]/16 bg-linear-to-br from-[#11172a]/78 to-[#0d111f]/52 p-6 shadow-[0_1.5rem_4rem_rgba(0,0,0,0.16)] transition-transform hover:-translate-y-1">
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                </div>
            </div>
            
            <h3 className="mb-2 text-[1.1rem] font-bold text-white">{document.title}</h3>
            <p className="text-[0.9rem] leading-relaxed text-muted mb-6">{document.description}</p>
            
            <a 
                href={document.link} 
                className="mt-auto self-start text-sm font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                target="_blank"
                rel="noreferrer"
            >
                View Document
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </a>
        </article>
    );
}

export default DocumentCard;
