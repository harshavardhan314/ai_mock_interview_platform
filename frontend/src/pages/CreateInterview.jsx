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

  return (
    <AppShell>
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
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm outline-none focus:border-[#86ff22]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Company</span>
                <input
                  name="company"
                  value={form.company}
                  onChange={updateField}
                  placeholder="Example: Google, Zoho, TCS"
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm outline-none focus:border-[#86ff22]"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white/70">Experience level</span>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={updateField}
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm outline-none focus:border-[#86ff22]"
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
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm outline-none focus:border-[#86ff22]"
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
                  className="w-full rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm outline-none focus:border-[#86ff22]"
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
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm leading-6 outline-none focus:border-[#86ff22]"
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
