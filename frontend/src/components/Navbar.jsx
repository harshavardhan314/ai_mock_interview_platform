import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { Bot } from 'lucide-react'; // Imported the premium logo icon
import { Navigate , useNavigate } from 'react-router-dom';


const Navbar = () => {
  
const navigate = useNavigate();

const handleClick = () => {
  navigate("/dashboard");
};

  return (
    <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-50 bg-transparent">
      
      {/* Premium Eye-Catching Interactive Brand Logo Component */}
      <div className="flex items-center gap-2.5 text-white group cursor-pointer w-fit           select-none">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#3d7c00] to-[#86ff22] p-[1px] shadow-lg shadow-[#5cb800]/5 group-hover:shadow-[#86ff22]/15 transition-all      duration-300" onClick={handleClick}>
          <div className="w-full h-full bg-[#070a05] rounded-[11px] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#cfff65] group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
          </div>
        </div>
        <span className="font-black tracking-tight text-lg text-white transition-colors duration-300">
          Interview<span className="text-[#cfff65] font-light">AI</span>
        </span>
      </div>
      
      {/* Nav Navigation Links */}
      <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
       <SignedOut> 
        <a href="#overview" className="hover:text-white transition-colors">Overview</a>
        <a href="#features" className="hover:text-white transition-colors">Features</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
        <a href="#library" className="hover:text-white transition-colors">Question Library</a>
        </SignedOut>
      </div>

      {/* Clerk Auth Section */}
      <div className="flex items-center gap-4">
        <SignedOut>
          <a 
            href="/login" 
            className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold hover:bg-gray-200 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Sign In
          </a>
        </SignedOut>
        
        <SignedIn>
          <div className="flex items-center gap-6">
            
            <UserButton afterSignOutUrl="/dashboard" appearance={{ elements: { avatarBox: "w-9 h-9" } }}
             />
          </div>
        </SignedIn>
        
      </div>
    </nav>
  );
};

export default Navbar;
