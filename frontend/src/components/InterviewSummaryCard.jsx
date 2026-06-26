import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Clock3 } from "lucide-react";

function InterviewSummaryCard({ interview }) {
  const isComplete = interview.status === "completed";
  const href = isComplete ? `/feedback/${interview.id}` : `/interview/${interview.id}`;

  return (
    <Link
      to={href}
      className="group block rounded-2xl border border-white/10 bg-[#121611] p-5 transition hover:border-[#86ff22]/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold">{interview.role}</h3>
            <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/55">
              {interview.interviewType}
            </span>
          </div>
          <p className="mt-2 line-clamp-2 text-sm text-white/55">{interview.company || "Target company not set"}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-white/30 transition group-hover:translate-x-1 group-hover:text-[#86ff22]" />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-2 text-white/50">
          {isComplete ? <CheckCircle2 className="h-4 w-4 text-[#86ff22]" /> : <Clock3 className="h-4 w-4 text-amber-300" />}
          {isComplete ? "Completed" : "In progress"}
        </span>
        <span className="font-mono text-white/65">{isComplete ? `${interview.score}%` : `${interview.answers.length}/${interview.questions.length}`}</span>
      </div>
    </Link>
  );
}

export default InterviewSummaryCard;

