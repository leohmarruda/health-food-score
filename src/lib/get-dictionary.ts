/**
 * Dictionary loader functions for each supported language
 */
const dictionaries = {
  pt: () => import('../dictionaries/pt.json').then((module) => module.default),
  en: () => import('../dictionaries/en.json').then((module) => module.default),
};

/**
 * Gets dictionary for the specified locale.
 * Falls back to Portuguese if locale is not supported.
 * 
 * @param locale - Language code ('pt' or 'en')
 * @returns Dictionary object for the locale
 */
export const getDictionary = async (locale: string) => {
  const lang = locale === 'en' || locale === 'pt' ? locale : 'pt';
  return dictionaries[lang]();
};