import { useState, useEffect } from "react";
import { pages } from "../data/pages.js";
import BulletinWidget from "../components/bulletin/BulletinWidget.jsx";
import CodingSummary from "../components/coding/CodingSummary.jsx";
import ArticleCard from "../components/library/ArticleCard.jsx";
import DocumentCard from "../components/library/DocumentCard.jsx";
import { articles, documents } from "../data/libraryData.js";
import { getCodingSummary } from "../api/fetchApi.js";

function Library() {
    const page = pages["/library"];
    const [codingSummary, setCodingSummary] = useState(null);

    useEffect(() => {
        getCodingSummary().then(data => {
            setCodingSummary(data);
        }).catch(err => console.error("Failed to fetch coding summary:", err));
    }, []);

    return (
        <>
            <section className="max-w-190">
                <p className="mb-5 text-md font-extrabold uppercase tracking-[0.14em] text-accent">{page.eyebrow}</p>
                <h1 className="mb-6 max-w-182.5 text-[clamp(2.75rem,7vw,5.7rem)] font-bold leading-[0.98] tracking-[-0.055em] text-emerald-100">{page.title}</h1>
                <p className="mb-8 max-w-162.5 text-[clamp(1rem,1.5vw,1.15rem)] leading-[1.75] text-muted">{page.description}</p>
            </section>

            {/* Top Section: Activity & Analytics */}
            <section className="mt-16 grid grid-cols-1 gap-4 md:mt-28 lg:grid-cols-3 lg:gap-8">
                <div className="lg:col-span-1">
                    <BulletinWidget />
                </div>
                <div className="lg:col-span-2">
                    {codingSummary ? (
                        <CodingSummary summary={codingSummary} />
                    ) : (
                        <div className="rounded-2xl border border-[#9eaedb]/16 bg-[#11172a]/62 p-6 flex items-center justify-center min-h-55">
                            <span className="text-muted text-sm italic">Loading coding activity...</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Middle Section: Technical Writing */}
            <section className="mt-16 md:mt-24">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-[1.3rem] font-bold text-white">Articles & Notes</h2>
                    <span className="text-sm text-muted">{articles.length} posts</span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </section>

            {/* Bottom Section: Documents */}
            <section className="mt-16 md:mt-24 mb-16">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-[1.3rem] font-bold text-white">Documents</h2>
                    <span className="text-sm text-muted">{documents.length} files</span>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {documents.map((doc) => (
                        <DocumentCard key={doc.id} document={doc} />
                    ))}
                </div>
            </section>
        </>
    );
}

export default Library;
