import { Mail } from 'lucide-react';

export function Footer() {
  const mailtoLink = "mailto:ondrejpetyniak@gmail.com?subject=ViCODEin";

  return (
    <footer className="relative z-10 py-8 mt-16 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <a
          href={mailtoLink}
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
        >
          <Mail size={20} className="group-hover:scale-110 transition-transform" />
          <span className="text-lg">Wanna do projects get in touch</span>
        </a>
      </div>
    </footer>
  );
}
