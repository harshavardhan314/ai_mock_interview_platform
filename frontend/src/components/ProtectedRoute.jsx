import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#070a05] flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 relative z-10 px-4">
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
          <div className="relative mx-auto w-20 h-20 bg-[rgba(134, 255, 34, 0.06)] border rounded-2xl flex items-center justify-center shadow-lg shadow-[#86ff22]/5 animate-[borderGlow_3s_infinite]" style={{ border: '1px solid rgba(134, 255, 34, 0.2)' }}>
            <div className="w-12 h-12 rounded-full border-t-2 border-r-2 border-[#86ff22] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[#86ff22] text-xs font-mono font-bold animate-pulse">AUTH</span>
            </div>
          </div>

          <div className="space-y-3">
            <span className="text-[#bdee60] text-[10px] font-bold tracking-widest uppercase bg-[rgba(134,255,34,0.1)] px-3 py-1.5 rounded-full">
              Secured Session
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight">Verifying Credentials</h2>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
              Please wait while we establish a secure connection with Clerk Auth Cloud...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;