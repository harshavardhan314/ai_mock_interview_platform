import Navbar from "./Navbar";

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#070a05] text-white">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-6 pb-14 pt-8">{children}</main>
    </div>
  );
}

export default AppShell;

