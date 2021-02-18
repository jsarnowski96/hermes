import React from 'react';
import ReactDOM from 'react-dom';
import {I18nextProvider} from "react-i18next";
import i18next from './services/i18n';

import App from './components/App';

require('dotenv').config({ path: __dirname + './../env'});

ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n = {i18next}>
            <App />
        </I18nextProvider>
    </React.StrictMode>, 
    document.querySelector('#root')
);


