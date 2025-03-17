// src/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationHE from './locales/he.json';
import translationEN from './locales/en.json';

const resources = {
    he: {
        translation: translationHE
    },
    en: {
        translation: translationEN
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'he', // Default language is Hebrew
        fallbackLng: 'he',
        interpolation: {
            escapeValue: false // React already safes from XSS
        },
        // RTL support
        react: {
            useSuspense: true
        }
    });

export default i18n;