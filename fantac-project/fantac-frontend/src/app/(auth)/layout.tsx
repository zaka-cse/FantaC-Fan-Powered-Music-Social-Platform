export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center px-4 py-8">
      {/* On desktop: card style. On mobile: full width */}
      <div className="w-full max-w-sm md:bg-[#141414] md:border md:border-[#2A2A2A] md:rounded-3xl md:p-8 md:shadow-2xl">
        {children}
      </div>
    </div>
  );
}
