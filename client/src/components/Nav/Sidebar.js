import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faHome, faPaperPlane, faInfoCircle, faUserPlus, faFingerprint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../../assets/css/sidebar.css';

library.add(faCheckSquare, faCoffee, faHome, faPaperPlane, faInfoCircle, faUserPlus, faFingerprint);

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.onLanguageChange = this.onLanguageChange.bind(this);
    }

    onLanguageChange(event) {
        const {i18n} = this.props;
        if(event.target.name === 'pl') {
            localStorage.setItem('language', 'pl');
            i18n.changeLanguage('pl');
        } else if(event.target.name === 'en') {
            localStorage.setItem('language', 'en');
            i18n.changeLanguage('en');
        }
    }

    render() {
        const {t, i18n} = this.props;

        return(
            <nav className="navbar">
                <ul className="navbar-nav">
                    <Link to="/" className="navbar-title">Hermes</Link><hr className="navbar-title-hr" />
                    <li className="nav-item"><Link to="/" className="nav-link"><FontAwesomeIcon icon="home" size="lg" /><span className="link-text">{t('navbar.home')}</span></Link></li>
                    <li className="nav-item"><Link to="/login" className="nav-link"><FontAwesomeIcon icon="fingerprint" size="lg" /><span className="link-text">{t('navbar.login')}</span></Link></li>
                    <li className="nav-item"><Link to="/register" className="nav-link"><FontAwesomeIcon icon="user-plus" size="lg" /><span className="link-text">{t('navbar.register')}</span></Link></li>
                    <li className="nav-item"><Link to="/about" className="nav-link"><FontAwesomeIcon icon="info-circle" size="lg" /><span className="link-text">{t('navbar.about')}</span></Link></li>
                    <li className="nav-item"><Link to="/contact" className="nav-link"><FontAwesomeIcon icon="paper-plane" size="lg" /><span className="link-text">{t('navbar.contact')}</span></Link></li>
                    <li className="nav-item lng-change">
                        <button type="button" name='pl' style={{backgroundColor: "white"}} className="lng-button" onClick={this.onLanguageChange}>PL</button>
                        <button type="button" name='en' style={{backgroundColor: "red"}} className="lng-button"onClick={this.onLanguageChange}>EN</button>
                    </li>
                </ul>
            </nav>
        )
    }
}

const SidebarTranslation = withTranslation('common')(Sidebar);

export default SidebarTranslation;