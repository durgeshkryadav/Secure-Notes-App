import enLocale from './en';

const locales: { [key: string]: { [key: string]: string } } = {
    en: enLocale,
};

export function locale(key: string, lang = 'en'): string {
    return locales[lang]?.[key] || key;
}
