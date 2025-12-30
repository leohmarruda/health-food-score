'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { getDictionary } from '@/lib/get-dictionary';

export default function Navbar() {
  // Hooks
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'pt';

  // State
  const [dict, setDict] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Derived values
  const navLinks = [
    { 
      name: dict?.common?.library || 'Library', 
      href: `/${lang}` 
    },
    { 
      name: dict?.common?.addFood || 'Add Food', 
      href: `/${lang}/new-food` 
    },
    { 
      name: dict?.common?.manage || 'Manage', 
      href: `/${lang}/manage` 
    },
  ];

  // Effects
  useEffect(() => {
    async function load() {
      const d = await getDictionary(lang);
      setDict(d);
    }
    load();
  }, [lang]);

  return (
    <nav className="bg-card border-b border-text-main/10 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-2 min-w-0">
          
          {/* Logo respeitando o idioma */}
          <Link href={`/${lang}`} className="flex items-center gap-2 flex-shrink-0 min-w-0">
            <span className="text-lg sm:text-xl font-bold bg-primary text-white px-1.5 sm:px-2 py-1 rounded-theme">HFS</span>
            <span className="font-bold text-text-main hidden lg:block whitespace-nowrap">Healthy Food Score</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            <div className="h-6 w-[1px] bg-text-main/10" />
            <div className="flex gap-4 lg:gap-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive ? 'text-primary' : 'text-text-main/70 hover:text-primary'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-text-main hover:text-primary transition"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-text-main/10 py-2 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-primary bg-primary/10' : 'text-text-main/70 hover:text-primary hover:bg-text-main/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}