import React from 'react';
import ReactDOM from 'react-dom';
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";

import common_pl from "./assets/translations/pl/common.json";
import common_en from "./assets/translations/en/common.json";

//import 'bootstrap/dist/css/bootstrap.min.css';

import App from './components/App';

require('dotenv').config({ path: __dirname + './../../common/.env'});

i18next.init({
    interpolation: { escapeValue: false},
    lng: 'pl',
    resources: {
        en: {
            common: common_en
        },
        pl: {
            common: common_pl
        }
    }
});

ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n = {i18next}>
            <App />
        </I18nextProvider>
    </React.StrictMode>, 
    document.querySelector('#root')
);


