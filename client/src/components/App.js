import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import {withTranslation} from 'react-i18next';
// import {connect} from 'react-redux';
// import {userLogin} from '../actions';

import Sidebar from './Nav/Sidebar';
import About from './Nav/About';
import Contact from './Nav/Contact';
import Login from './Nav/Login';
import Register from './Nav/Register';
import Home from './Nav/Home';
import Dashboard from './Dashboard/Dashboard';
import NewProject from './Project/NewProject';

import {getLanguageFromLocalStorage} from '../services/languageChanger';

import '../assets/css/style.css';

class App extends React.Component {    
    constructor(props) {
        super(props);
        const {i18n} = this.props;
        let lsLanguage = getLanguageFromLocalStorage();
        if(i18n.language !== lsLanguage) {
            i18n.changeLanguage(lsLanguage);
        }
    }

    render() {
        return(
            <BrowserRouter>
                <Sidebar />
                <main>
                    <Route exact path="/" component={Home} />
                    <Route path="/login" component={Login} />
                    <Route path="/register" component={Register} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/dashboard" component={Dashboard} />
                    <Route path="/project/create" component={NewProject} />
                </main>
            </BrowserRouter>
        )
    }
}

const AppTranslation = withTranslation('common')(App);

export default AppTranslation;