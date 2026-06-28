import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseBusiness, Clock3, FileText, Gauge, Mic, Sparkles, Upload } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import AppShell from "../components/AppShell";
import { createInterview } from "../services/interviewApi";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const initialForm = {
  role: "Software Engineer",
  company: "",
  experienceLevel: "Mid-level",
  difficulty: "Medium",
  interviewType: "Mixed",
  durationMinutes: 30,
  jobDescription: "",
};

function CreateInterview() {
  const { getToken } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: name === "durationMinutes" ? Number(value) : value,
    }));
  };

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    setResumeFile(file);
    setError("");
  };

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!resumeFile) {
      setError("Resume is required. Upload a PDF, DOCX, or TXT file.");
      return;
    }

    if (!form.jobDescription.trim()) {
      setError("Job description is required before starting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);
      formData.append("role", form.role);
      formData.append("company", form.company);
      formData.append("experienceLevel", form.experienceLevel);
      formData.append("difficulty", form.difficulty);
      formData.append("interviewType", form.interviewType);
      formData.append("durationMinutes", String(form.durationMinutes));
      formData.append("jobDescription", form.jobDescription);

      const token = await getToken();
      const { interview } = await createInterview(formData, token);
      navigate(`/interview/${interview.id}`);
    } catch (submitError) {
      setError(submitError.message || "Could not create interview.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const plannedQuestions = Math.max(3, Math.min(10, Math.round(form.durationMinutes / 5)));

  if (isSubmitting) {
    return (
      <AppShell>
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 relative z-10 px-4">
          <style>{`
            @keyframes borderGlow {
              0%, 100% { border-color: rgba(134, 255, 34, 0.2); }
              50% { border-color: rgba(134, 255, 34, 0.6); }
            }
            @keyframes progressPulse {
              0% { width: 0%; }
              50% { width: 75%; }
              100% { width: 100%; }
            }
          `}</style>
          
          <div className="absolute top-[20%] left-[-10%] w-[350px] h-[350px] bg-gradient-to-tr from-[#3d7c00]/30 to-transparent opacity-[0.25] rounded-full blur-[80px] pointer-events-none z-0"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="relative mx-auto w-20 h-20 bg-[rgba(134, 255, 34, 0.06)] border rounded-2xl flex items-center justify-center shadow-lg shadow-[#86ff22]/5 animate-[borderGlow_3s_infinite]" style={{ border: '1px solid rgba(134,255,34,0.2)' }}>
              <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#86ff22] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#cfff65] animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[#bdee60] text-[10px] font-bold tracking-widest uppercase bg-[rgba(134,255,34,0.1)] px-3 py-1.5 rounded-full">
                AI Agent Initializing
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">Analyzing Resume & Generating Questions</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                Our voice model is parsing your experience to map the perfect set of tailored mock interview questions for the <span className="text-[#86ff22] font-semibold">{form.role}</span> position.
              </p>
            </div>

            <div className="w-64 h-2 bg-black/60 border border-white/[0.05] rounded-full overflow-hidden p-[1px] mx-auto">
              <div className="h-full bg-gradient-to-r from-[#2a6600] to-[#86ff22] rounded-full animate-[progressPulse_4s_ease-in-out_infinite]" />
            </div>

            <p className="text-[11px] font-mono text-white/40 tracking-wider">
              ESTIMATED TIME: 3 - 5 SECONDS
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <style>{`
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        select:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #070a05 inset !important;
          -webkit-text-fill-color: #ffffff !important;
          caret-color: #ffffff;
          border-color: rgba(255,255,255,0.10) !important;
        }
        select option {
          background-color: #0d1109;
          color: #ffffff;
        }
      `}</style>
      <section className="max-w-4xl">

        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-bold text-white/55 hover:text-[#86ff22] mb-10">
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#86ff22]">Create interview</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Build a tailored mock session</h1>
        <p className="mt-3 text-white/60">
          Upload your resume and paste the job description. The backend will parse your resume and generate tailored questions.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-[#121611] p-6">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-[#86ff22]" />
              <h2 className="text-xl font-bold">Target role</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Role</span>
                <input
                  name="role"
                  value={form.role}
                  onChange={updateField}
                  required
                  placeholder="Software Engineer"
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#86ff22] transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Company</span>
                <input
                  name="company"
                  value={form.company}
                  onChange={updateField}
                  placeholder="Example: Google, Zoho, TCS"
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-[#86ff22] transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Experience level</span>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={updateField}
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm text-white outline-none focus:border-[#86ff22] transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  <option>Entry-level</option>
                  <option>Mid-level</option>
                  <option>Senior</option>
                </select>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Difficulty</span>
                <select
                  name="difficulty"
                  value={form.difficulty}
                  onChange={updateField}
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm text-white outline-none focus:border-[#86ff22] transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </label>
              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-semibold text-white/70">Interview duration</span>
                <select
                  name="durationMinutes"
                  value={form.durationMinutes}
                  onChange={updateField}
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm text-white outline-none focus:border-[#86ff22] transition-colors"
                  style={{ colorScheme: 'dark' }}
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>60 minutes</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#121611] p-6">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-[#86ff22]" />
              <h2 className="text-xl font-bold">Resume and job description</h2>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Resume file *</span>
                <div className="rounded-xl border border-dashed border-white/15 bg-[#070a05] p-5">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <Upload className="h-8 w-8 text-[#86ff22]" />
                    <p className="text-sm text-white/60">Upload PDF, DOCX, or TXT (max 5 MB)</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleResumeChange}
                      className="w-full text-sm text-white/70 file:mr-4 file:rounded-full file:border-0 file:bg-[#86ff22] file:px-4 file:py-2 file:text-sm file:font-bold file:text-black hover:file:bg-[#cfff65]"
                    />
                    {resumeFile ? (
                      <p className="text-sm font-semibold text-[#86ff22]">Selected: {resumeFile.name}</p>
                    ) : null}
                  </div>
                </div>
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Job description *</span>
                <textarea
                  name="jobDescription"
                  value={form.jobDescription}
                  onChange={updateField}
                  rows={7}
                  required
                  placeholder="Paste the job description, responsibilities, and required skills."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm text-white placeholder:text-white/30 leading-6 outline-none focus:border-[#86ff22] transition-colors"
                  style={{ colorScheme: 'dark' }}
                />
              </label>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-[#86ff22]/20 bg-[#121611] p-6">
          <Sparkles className="h-8 w-8 text-[#86ff22]" />
          <h2 className="mt-5 text-xl font-bold">Session plan</h2>
          <div className="mt-5 space-y-4 text-sm text-white/60">
            <p className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-white/35" /> {form.durationMinutes} minute session
            </p>
            <p className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-white/35" /> {plannedQuestions} tailored questions
            </p>
            <p className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-white/35" /> Voice-ready interview room
            </p>
            <p>Your resume is parsed on the backend and stored in PostgreSQL with the interview session.</p>
          </div>
          {error ? (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full bg-[#86ff22] px-5 py-3 text-sm font-black text-black transition hover:bg-[#cfff65] disabled:opacity-60"
          >
            {isSubmitting ? "Parsing resume & generating questions..." : "Start mock interview"}
          </button>
        </aside>
      </form>
    </AppShell>
  );
}

export default CreateInterview;
