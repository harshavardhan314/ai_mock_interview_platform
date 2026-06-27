import { useState } from "react";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  Brain,
  BarChart3,
  Mic,
  BookOpen,
  TrendingUp,
  ShieldCheck,
  Zap,
  MessageSquare,
  Sparkles,
  RotateCcw,
  Cpu,
  Bot, // New premium logo icon
} from "lucide-react";

const Home = () => {
  // State to simulate switching question categories
  const [activeCategory, setActiveCategory] = useState("Behavioral");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  };

  const mockVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 35 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 18,
        delay: 0.25,
      },
    },
  };

  const questionLibrary = {
    Behavioral: {
      question:
        "Tell me about a time you handled a difficult stakeholder. What was the situation and how did you approach it?",
      tip: "Use STAR method: Situation → Task → Action → Result. Aim for 90–120 seconds.",
      scores: {
        clarity: 8.8,
        confidence: 7.4,
        relevance: 9.2,
        conciseness: 6.7,
        star: 8.1,
        overall: 8.0,
      },
    },
    Technical: {
      question:
        "How would you design a rate limiter for a distributed system stack handling millions of requests per minute?",
      tip: "Mention Token Bucket or Leaking Bucket algorithms. Discuss Redis cluster integration for state sync.",
      scores: {
        clarity: 9.1,
        confidence: 8.0,
        relevance: 8.5,
        conciseness: 7.2,
        star: 6.0,
        overall: 7.8,
      },
    },
    "Case Study": {
      question:
        "Our active user metric dropped by 12% week-over-week. Walk me through how you'd diagnose the structural root cause.",
      tip: "Isolate segments: platform, geography, traffic source. Distinguish external factors vs internal releases.",
      scores: {
        clarity: 8.5,
        confidence: 8.8,
        relevance: 9.0,
        conciseness: 7.9,
        star: 7.5,
        overall: 8.3,
      },
    },
    Leadership: {
      question:
        "Describe a situation where your team was strongly divided on a technical direction. How did you resolve it?",
      tip: "Focus on data-driven evaluation frameworks, fostering psychological safety, and disagreeing yet committing.",
      scores: {
        clarity: 8.9,
        confidence: 8.5,
        relevance: 9.5,
        conciseness: 7.0,
        star: 8.8,
        overall: 8.5,
      },
    },
  };

  const features = [
  {
    title: "AI Interview Coach",
    icon: Brain,
    desc: "Experience realistic interviews powered by AI that adapts questions based on your responses."
  },
  {
    title: "Resume-Based Questions",
    icon: BarChart3,
    desc: "Every interview is personalized using your resume, experience, and target job description."
  },
  {
    title: "Voice & Text Interviews",
    icon: Mic,
    desc: "Practice naturally using voice or text, just like a real interview."
  },
  {
    title: "Instant Performance Analysis",
    icon: BookOpen,
    desc: "Receive detailed feedback on communication, technical knowledge, confidence, and clarity."
  },
  {
    title: "Track Your Progress",
    icon: TrendingUp,
    desc: "Monitor your interview history, identify weak areas, and measure improvement over time."
  },
  {
    title: "Private & Secure",
    icon: ShieldCheck,
    desc: "Your interview sessions remain private and securely stored."
  }
];

  return (
    <div className="relative min-h-screen bg-[#070a05] text-white overflow-x-hidden font-sans scroll-smooth antialiased">
      {/* --- PREMIUM DESIGN SYSTEM GLOBAL STYLES & KEYFRAMES --- */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes voiceWave {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.22); }
        }
        .animate-float {
          animation: floatCard 6s ease-in-out infinite;
        }
        .animate-voice {
          animation: voiceWave 0.75s ease-in-out infinite;
          transform-origin: center;
        }
        .topography-lines {
          background-image: radial-gradient(circle at 50% 50%, transparent 60%, rgba(134, 255, 34, 0.02) 61%, transparent 62%);
          background-size: 160px 160px;
        }
        .cta-gradient {
          background: linear-gradient(135deg, #5cb800, #cfff65);
        }
        .icon-gradient {
          background: linear-gradient(135deg, #3d7c00, #86ff22);
        }
        .progress-gradient {
          background: linear-gradient(90deg, #2a6600, #86ff22);
        }
        .pricing-highlight {
          background: linear-gradient(160deg, rgba(61,124,0,0.22), rgba(134,255,34,0.06));
        }
        .stats-overlay {
          background: linear-gradient(90deg, transparent, rgba(134,255,34,0.03), transparent);
        }
      `}</style>

      {/* --- AMBIENT BLOBS SYSTEM --- */}
      <div className="absolute top-[-5%] left-[-10%] w-[850px] h-[850px] bg-gradient-to-tr from-[#3d7c00] via-[#b3ff4c]/20 to-transparent opacity-[0.32] rounded-full blur-[140px] pointer-events-none z-0"></div>
      <div className="absolute top-[15%] right-[-10%] w-[750px] h-[750px] bg-gradient-to-bl from-[#5cb800] via-[#cfff65]/15 to-transparent opacity-[0.25] rounded-full blur-[150px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[10%] w-[900px] h-[650px] bg-gradient-to-br from-[#2a6600]/40 to-transparent opacity-[0.12] rounded-full blur-[180px] pointer-events-none z-0"></div>

      {/* Topography Mesh Overlay */}
      <div className="absolute inset-0 topography-lines opacity-30 pointer-events-none mix-blend-screen z-0"></div>

      {/* Concentric Curved Vector Background Arcs (Left Side) */}
      <div className="absolute top-[18%] left-0 pointer-events-none z-0 opacity-25 select-none hidden lg:block">
        <svg
          width="400"
          height="600"
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#cfff65" />
              <stop offset="100%" stopColor="#1a4a00" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="-50"
            cy="300"
            r="200"
            stroke="url(#arcGrad)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />
          <circle
            cx="-50"
            cy="300"
            r="280"
            stroke="url(#arcGrad)"
            strokeWidth="1.5"
          />
          <circle
            cx="-50"
            cy="300"
            r="360"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeDasharray="4 8"
          />
        </svg>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* --- HERO SECTION WITH PUNCHY, CONVERTING TEXT --- */}
        <motion.header
          id="overview"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-7xl mx-auto px-6 md:px-8 pt-16 lg:pt-24 pb-28 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative"
        >
          {/* Left Text Column Area */}
          <motion.div className="lg:col-span-5 space-y-6 text-left" variants={containerVariants}>
            <motion.div className="inline-flex items-center gap-2 bg-[rgba(134,255,34,0.10)] border border-[rgba(134,255,34,0.25)] px-4 py-1.5 rounded-full" variants={itemVariants}>
              <Sparkles className="w-3.5 h-3.5 text-[#86ff22]" />
              <span className="text-[#bdee60] text-[10px] font-bold tracking-widest uppercase">
                Next-Gen Voice AI Interviewer
              </span>
            </motion.div>

            <motion.h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-white" variants={itemVariants}>
              Master your next <br />
              interview before <br />
              <span className="bg-gradient-to-r from-[#cfff65] to-[#86ff22] bg-clip-text text-transparent filter drop-shadow-[0_2px_10px_rgba(134,255,34,0.15)]">
                it even happens.
              </span>
            </motion.h1>

            <motion.p className="text-[rgba(255,255,255,0.70)] text-sm md:text-base leading-relaxed max-w-md" variants={itemVariants}>
              Practice personalized mock interviews tailored to your resume and
              target role. Receive instant AI feedback, detailed performance
              insights, and actionable recommendations to improve every answer
              before your real interview.
            </motion.p>

            <motion.div className="space-y-4 pt-2" variants={itemVariants}>
              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="cta-gradient text-black px-8 py-3.5 rounded-full text-sm font-black shadow-xl shadow-[#5cb800]/20 hover:opacity-95 transition-all transform hover:-translate-y-0.5"
                >
                  Start Your Mock Interview
                </motion.a>
              </div>

              {/* Trust Signal / Social Proof Text */}
              <div className="text-[13px] font-mono tracking-wide text-[rgba(255,255,255,0.40)] flex items-center gap-2">
                <span className="text-[#86ff22]">✦</span>
                Practice smarter. Speak confidently. Get hired faster.
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: High-Fidelity Glassmorphic App Browser Mockup with Premium Mac Title Bar */}
          <motion.div className="lg:col-span-7 w-full relative" variants={mockVariants}>
            <div className="animate-float w-full max-w-2xl mx-auto">
              {/* Main Glass Box Window Wrapper */}
              <div className="w-full bg-[rgba(27,32,35,0.62)] backdrop-blur-[14px] rounded-xl border border-white/[0.07] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col">
                {/* Authentic macOS Window Control Title Bar */}
                <div className="h-11 bg-black/30 border-b border-white/[0.05] flex items-center px-4 relative select-none">
                  <div className="flex gap-2 z-20">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] transition-opacity hover:opacity-80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-opacity hover:opacity-80"></div>
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAA2C] transition-opacity hover:opacity-80"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/40 text-[rgba(255,255,255,0.30)] text-[10px] font-mono tracking-wider px-12 py-0.5 rounded border border-white/[0.05] min-w-[220px] text-center">
                      app.interviewai.io
                    </div>
                  </div>
                </div>

                {/* Live Mock Screen Container Panel */}
                <div className="p-6 space-y-5 bg-transparent">
                  {/* Session Header Component */}
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                      <h3 className="text-[10px] font-bold text-[rgba(255,255,255,0.40)] tracking-widest uppercase">
                        System Execution Node
                      </h3>
                      <p className="text-sm font-extrabold text-white">
                        Live Interview Session
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[rgba(134,255,34,0.12)] border border-[rgba(134,255,34,0.30)] px-3 py-1 rounded-full text-[10px] font-bold text-[#86ff22]">
                      <span className="w-1.5 h-1.5 bg-[#86ff22] rounded-full animate-ping"></span>
                      RECORDING
                    </div>
                  </div>

                  {/* Interacting Chat Interface Blocks */}
                  <div className="space-y-3.5">
                    {/* AI Coach Question Node */}
                    <div className="flex gap-3 items-start">
                      <div className="w-8 h-8 icon-gradient rounded-full flex items-center justify-center shrink-0 shadow-md">
                        <Cpu className="w-4 h-4 text-black" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl rounded-tl-none p-4 text-xs font-medium text-[rgba(255,255,255,0.70)] leading-relaxed shadow-sm">
                        Walk me through a time you resolved a major conflict in
                        your team. What was your approach?
                      </div>
                    </div>

                    {/* Candidate Input/Text Node */}
                    <div className="flex gap-3 items-start justify-end">
                      <div className="flex-1 bg-white/[0.015] border border-white/[0.05] rounded-2xl rounded-tr-none p-4 text-xs font-medium text-[rgba(255,255,255,0.55)] leading-relaxed text-left max-w-[85%]">
                        In my previous role, I noticed two engineers had
                        conflicting approaches to our API design...
                        <span className="text-[#86ff22] font-bold animate-pulse">
                          |
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 border border-white/[0.1] text-[10px] font-mono font-bold text-white/70">
                        YOU
                      </div>
                    </div>
                  </div>

                  {/* Live Streaming Audio Form Track Bar */}
                  <div className="bg-black/40 border border-white/[0.07] rounded-xl p-4 flex items-center justify-between gap-4">
                    <button className="w-9 h-9 bg-[#86ff22] rounded-full flex items-center justify-center shadow-lg shadow-[#86ff22]/20 hover:scale-102 transition-all shrink-0">
                      <Mic className="w-4 h-4 text-black" />
                    </button>

                    {/* Animated Neon Waveform Bars */}
                    <div className="flex-1 flex items-center gap-[4px] h-8 px-1 justify-start overflow-hidden">
                      {[
                        35, 55, 25, 70, 85, 45, 95, 65, 50, 80, 40, 75, 45, 60,
                        35, 45, 25, 50, 30, 65,
                      ].map((val, idx) => (
                        <div
                          key={idx}
                          className="w-[3px] bg-[#86ff22] rounded-full opacity-95 animate-voice shrink-0"
                          style={{
                            height: `${val}%`,
                            animationDelay: `${(idx * 0.05) % 0.8}s`,
                            animationDuration: `${0.55 + (idx % 4) * 0.11}s`,
                          }}
                        ></div>
                      ))}
                    </div>

                    <div className="text-[11px] font-mono text-[rgba(255,255,255,0.35)] tracking-wider font-semibold">
                      0:42
                    </div>
                  </div>

                  {/* Real-time Validation Status Chips Row */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    <div className="bg-[rgba(134,255,34,0.08)] border border-[rgba(134,255,34,0.15)] text-[#86ff22] text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#86ff22] rounded-full"></span>{" "}
                      Clarity: 91%
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.07] text-[rgba(255,255,255,0.55)] text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-[#bdee60] rounded-full"></span>{" "}
                      Confidence: 78%
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.07] text-[rgba(255,255,255,0.55)] text-[10px] font-bold px-3 py-1.5 rounded-full">
                      ✓ STAR Method Verified
                    </div>
                  </div>

                  {/* Screen Progress Tracking Footer */}
                  <div className="pt-3.5 border-t border-white/[0.05] flex items-center justify-between text-[11px] font-mono font-semibold text-[rgba(255,255,255,0.35)]">
                    <span>Session Progress</span>
                    <div className="w-1/2 h-1.5 bg-black/60 rounded-full overflow-hidden mx-3">
                      <div
                        className="progress-gradient h-full rounded-full"
                        style={{ width: "37.5%" }}
                      ></div>
                    </div>
                    <span className="text-white/60">Q 3 / 8</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* --- STATS OVERLAY GRID BANNER --- */}
        <section className="border-y border-white/[0.05] relative overflow-hidden stats-overlay">
          <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "500+", text: "Corporate Categories Mapped" },
              { val: "14ms", text: "Acoustic Audio Ingestion Sync" },
              { val: "94.8%", text: "Precision Semantic Alignment" },
              { val: "250k+", text: "Evaluated Mock Sessions" },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                  {stat.val}
                </div>
                <div className="text-xs text-[rgba(255,255,255,0.40)] font-medium tracking-wide">
                  {stat.text}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- CORE FEATURES SECTION --- */}
        <section
          id="features"
          className="max-w-7xl mx-auto px-8 py-24 relative"
        >
          <div className="text-center mb-16 space-y-2">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white">
  Everything You Need to
  <span className="text-[#cfff65]"> Crack Your Next Interview</span>
</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, i) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  whileHover={{ 
                    y: -6, 
                    scale: 1.02, 
                    borderColor: "rgba(134,255,34,0.35)",
                    boxShadow: "0 15px 30px -10px rgba(134,255,34,0.1)"
                  }}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-8 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-10 h-10 bg-[rgba(134,255,34,0.1)] text-[#86ff22] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[rgba(134,255,34,0.2)] transition-all">
                    <IconComponent className="w-5 h-5 text-[#86ff22]" />
                  </div>
                  <h4 className="text-lg font-bold mb-2 text-white group-hover:text-[#cfff65] transition-colors">
                    {feat.title}
                  </h4>
                  <p className="text-[rgba(255,255,255,0.55)] text-xs leading-relaxed">
                    {feat.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* --- HOW IT WORKS SECTION --- */}
        <section
          id="how-it-works"
          className="max-w-7xl mx-auto px-8 py-24 border-t border-white/[0.05]"
        >
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-[rgba(255,255,255,0.40)] text-xs font-extrabold tracking-widest uppercase">
              HOW IT WORKS
            </h2>
            <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              From nervous to <span className="text-[#cfff65]">confident</span>{" "}
              in 4 steps
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
  {
    step: "01",
    badge: "Quick Setup",
    title: "Create Your Interview",
    desc: "Upload your resume, choose your target role, and optionally add a job description to generate a personalized interview."
  },
  {
    step: "02",
    badge: "Real AI Conversation",
    title: "Take the Interview",
    desc: "Answer AI-generated questions using voice or text while the interviewer adapts naturally based on your responses."
  },
  {
    step: "03",
    badge: "Instant AI Feedback",
    title: "Analyze Your Performance",
    desc: "Receive detailed scores, strengths, weaknesses, and personalized suggestions after every interview."
  },
  {
    step: "04",
    badge: "Continuous Improvement",
    title: "Track Your Growth",
    desc: "Monitor your progress across interviews and focus on the skills that matter most."
  }
].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ 
                  y: -5, 
                  scale: 1.015,
                  borderColor: "rgba(134,255,34,0.3)",
                  boxShadow: "0 15px 30px -10px rgba(0,0,0,0.5)"
                }}
                className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-8 relative overflow-hidden group flex flex-col justify-between min-h-[260px] cursor-pointer transition-colors duration-300"
              >
                <div className="absolute right-6 top-2 text-[100px] font-black text-white/[0.02] select-none font-mono tracking-tighter transition-all group-hover:text-[#86ff22]/[0.03]">
                  {item.step}
                </div>
                <div>
                  <div className="w-7 h-7 bg-[rgba(134,255,34,0.1)] text-[#86ff22] text-xs font-mono font-bold rounded flex items-center justify-center mb-6">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold mb-2 text-white group-hover:text-[#cfff65] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[rgba(255,255,255,0.55)] text-xs leading-relaxed max-w-md mb-6">
                    {item.desc}
                  </p>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#bdee60] bg-[rgba(134,255,34,0.1)] border border-[rgba(134,255,34,0.2)] px-3 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-[#bdee60]" /> {item.badge}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* --- QUESTION LIBRARY INTERACTIVE SECTION --- */}
        <section
          id="library"
          className="max-w-7xl mx-auto px-8 py-24 border-t border-white/[0.05]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-[#bdee60] text-xs font-extrabold tracking-widest uppercase mb-2">
                  INTERVIEW LIBRARY
                </h2>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white">
  Practice Every
  <br />
  <span className="text-[#cfff65]">Interview Format</span>
</h3>
              </div>
              <p className="text-[rgba(255,255,255,0.65)] text-sm leading-relaxed">
  Prepare for behavioral, technical, HR, leadership, system design, and case-study interviews—all tailored to your career goals and experience level.
</p>  

              <div className="flex flex-wrap gap-2">
                {Object.keys(questionLibrary).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-xs font-bold px-4 py-2.5 rounded-full transition-all border ${
                      activeCategory === cat
                        ? "bg-[#cfff65] text-black border-[#cfff65]"
                        : "bg-white/[0.03] text-[rgba(255,255,255,0.70)] border-white/[0.07] hover:border-white/20"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-5 space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded bg-[#86ff22]/10 flex items-center justify-center text-xs text-[#86ff22] font-bold shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5 text-[#86ff22]" />
                  </div>
                  <p className="text-xs font-semibold text-[rgba(255,255,255,0.70)] leading-relaxed">
                    {questionLibrary[activeCategory].question}
                  </p>
                </div>
                <div className="bg-[rgba(134,255,34,0.06)] border border-[rgba(134,255,34,0.15)] rounded-lg p-3.5 flex gap-2.5 items-start">
                  <Sparkles className="w-3.5 h-3.5 text-[#cfff65] shrink-0 mt-0.5" />
                  <div className="text-[11px] text-[#9ae77c] font-medium leading-relaxed">
                    <strong className="font-bold uppercase text-[10px] tracking-wider block mb-0.5 text-white">
                      AI Tip:
                    </strong>
                    {questionLibrary[activeCategory].tip}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Metrics Scorecard */}
            <div className="lg:col-span-7 pricing-highlight border border-[rgba(134,255,34,0.15)] rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="absolute top-4 right-4 w-32 h-32 bg-[#edffd7] opacity-[0.03] rounded-full blur-xl pointer-events-none"></div>

              <h4 className="text-base font-bold mb-6 text-white tracking-tight border-b border-white/[0.07] pb-4 flex justify-between items-center">
                <span>Answer Scorecard</span>
                <span className="text-xs font-mono font-normal text-[rgba(255,255,255,0.35)]">
                  Candidate Evaluation Module
                </span>
              </h4>

              <div className="space-y-4.5 my-6">
                {[
                  {
                    label: "Clarity & Structure",
                    value: questionLibrary[activeCategory].scores.clarity,
                  },
                  {
                    label: "Confidence & Tone",
                    value: questionLibrary[activeCategory].scores.confidence,
                  },
                  {
                    label: "Relevance to Role",
                    value: questionLibrary[activeCategory].scores.relevance,
                  },
                  {
                    label: "Conciseness",
                    value: questionLibrary[activeCategory].scores.conciseness,
                  },
                  {
                    label: "STAR Framework Evaluation",
                    value: questionLibrary[activeCategory].scores.star,
                  },
                ].map((metric, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-[rgba(255,255,255,0.70)]">
                        {metric.label}
                      </span>
                      <span className="text-[#86ff22] font-mono font-bold">
                        {metric.value}/10
                      </span>
                    </div>
                    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden p-[1px]">
                      <div
                        className="h-full progress-gradient rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${metric.value * 10}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center bg-black/40 border border-white/[0.05] p-5 rounded-xl">
                <div>
                  <span className="text-[10px] font-bold text-[rgba(255,255,255,0.40)] uppercase tracking-widest block mb-0.5">
                    Overall Score
                  </span>
                  <div className="text-3xl font-black text-white font-mono">
                    {questionLibrary[activeCategory].scores.overall.toFixed(1)}
                    <span className="text-xs text-[rgba(255,255,255,0.35)] font-normal">
                      {" "}
                      / 10
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => alert("Initializing Voice Sandbox...")}
                  className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-black hover:bg-white/90 transition-all flex items-center gap-2 shadow-sm"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Retry Mock
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER LAYOUT WITH INTEGRATED PRE-RENDERED LOGO ELEMENT --- */}
        <footer className="bg-black/40 border-t border-white/[0.05] text-[rgba(255,255,255,0.40)] text-sm">
  <div className="max-w-7xl mx-auto px-8 pt-16 pb-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10">
    
    {/* Brand */}
    <div className="col-span-2 space-y-4">
      <div className="flex items-center gap-2.5 text-white group cursor-pointer w-fit select-none">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3d7c00] to-[#86ff22] p-[1px] shadow-lg shadow-[#5cb800]/5 group-hover:shadow-[#86ff22]/15 transition-all duration-300">
          <div className="w-full h-full bg-[#070a05] rounded-[11px] flex items-center justify-center">
            <Bot
              className="w-4 h-4 text-[#cfff65] group-hover:scale-110 transition-transform duration-300"
              strokeWidth={2}
            />
          </div>
        </div>

        <span className="font-black tracking-tight text-lg text-white">
          Interview<span className="text-[#cfff65] font-light">AI</span>
        </span>
      </div>

      <p className="text-xs text-[rgba(255,255,255,0.35)] leading-relaxed max-w-xs">
        Practice realistic AI-powered mock interviews, receive personalized
        feedback, and build the confidence to ace your next interview.
      </p>
    </div>

   {[
  {
    title: "Platform",
    links: [
      { name: "Home", href: "/" },
      { name: "Features", href: "#features" },
      { name: "Dashboard", href: "/dashboard" },
      { name: "Mock Interview", href: "/create-interview" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Interview Tips", href: "#" },
      { name: "FAQs", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Support", href: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        name: "GitHub",
        href: "https://github.com/harshavardhan314",
      },
      {
        name: "LinkedIn",
        href: "https://www.linkedin.com/in/tarivitiharshavardhan/",
      },
      {
        name: "Email",
        href: "mailto:hharshavardhan974@gmail.com",
      },
    ],
  },
].map((col, idx) => (
  <div key={idx} className="space-y-4">
    <h5 className="text-xs font-bold text-white tracking-wider uppercase">
      {col.title}
    </h5>

    <ul className="space-y-2.5 text-xs text-[rgba(255,255,255,0.55)]">
      {col.links.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target={link.href.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="hover:text-[#cfff65] transition-colors"
          >
            {link.name}
          </a>
        </li>
      ))}
    </ul>
  </div>
))}
  </div>

  <div className="max-w-7xl mx-auto px-8 pt-8 pb-5 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[rgba(255,255,255,0.35)] font-medium">
    
  <div className="flex items-center gap-2 text-xs">
  <span>© {new Date().getFullYear()} InterviewAI.</span>
  <span className="text-[#86ff22]">•</span>
  <span>
    Built with <span className="text-red-500">❤️</span> by{" "}
    <a
      href="https://www.linkedin.com/in/tarivitiharshavardhan/"
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold text-[#cfff65] hover:text-[#86ff22] transition-colors"
    >
      Harsha Vardhan
    </a>
  </span>
</div>

    <div className="flex items-center gap-2 bg-[rgba(134,255,34,0.08)] border border-[rgba(134,255,34,0.15)] px-3 py-1 rounded-full text-[11px] text-[rgba(255,255,255,0.60)]">
      <span className="w-1.5 h-1.5 bg-[#86ff22] rounded-full animate-pulse"></span>
      <span>Practice. Improve. Get Hired.</span>
    </div>
  </div>
</footer>
      </div>
    </div>
  );
};

export default Home;
