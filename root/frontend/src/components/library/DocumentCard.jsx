function DocumentCard({ document }) {
  return (
    <article className="flex flex-col rounded-2xl border border-brand-border bg-brand-card backdrop-blur-md p-6 shadow-paper-depth transition-all duration-300 hover:-translate-y-1 hover:border-brand-violet/40">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-brand-turquoise/20 bg-brand-turquoise/10 text-brand-turquoise shadow-glow-turquoise/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
      </div>

      <h3 className="mb-2 text-[1.1rem] font-bold text-white">{document.title}</h3>
      <p className="text-[0.9rem] leading-relaxed text-muted mb-6">
        {document.description}
      </p>

      <a
        href={document.link}
        className="mt-auto self-start text-sm font-semibold text-brand-turquoise hover:text-brand-green flex items-center gap-1.5 transition-colors"
        target="_blank"
        rel="noreferrer"
      >
        View Document
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </a>
    </article>
  );
}

export default DocumentCard;
