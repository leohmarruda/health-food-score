'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLang = pathname.split('/')[1] || 'pt';

  const handleLanguageChange = (newLang: string) => {
    const segments = pathname.split('/');
    segments[1] = newLang;
    const newPath = segments.join('/');
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-card text-text-main border border-text-main/10 rounded-theme px-1.5 sm:px-2 py-1 text-[10px] sm:text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-all hover:border-primary/50"
      >
        <option value="pt">🇧🇷 PT</option>
        <option value="en">🇺🇸 EN</option>
      </select>
    </div>
  );
}