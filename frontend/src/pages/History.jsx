import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import AppShell from "../components/AppShell";
import InterviewSummaryCard from "../components/InterviewSummaryCard";
import { listInterviews } from "../services/interviewApi";

function History() {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      try {
        const data = await listInterviews();
        if (!cancelled) {
          setInterviews(data.interviews ?? []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Could not load interview history.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell>
      <section>
        <Link
          to="/dashboard"
          className="mb-10 inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-[#86ff22]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#86ff22]">History</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Your interview sessions</h1>
        <p className="mt-3 text-white/60">Continue unfinished mocks or open completed feedback reports.</p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {isLoading ? (
          <div className="rounded-2xl border border-white/10 bg-[#121611] p-8 text-white/55 lg:col-span-3">
            Loading sessions...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-red-200 lg:col-span-3">
            {error}
          </div>
        ) : interviews.length ? (
          interviews.map((interview) => <InterviewSummaryCard key={interview.id} interview={interview} />)
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 p-8 text-white/55 lg:col-span-3">
            No sessions found yet.
          </div>
        )}
      </section>
    </AppShell>
  );
}

export default History;
