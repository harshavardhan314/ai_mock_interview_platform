import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import AppShell from "../components/AppShell";
import MetricCard from "../components/MetricCard";
import { getInterview } from "../services/interviewApi";

function Feedback() {
  const { interviewId } = useParams();
  const { getToken } = useAuth();
  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadFeedback() {
      try {
        const token = await getToken();
        const data = await getInterview(interviewId, token);
        if (!cancelled) {
          setInterview(data.interview);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message || "Could not load feedback.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadFeedback();
    return () => {
      cancelled = true;
    };
  }, [interviewId, getToken]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/10 bg-[#121611] p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#86ff22]" />
          <p className="mt-4 text-white/60">Loading feedback report...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !interview) {
    return (
      <AppShell>
        <h1 className="text-2xl font-black">{error || "Feedback not found"}</h1>
        <Link to="/history" className="mt-4 inline-block text-sm font-bold text-[#86ff22]">
          Back to history
        </Link>
      </AppShell>
    );
  }

  const feedback = interview.feedback;

  return (
    <AppShell>
      <Link to="/history" className="inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-[#86ff22]">
        <ArrowLeft className="h-4 w-4" />
        Back to history
      </Link>

      <section className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#86ff22]">Feedback report</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{interview.role}</h1>
          <p className="mt-2 text-white/55">{feedback?.summary || "Complete the interview to generate feedback."}</p>
        </div>
      </section>

      {feedback ? (
        <>
          <section className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-4">
            <MetricCard label="Overall" value={`${feedback.overallScore ?? 0}%`} />
            <MetricCard label="Technical" value={`${feedback.technicalScore ?? 0}%`} />
            <MetricCard label="Relevance" value={`${feedback.relevanceScore ?? 0}%`} />
            <MetricCard label="Communication" value={`${feedback.communicationScore ?? 0}%`} />
          </section>

          <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#121611] p-6">
              <h2 className="text-xl font-bold">Strengths</h2>
              <div className="mt-4 space-y-3">
                {(feedback.strengths || []).map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-6 text-white/65">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#86ff22]" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#121611] p-6">
              <h2 className="text-xl font-bold">Improvements</h2>
              <div className="mt-4 space-y-3">
                {(feedback.improvements || []).map((item) => (
                  <p key={item} className="flex gap-3 text-sm leading-6 text-white/65">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-white/10 bg-[#121611] p-6">
            <h2 className="text-xl font-bold">Question review</h2>
            <div className="mt-5 space-y-5">
              {(feedback.questionFeedback?.length ? feedback.questionFeedback : interview.answers).map(
                (entry, index) => (
                  <article key={entry.question || entry.questionId || index} className="border-b border-white/10 pb-5 last:border-b-0">
                    <p className="text-sm font-bold text-[#86ff22]">Question {index + 1}</p>
                    <h3 className="mt-2 font-semibold">{entry.question}</h3>
                    {entry.answer ? (
                      <p className="mt-3 text-sm leading-6 text-white/60">{entry.answer}</p>
                    ) : null}
                    {entry.feedback ? (
                      <p className="mt-3 text-sm leading-6 text-white/50">{entry.feedback}</p>
                    ) : null}
                    {entry.rating ? (
                      <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#86ff22]">
                        Rating: {entry.rating}/10
                      </p>
                    ) : null}
                  </article>
                )
              )}
            </div>
          </section>
        </>
      ) : (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#121611] p-8 text-white/60">
          Feedback is still being generated or is not available yet.
        </div>
      )}
    </AppShell>
  );
}

export default Feedback;
