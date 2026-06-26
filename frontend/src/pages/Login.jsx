import { SignIn } from "@clerk/clerk-react";
import { Bot, ArrowLeft } from "lucide-react";

function Login() {
  return (
    <div className="relative min-h-screen bg-[#070a05] text-white flex flex-col items-center justify-center p-6 overflow-hidden font-sans antialiased">
      
      {/* --- GLOBAL DESIGN STYLES & BACKGROUND MESH --- */}
      <style>{`
        .topography-lines {
          background-image: radial-gradient(circle at 50% 50%, transparent 60%, rgba(134, 255, 34, 0.02) 61%, transparent 62%);
          background-size: 160px 160px;
        }
      `}</style>

      {/* Ambient Radial Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-gradient-to-tr from-[#3d7c00]/30 to-transparent opacity-[0.25] rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-gradient-to-bl from-[#5cb800]/20 to-transparent opacity-[0.20] rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute inset-0 topography-lines opacity-30 pointer-events-none mix-blend-screen z-0"></div>

      {/* Interactive Back to Home Link */}
      <div className="absolute top-8 left-8 z-20">
        <a 
          href="/" 
          className="flex items-center gap-2 text-xs font-bold text-[rgba(255,255,255,0.40)] hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </a>
      </div>

      {/* Inner Centered Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-md space-y-8">
        
        {/* Brand Identity Header */}
        <div className="flex flex-col items-center gap-2 select-none">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3d7c00] to-[#86ff22] p-[1px] shadow-xl shadow-[#5cb800]/10">
            <div className="w-full h-full bg-[#070a05] rounded-[15px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#cfff65]" strokeWidth={2} />
            </div>
          </div>
          <span className="font-black tracking-tight text-xl text-white">
            Interview<span className="text-[#cfff65] font-light">AI</span>
          </span>
        </div>

        {/* Custom Appearance Managed Clerk Core Login Module */}
        <div className="w-full flex justify-center shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] rounded-2xl overflow-hidden">
          <SignIn 
            routing="path" 
            path="/login" 
            signUpUrl="/signup"
            forceRedirectUrl="/dashboard"
            
            

            appearance={{
              variables: {
                colorPrimary: '#86ff22',
                colorBackground: '#121611',
                colorText: '#ffffff',
                colorTextSecondary: 'rgba(255,255,255,0.55)',
                colorInputBackground: '#070a05',
                colorInputText: '#ffffff',
                colorBorder: 'rgba(255,255,255,0.08)',
                borderRadius: '12px',
              },
              elements: {
                card: 'border border-white/[0.06] backdrop-blur-[12px] p-6 sm:p-8 w-full shadow-none bg-transparent',
                headerTitle: 'text-white font-black tracking-tight text-xl',
                headerSubtitle: 'text-white/50 text-xs font-medium',
                socialButtonsBlockButton: 'bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.07] text-white transition-all duration-200',
                // Added !text-white here to force white typography on social buttons
                socialButtonsBlockButtonText: 'font-semibold text-xs text-white !text-white',
                socialButtonsProviderIcon: 'w-4 h-4',
                formButtonPrimary: 'bg-gradient-to-r from-[#5cb800] to-[#86ff22] text-black font-black hover:opacity-95 shadow-lg shadow-[#5cb800]/10 border-0 transition-all duration-200 text-sm py-2.5',
                formFieldLabel: 'text-[rgba(255,255,255,0.70)] text-xs font-bold tracking-wide uppercase mb-1.5',
                formFieldInput: 'border border-white/[0.08] bg-[#070a05] focus:border-[#86ff22] focus:ring-1 focus:ring-[#86ff22] text-white transition-colors py-2.5 text-sm',
                footerActionText: 'text-white/40 text-xs font-medium',
                footerActionLink: 'text-[#86ff22] hover:text-[#cfff65] transition-colors font-bold text-xs decoration-none',
                dividerText: 'text-white/20 text-[10px] font-bold tracking-widest uppercase',
                dividerLine: 'bg-white/[0.05]',
              }
            }}
          />
        </div>
        
      </div>
    </div>
  );
}

export default Login;
