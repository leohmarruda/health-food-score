import { getDictionary } from '@/lib/get-dictionary';
import HomeClient from './HomeClient';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const dict = await getDictionary(lang as 'pt' | 'en');

  if (!dict) {
    throw new Error(`Dictionary not found for language: ${lang}`);
  }

  return <HomeClient dict={dict} lang={lang} />;
}