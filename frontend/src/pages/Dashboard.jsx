import { useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { BarChart3, FileText, History, PlusCircle } from "lucide-react";
import AppShell from "../components/AppShell";
import InterviewSummaryCard from "../components/InterviewSummaryCard";
import MetricCard from "../components/MetricCard";
import { listInterviews } from "../services/interviewApi";

function Dashboard() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadInterviews() {
      try {
        const token = await getToken();
        const data = await listInterviews(token);
        if (!cancelled) {
          setInterviews(data.interviews ?? []);
        }
      } catch {
        if (!cancelled) {
          setInterviews([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadInterviews();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const completed = interviews.filter((interview) => interview.status === "completed");
  const averageScore = completed.length
    ? (completed.reduce((total, interview) => total + Number(interview.score || 0), 0) / completed.length).toFixed(1)
    : "0";
  const bestScore = completed.length
    ? Math.max(...completed.map((interview) => Number(interview.score || 0))).toFixed(1)
    : "0";

  return (
    <AppShell>
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#86ff22]">Dashboard</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            Welcome back, {user?.firstName || "candidate"}
          </h1>
          <p className="mt-3 max-w-2xl text-white/60">
            Practice against your resume and target job, then review AI-generated feedback after each session.
          </p>
        </div>
        <Link
          to="/create-interview"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#86ff22] px-5 py-3 text-sm font-black text-black transition hover:bg-[#cfff65]"
        >
          <PlusCircle className="h-4 w-4" />
          New interview
        </Link>
      </section>

      <section className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard label="Total interviews" value={isLoading ? "..." : interviews.length} helper="Interviews taken so Far..." />
        <MetricCard label="Average score" value={`${averageScore}/10`} helper="Across completed sessions." />
        <MetricCard label="Best score" value={`${bestScore}/10`} helper="Your strongest mock so far." />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Link
          to="/create-interview"
          className="rounded-2xl border border-[#86ff22]/25 bg-[#121611] p-6 transition hover:border-[#86ff22]"
        >
          <FileText className="h-8 w-8 text-[#86ff22]" />
          <h2 className="mt-5 text-xl font-bold">Resume + JD setup</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Upload your resume, paste the job description, and create a tailored practice session.
          </p>
        </Link>
        <Link
          to="/history"
          className="rounded-2xl border border-white/10 bg-[#121611] p-6 transition hover:border-sky-400/70"
        >
          <History className="h-8 w-8 text-sky-300" />
          <h2 className="mt-5 text-xl font-bold">Interview history</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Continue in-progress sessions and revisit completed feedback reports.
          </p>
        </Link>
        <Link
          to="/analytics"
          className="rounded-2xl border border-white/10 bg-[#121611] p-6 transition hover:border-violet-400/70"
        >
          <BarChart3 className="h-8 w-8 text-violet-300" />
          <h2 className="mt-5 text-xl font-bold">Progress analytics</h2>
          <p className="mt-2 text-sm leading-6 text-white/55">
            Track scores across technical, relevance, communication, and overall readiness.
          </p>
        </Link>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">Recent sessions</h2>
          <Link to="/history" className="text-sm font-bold text-[#86ff22] hover:text-[#cfff65]">
            View all
          </Link>
        </div>
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-[#121611] p-8 text-center text-white/55">
            Loading recent sessions...
          </div>
        ) : interviews.length ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {interviews.slice(0, 3).map((interview) => (
              <InterviewSummaryCard key={interview.id} interview={interview} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center text-white/55">
            No interviews yet. Create your first mock session to start building your feedback history.
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default Dashboard;
