import { useEffect, useState } from 'react';
import { fetchLeetcodeStats } from '../../api/fetchApi.js';
import { mockLeetcodeData } from '../../data/libraryData.js';

export function LeetcodeStats({ stats: initialStats }) {
  const [fetchedStats, setFetchedStats] = useState(null);
  const [loading, setLoading] = useState(!initialStats);
  const [isCached, setIsCached] = useState(false);

  const stats = initialStats || fetchedStats;

  useEffect(() => {
    if (initialStats) return;

    let isMounted = true;

    fetchLeetcodeStats()
      .then((data) => {
        if (!isMounted) return;
        if (data && data.submitStatsGlobal) {
          setFetchedStats(data);
        } else {
          setFetchedStats(mockLeetcodeData);
          setIsCached(true);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn(
          'Failed to fetch LeetCode statistics from API, falling back to mock data:',
          err
        );
        setFetchedStats(mockLeetcodeData);
        setIsCached(true);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialStats]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#9eaedb]/16 bg-[#11172a]/62 p-6 flex flex-col justify-center items-center min-h-[300px]">
        <div className="h-4 w-36 bg-white/10 rounded-full animate-pulse mb-3" />
        <div className="h-8 w-52 bg-white/10 rounded-lg animate-pulse mb-2" />
        <p className="text-muted text-xs animate-pulse">Loading LeetCode statistics...</p>
      </div>
    );
  }

  const currentStats = stats || mockLeetcodeData;
  const acList = currentStats.submitStatsGlobal?.acSubmissionNum || [];
  const totalList = currentStats.submitStatsGlobal?.totalSubmissionNum || [];

  const getAcCount = (diff) =>
    acList.find((i) => i.difficulty.toLowerCase() === diff.toLowerCase())?.count || 0;
  const getTotalSubmissions = (diff) =>
    totalList.find((i) => i.difficulty.toLowerCase() === diff.toLowerCase())
      ?.submissions || 0;

  const allSolved = getAcCount('All');
  const allSubmissions = getTotalSubmissions('All');
  const overallAcceptance =
    allSubmissions > 0 ? ((allSolved / allSubmissions) * 100).toFixed(1) : '0.0';

  const easySolved = getAcCount('Easy');
  const easySubmissions = getTotalSubmissions('Easy');
  const easyRate =
    easySubmissions > 0 ? ((easySolved / easySubmissions) * 100).toFixed(0) : '0';

  const mediumSolved = getAcCount('Medium');
  const mediumSubmissions = getTotalSubmissions('Medium');
  const mediumRate =
    mediumSubmissions > 0 ? ((mediumSolved / mediumSubmissions) * 100).toFixed(0) : '0';

  const hardSolved = getAcCount('Hard');
  const hardSubmissions = getTotalSubmissions('Hard');
  const hardRate =
    hardSubmissions > 0 ? ((hardSolved / hardSubmissions) * 100).toFixed(0) : '0';

  const easyPct = allSolved > 0 ? (easySolved / allSolved) * 100 : 0;
  const medPct = allSolved > 0 ? (mediumSolved / allSolved) * 100 : 0;
  const hardPct = allSolved > 0 ? (hardSolved / allSolved) * 100 : 0;

  const ranking = currentStats.profile?.ranking
    ? currentStats.profile.ranking.toLocaleString()
    : 'N/A';
  const username = currentStats.username || 'PiyushMishra07';
  const profileUrl = `https://leetcode.com/u/${username}`;

  const difficultyCards = [
    {
      difficulty: 'Easy',
      solved: easySolved,
      submissions: easySubmissions,
      rate: easyRate,
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-400/10 border-emerald-400/20',
      barColor: 'bg-emerald-400',
    },
    {
      difficulty: 'Medium',
      solved: mediumSolved,
      submissions: mediumSubmissions,
      rate: mediumRate,
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-400/10 border-amber-400/20',
      barColor: 'bg-amber-400',
    },
    {
      difficulty: 'Hard',
      solved: hardSolved,
      submissions: hardSubmissions,
      rate: hardRate,
      accentColor: 'text-rose-400',
      badgeBg: 'bg-rose-400/10 border-rose-400/20',
      barColor: 'bg-rose-500',
    },
  ];

  return (
    <section className="rounded-2xl border border-[#9eaedb]/[0.16] bg-[#11172a]/[0.62] p-6 flex flex-col justify-between">
      {/* Top row: Header & Profile badge */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-accent">
              LeetCode Activity
            </p>
            {isCached && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[0.68rem] text-subtle">
                Offline Cached
              </span>
            )}
          </div>
          <h2 className="text-[clamp(1.45rem,3vw,2rem)] font-bold text-white flex items-baseline gap-2.5">
            <span>{allSolved}</span>
            <span className="text-sm font-semibold text-muted tracking-normal">
              Problems Solved
            </span>
          </h2>
          <p className="mt-1 leading-relaxed text-[#99a4be] text-sm">
            Continuous practice across algorithmic data structures and problem solving.
          </p>
        </div>

        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 self-start md:self-auto rounded-full border border-[#9eaedb]/20 bg-page-bg/48 px-3.5 py-1.5 text-xs font-bold text-[#a7f3d0] transition-colors hover:border-[#a7f3d0]/40 hover:bg-[#a7f3d0]/10"
        >
          <span>@{username}</span>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>

      {/* Middle Quick Stats */}
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex flex-col rounded-xl border border-[#9eaedb]/12 bg-page-bg/48 p-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-subtle">
            Global Ranking
          </span>
          <strong className="mt-1 text-base font-extrabold text-white">#{ranking}</strong>
        </div>

        <div className="flex flex-col rounded-xl border border-[#9eaedb]/12 bg-page-bg/48 p-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-subtle">
            Acceptance Rate
          </span>
          <strong className="mt-1 text-base font-extrabold text-emerald-400">
            {overallAcceptance}%
          </strong>
        </div>

        <div className="flex flex-col rounded-xl border border-[#9eaedb]/12 bg-page-bg/48 p-3">
          <span className="text-[0.7rem] font-bold uppercase tracking-wider text-subtle">
            Total Submissions
          </span>
          <strong className="mt-1 text-base font-extrabold text-[#60a5fa]">
            {allSubmissions}
          </strong>
        </div>
      </div>

      {/* Difficulty breakdown */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-subtle">
            Difficulty Breakdown
          </h3>
          <span className="text-xs text-muted">{allSolved} total solved</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {difficultyCards.map((item) => (
            <div
              key={item.difficulty}
              className="rounded-xl border border-[#9eaedb]/12 bg-page-bg/48 p-3 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${item.accentColor}`}>
                  {item.difficulty}
                </span>
                <span className="text-[0.7rem] text-subtle">{item.rate}% acc</span>
              </div>
              <div className="my-2 flex items-baseline justify-between">
                <span className="text-lg font-bold text-white">{item.solved}</span>
                <span className="text-[0.72rem] text-muted">
                  / {item.submissions} subs
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#080b16]/72">
                <span
                  className={`block h-full rounded-full ${item.barColor} transition-all duration-500`}
                  style={{ width: `${Math.min(100, Math.max(8, Number(item.rate)))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Proportional distribution bar */}
        <div className="mt-4 rounded-xl border border-[#9eaedb]/10 bg-page-bg/30 p-3">
          <div className="mb-2 flex items-center justify-between text-[0.72rem] text-muted">
            <span className="font-semibold text-subtle">Distribution</span>
            <span>
              {easySolved} Easy · {mediumSolved} Medium · {hardSolved} Hard
            </span>
          </div>
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-[#080b16] p-0.5 gap-0.5">
            {easyPct > 0 && (
              <div
                className="h-full rounded-full bg-emerald-400"
                style={{ width: `${easyPct}%` }}
                title={`Easy: ${easySolved}`}
              />
            )}
            {medPct > 0 && (
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${medPct}%` }}
                title={`Medium: ${mediumSolved}`}
              />
            )}
            {hardPct > 0 && (
              <div
                className="h-full rounded-full bg-rose-500"
                style={{ width: `${hardPct}%` }}
                title={`Hard: ${hardSolved}`}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default LeetcodeStats;
