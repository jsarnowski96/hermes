import i18n from "i18next";

import common_pl from "../translations/pl/common.json";
import common_en from "../translations/en/common.json";

i18n.init({
    interpolation: { escapeValue: false},
    lng: 'pl',
    fallbackLng: 'en',
    resources: {
        en: {
            common: common_en
        },
        pl: {
            common: common_pl
        }
    }
});

export default i18n;