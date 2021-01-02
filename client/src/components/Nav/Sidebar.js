import React from 'react';
import {Link} from 'react-router-dom';
import {withTranslation} from 'react-i18next';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheckSquare, faCoffee, faHome, faPaperPlane, faInfoCircle, faUserPlus, faFingerprint } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import '../../assets/css/sidebar.css';

library.add(faCheckSquare, faCoffee, faHome, faPaperPlane, faInfoCircle, faUserPlus, faFingerprint);

class Sidebar extends React.Component {
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
                        <button type="button" style={{backgroundColor: "white"}} className="lng-button" onClick={() => i18n.changeLanguage('pl')}>PL</button>
                        <button type="button" style={{backgroundColor: "red"}} className="lng-button"onClick={() => i18n.changeLanguage('en')}>EN</button>
                    </li>
                </ul>
            </nav>
        )
    }
}

const SidebarTranslation = withTranslation('common')(Sidebar);

export default SidebarTranslation;