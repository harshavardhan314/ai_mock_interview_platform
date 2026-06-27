import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, Clock3, Loader2, Mic, MicOff, Send, Volume2 } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import AppShell from "../components/AppShell";
import {
  completeInterview,
  getInterview as fetchInterview,
  saveInterviewAnswer,
  startInterview,
} from "../services/interviewApi";
import { requestVoiceAgentResponse } from "../services/voiceAgentApi";

function InterviewRoom() {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [interview, setInterview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [answers, setAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draft, setDraft] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [lastAiResponse, setLastAiResponse] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(null);
  const [hasSpokenInitialQuestion, setHasSpokenInitialQuestion] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  function stopMicrophoneStream() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  const speakText = (text) => {
    if (!text || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let cancelled = false;

    async function bootstrapInterview() {
      setIsLoading(true);
      setLoadError("");

      try {
        const token = await getToken();
        const remote = await fetchInterview(interviewId, token);
        let session = remote.interview;

        if (session.status !== "completed") {
          const started = await startInterview(interviewId, token);
          session = started.interview;
        }

        if (cancelled) return;

        setInterview(session);
        setAnswers(session.answers ?? []);
        setCurrentIndex(session.currentQuestionIndex ?? 0);
        setRemainingSeconds((session.durationMinutes || 30) * 60);

        const firstQuestion = session.questions?.[session.currentQuestionIndex ?? 0];

        if (firstQuestion?.prompt && session.status !== "completed") {
          speakText(firstQuestion.prompt);
          setHasSpokenInitialQuestion(true);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error.message || "Could not load interview.");
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    bootstrapInterview();

    return () => {
      cancelled = true;
      stopMicrophoneStream();
      window.speechSynthesis?.cancel();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interviewId, getToken]);

  useEffect(() => {
    if (remainingSeconds === null || remainingSeconds <= 0) return;

    timerRef.current = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [remainingSeconds === null ? null : interview?.id]);

  if (isLoading) {
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
            <div className="relative mx-auto w-20 h-20 bg-[rgba(134,255,34,0.06)] border rounded-2xl flex items-center justify-center shadow-lg shadow-[#86ff22]/5 animate-[borderGlow_3s_infinite]" style={{ border: '1px solid rgba(134,255,34,0.2)' }}>
              <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#86ff22] animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#cfff65] animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[#bdee60] text-[10px] font-bold tracking-widest uppercase bg-[rgba(134,255,34,0.1)] px-3 py-1.5 rounded-full">
                Session Mounting
              </span>
              <h2 className="text-3xl font-black text-white tracking-tight">Setting Up Interview Room</h2>
              <p className="text-sm text-white/60 leading-relaxed max-w-md mx-auto">
                Connecting to Neon Database and initializing AI dialogue pipelines. Please wait...
              </p>
            </div>

            <div className="w-64 h-2 bg-black/60 border border-white/[0.05] rounded-full overflow-hidden p-[1px] mx-auto">
              <div className="h-full bg-gradient-to-r from-[#2a6600] to-[#86ff22] rounded-full animate-[progressPulse_4s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (loadError || !interview) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-white/10 bg-[#121611] p-8">
          <h1 className="text-2xl font-black">{loadError || "Interview not found"}</h1>
          <Link to="/dashboard" className="mt-4 inline-block text-sm font-bold text-[#86ff22]">
            Back to dashboard
          </Link>
        </div>
      </AppShell>
    );
  }

  const currentQuestion = interview.questions[currentIndex];
  const progress = Math.round((answers.length / interview.questions.length) * 100);
  const minutes = Math.floor((remainingSeconds ?? 0) / 60);
  const seconds = String((remainingSeconds ?? 0) % 60).padStart(2, "0");

  const saveAnswer = async (answerText = draft) => {
    if (!answerText.trim() || !currentQuestion) return;

    try {
      const token = await getToken();
      const result = await saveInterviewAnswer(interviewId, answerText.trim(), token);
      const updatedInterview = result.interview;

      setInterview(updatedInterview);
      setAnswers(updatedInterview.answers);
      setDraft("");
      setLastAiResponse("");

      if (result.isComplete) {
        setIsGeneratingFeedback(true);
        await completeInterview(interviewId, token);
        navigate(`/feedback/${interviewId}`);
        return;
      }

      setCurrentIndex(updatedInterview.currentQuestionIndex);

      if (result.nextQuestion?.prompt) {
        speakText(result.nextQuestion.prompt);
      }
    } catch (error) {
      setVoiceError(error.message || "Could not save your answer.");
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const toggleRecording = async () => {
    if (isProcessingVoice || isGeneratingFeedback) return;

    if (isListening) {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setVoiceError("Your browser does not support MediaRecorder. Please use Chrome or Edge.");
      return;
    }

    try {
      setVoiceError("");
      window.speechSynthesis?.cancel();
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: getSupportedMimeType(),
      });

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = processRecordedAnswer;
      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      setVoiceError(error.message || "Microphone permission was denied.");
      stopMicrophoneStream();
    }
  };

  const processRecordedAnswer = async () => {
    stopMicrophoneStream();
    setIsProcessingVoice(true);

    try {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: audioChunksRef.current[0]?.type || "audio/webm",
      });

      const nextQuestion = interview.questions[currentIndex + 1];
      const token = await getToken();

      const result = await requestVoiceAgentResponse({
        audioBlob,
        interviewContext: {
          role: interview.role,
          company: interview.company,
          difficulty: interview.difficulty,
          experienceLevel: interview.experienceLevel,
          resumeText: interview.resumeText,
          jobDescription: interview.jobDescription,
          currentQuestion: currentQuestion?.prompt,
          nextQuestion: nextQuestion?.prompt,
          expectedTopics: currentQuestion?.expectedTopics,
          previousAnswers: answers,
          questionNumber: currentIndex + 1,
          totalQuestions: interview.questions.length,
        },
      }, token);

      setDraft(result.transcript);
      setLastAiResponse(result.aiResponse);
      speakText(result.aiResponse);
    } catch (error) {
      setVoiceError(error.message || "Voice agent failed. Please try again.");
    } finally {
      setIsProcessingVoice(false);
    }
  };

  return (
    <AppShell>
      <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#86ff22]">Interview room</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight">{interview.role}</h1>
          <p className="mt-2 text-white/55">
            {interview.company || "Practice company"} - {interview.difficulty} - {interview.experienceLevel}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70">
            Question {Math.min(currentIndex + 1, interview.questions.length)} of {interview.questions.length}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#86ff22]/20 px-4 py-2 text-sm font-semibold text-[#86ff22]">
            <Clock3 className="h-4 w-4" />
            {minutes}:{seconds}
          </div>
        </div>
      </section>

      <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#86ff22]" style={{ width: `${progress}%` }} />
      </div>

      {isGeneratingFeedback ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-[#121611] p-8 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#86ff22]" />
          <p className="mt-4 text-white/60">Generating AI feedback from your interview...</p>
        </div>
      ) : null}

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-white/10 bg-[#121611] p-6">
          {currentQuestion ? (
            <>
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#86ff22]">
                  {currentQuestion.category}
                </p>
                <h2 className="mt-3 text-2xl font-black leading-snug">{currentQuestion.prompt}</h2>
                <p className="mt-3 text-sm text-white/60">
                  {hasSpokenInitialQuestion
                    ? "Listen to the question, record your answer, then save it to continue."
                    : "Preparing your first question..."}
                </p>
              </div>

              <label className="block space-y-3">
                <span className="text-sm font-semibold text-white/70">Your answer</span>
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={10}
                  placeholder="Record your answer or type here..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#070a05] px-4 py-3 text-sm leading-6 outline-none focus:border-[#86ff22]"
                />
              </label>

              {lastAiResponse ? (
                <div className="mt-5 rounded-xl border border-[#86ff22]/20 bg-[#86ff22]/5 p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#86ff22]">
                    <Volume2 className="h-4 w-4" />
                    AI interviewer
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/70">{lastAiResponse}</p>
                </div>
              ) : null}

              {voiceError ? (
                <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {voiceError}
                </p>
              ) : null}

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={toggleRecording}
                  disabled={isGeneratingFeedback}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-white/75 hover:border-[#86ff22]/50 disabled:opacity-60"
                >
                  {isProcessingVoice ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isListening ? (
                    <MicOff className="h-4 w-4" />
                  ) : (
                    <Mic className="h-4 w-4" />
                  )}
                  {isProcessingVoice ? "Processing Voice" : isListening ? "Stop Recording" : "Record Answer"}
                </button>

                <button
                  type="button"
                  onClick={() => saveAnswer()}
                  disabled={isGeneratingFeedback}
                  className="inline-flex items-center gap-2 rounded-full bg-[#86ff22] px-5 py-3 text-sm font-black text-black hover:bg-[#cfff65] disabled:opacity-60"
                >
                  <Send className="h-4 w-4" />
                  Save Answer
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-[#86ff22]" />
              <h2 className="mt-4 text-2xl font-black">Interview Completed</h2>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-white/10 bg-[#121611] p-6">
          <h2 className="text-xl font-bold">Transcript</h2>
          <div className="mt-5 space-y-4">
            {answers.length ? (
              answers.map((answer, index) => (
                <div key={answer.questionId} className="border-b border-white/10 pb-4 last:border-b-0">
                  <p className="text-xs font-bold text-[#86ff22]">
                    Q{index + 1}. {answer.category}
                  </p>
                  <p className="mt-2 text-sm text-white/65">{answer.answer}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-white/50">Your answers will appear here as the session progresses.</p>
            )}
          </div>
        </aside>
      </section>
    </AppShell>
  );
}

export default InterviewRoom;

function getSupportedMimeType() {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
}
