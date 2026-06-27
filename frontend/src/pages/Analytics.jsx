import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import { listInterviews } from "../services/interviewApi";

function Analytics() {
  const { getToken } = useAuth();
  const [completed, setCompleted] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      try {
        const token = await getToken();
        const data = await listInterviews(token);
        if (!cancelled) {
          setCompleted((data.interviews ?? []).filter((interview) => interview.status === "completed"));
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadAnalytics();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  const average = (key) =>
    completed.length
      ? (
          completed.reduce((total, interview) => total + Number(interview.feedback?.[key] || 0), 0) / completed.length
        ).toFixed(1)
      : "0";

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
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#86ff22]">Analytics</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Progress overview</h1>
        <p className="mt-3 text-white/60">Scores aggregated from AI feedback stored in PostgreSQL.</p>
      </section>

      <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
        <MetricCard label="Completed" value={isLoading ? "..." : completed.length} />
        <MetricCard label="Avg technical" value={`${average("technicalScore")}/10`} />
        <MetricCard label="Avg relevance" value={`${average("relevanceScore")}/10`} />
        <MetricCard label="Avg communication" value={`${average("communicationScore")}/10`} />
      </section>
    </AppShell>
  );
}

export default Analytics;
