// request.ts

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { hasLocale } from 'next-intl';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [pageMessages, componentMessages] = await Promise.all([
    import(`../../messages/pages/${locale}.json`).then(m => m.default),
    import(`../../messages/components/${locale}.json`).then(m => m.default)
  ]);

  return {
    locale,
    messages: {
      ...pageMessages,
      ...componentMessages
    }
  };
});


// import {getRequestConfig} from 'next-intl/server';
// import {routing} from './routing';
// import {hasLocale} from 'next-intl';

// export default getRequestConfig(async ({requestLocale}) => {
//   // Typically corresponds to the `[locale]` segment
//   const requested = await requestLocale;
//   const locale = hasLocale(routing.locales, requested)
//     ? requested
//     : routing.defaultLocale;

//   return {
//     locale,
//     messages: (await import(`../../messages/${locale}.json`)).default
//   };
// });