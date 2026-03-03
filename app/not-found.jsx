import Link from "next/link";
import { H1, Muted } from "@/components/ui/Typography";
import Button from "@/components/ui/Button";
import { FaExclamationTriangle, FaChevronLeft, FaSearch } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[300px] w-[300px] bg-brand-500/10 blur-[100px] rounded-full animate-pulse" />
        <div className="h-40 w-40 rounded-[40px] bg-surface border-2 border-brand-500/50 flex items-center justify-center shadow-2xl relative">
          <FaExclamationTriangle className="text-6xl text-brand-500 animate-bounce" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-2xl bg-rose-500 flex items-center justify-center text-white font-black text-2xl italic shadow-xl">
            404
          </div>
        </div>
      </div>

      <H1 className="mb-4 text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
        Sector Not Found
      </H1>

      <Muted className="max-w-md mx-auto text-lg font-bold uppercase tracking-tight italic mb-12">
        The coordinates you provided do not point to any known intelligence hub.
        It might have been redacted or moved.
      </Muted>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          as={Link}
          href="/"
          className="px-10 py-6 font-black uppercase tracking-widest shadow-2xl shadow-brand-500/20"
        >
          <FaChevronLeft className="mr-3" /> Back to Base
        </Button>
        <Button
          as={Link}
          href="/articles"
          variant="outline"
          className="px-10 py-6 font-black uppercase tracking-widest border-2 border-border"
        >
          <FaSearch className="mr-3" /> Search Files
        </Button>
      </div>

      <div className="mt-20 pt-10 border-t border-border/50 max-w-lg mx-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted italic">
          Visual Encryption State: Error 404 // Location: Liberian Digital
          Frontier
        </p>
      </div>
    </div>
  );
}
